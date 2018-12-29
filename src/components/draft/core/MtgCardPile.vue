<script>

import { Drop } from 'vue-drag-drop'
import MtgCard from './MtgCard.vue'

import _flatten from 'lodash/flatten'

export default {

  name: 'MtgCardPile',

  props: {
    piles: {
      type: Array,
      required: true
    },
    number: {
      type: Number,
      required: true,
    },
    caption: {
      type: String
    },
    caption_count: {
      type: Boolean,
      default: false
    },
    caption_center: {
      type: Boolean,
      default: true
    },
    drag_source: {
      type: String,
      default: "DRAG_SOURCE_PILE"
    },
  },

  inject: [
    'packToPick',
    'pickToPile',
    'deckToSideboard',
    'sideboardToDeck',
    'sideboardToSideboard',
    'touchDragManager'
  ],

  mounted() {
    this.touchDragManager.registerDropTarget({
      element: this.$refs.drop.$el, 
      handlers: {
        onEnter(data, touch) {
          console.log("onTouchEnter");
        },
        onMove(data, touch) {
          console.log("onTouchMove");
        },
        onLeave(data, touch) {
          console.log("onTouchLeave");
        },
        onDrop(data, touch) {
          console.log("onTouchDrop");
        },
      }
    });
  },

  beforeDestroy() {
    this.touchDragManager.unregisterDropTarget(this.$refs.drop.$el);
  },

  computed: {
    pile: function() { return this.piles[this.number]},
    pick_number: function() {
      return _flatten(this.piles).length + 1;
    }
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
    MtgCard, Drop
  },
  methods: {

    handleDragenter(data) {
      // tag the data with the current pick number
      if (!data.pick_number)
        data.pick_number = this.pick_number;
    },

    handleDragover(data, event) {
      
      // reject if not one of our drag sources or if it's the wrong pick number
      if (!data || !data.drag_source || (data.pick_number != this.pick_number)) {
        event.dataTransfer.dropEffect = 'none';
        return;
      }

      // reject for deck to deck
      if (data.drag_source === "DRAG_SOURCE_DECK" &&
          this.drag_source === "DRAG_SOURCE_DECK") {
        event.dataTransfer.dropEffect = 'none';
        return;
      }

      // no insert feedback for sideboard to deck
      if (data.drag_source === "DRAG_SOURCE_SIDEBOARD" &&
          this.drag_source === "DRAG_SOURCE_DECK") {
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

      // reject if it's the wrong pick_number
      if (data.pick_number != this.pick_number)
        return;

      // check for insert location
      let insertLoc = cardInsertLocation(data, event);
      
      // event: pack to pick
      if (data.drag_source === "DRAG_SOURCE_PACK") {
        this.packToPick({
          card: data.card, 
          pile_number: this.number, 
          insertBefore: insertLoc.insertBefore
        });
      }

      // event: move pick to another pile
      else if (data.drag_source === "DRAG_SOURCE_PILE") {
        this.pickToPile({
          card: data.card,
          pile_number: this.number,
          insertBefore: insertLoc.insertBefore
        });
      }

      // event: deck to sideboard
      else if (data.drag_source === "DRAG_SOURCE_DECK") {
        this.deckToSideboard({
          card: data.card,
          insertBefore: insertLoc.insertBefore
        });
      } 

      // events: sideboard
      else if (data.drag_source === "DRAG_SOURCE_SIDEBOARD") {
        if (this.drag_source === "DRAG_SOURCE_DECK") {
          this.sideboardToDeck({
            card: data.card
          });
        } else if (this.drag_source === "DRAG_SOURCE_SIDEBOARD") {
          this.sideboardToSideboard({
            card: data.card,
            insertBefore: insertLoc.insertBefore
          });
        }
      }

      // execute onAfterDrop if we have it
      if (data.onAfterDrop)
        data.onAfterDrop();
    },

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
  const cards = pileElement.getElementsByClassName("mtgcard");
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

<template>

  <Drop class="pile" 
        @drop="handleDrop(...arguments)" 
        @dragover="handleDragover(...arguments)"
        @dragenter="handleDragenter(...arguments)"
        @dragleave="handleDragleave(...arguments)"
        ref="drop">
    <div class="pile-caption" v-if="caption" 
        :style="{textAlign: caption_center ? 'center' : 'left'}">
      {{ caption }}<span v-if="caption_count"> ({{pile.length}})</span>
    </div>
    <MtgCard v-for="(card, index) in pile" :key="card.key"
          :card="card" :drag_source="drag_source"
          :style="{marginTop: ((index+(caption ? 1 : 0))*16) + '%'}">
    </MtgCard>
    <div class="pile-controls" 
        :style="{marginTop: ((pile.length-1+(caption ? 1 : 0))*16) 
                              + (pile.length >= 1 ? 140 : 6) + '%'}">
      <slot name="controls"></slot>
    </div>
    <div class="pile-drag-insert" :style="styles.dragInsert"></div>
  </Drop>

</template>

<style>
.pile {
  display: inline-block;
  position: relative;
  min-height: 250px;
  margin-right: 4px;
}
.pile {
  width: 11.5%;
}


.pile-separator {
  width: 1.5%;
}
.pile .pile-caption {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.8em;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
  margin-top: -2px; 
}
@media only screen and (max-width: 1000px) {
.pile {
  width: 11%;
} 
.pile .pile-caption {
  font-size: 0.6em;
  margin-top: -3px;
}
.pile-separator {
  width: 0.5%;
}
}

.pile .mtgcard {
  position: absolute;
  left: 0;
  max-width: 100%;
}
.pile .mtgcard img {
  max-width: 100%;
  height: auto;
}
.pile .pile-drag-insert {
  border-top: 2px groove #f2f2f2;
  position: absolute;
  width: 100%;
  margin-left: 2px;
  margin-right: 2px;
}

.pile .pile-controls {
  position: absolute;
  width: 100%;
}

</style>