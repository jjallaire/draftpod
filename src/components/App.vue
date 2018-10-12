<template>
  <div class="app">
    <Booster/>
    <Deck/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Booster from './Booster.vue';
import { BEGIN_DRAFT } from '../store/actions';

import { mapActions } from 'vuex';

export default {
  name: 'app',

  components: {
    Booster, Deck
  },

  created() {
    this.beginDraft();
  },

  methods: {
    ...mapActions({
      beginDraft: BEGIN_DRAFT
    })
  }
}
</script>

