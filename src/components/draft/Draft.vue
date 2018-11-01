<template>
  <div>
  
  <Navbar> 
    <span v-if="started" class="navbar-text">{{ set_name }} &mdash; 
      <span v-if="picks_complete">Picks Completed</span>
      <span v-else>Pack {{ current_pack }}, Pick {{ current_pick }}</span>
    </span> 
    <ul v-if="started" class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link">
          <ExitToAppIcon title="Exit Draft" @click.native="exitDraft"/>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link">
          <FullScreenExitIcon v-if="fullscreen" title="Exit Fullscreen" @click.native="fullscreenToggle"/>
          <FullScreenIcon v-else title="Fullscreen" @click.native="fullscreenToggle"/>
        </a>
      </li>
    </ul> 
  </Navbar>

  <div class="mtgdraft bg-secondary">

      <div class="mtgdraft-cards">
        <transition name="mtgpack-hide">
          <Pack v-if="!picks_complete" :player="player"/>
        </transition>
        <Pick v-if="!picks_complete" :player="player"/>
        <Deck v-else :player="player"/>
      </div>

      <Infobar :player="player"/>

  </div>

  </div>
</template>

<script>

import Navbar from '../Navbar.vue'
import Pack from './Pack.vue';
import Pick from './pick/Pick.vue';
import Infobar from './infobar/Infobar.vue'
import Deck from './deck/Deck.vue'

import { START_DRAFT } from '../../store/actions';

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"
import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

import fscreen from 'fscreen'
import bootbox from 'bootbox'

export default {
  name: 'App',

  props: {
    player: {
      type: Number,
      default: 0
    }
  },

  data: function() {
    return { fullscreen: false };
  },

  components: {
    Navbar, Pack, Pick, Deck, Infobar, 
    FullScreenIcon, FullScreenExitIcon, ExitToAppIcon
  },

  created() {

    let vm = this;
    fscreen.onfullscreenchange = function() {
      vm.fullscreen = fscreen.fullscreenElement !== null;
    };

    if (!this.started) {
      this.startDraft({ playerNumber: this.player, set_code: 'grn' });
    }
  },

  computed: {
    ...mapGetters([
      'set_code',
      'set_name',
      'started',
      'picks_complete',
      'current_pack',
      'current_pick',
    ]),
  },

  methods: {
    ...mapActions({
      startDraft: START_DRAFT
    }),
    exitDraft: function() {
      bootbox.confirm({

        message: "<p>Do you want to exit this draft and start a new draft?</p>",
        
        className: "mtgdraft-auto-land-disable-dialog",

        buttons: {
          confirm: {
            label: 'Yes',
            className: 'btn-secondary'
          },
          cancel: {
            label: 'No',
            className: 'btn-primary'
          }
        },
      
        callback: (result) => {
      
          if (result) {
            this.startDraft({ playerNumber: this.player, set_code: 'grn' });
          } 
        }
    });
    },
    fullscreenToggle: function() {
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

.mtgdraft {
  position: fixed;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
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
  margin: 8px;
  margin-bottom: 0;
}

.mtgdraft-pick {
  flex: 1 1 auto;
  margin: 8px;
  margin-top: 5px;
}

.mtgdraft-deck {
  flex: 1 1 auto;
  margin: 8px;
}

.mtgdraft .card {
  border: 0; 
}

.mtgdraft .card-header {
  padding: 0.2rem;
  padding-left: 0.5rem;
  font-size: 0.7rem;
  color: lightgray;
}

.mtgdraft .tabs-header .nav-link {
  padding: 0.2rem;
  padding-left: 0.5rem;
  padding-right: 0.8rem;
  font-size: 0.7rem;
  color: #aaa;
}

.mtgdraft .tabs-header .nav-link.active,
.mtgdraft .tabs-header .nav-link:hover {
  color:  lightgray;
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

</style>



