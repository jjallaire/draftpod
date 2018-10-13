

<template>
  <div class="deck">
    <Pile v-for="index in 7" :key="index" :pile_index=index></Pile>
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

