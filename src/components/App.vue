<template>
  <div class="app">
    <Pack :player="0"/>
    <Deck :player="0"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Pack from './Pack.vue';
import { NEXT_PACK } from '../store/actions';

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'app',

  components: {
    Pack, Deck
  },

  created() {
    if (!this.initialized)
      this.nextPack();
  },

  computed: {
    ...mapGetters([
      'initialized'
    ]),
  },

  methods: {
    ...mapActions({
      nextPack: NEXT_PACK
    })
  }
}
</script>

