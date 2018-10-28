
<template>



<div class="mtgdraft-infobar">
  <div class="mtgdraft-cardview">
    <img :src="preview_image" />
  </div>
  
  <Panel caption="Deck Stats" panel_class="mtgdraft-deckstats"> 
    <ManaCurve :cards="deck_cards" />
    <div class="mana-curve-legend">
      <span class="mana-key creatures-key">&nbsp;</span> Creatures ({{ creature_count }})
      <span class="mana-key other-key">&nbsp;</span> Other ({{ other_count }})
    </div>
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
      let count = 0;
      for (let i=0; i<this.deck_cards.length;i++) {
        let card = this.deck_cards[i];
        if (card.type_line.includes("Creature"))
          count++;
      }
      return count;
    },
    other_count: function() {
      return 0;
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


