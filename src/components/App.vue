<template>
  <div class="app">
    <div>Pack: {{ current_pack }}&nbsp;Pick: {{ current_pick }}</div>
    <Pack :player="0"/>
    <Deck :player="0"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Pack from './Pack.vue';
import { START_DRAFT } from '../store/actions';

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
  name: 'app',

  components: {
    Pack, Deck
  },

  created() {
    if (!this.started)
      this.startDraft();
  },

  computed: {
    ...mapGetters([
      'started',
      'current_pack',
      'current_pick'
    ]),
  },

  methods: {
    ...mapActions({
      startDraft: START_DRAFT
    })
  }
}
</script>

