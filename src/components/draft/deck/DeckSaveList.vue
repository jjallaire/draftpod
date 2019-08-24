<script>

import PlusIcon from "vue-material-design-icons/Plus.vue"

import * as selectors from '@/store/modules/draft/selectors'

export default {

  name: 'DeckSaveList',

  components: {
    PlusIcon
  },

  props: {
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
    'saveDeck',
    'addDeck',
    'activateDeck'
  ],

  methods: {
    onSaveClicked() {
      this.saveDeck({ name: 'Build 1' })
        .then(() => {
          this.onNewBuildClicked();
        })
    },

    onNewBuildClicked() {
      let name = 'Build ' + (this.deck_names.length + 1);
      this.addDeck({ name })
        .then(() => {
          this.activateDeck({ name })
        })
    },
  }

}

</script>




<template>
  <span class="deck-save-list">
    <template v-if="!saved_decks.active">
      <select class="card-header-select">
        <option>Build 1</option>
      </select>
      <button class="btn btn-sm btn-secondary btn-savelist text-light" @click="onSaveClicked">
        <PlusIcon title="Add build" />
      </button>
    </template>
    <template v-else>
      <select v-model="active_deck" class="card-header-select">
        <option v-for="name in deck_names" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="btn btn-sm btn-secondary btn-savelist text-light" @click="onNewBuildClicked">
        <PlusIcon title="Add Build" />
      </button>
    </template>
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
  min-width: 75px;
}


.deck .card-header .btn-savelist {
  padding: 0.1rem;
  padding-bottom: 0;
  height: 22px;
  width: 24px;
}

.deck .card-header .btn-sm.btn-savelist svg {
  width: 20px !important;
  height: 20px !important;
  margin-top: -6px;
  margin-left: -6px;
}

</style>