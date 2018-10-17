<template>
  <div class="app">
    <Header />
    <Pack :player="0"/>
    <Deck :player="0"/>  
  </div>
</template>

<script>
import Header from './Header.vue'
import Deck from './Deck.vue';
import Pack from './Pack.vue';
import { START_DRAFT } from '../store/actions';

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'App',

  components: {
    Header, Pack, Deck
  },

  created() {
    if (!this.started) {
      let set = this.$route.query.set || 'grn';
      this.startDraft({ set: set });
    }
  },

  computed: {
    ...mapGetters([
      'started',
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

.pack {
  flex: 0 1 auto;
}

.deck {
  flex: 1 1 auto;
}
</style>



