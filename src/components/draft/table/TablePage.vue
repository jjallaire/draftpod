<script>

import NavBar from '@/components/core/NavBar.vue'
import FirebaseError from '@/components/core/FirebaseError.vue'
import PackPanel from '../pack/PackPanel.vue';
import PickPanel from '../pick/PickPanel.vue';
import PickTimer from '../pick/PickTimer.vue'
import InfoBar from '../infobar/InfoBar.vue'
import DeckPanel from '../deck/DeckPanel.vue'
import PlayersPopup from '../players/PlayersPopup.vue'

import { REMOVE_DRAFTS, SET_FIREBASE_ERROR } from '@/store/mutations'

import { RESUME_DRAFT, PICK_TIMER_PICK, PACK_TO_PICK, PICK_TO_PILE, 
         DECK_TO_SIDEBOARD, DECK_TO_UNUSED, 
         SIDEBOARD_TO_DECK, SIDEBOARD_TO_UNUSED, 
         UNUSED_TO_DECK, UNUSED_TO_SIDEBOARD,
         DISABLE_AUTO_LANDS, SET_BASIC_LANDS,
         REMOVE_PLAYER } from '@/store/modules/draft/actions';
import { WRITE_TABLE, SET_CONNECTED, SET_WAITING, SET_SHOW_BOT_COLORS } from '@/store/modules/draft/mutations'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import PlayersIcon from "vue-material-design-icons/AccountMultiple.vue"
import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

import * as log from '@/core/log'

import fscreen from 'fscreen'
import * as messagebox from '@/components/core/messagebox.js'
 
import _flatten from 'lodash/flatten'

import MobileDetect from 'mobile-detect'

import shortUuid from 'short-uuid'

import jquery from 'jquery'

import TouchDragManager from '../core/TouchDragManager.js'

const production = process.env.NODE_ENV === 'production';

// drafts namespace
const NS_DRAFTS = "drafts";

import * as selectors from '@/store/modules/draft/selectors'
import * as draftbot from '@/store/modules/draft/draftbot'
import * as draftlog from '@/store/modules/draft/draftlog'
import firestore from '@/store/modules/draft/firestore'

export default {
  name: 'DraftTable',

  components: {
    NavBar, PackPanel, PickTimer, PickPanel, DeckPanel, InfoBar,
    PlayersIcon, PlayersPopup, FullScreenIcon, FullScreenExitIcon, ExitToAppIcon,
    FirebaseError
  },

  props: {
    draft_id: {
      type: String,
      required: true
    },
  },

  data: function() {
    return { 
      client_id: shortUuid().new(),
      fullscreen: false,
      fullscreenEnabled: fscreen.fullscreenEnabled,
      isMobile: false,
      isPhone: false,
      isTablet: false,
      card_preview: null,
      touchDragManager: new TouchDragManager(),
      firestoreUnsubscribe: null,
      pick_timeout_timer: null,
      firebase_error: null
    };
  },

  computed: {
    ...mapState({
      draft: function(state) {
        return state[NS_DRAFTS][this.draft_id];
      },
    }),
    ...mapGetters([
      'player'
    ]),

    set: function() {
      return this.draft.set;
    },
    options: function() {
      return this.draft.options;
    },
    table: function() {
      return this.draft.table;
    },
    waiting: function() {
      return this.draft.waiting;
    },

    active_player: function() {
      return selectors.activePlayer(this.player.id, this.table);
    },

    active_pack: function() {
      return selectors.activePack(this.player.id, this.table);
    },
    
    active_cards: function() {
      return selectors.activeCards(this.player.id, this.table);
    },

    current_pack: function() {
      return selectors.currentPack(this.player.id, this.set.code, this.table);
    },

    current_pick: function() {
      return selectors.currentPick(this.player.id, this.set.code, this.table);
    },

    picks_complete: function() {
      return selectors.picksComplete(this.player.id, this.set.code, this.table);
    },

    pick_ratings: function() {
      if (this.options.pick_ratings) {
        let pack = this.active_pack;
        if (pack) {
          let deck = _flatten(this.active_player.picks.piles);
          return draftbot.cardRatings(this.active_player.bot, deck, pack, true);
        } else {
          return [];
        }
      } else {
        return null;
      }
    },

    namespace: function() {
      return NS_DRAFTS + '/' + this.draft_id;
    },
  },


  watch: {
    active_player: function (val) {
      if (val === undefined)
        this.$router.push({ path: "/draft/"});
    },
    picks_complete(newValue, oldValue) {
      // save draft log when picks complete
      if (production && (newValue && !oldValue)) {
        firestore.saveDraftLog(this.player.id, this.draft).then(() => {
          // success
        }).catch(error => {
          log.logException(error, "onSaveDraftLog");
        });
      }
    }
  },

  created() {

    // detect mobile
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile())
      this.isMobile = true;
    if (md.tablet())
      this.isTablet = true;
    if (this.isMobile && !this.isTablet)
      this.isPhone = true;

    // manage players popup on iOS (needed in order to make it dismiss)
    if (md.os() === 'iOS')
      this.managePlayersPopupForiOS();

    // collect/handle firebase_error if there is one. if there is an error
    // then we abort processing 
    if (this.$store.getters.firebase_error) {
      this.firebase_error = this.$store.getters.firebase_error;
      this.$store.commit(SET_FIREBASE_ERROR, null);
      return;
    }

    // clear waiting flag
    this.setWaiting({ waiting: false});
  
    // resume draft
    this.resumeDraft().then((success) => {

      // multiplayer
      if (success && this.options.multi_player) {

        // wait to validate the client until we see our first commit
        let validateClient = false;

        // track firestore
        this.firestoreUnsubscribe = firestore.onDraftTableChanged(this.draft_id, table => {

          // write locally. 
          this.writeTable({ table });

          // clear waiting flag
          this.setWaiting({ waiting: false });

          // get activePlayer reference
          let player = selectors.activePlayer(this.player.id, table);

          // see if we should start validating the client (we do this only after we've 
          // seen our client in a change, this is to eliminate the possibility of failing
          // validation as a result of snapshots coming from other clients that occurred
          // prior to our resuming the draft)
          if (!validateClient)
            validateClient = this.client_id === player.client_id;

          // validate that the client hasn't changed
          if (validateClient && !firestore.validateClient(this.player.id, this.client_id, table)) {
            this.setConnected({ connected: false });
            this.firestoreUnsubscribe();
          }
        });
      }
    });

    // update fullscreen state on change
    this.onFullscreenChange();
    fscreen.addEventListener('fullscreenchange', this.onFullscreenChange);   
  },

  beforeDestroy() {
   
    fscreen.removeEventListener('fullscreenchange', this.onFullscreenChange);

    if (this.firestoreUnsubscribe)
      this.firestoreUnsubscribe();

    if (this.pick_timeout_timer)
      clearInterval(this.pick_timeout_timer);
  },


  methods: {
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
      writeTable(dispatch, payload) {
        return dispatch(this.namespace + '/' + WRITE_TABLE, payload);
      },
      setConnected(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_CONNECTED, payload);
      },
      setWaiting(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_WAITING, payload);
      },
      setShowBotColors(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_SHOW_BOT_COLORS, payload);
      },
    }),
    ...mapActions({
      resumeDraft(dispatch) {
        return dispatch(this.namespace + '/' + RESUME_DRAFT, this.withPlayerId({}));
      },
      pickTimerPick(dispatch) {
        return dispatch(this.namespace + '/' + PICK_TIMER_PICK, this.withPlayerId({}));
      },
      packToPick(dispatch, payload) {
        return dispatch(this.namespace + '/' + PACK_TO_PICK, this.withPlayerId(payload));
      },
      pickToPile(dispatch, payload) {
        return dispatch(this.namespace + '/' + PICK_TO_PILE, this.withPlayerId(payload));
      },
      deckToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_SIDEBOARD, this.withPlayerId(payload));
      },
      deckToUnused(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_UNUSED, this.withPlayerId(payload));
      },
      sideboardToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_DECK, this.withPlayerId(payload));
      },
      sideboardToUnused(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_UNUSED, this.withPlayerId(payload));
      },
      unusedToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + UNUSED_TO_DECK, this.withPlayerId(payload));
      },
      unusedToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + UNUSED_TO_SIDEBOARD, this.withPlayerId(payload));
      },
      disableAutoLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + DISABLE_AUTO_LANDS, this.withPlayerId(payload));
      },
      setBasicLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_BASIC_LANDS, this.withPlayerId(payload));
      },
      removePlayer(dispatch, payload) {
        return dispatch(this.namespace + '/' + REMOVE_PLAYER, this.withPlayerId(payload));
      },
    }),
    withPlayerId: function(payload) {
      return {
        player_id: this.player.id,
        client_id: this.client_id,
        ...payload
      }
    },
    setCardPreview: function(card_preview) {
      this.card_preview = card_preview;
    },
    generateDraftLog() {
      return draftlog.generate(this.player.id, this.draft);
    },
    onExitDraft: function() {
      if (this.options.multi_player) {
         messagebox.confirm(
          "Exit Draft",
          "<p>You cannot rejoin the draft after you have exited.</p>" + 
          "Do you want to exit this draft? ",
          () => {
            this.removePlayer({ remove_player_id: this.player.id });
          });
      } else {
        messagebox.confirm(
          "Exit Draft",
          "<p>You can pick up where you left off in the draft later.</p>" + 
          "Do you want to exit this draft? ",
          () => {
            this.$router.push({ path: "/draft/" });
          });
      }
    },
    onRemoveDraft: function() {
      messagebox.confirm(
        "Discard Draft",
        "<p>You will no longer be able to access this draft after it is discarded.</p>" +
        "Do you want to discard this draft? ",
        () => {
          this.removeDrafts([this.draft_id]);
          this.$router.push({ path: "/draft/" });
        })
    },
    onFullscreenChange: function() {
      this.fullscreen = fscreen.fullscreenElement !== null;
    },
    onFullscreenToggle: function() {
      if (!this.fullscreen)
        fscreen.requestFullscreen(document.documentElement);
      else
        fscreen.exitFullscreen();
    },

    managePlayersPopupForiOS() {
      jquery(document).on("touchstart", function(event){
        if (jquery(event.target).closest('.dropdown-menu').length === 0) {
          jquery('.dropdown.show .dropdown-toggle').each(function() {
            jquery(this).dropdown('toggle');
          });
        }
      });
    }
  },

  provide: function() {
      return {
        pickTimerPick: this.pickTimerPick,
        packToPick: this.packToPick,
        pickToPile: this.pickToPile,
        deckToSideboard: this.deckToSideboard,
        deckToUnused: this.deckToUnused,
        sideboardToDeck: this.sideboardToDeck,
        sideboardToUnused: this.sideboardToUnused,
        unusedToDeck: this.unusedToDeck,
        unusedToSideboard: this.unusedToSideboard,
        disableAutoLands: this.disableAutoLands,
        setBasicLands: this.setBasicLands,
        removePlayer: this.removePlayer,
        setShowBotColors: this.setShowBotColors,
        setCardPreview: this.setCardPreview,
        touchDragManager: this.touchDragManager,
        generateDraftLog: this.generateDraftLog
      }
    },

}
</script>

<template>
  <div v-if="firebase_error">
    <NavBar />
    <div class="container">
      <div class="row">
        <div class="col-sm-10 offset-sm-1">
          <FirebaseError :error="firebase_error" />
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <NavBar> 
      <span class="navbar-text">
        {{ set.name }} 
        <span v-if="!picks_complete">
          &mdash;
          Pack {{ current_pack }}, Pick {{ current_pick }}
          <PickTimer 
            v-if="options.pick_timer && active_pack" 
            :pick_end_time="active_player.pick_end_time"
          />
        </span>
      </span> 
    
      <ul class="navbar-nav">
        <li class="nav-item">
          <div class="dropdown">
            <a 
              id="playersMenuLink" 
              href="#" 
              class="nav-link icon-link dropdown-toggle" 
              title="Players" 
              data-toggle="dropdown" 
              aria-haspopup="true" 
              aria-expanded="false"
            >
              <PlayersIcon /> Players
            </a>
            <div 
              class="dropdown-menu players-menu" 
              aria-labelledby="playersMenuLink"
            >
              <PlayersPopup :draft="draft" />
            </div>
          </div>
        </li>

        <li class="nav-item">
          <a class="nav-link icon-link">
            <ExitToAppIcon 
              title="Exit Draft" 
              @click.native="onExitDraft"
            />
          </a>
        </li>
        <li 
          v-if="fullscreenEnabled" 
          class="nav-item"
        >
          <a class="nav-link icon-link">
            <FullScreenExitIcon 
              v-if="fullscreen" 
              title="Exit fullscreen mode" 
              @click.native="onFullscreenToggle"
            />
            <FullScreenIcon 
              v-else 
              title="Fullscreen mode" 
              @click.native="onFullscreenToggle"
            />
          </a>
        </li>
      </ul>
    </NavBar>

    <div :class="{ 'draft-page': true, 'mobile': isMobile, 'phone': isPhone, 'tablet': isTablet }">
      <div 
        v-if="waiting" 
        class="waiting-glass"
      />

      <div class="draft-cards user-select-none">
        <transition name="pack-hide">
          <PackPanel 
            v-if="!picks_complete" 
            :pack="active_pack"
          />
        </transition>
        <PickPanel 
          v-if="!picks_complete" 
          :picks="active_player.picks" 
          :pick_ratings="pick_ratings"
        />
        <DeckPanel 
          v-else 
          :set_name="set.name" 
          :deck="active_player.deck"
        />
      </div>

      <InfoBar 
        v-if="!isMobile" 
        :card_preview="card_preview" 
        :cards="active_cards" 
        class="user-select-none"
      />
    </div>
  </div>
</template>

<style>

.navbar .pick-timer {
  padding: 0.3rem;
  font-size: 0.9rem;
  font-weight: 400;
  margin-left: 8px;
  min-width: 45px;
}

.navbar .players-menu {
  padding-top: 0;
  padding-bottom: 0;
}

.waiting-glass {
  width: 100%;
  height: 100%;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  cursor: wait;
}

.draft-page {
  position: fixed;
  top: 37px;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(#8a9196, #7A8288 80%, #70787d);
  background-repeat: no-repeat;
  background-color: transparent;
}

.infobar {
  position: absolute;
  width: 220px;
  top: 0;
  bottom: 0;
  right: 0;
}

.draft-cards {
  position: absolute;
  right: 220px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

@media only screen and (max-width: 1000px) {
  .infobar {
    width: 200px;
  }
  .draft-cards {
    right: 200px;
  }
}


.mobile .draft-cards {
  right: 0;
}

.mobile .pack-panel .mtgcard img {
  width: 12.1%;
}

.mobile .draft-cards .pack-panel {
  padding-bottom: 34%;
}

.phone .pack-panel .mtgcard img {
  width: 17.5%;
}

.phone .draft-cards .pack-panel {
  height: 47%;
  padding-bottom: 0;
  overflow: hidden;
  width: 100%;
  padding-right: 10px;
}

.phone .draft-cards .pack-panel .pack-container {
  overflow-x: scroll;
  white-space: nowrap;
}

.draft-cards .pack-panel {
  flex: 0 1 auto;
  margin: 5px;
  margin-bottom: 0;
  height: 0;
  overflow: visible;
  padding-bottom: 32.2%;
}

@media only screen and (max-width: 1000px) {
.draft-cards .pack-panel {
  padding-bottom: 27.9%;
}
}

.draft-cards .pick-panel {
  flex: 1 1 auto;
  margin: 5px;
  margin-top: 3px;
}

.deck {
  flex: 1 1 auto;
  margin: 5px;
  margin-top: 4px;
}

.card {
  border: 0; 
}

.card-header {
  padding: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.2rem;
  font-size: 0.7rem;
  border-bottom: 0;
  background-image: linear-gradient(to bottom, #616d74, #5d686f, #59636a, #555e65, #515960);
  background-repeat: no-repeat;
  background-color: transparent;
}

.tabs-header {
  padding: 0;
}

.tabs-header .nav-link {
  padding: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.8rem;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
}

.tabs-header .nav-link.active,
.tabs-header .nav-link:hover {
  color: #e9ecef;
}

.draft-page .card-body {
  padding: 0.4rem;
  color: rgba(0,0,0,.5);
  background-color: rgb(236,236,236);
}

.draft-cards {
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
}

.draft-cards .pack-hide-leave {
  visibility: hidden;
}

.draft-cards .pack-hide-leave-active {
  transition: padding-bottom 1s;
  padding-bottom: 32.1%;
  visibility: hidden;
}

.draft-cards .pack-hide-leave-to {
  padding-bottom: 0;
}


</style>



