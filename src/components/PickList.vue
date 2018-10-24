<template>
  <div class="mtgdraft-pick-list">
    <Pile :player="player" :key="0" :number="0"></Pile>
    <Pile :player="player" v-for="number in 4" :key="number" :number="number"></Pile>
    <Pile :player="player" :key="5" :number="5"></Pile>
    <Pile :player="player" :key="6" :number="6"></Pile>
    <div class="mtgpile mtgpile-separator"></div>
    <Pile caption="Sideboard"  :player="player" :key="7" :number="7"></Pile>
  </div>
</template>

<script>

import Pile from './Pile.vue'

export default {
  name: 'PickList',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    Pile
  }
}

</script>

<style>

.mtgdraft-pick-list {
  position: relative;
  overflow-y: scroll;
}

</style>



