<template>
  <Booster v-bind:cards="booster.cards"/>
</template>

<script>
import Booster from './components/Booster.vue'
import axios from 'axios';

export default {
  name: 'app',
  components: {
    Booster
  },

  created() {
    
    axios.get('https://api.magicthegathering.io/v1/sets/GRN/booster')
      .then(response => {
          this.booster = response.data
      });
  },

  data() {
    return {
      booster: {
        cards: []
      }
    }
  }
}
</script>
