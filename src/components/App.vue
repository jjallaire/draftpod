<template>
  <div class="app">
    <Booster :cards="booster"/>
    <Deck :cards="deck"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Booster from './Booster.vue';
import { BEGIN_DRAFT } from '../store/actions';

import { mapState } from 'vuex';
import { mapActions } from 'vuex';

export default {
  name: 'app',

  components: {
    Booster, Deck
  },

  created() {
    this.beginDraft();
  },

  computed: mapState([
    'booster',
    'deck'
  ]),

  methods: {
    ...mapActions({
      beginDraft: BEGIN_DRAFT
    })
  }
}
</script>

