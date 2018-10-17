

<template>
  <div class="deck">
    <Pile :player="player" v-for="number in 7" :key="number" :number=number></Pile>
  </div>
</template>


<script>

import Pile from './Pile.vue';

export default {
  name: 'Deck',
  props: {
    player: {
      type: Number,
      required: true
    }
  },
  components: {
    Pile
  },
}

</script>

<style>
.deck {
  background-color: lightgray;
  position: relative;
  overflow-y: scroll;
}
</style>

