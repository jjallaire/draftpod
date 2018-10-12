<template>
  <div class="app">
    <Booster :cards="booster"/>
    <Drop @drop="handleDrop(...arguments)">
      <Deck :cards="deck"/>
    </Drop>
  </div>
</template>

<script>
import Deck from './components/Deck.vue';
import Booster from './components/Booster.vue';
import { mapState } from 'vuex';
import { Drop } from 'vue-drag-drop';

export default {
  name: 'app',

  components: {
    Booster, Deck, Drop
  },

  created() {
    this.$store.dispatch('generateBooster');
  },

  computed: mapState([
    'booster',
    'deck'
  ]),

  methods: {
    handleDrop(data) {
      this.$store.dispatch('pickCard', data);
    }
  },
}
</script>

