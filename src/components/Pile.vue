
<template>

<Drop class="pile" 
      @drop="handleDrop(...arguments)" 
      @dragover="handleDragover(...arguments)"
      @dragleave="handleDragleave(...arguments)">
  <Card v-for="(card, index) in piles[number]" :card="card" :key="card.key"
        :drag_source="drag_source"
        v-bind:style="{marginTop: ((index)*16) + '%'}">
  </Card>
  <div class="drag-insert" v-bind:style="styles.dragInsert"></div>
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
  data: function() {
    return {
      styles: {
        dragInsert: {
          marginTop: "0",
          display: "none"
        },
      },
    }
  },
  components: {
    Card, Drop
  },
  methods: {

    handleDragover(data, event) {
      
      // reject if not one of our drag sources
      if (!data || !data.drag_source) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }

      // see if we need to provider insert feedback
      let insertLoc = cardInsertLocation(data, event);
      if (insertLoc.feedbackAt !== null)
        this.provideDragFeedback(insertLoc.feedbackAt);
      else
        this.clearDragFeedback();
    },

    handleDragleave() {
      this.clearDragFeedback();
    },

    handleDrop(data, event) {

      // remove feedback
      this.clearDragFeedback();

      // check for insert location
      let insertLoc = cardInsertLocation(data, event);
      
      // payload for event
      let payload = { 
        card: data.card, 
        pileNumber: this.number, 
        insertBefore: insertLoc.insertBefore
      };

      // fire event
      if (data.drag_source === DRAG_SOURCE_BOOSTER)
        this.pickCard(payload);
      else if (data.drag_source === DRAG_SOURCE_PILE)
        this.moveCard(payload);

    },
    ...mapActions({
      pickCard: PICK_CARD,
      moveCard: MOVE_CARD
    }),

    provideDragFeedback: function(location) {
      this.styles.dragInsert.display = "block";
      this.styles.dragInsert.marginTop = location + "px";
    },

    clearDragFeedback: function() {
      this.styles.dragInsert.display = "none";
    }

  },

};

// compute insert location for a card
function cardInsertLocation(data, event) { 

  const pileElement = event.currentTarget;
  const pileBoundingRect = pileElement.getBoundingClientRect();
  const cursorOffset = data.cursorOffset;
  const dragCardTop = event.clientY - cursorOffset.y - pileBoundingRect.top;

  let insertLocation = {
    insertBefore: null,
    feedbackAt: null
  };
  const cards = pileElement.getElementsByClassName("card");
  for (let i = 0; i<cards.length; i++) {
    let cardTop = cards.item(i).getBoundingClientRect().top - pileBoundingRect.top;
    if (cardTop > dragCardTop) {
      insertLocation.insertBefore = i;
      insertLocation.feedbackAt = cardTop;
      break;
    }
  }

  return insertLocation;
}

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
.pile .drag-insert {
  border-top: 1px solid red;
  position: absolute;
  width: 100%;
}
</style>