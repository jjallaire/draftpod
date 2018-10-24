<template>
  <div class="mtgdraft-pick-list">
    <Pile :player="player" :key="0" :number="0"></Pile>
    <Pile :player="player" v-for="number in 6" :key="number" :number="number"></Pile>
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


</style>



