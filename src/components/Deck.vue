

<template>
  <div class="deck">
    <Pile v-for="number in 7" :key="number" :number=number></Pile>
  </div>
</template>


<script>

import Pile from './Pile.vue';

export default {
  name: 'Deck',
  components: {
    Pile
  },
}

</script>

<style>
.deck {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid;
}
</style>

