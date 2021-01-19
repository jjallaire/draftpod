<script>

import { Drop } from 'vue-drag-drop'
import MtgCard from './MtgCard.vue'

import _flatten from 'lodash/flatten'

import { DECK } from '@/store/modules/draft/constants'
import * as filters from '@/store/modules/draft/card-filters'

export default {

  name: 'MtgCardPile',
  components: {
    MtgCard, Drop
  },

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
      type: String,
      default: null,
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
      required: true
    },
    format: {
      type: String,
      required: true
    },
    compact: {
      type: Boolean,
      default: false
    },
    arrange_by_cost: {
      type: Boolean,
      default: false
    },
    controls_offset: {
      type: Number,
      default: 0
    }
  },

  inject: [
    'packToPick',
    'pickToPile',
    'deckToSideboard',
    'deckToUnused',
    'deckToDeck',
    'sideboardToDeck',
    'sideboardToUnused',
    'unusedToDeck',
    'unusedToSideboard',
    'touchDragManager'
  ],
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

  computed: {
    pile: function() { return this.piles[this.number]},
    pick_number: function() {
      return _flatten(this.piles).length + 1;
    },
    is_draft: function() {
      return this.format === 'draft';
    },
    is_sealed: function() {
      return this.format === 'sealed';
    },
    is_sealed_compact: function() {
      return this.is_sealed && this.compact;
    }
  },

  mounted() {
    this.touchDragManager.registerDropTarget({
      element: this.$el,
      handlers: {
        onEnter: this.handleDragenter,
        onMove: this.handleDragover,
        onLeave: this.handleDragleave,
        onDrop: this.handleDrop
      }
    });
  },

  beforeDestroy() {
    this.touchDragManager.unregisterDropTarget(this.$el);
  },
  methods: {

    handleDragenter(data) {
      // tag the data with the current pick number
      if (data && !data.pick_number)
        data.pick_number = this.pick_number;
    },

    handleDragover(data, event) {
      
      // reject if not one of our drag sources or if it's the wrong pick number
      if (!data || !data.drag_source || (data.pick_number != this.pick_number)) {
        if (event.dataTransfer)
          event.dataTransfer.dropEffect = 'none';
        return false;
      }

      // reject moves within the deck for sealed compact mode
      // (reject all for arrange_by_cost or otherwise reject lands)
      if ((this.arrange_by_cost || filters.land(data.card)) && 
          this.is_sealed_compact && 
          data.drag_source === "DRAG_SOURCE_DECK" &&
          this.drag_source === "DRAG_SOURCE_DECK") {
        if (event.dataTransfer)
          event.dataTransfer.dropEffect = 'none';
        return false;
      }

      // no insert feedback for full mode deck building
      if (!this.is_sealed_compact &&
          (this.drag_source === "DRAG_SOURCE_DECK" ||
           this.drag_source === "DRAG_SOURCE_SIDEBOARD" ||
           this.drag_source === "DRAG_SOURCE_UNUSED")) {
        return true;
      }

      // no insert feedback for sideboard in compact mode
      // deck building (we auto-arrange it)
      if (this.is_sealed_compact && (this.number == DECK.SIDEBOARD)) {
        return true;
      }

      // no insert feedback for lands into deck in compact mode
      // (they go into the lands pile)
      if (this.is_sealed_compact && filters.land(data.card) && this.drag_source === "DRAG_SOURCE_DECK") {
        return true;
      }

      // see if we need to provider insert feedback
      let insertLoc = this.cardInsertLocation(data, event);
      if (insertLoc.feedbackAt !== null)
        this.provideDragFeedback(insertLoc.feedbackAt);
      else
        this.clearDragFeedback();

      // stop propagation
      if (event.stopPropagation)
        event.stopPropagation();

      // return true
      return true;
    },

    handleDragleave() {
      this.clearDragFeedback();
    },

    handleDrop(data, event) {

      // remove feedback
      this.clearDragFeedback();

      // reject if it's the wrong pick_number
      if (!data || (data.pick_number != this.pick_number)) {
        if (event.stopPropagation)
          event.stopPropagation();
        return;
      }

      // reject if it's an invalid transfer
      if (this.isInvalidTransfer(data.drag_source)) {
        if (event.stopPropagation)
          event.stopPropagation();
        return;
      }

      // check for insert location
      let insertLoc = this.cardInsertLocation(data, event);

      // prepare an object for intra-deck moves (will include pile_number 
      // and insertLoc for non-lands in sealed compact mode, otherwise won't)
      let isLand = filters.land(data.card);
      let isFromPack = data.drag_source === "DRAG_SOURCE_PACK";
      let isDraftPile = this.drag_source === "DRAG_SOURCE_PILE";
      let hasInsertData = !this.arrange_by_cost && 
                          (isFromPack || isDraftPile || (this.is_sealed_compact && !isLand));
      let moveParams = { 
        card: data.card,
        pile_number: hasInsertData ? this.number : null,
        insertBefore: hasInsertData ? insertLoc.insertBefore : null
      }; 

      // event: pack to pick
      if (data.drag_source === "DRAG_SOURCE_PACK") {
        this.packToPick(moveParams);
      }

      // event: move pick to another pile
      else if (data.drag_source === "DRAG_SOURCE_PILE") {
        this.pickToPile(moveParams);
      }

      // event: deck to sideboard/unused
      else if (data.drag_source === "DRAG_SOURCE_DECK") {
        if (this.drag_source === "DRAG_SOURCE_SIDEBOARD") {
          this.deckToSideboard(moveParams);
        } else if (this.drag_source === "DRAG_SOURCE_UNUSED") {
          this.deckToUnused(moveParams);
        } else if (this.drag_source === "DRAG_SOURCE_DECK") {
          this.deckToDeck(moveParams);
        }
      } 

      // events: sideboard
      else if (data.drag_source === "DRAG_SOURCE_SIDEBOARD") {
        if (this.drag_source === "DRAG_SOURCE_DECK") {
          this.sideboardToDeck(moveParams);
        } else if (this.drag_source === "DRAG_SOURCE_UNUSED") {
          this.sideboardToUnused(moveParams);
        }
      }

      // events: unused
      else if (data.drag_source === "DRAG_SOURCE_UNUSED") {
        if (this.drag_source === "DRAG_SOURCE_DECK") {
          this.unusedToDeck(moveParams);
        } else if (this.drag_source === "DRAG_SOURCE_SIDEBOARD") {
          this.unusedToSideboard(moveParams);
        }
      }

      // execute onAfterDrop if we have it
      if (data.onAfterDrop)
        data.onAfterDrop();

       // stop propagation
      if (event.stopPropagation)
        event.stopPropagation();
    },

    isInvalidTransfer: function(drag_source) {
      let noIntraDragSources = ["DRAG_SOURCE_SIDEBOARD", "DRAG_SOURCE_UNUSED"];
      if (!this.is_sealed_compact)
        noIntraDragSources.push("DRAG_SOURCE_DECK");
      return noIntraDragSources.indexOf(drag_source) !== -1 &&
             drag_source === this.drag_source
    },

    provideDragFeedback: function(location) {
      this.styles.dragInsert.display = "block";
      this.styles.dragInsert.marginTop = location + "px";
    },

    clearDragFeedback: function() {
      this.styles.dragInsert.display = "none";
    },

    // compute insert location for a card
    cardInsertLocation: function(data, event) { 
      const pileBoundingRect = this.$el.getBoundingClientRect();
      const cursorOffset = data.cursorOffset;
      const dragCardTop = event.clientY - cursorOffset.y - pileBoundingRect.top;

      let insertLocation = {
        insertBefore: null,
        feedbackAt: null
      };
      const cards = this.$el.getElementsByClassName("mtgcard");
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

  },

};

</script>

<template>
  <Drop 
    class="pile" 
    @drop="handleDrop(...arguments)" 
    @dragover="handleDragover(...arguments)"
    @dragenter="handleDragenter(...arguments)"
    @dragleave="handleDragleave(...arguments)"
  >
    <div 
      v-if="caption" 
      :style="{textAlign: caption_center ? 'center' : 'left'}" 
      class="pile-caption"
    >
      {{ caption }}<span v-if="caption_count">
        ({{ pile.length }})
      </span>
    </div>
    <MtgCard 
      v-for="(card, index) in pile" 
      :key="card.key"
      :card="card" 
      :drag_source="drag_source"
      :style="{marginTop: ((index+(caption ? 1 : 0))*16) + '%'}"
      :click_move="is_sealed_compact"
    />
    <div 
      :style="{marginTop: ((pile.length-1+(caption ? 1 : 0))*16) 
        + (pile.length >= 1 ? 140 : 6) + controls_offset + '%'}" 
      class="pile-controls"
    >
      <slot name="controls" />
    </div>
    <div 
      :style="styles.dragInsert" 
      class="pile-drag-insert"
    />
  </Drop>
</template>

<style>
.pile {
  display: inline-block;
  position: relative;
  min-height: 40vh;
  margin-right: 4px;
}
.pile {
  width: 11.0%;
}


.pile-separator {
  width: 2.0%;
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