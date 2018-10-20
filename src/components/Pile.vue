
<template>

<Drop class="mtgpile" 
      @drop="handleDrop(...arguments)" 
      @dragover="handleDragover(...arguments)"
      @dragleave="handleDragleave(...arguments)">
  <div class="caption" v-if="caption" 
       :style="{textAlign: center_caption ? 'center' : 'left'}">
    {{ caption }}
  </div>
  <Card v-for="(card, index) in piles(player)[number]" :key="card.key"
        :player="player" :card="card" :drag_source="drag_source"
        v-bind:style="{marginTop: ((index+(caption ? 1 : 0))*16) + '%'}">
  </Card>
  <div class="drag-insert" v-bind:style="styles.dragInsert"></div>
</Drop>

</template>


<script>

import { mapActions } from 'vuex'
import { mapGetters } from 'vuex'
import { Drop } from 'vue-drag-drop'

import { DRAG_SOURCE_PACK, DRAG_SOURCE_PILE } from './constants'
import { PICK_CARD, MOVE_CARD } from '../store/actions'

import Card from './Card.vue'

export default {
  props: {
    player: {
      type: Number,
      required: true
    },
    number: {
      type: Number,
      required: true
    },
    caption: {
      type: String
    },
    center_caption: {
      type: Boolean,
      default: false
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
        playerNumber: this.player,
        card: data.card, 
        pileNumber: this.number, 
        insertBefore: insertLoc.insertBefore
      };

      // fire event
      if (data.drag_source === DRAG_SOURCE_PACK)
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
.mtgpile, .mtgpileseparator {
  display: inline-block;
  position: relative;
  min-height: 300px;
  margin-right: 4px;
}
.mtgpile {
  width: 11.5%;
}
.mtgpile-separator {
  width: 3%;
}
.mtgpile .caption {
  position: absolute;
  left: 0;
  top: 0;
  font-size: 0.8em;
  font-weight: 500;
  text-transform: uppercase;
  text-align: center;
  width: 100%;
  color: #808080;
  margin-top: -2px;
}
@media only screen and (max-width: 1000px) {
.mtgpile {
  width: 10%;
} 
.mtgpile .caption {
  font-size: 0.6em;
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
.mtgpile .drag-insert {
  border-top: 2px groove #f2f2f2;
  position: absolute;
  width: 100%;
  margin-left: 2px;
  margin-right: 2px;
}
</style>