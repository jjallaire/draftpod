<template>
  <div class="app">
    <Booster :cards="booster"/>
    <Deck :cards="deck"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Booster from './Booster.vue';
import { GENERATE_BOOSTER } from '../store/action-types';
import { mapState } from 'vuex';

export default {
  name: 'app',

  components: {
    Booster, Deck
  },

  created() {
    this.$store.dispatch(GENERATE_BOOSTER);
  },

  computed: mapState([
    'booster',
    'deck'
  ]),
}
</script>

