
<template>

<Drop class="pile" @drop="handleDrop(...arguments)" @dragover="handleDragover(...arguments)">
  <Card v-for="(card, index) in piles[number]" :card="card" :key="card.key"
        :drag_source="drag_source"
        v-bind:style="{marginTop: ((index)*16) + '%'}">
  </Card>
</Drop>

</template>


<script>

import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { Drop } from 'vue-drag-drop'

import { DRAG_SOURCE_BOOSTER, DRAG_SOURCE_PILE } from './constants'
import { PICK_CARD, MOVE_CARD } from '../store/actions'

import Card from './Card.vue'

export default {
  props: {
    number: {
      type: Number,
      required: true
    }
  },
  computed: {
    drag_source: () => DRAG_SOURCE_PILE,
    ...mapGetters([
      'piles'
    ]),
  },
  components: {
    Card, Drop
  },
  methods: {
    handleDragover(data, event) {
      if (!data || !data.drag_source) {
				event.dataTransfer.dropEffect = 'none';
			}
    },
    handleDrop(data) {
      let payload = { card: data.card, pile: this.number};
      if (data.drag_source === DRAG_SOURCE_BOOSTER)
        this.pickCard(payload);
      else if (data.drag_source === DRAG_SOURCE_PILE)
        this.moveCard(payload);

    },
    ...mapActions({
      pickCard: PICK_CARD,
      moveCard: MOVE_CARD
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