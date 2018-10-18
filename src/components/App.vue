<template>
  <div class="app">
    <Header />
    <div class="main">
      <div class="draft">
        <transition name="pack-hide"> 
          <Pack v-if="!complete" :player="player"/>
        </transition>
        <Deck :player="player"/>
      </div> 
      <Sidebar :player="player"/>
    </div>
  </div>
</template>

<script>
import Header from './Header.vue'
import Sidebar from './Sidebar.vue'
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
    Header, Pack, Deck, Sidebar
  },

  created() {
    if (!this.started) {
      let set = this.$route.query.set || 'grn';
      this.startDraft({ playerNumber: this.player, set: set });
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
  margin: 0
}

.app {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.header {
  flex: 0 1 auto;
}

.main {
  display: flex;
  flex-flow: row;
  flex: 1 1 auto;
}

.draft {
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
}

.pack {
  flex: 0 1 auto;
}

.deck {
  flex: 1 1 auto;
}

.pack-hide-leave-active {
  transition: all 1s;
  max-height: 500px;
}

.pack-hide-leave-to {
  max-height: 0px;
  padding: 0;
  margin: 0;
}

</style>



