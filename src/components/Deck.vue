<template>
  
<div class="mtgdraft-deck card bg-light">
  <div class="card-header">Deck</div>
  <div class="card-body">
  </div>
</div>


</template>

<script>

import Pile from './Pile.vue'

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
  }
}

</script>

<style>


</style>



