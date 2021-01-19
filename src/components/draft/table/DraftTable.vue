<script>

import NavBar from '@/components/core/NavBar.vue'
import FirebaseError from '@/components/core/FirebaseError.vue'
import PackPanel from '../pack/PackPanel.vue';
import PickPanel from '../pick/PickPanel.vue';
import PickTimer from '../pick/PickTimer.vue'
import DeckPanel from '../deck/DeckPanel.vue'
import PlayersPopup from '../players/PlayersPopup.vue'
import TableCore from './TableCore.js'
import FullscreenButton from './FullscreenButton.vue'

import { SET_FIREBASE_ERROR } from '@/store/mutations'
import { PICK_TIMER_PICK } from '@/store/modules/draft/actions';
import { WRITE_TABLE, SET_SHOW_BOT_COLORS } from '@/store/modules/draft/mutations'

import { mapMutations, mapActions } from 'vuex';

import PlayersIcon from "vue-material-design-icons/AccountMultiple.vue"

import * as log from '@/core/log'
 
import _flatten from 'lodash/flatten'

import jquery from 'jquery'

import WaitTimer from './WaitTimer.js'

import Vue from 'vue'
import VueHotkey from 'v-hotkey'
Vue.use(VueHotkey);

const production = process.env.NODE_ENV === 'production';


import * as selectors from '@/store/modules/draft/selectors'
import * as draftbot from '@/store/modules/draft/draftbot'
import * as draftlog from '@/store/modules/draft/draftlog'
import firestore from '@/store/modules/draft/firestore'

export default {
  name: 'DraftTable',

  components: {
    NavBar, PackPanel, PickTimer, PickPanel, DeckPanel,
    PlayersIcon, PlayersPopup, FirebaseError, FullscreenButton
  },

  mixins: [WaitTimer,TableCore],

  data: function() {
    return { 
      firestoreUnsubscribe: null,
      pick_timeout_timer: null,
      firebase_error: null
    };
  },

  computed: {
    
    waiting: function() {
      return this.draft.waiting;
    },

    active_pack: function() {
      return selectors.activePack(this.player.id, this.table);
    },

    current_pack: function() {
      return selectors.currentPack(this.player.id, this.set.code, this.options, this.table);
    },

    current_pick: function() {
      return selectors.currentPick(this.player.id, this.set.code, this.options, this.table);
    },

    picks_complete: function() {
      return selectors.picksComplete(this.player.id, this.set.code, this.options, this.table);
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

    keymap: function() {
      return {
        'shift+enter': () => {
          if (!this.waiting && !this.picks_complete)
            this.pickTimerPick();
        } 
      };
    }

  },


  watch: {
    active_player: function (val) {
      if (val === undefined)
        this.$router.push({ path: "/play/"});
    },
    picks_complete(newValue, oldValue) {
      // save draft log when picks complete
      if (production && (newValue && !oldValue)) {
        let draftLog = draftlog.generate(this.player.id, this.draft);
        Promise.resolve()
          .then(() => firestore.saveDraftLog(draftLog))
          .then(() => firestore.saveDraftPickOrder(draftLog))
          .catch(error => {
            log.logException(error, "onSaveDraftLog");
          });
      }
    }
  },

  created() {

    // manage players popup on iOS (needed in order to make it dismiss)
    if (this.isiOS)
      this.managePlayersPopupForiOS();

    // collect/handle firebase_error if there is one. if there is an error
    // then we abort processing 
    if (this.$store.getters.firebase_error) {
      this.firebase_error = this.$store.getters.firebase_error;
      this.$store.commit(SET_FIREBASE_ERROR, null);
      return;
    }

    // resume draft
    this.resumeDraft().then(() => {

      // multiplayer
      if (this.options.multi_player) {

        // track firestore
        this.firestoreUnsubscribe = firestore.onDraftTableChanged(this.draft_id, table => {

          // write locally. 
          this.writeTable({ table });
          
        });

        // start wait timer
        this.startWaitTimer(this.draft_id);
      }
    });

  },

  beforeDestroy() {
  
    if (this.firestoreUnsubscribe)
      this.firestoreUnsubscribe();

    if (this.pick_timeout_timer)
      clearInterval(this.pick_timeout_timer);
  },


  methods: {
    ...mapMutations({
      writeTable(dispatch, payload) {
        return dispatch(this.namespace + '/' + WRITE_TABLE, payload);
      },
      setShowBotColors(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_SHOW_BOT_COLORS, payload);
      },
    }),
    ...mapActions({
      pickTimerPick(dispatch) {
        return dispatch(this.namespace + '/' + PICK_TIMER_PICK, this.withPlayerId({}));
      },
    }),
  
   
    generateDraftLog() {
      return draftlog.generate(this.player.id, this.draft);
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
      setShowBotColors: this.setShowBotColors,
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
      <template slot="navbar-left">
        <span class="navbar-text">
          Draft
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
        </ul>
      </template>

      <template slot="navbar-right">
         <ul class="navbar-nav ml-auto">
          <FullscreenButton 
              v-if="fullscreenEnabled" 
              :fullscreen="fullscreen" 
              @clicked="onFullscreenToggle"
            />
         </ul>
      </template>
    </NavBar>

    <div :class="{ 'draft-page': true, 'mobile': isMobile, 'phone': isPhone, 'tablet': isTablet }">
      <div 
        v-if="waiting" 
        class="waiting-glass"
      />

      <div 
        v-hotkey="keymap"
        class="draft-cards user-select-none"
      >
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
          :set="set" 
          format="draft"
          :options="options"
          :deck="active_player.deck"
        />
      </div>

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

.draft-cards {
  position: absolute;
  right: 0;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}


.mobile .draft-cards {
  right: 0;
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



