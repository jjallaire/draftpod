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
import { Drop } from 'vue-drag-drop';
import axios from 'axios';

export default {
  name: 'app',

  components: {
    Booster, Deck, Drop
  },

  created() {
    
    axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
      .then(response => {
        // generate a unique index/key for each card
        let key=1;
        this.booster = response.data.cards.map(card => {
          return { ...card, key: key++ };
        });
      });
  },

  data() {
    return {
      booster: [],
      deck: []
    }
  },

  methods: {
    handleDrop(data) {
      this.booster.splice(this.booster.indexOf(data), 1);
      this.deck.push(data);
      console.log(data);
    }
  },
}
</script>
