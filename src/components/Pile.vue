
<template>

<Drop class="pile" @drop="handleDrop(...arguments)" @dragover="handleDragover(...arguments)">
  <Card v-for="(card, index) in piles[pile_index]" :card="card" :key="card.key"
        v-bind:style="{marginTop: ((index)*16) + '%'}">
  </Card>
</Drop>

</template>


<script>

import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';
import { Drop } from 'vue-drag-drop';

import { DRAG_SOURCE_BOOSTER } from './constants';
import { PICK_CARD } from '../store/actions';

import Card from './Card.vue';

export default {
  props: {
    pile_index: {
      type: Number,
      required: true
    },
    cards: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    ...mapGetters([
      'piles'
    ])
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
        this.pickCard({ card: data.card, pile: this.pile_index});
    },
    ...mapActions({
      pickCard: PICK_CARD
    })
  }
};

</script>

<style>
.pile {
  display: inline-block;
  position: relative;
  width: 11.5%;
  min-height: 400px;
  margin-right: 4px;
}
.pile .card {
  position: absolute;
  left: 0;
  max-width: 100%;
}
.pile .card img {
  max-width: 100%;
  height: auto;
}
</style>