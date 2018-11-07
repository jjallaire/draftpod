<template>
  <div>

  <Navbar> 
    <transition name="mtgdraft-fade">
      <span v-if="started" class="navbar-text">{{ set_name }} &mdash; 
        <span v-if="picks_complete">Deck Construction</span>
        <span v-else>
          Pack {{ current_pack }}, Pick {{ current_pick }}
          <PickTimer v-if="pick_timer" :pick_time_remaining="pick_time_remaining" />
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
            <Pack v-if="!picks_complete" 
                  :draft_id="draft_id" :player_id="player_id" :pack="draft(this.player_id).pack"/>
          </transition>
          <Pick v-if="!picks_complete" :draft_id="draft_id" :player_id="player_id"/>
          <Deck v-else :draft_id="draft_id" :player_id="player_id"/>
        </div>

        <Infobar :draft_id="draft_id" :player_id="player_id"/>
    </div>
    <div v-else key="draft-navigator">
      <Navigator :player_id="player_id" />
    </div>
    </transition>


  </div>
</template>

<script>

import Navbar from '../Navbar.vue'
import Navigator from './navigator/Navigator.vue'
import Pack from './pack/Pack.vue';
import Pick from './pick/Pick.vue';
import PickTimer from './pick/PickTimer.vue'
import Infobar from './infobar/Infobar.vue'
import Deck from './deck/Deck.vue'

import { INITIALIZE_STORE } from '../../store/actions';
import { EXIT_DRAFT } from '../../store/mutations';

import { mapActions } from 'vuex';
import { mapMutations } from 'vuex';
import { mapGetters } from 'vuex';

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

import fscreen from 'fscreen'
import * as messagebox from '../core/messagebox.js'

export default {
  name: 'Draft',

  props: {
    draft_id: {
      type: String,
      default: "339CA951-9C5A-441E-A7DC-A2738A563965"
    },
    player_id: {
      type: Number,
      default: 0
    }
  },

  data: function() {
    return { fullscreen: false };
  },

  components: {
    Navbar, Navigator, Pack, PickTimer, Pick, Deck, Infobar, 
    FullScreenIcon, FullScreenExitIcon, ExitToAppIcon
  },

  created() {
    // one time store initialization
    this.initializeStore({ player_id: this.player_id });

    // update fullscreen state on change
    let vm = this;
    fscreen.onfullscreenchange = function() {
      vm.fullscreen = fscreen.fullscreenElement !== null;
    };
  },

  computed: {
    ...mapGetters([
      'set_code',
      'set_name',
      'started',
      'picks_complete',
      'current_pack',
      'current_pick',
      'pick_timer',
      'pick_time_remaining',
      'draft',
    ]),
  },

  methods: {
    ...mapActions({
      initializeStore: INITIALIZE_STORE,
    }),
    ...mapMutations({
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
    }
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



