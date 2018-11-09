<template>
  <div>

  <Navbar> 
    <transition name="mtgdraft-fade">
      <span v-if="started" class="navbar-text">{{ cards.set_name }} &mdash; 
        <span v-if="status.picks_complete">Deck Construction</span>
        <span v-else>
          Pack {{ status.current_pack }}, Pick {{ status.current_pick }}
          <PickTimer v-if="options.pick_timer" :pick_end_time="status.pick_end_time" />
        </span>
      </span> 
    </transition>
    <transition name="mtgdraft-fade">
      <ul v-if="started" class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link icon-link">
            <ExitToAppIcon title="Exit Draft" @click.native="onExitDraft"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link icon-link">
            <FullScreenExitIcon v-if="fullscreen" title="Exit Fullscreen" @click.native="onFullscreenToggle"/>
            <FullScreenIcon v-else title="Fullscreen" @click.native="onFullscreenToggle"/>
          </a>
        </li>
      </ul> 
    </transition>
  </Navbar>

  <transition name="mtgdraft-fade">
    <div v-if="started" key="draft" class="mtgdraft bg-secondary">
        <div class="mtgdraft-cards">
          <transition name="mtgpack-hide">
            <Pack v-if="!status.picks_complete" 
                 :player_id="player_id" :pack="player.draft.pack"/>
          </transition>
          <Pick v-if="!status.picks_complete" 
                :draft="player.draft" 
                :pick_analysis="options.pick_analysis"/>
          <Deck v-else :deck="player.deck"/>
        </div>

        <Infobar :cards="active_cards"/>
    </div>
    <div v-else key="draft-navigator">
      <Navigator :player_id="player_id" />
    </div>
    </transition>


  </div>
</template>

<script>

import Navbar from '@/components/Navbar.vue'
import Navigator from './navigator/Navigator.vue'
import Pack from './pack/Pack.vue';
import Pick from './pick/Pick.vue';
import PickTimer from './pick/PickTimer.vue'
import Infobar from './infobar/Infobar.vue'
import Deck from './deck/Deck.vue'

import { INITIALIZE_STORE, PICK_CARD } from '@/store/modules/draft/actions';
import { PICK_TO_PILE, DECK_TO_SIDEBOARD, SIDEBOARD_TO_DECK, SIDEBOARD_TO_SIDEBOARD, 
         DISABLE_AUTO_LANDS, SET_BASIC_LANDS, 
         EXIT_DRAFT } from '@/store/modules/draft/mutations';

import { mapState, mapActions, mapMutations } from 'vuex';

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

import fscreen from 'fscreen'
import * as messagebox from '@/components/core/messagebox.js'
import { Events, EventBus } from './eventbus'

//import { createNamespacedHelpers } from 'vuex'
//const { mapState, mapActions } = createNamespacedHelpers('some/nested/module')

export default {
  name: 'Draft',

  props: {
    player_id: {
      type: Number,
      default: 0
    },
  },

  data: function() {
    return { fullscreen: false };
  },

  components: {
    Navbar, Navigator, Pack, PickTimer, Pick, Deck, Infobar, 
    FullScreenIcon, FullScreenExitIcon, ExitToAppIcon
  },

  created() {
    // alias vue model for callbacks
    let vm = this;

    // one time store initialization
    this.initializeStore({ player_id: this.player_id });

    // update fullscreen state on change
    fscreen.onfullscreenchange = function() {
      vm.fullscreen = fscreen.fullscreenElement !== null;
    };

    EventBus.$on(Events.CardPackToPick, function(data) {
      vm.pickCard({player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.CardPickToPile, function(data) {
      vm.pickToPile({ player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.CardDeckToSideboard, function(data) {
      vm.deckToSideboard({ player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.CardSideboardToDeck, function(data) {
      vm.sideboardToDeck({player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.CardSideboardToSideboard, function(data) {
      vm.sideboardToSideboard({player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.CardPileToPile, function(data) {
      vm.pileToPile(data);
    });
    EventBus.$on(Events.LandsChanged, function(data) {
      vm.setBasicLands({player_id: vm.player_id, ...data});
    });
    EventBus.$on(Events.LandsAutoDisable, function() {
      vm.disableAutoLands({ player_id: vm.player_id });
    });
  },

  computed: {
    namespace: function() {
      return 'draft';
    },
    ...mapState({
      cards: function(state) {
        return state[this.namespace].cards;
      },
      started: function() {
        return this.status.current_pack > 0;
      },
      options: function(state) {
        return state[this.namespace].options;
      },
      status: function(state) {
        return state[this.namespace].status;
      },
      player: function(state) {
        return state[this.namespace].players[this.player_id];
      },
    }),
    
    active_cards: function() {
      let draft = this.player.draft;
      let deck = this.player.deck;
      let piles = this.status.picks_complete ? deck.piles : draft.piles;
      return piles.slice(0, 7).flat();
    }
  },

  methods: {
    ...mapActions('draft', {
      initializeStore: INITIALIZE_STORE,
      pickCard: PICK_CARD,
    }),
    ...mapMutations('draft', {
      pickToPile: PICK_TO_PILE,
      deckToSideboard: DECK_TO_SIDEBOARD,
      sideboardToDeck: SIDEBOARD_TO_DECK,
      sideboardToSideboard: SIDEBOARD_TO_SIDEBOARD,
      disableAutoLands: DISABLE_AUTO_LANDS,
      setBasicLands: SET_BASIC_LANDS,
      exitDraft: EXIT_DRAFT,
    }),
    onExitDraft: function() {
      messagebox.confirm("<p>Do you want to exit this draft?</p>", this.exitDraft);
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

<style>

.navbar {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 40px;
}

.navbar .mtgdraft-pick-timer {
  padding: 0.3rem;
  font-size: 0.9rem;
  font-weight: 400;
  margin-left: 8px;
  min-width: 45px;
}

.mtgdraft {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
}

.mtgdraft-fade-enter-active, .mtgdraft-fade-leave-active {
  transition: opacity 0.7s;
}
.mtgdraft-fade-enter, .mtgdraft-fade-leave-to {
  opacity: 0;
}

.mtgdraft-infobar {
  position: absolute;
  width: 230px;
  top: 0;
  bottom: 0;
  right: 0;
}

.mtgdraft-cards {
  position: absolute;
  right: 230px;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
}

@media only screen and (max-width: 1000px) {
  .mtgdraft-infobar {
    width: 210px;
  }
  .mtgdraft-cards {
    right: 210px;
  }
}


.mtgdraft-pack {
  flex: 0 1 auto;
  margin: 5px;
  margin-bottom: 0;
}

.mtgdraft-pick {
  flex: 1 1 auto;
  margin: 5px;
  margin-top: 3px;
}

.mtgdraft-deck {
  flex: 1 1 auto;
  margin: 5px;
  margin-top: 4px;
}

.mtgdraft .card {
  border: 0; 
}

.mtgdraft .card-header {
  padding: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.2rem;
  font-size: 0.7rem;
  border-bottom: 0;
}

.mtgdraft .tabs-header .nav-link {
  padding: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.8rem;
  font-size: 0.7rem;
}

.mtgdraft .tabs-header {
  padding: 0;
}

.mtgdraft .card-body {
  padding: 0.4rem;
}

.mtgdraft-cards {
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
}

.mtgpack-hide-leave-active {
  transition: all 1s;
  max-height: 500px;
}

.mtgpack-hide-leave-to {
  max-height: 0px;
}

.mtgdraft-deck-colors {
  font-size: 0.8em;
  font-weight: 400;
  margin-top: 3px;
}

.mtgdraft-deck-colors th,
.mtgdraft-deck-colors td {
  border-top: none;
}

.mtgdraft-deck-colors td img {
  margin-top: -2px;
  margin-right: 5px;
  margin-left: 4px;
}


</style>



