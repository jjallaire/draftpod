

<template>
  <div class="deck">
    <Pile :player="player" v-for="number in 7" :key="number-1" :number="number-1"></Pile>
    <div class="pile pile-separator"></div>
    <Pile caption="Sideboard" :player="player" :key="7" :number="7"></Pile>
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
  background-color: #E8E8E8;
  position: relative;
  overflow-y: scroll;
  padding-top: 7px;
  padding-left: 7px;
}
</style>

