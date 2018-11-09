
<template>

<Drop class="mtgpile" 
      @drop="handleDrop(...arguments)" 
      @dragover="handleDragover(...arguments)"
      @dragleave="handleDragleave(...arguments)">
  <div class="mtgpile-caption" v-if="caption" 
       :style="{textAlign: caption_center ? 'center' : 'left'}">
    {{ caption }}<span v-if="caption_count"> ({{pile.length}})</span>
  </div>
  <Card v-for="(card, index) in pile" :key="card.key"
        :card="card" :drag_source="drag_source"
        :style="{marginTop: ((index+(caption ? 1 : 0))*16) + '%'}">
  </Card>
  <div class="mtgpile-controls" 
       :style="{marginTop: ((pile.length-1+(caption ? 1 : 0))*16) 
                            + (pile.length >= 1 ? 140 : 6) + '%'}">
    <slot name="controls"></slot>
  </div>
  <div class="mtgpile-drag-insert" :style="styles.dragInsert"></div>
</Drop>

</template>


<script>

import { Drop } from 'vue-drag-drop'
import Card from './Card.vue'

import { Events, EventBus } from '@/components/draft/eventbus'

export default {
  props: {
    deck: {
      type: Object,
      default: null
    },
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
  computed: {
    pile: function() { return this.piles[this.number]},
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

      // check for insert location
      let insertLoc = cardInsertLocation(data, event);
      
      // event: pack to pick
      if (data.drag_source === "DRAG_SOURCE_PACK") {
        EventBus.$emit(Events.CardPackToPick, {
          card: data.card, 
          pile_number: this.number, 
          insertBefore: insertLoc.insertBefore
        });
      }

      // event: move pick to another pile
      else if (data.drag_source === "DRAG_SOURCE_PILE") {
        EventBus.$emit(Events.CardPickToPile, {
          card: data.card,
          pile_number: this.number,
          insertBefore: insertLoc.insertBefore
        });
      }

      // event: deck to sideboard
      else if (data.drag_source === "DRAG_SOURCE_DECK") {
        EventBus.$emit(Events.CardDeckToSideboard, {
          card: data.card,
          insertBefore: insertLoc.insertBefore
        });
      } 

      // events: sideboard
      else if (data.drag_source === "DRAG_SOURCE_SIDEBOARD") {
        if (this.drag_source === "DRAG_SOURCE_DECK") {
          EventBus.$emit(Events.CardSideboardToDeck, {
            card: data.card
          });
        } else if (this.drag_source === "DRAG_SOURCE_SIDEBOARD") {
          EventBus.$emit(Events.CardSideboardToSideboard, {
            card: data.card,
            insertBefore: insertLoc.insertBefore
          });
        }
      }

      // apply auto lands if this was a deck building action
      if ((data.drag_source === "DRAG_SOURCE_DECK" || data.drag_source === "DRAG_SOURCE_SIDEBOARD") &&
           this.deck.auto_lands) {
        EventBus.$emit(Events.LandsAutoApply);
      }
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

<style>
.mtgpile, .mtgpileseparator {
  display: inline-block;
  position: relative;
  min-height: 200px;
  margin-right: 4px;
}
.mtgpile {
  width: 11.5%;
}
.mtgpile-separator {
  width: 3%;
}
.mtgpile .mtgpile-caption {
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
.mtgpile {
  width: 10%;
} 
.mtgpile .mtgpile-caption {
  font-size: 0.6em;
  margin-top: -3px;
}
}

.mtgpile .mtgcard {
  position: absolute;
  left: 0;
  max-width: 100%;
}
.mtgpile .mtgcard img {
  max-width: 100%;
  height: auto;
}
.mtgpile .mtgpile-drag-insert {
  border-top: 2px groove #f2f2f2;
  position: absolute;
  width: 100%;
  margin-left: 2px;
  margin-right: 2px;
}

.mtgpile .mtgpile-controls {
  position: absolute;
  width: 100%;
}

</style>