<template>
  <div class="app">
    <Booster :cards="booster"/>
    <Drop @drop="handleDrop(...arguments)">
      <Deck :cards="deck"/>
    </Drop>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Booster from './Booster.vue';
import { GENERATE_BOOSTER, PICK_CARD } from '../store/actions';
import { mapState } from 'vuex';
import { Drop } from 'vue-drag-drop';

export default {
  name: 'app',

  components: {
    Booster, Deck, Drop
  },

  created() {
    this.$store.dispatch(GENERATE_BOOSTER);
  },

  computed: mapState([
    'booster',
    'deck'
  ]),

  methods: {
    handleDrop(data) {
      this.$store.dispatch(PICK_CARD, data);
    }
  },
}
</script>

