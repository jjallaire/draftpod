

<template>
  <div class="deck">
    <Pile :pile_index=0></Pile>
    <Pile :pile_index=1></Pile>
    <Pile :pile_index=2></Pile>
    <Pile :pile_index=3></Pile>
    <Pile :pile_index=4></Pile>
    <Pile :pile_index=5></Pile>
    <Pile :pile_index=6></Pile>
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

