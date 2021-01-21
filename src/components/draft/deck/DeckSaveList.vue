<script>

import PlusIcon from "vue-material-design-icons/Plus.vue"

import _flatten from 'lodash/flatten'

import { DECK } from '@/store/modules/draft/constants'
import * as selectors from '@/store/modules/draft/selectors'

export default {

  name: 'DeckSaveList',

  components: {
    PlusIcon
  },

  props: {
    deck: {
      type: Object,
      required: true
    },
    saved_decks: {
      type: Object,
      required: true
    }
  },

  computed: {
    deck_names() {
      return selectors.savedDeckNames(this.saved_decks);
    },

     active_deck: {
      get: function() { return this.saved_decks.active },
      set: function(value) { this.activateDeck({ name: value }) }
    }

   
  },

  inject: [
    'addDeck',
    'activateDeck'
  ],

  methods: {
    onAddBuildClicked(event) {
      let name = 'Build ' + (this.deck_names.length + 1);
      this.addDeck({ name })
        .then(() => {
          this.activateDeck({ name })
        })
      event.target.blur();
    },

    deckDisplayName(name) {
      let deck = name === this.active_deck ? this.deck : this.saved_decks.decks[name];
      const cards = _flatten(deck.piles.slice(0, DECK.PILES));
      const colors = selectors.cardColors(cards);
      const orderedColors = selectors.orderColorPair(colors);
      const activeColors = orderedColors.reduce((active, color) => {
        if (color.count > 0) {
          active.push(color.code);
        }
        return active;
      }, []);
      if (activeColors.length > 0) {
        return name + ': ' + activeColors.join('');
      } else {
        return name;
      }      
    }
  }

}

</script>

<template>
  <span class="deck-save-list">
    <select v-model="active_deck" class="card-header-select">
      <option v-for="name in deck_names" :key="name" :value="name">{{ deckDisplayName(name) }}</option>
    </select>
    <button class="btn btn-sm btn-secondary btn-savelist text-light" @click="onAddBuildClicked">
      <PlusIcon title="Add Build" />
    </button> 
  </span>
</template>

<style>

.deck-save-list {
  margin-left: 10px;
}

.card-header-select {
  font-size: 0.9em;
  color: rgba(255,255,255,0.7);
  background-image: linear-gradient(#8a9196, #7A8288 60%, #70787d) !important;
  background-repeat: no-repeat;
  -webkit-appearance: menulist-button;
  height: 23px;
  min-width: 70px;
}


.deck .card-header .btn-sm.btn-savelist {
  padding: 0.1rem;
  padding-bottom: 0;
  height: 23px;
  width: 24px;
  margin-top: -2px;
}

.deck .card-header .btn-sm.btn-savelist svg {
  width: 20px !important;
  height: 20px !important;
  margin-top: 0;
  margin-left: 0;
}

</style>