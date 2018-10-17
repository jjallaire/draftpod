<template>
  <div class="app">
    <div v-if="complete">Draft complete!</div> 
    <div v-else >Pack: {{ current_pack }}&nbsp;Pick: {{ current_pick }}</div>
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
    if (!this.started) {
      let set = this.$route.query.set || 'grn';
      this.startDraft({ set: set });
    }
  },

  computed: {
    ...mapGetters([
      'started',
      'current_pack',
      'current_pick',
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

