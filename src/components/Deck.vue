

<template>
  <div class="deck">
    <Pile :player="player" :key="0" :number="0"></Pile>
    <Pile :player="player" v-for="number in 6" :key="number" :number="number"></Pile>
    <div class="pile pile-separator"></div>
    <Pile caption="Sideboard" :center_caption="true" :player="player" :key="7" :number="7"></Pile>
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
  padding: 7px;
}
</style>

