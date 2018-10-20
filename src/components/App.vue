<template>
  <div class="mtgdraft">
    <Header />
    <div class="mtgdraft-main">
      <div class="mtgdraft-cards">
        <transition name="mtgpack-hide"> 
          <Pack v-if="!complete" :player="player"/>
        </transition>
        <transition name="mtgpack-hide"> 
        <div v-if="!complete" class="mtgpack-separator"></div>
        </transition>
        <Deck :player="player"/>
      </div> 
      <Infobar :player="player"/>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import Infobar from './Infobar.vue'
import Deck from './Deck.vue';
import Pack from './Pack.vue';
import { START_DRAFT } from '../store/actions';

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  props: {
    player: {
      type: Number,
      default: 0
    }
  },

  components: {
    Header, Pack, Deck, Infobar
  },

  created() {
    if (!this.started) {
      let set = this.$route.query.set || 'grn';
      this.startDraft({ playerNumber: this.player, set_code: set });
    }
  },

  computed: {
    ...mapGetters([
      'started',
      'complete'
    ]),
  },

  methods: {
    ...mapActions({
      startDraft: START_DRAFT
    })
  }
}
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
  font-family: "Source Sans Pro",Calibri,Candara,Arial,sans-serif;
}

.mtgdraft {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.mtgdraft-header {
  flex: 0 1 auto;
}

.mtgdraft-main {
  display: flex;
  flex-flow: row;
  flex: 1 1 auto;
}

.mtgdraft-cards {
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
}

.mtgpack {
  flex: 0 1 auto;
}

.mtgpack-separator {
  flex: 0 1 auto;
  height: 10px;
  background-color: rgba(39, 128, 227, 0.1);
}

.mtgdeck {
  flex: 1 1 auto;
}

.mtgpack-hide-leave-active {
  transition: all 1s;
  max-height: 500px;
}

.mtgpack-hide-leave-to {
  max-height: 0px;
  padding: 0;
  margin: 0;
}

</style>



