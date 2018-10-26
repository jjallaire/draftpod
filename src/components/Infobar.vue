
<template>



<div class="mtgdraft-infobar">
  <div class="mtgdraft-cardview">
    <img :src="preview_image" />
  </div>
  
  <Panel caption="Stats" panel_class="mtgdraft-deckstats"> 
      Deck: {{ deck_cards.length }}
  </Panel>
  
</div>


</template>
  

<script>

import { mapGetters } from 'vuex';

import Panel from './Panel.vue'

export default {
  name: 'Infobar',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    Panel
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
    }
  },
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

</style>


