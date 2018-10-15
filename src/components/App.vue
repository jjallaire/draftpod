<template>
  <div class="app">
    <Pack :player="0"/>
    <Deck :player="0"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Pack from './Pack.vue';
import { BEGIN_DRAFT } from '../store/actions';

import { mapActions } from 'vuex';

export default {
  name: 'app',

  components: {
    Pack, Deck
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

