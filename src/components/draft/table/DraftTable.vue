<script>

import SetIcon from '@/components/core/SetIcon.vue'
import NavBar from '@/components/core/NavBar.vue'
import PackPanel from '../pack/PackPanel.vue';
import PickPanel from '../pick/PickPanel.vue';
import PickTimer from '../pick/PickTimer.vue'
import InfoBar from '../infobar/InfoBar.vue'
import DeckPanel from '../deck/DeckPanel.vue'

import { REMOVE_DRAFTS } from '@/store/mutations'
import { RESUME_DRAFT, PACK_TO_PICK, PICK_TO_PILE, 
         DECK_TO_SIDEBOARD, SIDEBOARD_TO_DECK, SIDEBOARD_TO_SIDEBOARD, 
         DISABLE_AUTO_LANDS, SET_BASIC_LANDS } from '@/store/modules/draft/mutations';

import { mapState, mapMutations } from 'vuex';

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"
import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"

import fscreen from 'fscreen'
import * as messagebox from '@/components/core/messagebox.js'
 
// drafts namespace
const NS_DRAFTS = "drafts";

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'DraftTable',

  props: {
    draft_id: {
      type: String,
      required: true
    },
  },

  data: function() {
    return { 
      fullscreen: false,
      card_preview: "/images/card-back.png"
    };
  },

  components: {
    NavBar, Navigator, PackPanel, PickTimer, PickPanel, DeckPanel, InfoBar, SetIcon,
    FullScreenIcon, FullScreenExitIcon, ExitToAppIcon, DeleteIcon
  },

  provide: function() {
    return {
      aiPick: this.aiPick,
      packToPick: this.packToPick,
      pickToPile: this.pickToPile,
      deckToSideboard: this.deckToSideboard,
      sideboardToDeck: this.sideboardToDeck,
      sideboardToSideboard: this.sideboardToSideboard,
      disableAutoLands: this.disableAutoLands,
      setBasicLands: this.setBasicLands,
      setCardPreview: this.setCardPreview
    }
  },

  created() {
 
    // resume draft
    this.resumeDraft();

    // update fullscreen state on change
    this.onFullscreenChange();
    fscreen.addEventListener('fullscreenchange', this.onFullscreenChange);   
  },

  beforeDestroy() {
   
    fscreen.removeEventListener('fullscreenchange', this.onFullscreenChange);
  },

  computed: {
    ...mapState({
      options: function(state) {
        return state[NS_DRAFTS][this.draft_id].options;
      },
      table: function(state) {
        return state[NS_DRAFTS][this.draft_id].table;
      },
    }),
    
    active_cards: function() {
      return selectors.activeCards(this.table);
    },

    namespace: function() {
      return NS_DRAFTS + '/' + this.draft_id;
    },
  },

  methods: {
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
      resumeDraft(dispatch) {
        return dispatch(this.namespace + '/' + RESUME_DRAFT);
      },
      packToPick(dispatch, payload) {
        return dispatch(this.namespace + '/' + PACK_TO_PICK, payload);
      },
      pickToPile(dispatch, payload) {
        return dispatch(this.namespace + '/' + PICK_TO_PILE, payload);
      },
      deckToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_SIDEBOARD, payload);
      },
      sideboardToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_DECK, payload);
      },
      sideboardToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_SIDEBOARD, payload);
      },
      disableAutoLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + DISABLE_AUTO_LANDS, payload);
      },
      setBasicLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_BASIC_LANDS, payload);
      },
    }),
    aiPick: function() {
      this.packToPick({
        card: null,
        pile_number: 0, 
        insertBefore: null
      });
    },
    setCardPreview: function(card_preview) {
      this.card_preview = card_preview;
    },
    onExitDraft: function() {
      let vm = this;
      messagebox.confirm("<p>Do you want to exit this draft?</p>" +
                         "<p><em class='text-muted'>You can pick up where you left off in the draft later.</em></p>", function() {
        vm.$router.push({ path: "/draft/" });
      });
    },
    onRemoveDraft: function() {
      messagebox.confirm(
        "<p>Discard draft?</p> ",
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
  }
}
</script>

<template>

  <div>

    <NavBar> 
      <span class="navbar-text navbar-set-icon">
         <SetIcon :set_code="options.set_code"/>   
      </span>
      <span class="navbar-text">
        {{ options.set_name }} 
        <span v-if="!table.picks_complete">
          &mdash;
          Pack {{ table.current_pack }}, Pick {{ table.current_pick }}
          <PickTimer v-if="options.pick_timer" :current_pick="table.current_pick" />
        </span>
      </span> 
    
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link icon-link">
            <ExitToAppIcon title="Exit Draft" @click.native="onExitDraft"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link icon-link">
            <DeleteIcon title="Discard Draft" @click.native="onRemoveDraft"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link icon-link">
            <FullScreenExitIcon v-if="fullscreen" title="Exit fullscreen mode" @click.native="onFullscreenToggle"/>
            <FullScreenIcon v-else title="Fullscreen mode" @click.native="onFullscreenToggle"/>
          </a>
        </li>
      </ul> 
    
    </NavBar>

    <div class="draft-page">
        <div class="draft-cards">
          <transition name="pack-hide">
            <PackPanel v-if="!table.picks_complete" :pack="table.picks.pack"/>
          </transition>
          <PickPanel v-if="!table.picks_complete" 
                     :picks="table.picks" 
                     :pick_analysis="options.pick_analysis"/>
          <DeckPanel v-else :deck="table.deck"/>
        </div>

        <InfoBar :card_preview="card_preview" :cards="active_cards"/>
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

.draft-page {
  position: fixed;
  top: 40px;
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
  color: #fff;
}

.card-body {
  padding: 0.4rem;
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


