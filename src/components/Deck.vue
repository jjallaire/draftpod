

<template>
  <Drop class="deck" @drop="handleDrop(...arguments)" @dragover="handleDragover(...arguments)">
    <Card v-for="card in cards" :card="card" :key="card.key"></Card>
  </Drop>
</template>


<script>

import { mapActions } from 'vuex';
import { Drop } from 'vue-drag-drop';

import Card from './Card.vue';

import { DRAG_SOURCE_BOOSTER } from './constants';
import { PICK_CARD } from '../store/actions';

export default {
  name: 'Deck',
  props: {
    cards: Array
  },
  components: {
    Card, Drop
  },
  methods: {
    handleDragover(data, event) {
			if (!data || data.drag_source !== DRAG_SOURCE_BOOSTER) {
				event.dataTransfer.dropEffect = 'none';
			}
    },
    handleDrop(data) {
      if (data.drag_source === DRAG_SOURCE_BOOSTER)
        this.pickCard(data.card);
    },
    ...mapActions({
      pickCard: PICK_CARD
    })
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

