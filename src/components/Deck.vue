

<template>
  <div class="deck">
    <Pile :cards="cards"></Pile>
  </div>
</template>


<script>

import Pile from './Pile.vue';

export default {
  name: 'Deck',
  props: {
    cards: Array
  },
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

