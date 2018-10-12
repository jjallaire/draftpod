

<template>
  <Drop class="deck" @drop="handleDrop(...arguments)">
    <Card v-for="card in cards" :card="card" :key="card.key"></Card>
  </Drop>
</template>


<script>

import Card from './Card.vue';
import { Drop } from 'vue-drag-drop';
import { DragSources } from './constants';

import { PICK_CARD } from '../store/action-types';

export default {
  name: 'Deck',
  props: {
    cards: Array
  },
  components: {
    Card, Drop
  },
  methods: {
    handleDrop(data) {
      if (data) {
        if (data.drag_source === DragSources.Booster)
          this.$store.dispatch(PICK_CARD, data.card);
      }
    }
  },
}

</script>

<style>
.deck {
  margin-top: 10px;
  padding-top: 10px;
  min-height: 400px;
  border-top: 1px solid;
}
</style>

