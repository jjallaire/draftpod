<template>
  <div class="app">
    <Booster :cards="booster"/>
    <Deck :cards="deck"/>
  </div>
</template>

<script>
import Deck from './Deck.vue';
import Booster from './Booster.vue';
import { GENERATE_BOOSTER } from '../store/actions';
import { mapState } from 'vuex';
import { mapActions } from 'vuex';

export default {
  name: 'app',

  components: {
    Booster, Deck
  },

  created() {
    this.generateBooster();
  },

  computed: mapState([
    'booster',
    'deck'
  ]),

  methods: {
    ...mapActions({
      generateBooster: GENERATE_BOOSTER
    })
  }
}
</script>

