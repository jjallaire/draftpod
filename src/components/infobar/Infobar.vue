
<template>



<div class="mtgdraft-infobar">
  <div class="mtgdraft-cardview">
    <img :src="preview_image" />
  </div>
  
  <Panel caption="Deck Stats" panel_class="mtgdraft-deckstats"> 
    <div class="mana-curve-legend">
      <span class="mana-key creatures-key">&nbsp;</span> Creatures ({{ creature_count }})
      <span class="mana-key other-key">&nbsp;</span> Other ({{ other_count }})
    </div>
    <ManaCurve :cards="deck_cards" />
  </Panel>
  
</div>


</template>
  

<script>

import { mapGetters } from 'vuex';

import Panel from '../core/Panel.vue'
import ManaCurve from './ManaCurve.vue'

export default {
  name: 'Infobar',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    Panel, ManaCurve
  },

  computed: {
    ...mapGetters([
      'card_preview',
      'pick_piles',
      'deck_piles',
      'picks_complete'
    ]),
    preview_image: function() {
      let card = this.card_preview(this.player);
      if (card)
        return card.image;
      else
        return "images/card-back.png";
    },
    deck_cards: function() {
      let piles = this.picks_complete 
        ? this.deck_piles(this.player) 
        : this.pick_piles(this.player);
      return piles.slice(0, 7).flat();
    },
    sideboard_cards: function() {
      return this.picks_complete 
        ? this.deck_piles(this.player)[7] 
        : this.pick_piles(this.player)[7];
    },
    creature_count: function() {
      return this.deck_cards.filter((card) => card.type_line.includes("Creature")).length;
    },
    other_count: function() {
      return this.deck_cards.filter((card) => !card.type_line.includes("Creature") &&
                                              !card.type_line.includes("Land")).length;
    }
  }
}
</script>


<style>

.mtgdraft-infobar {
  display: flex;
  flex-direction: column;
  padding: 8px;
  padding-left: 0;
  background-color: transparent;
}

@media only screen and (min-width: 900px) {
  .mtgdraft-infobar {
    width: 190px;
  }
}

@media only screen and (min-width: 1100px) {
  .mtgdraft-infobar {
    width: 210px;
  }
}

@media only screen and (min-width: 1300px) {
  .mtgdraft-infobar {
    width: 230px;
  }
}


.mtgdraft-cardview {
  width: 100%;  
  margin-bottom: 8px;
}

.mtgdraft-cardview img {
  width: 100%;
  height: auto;
}

.mtgdraft-deckstats {
  flex: 1 1 auto;
}

.mtgdraft-deckstats .card-body {
  position: relative;
  overflow-y: scroll;
}

.mtgdraft-deckstats .mana-curve-legend {
  font-size: 0.8em;
  font-weight: 400;
  color: #808080;
  margin-top: 6px;
}

@media only screen and (max-width: 1000px) {
  .mtgdraft-deckstats .mana-curve-legend {
    font-size: 0.7em;
  }
}

.mtgdraft-deckstats .mana-key {
  padding-right: 12px;
}

.mtgdraft-deckstats .creatures-key {
  margin-left: 10px;
  background-color: #ee5f5b;
}

.mtgdraft-deckstats .other-key {
  margin-left: 5px;
  background-color: #5bc0de;
}



</style>


