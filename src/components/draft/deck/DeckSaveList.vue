<script>


/*

[ (Untitled) ] [Save]

[ BW Fliers  ] [Add]

*/

import PlusIcon from "vue-material-design-icons/Plus.vue"
import SaveIcon from "vue-material-design-icons/ContentSave.vue"

import { prompt } from '@/components/core/messagebox.js'

import * as selectors from '@/store/modules/draft/selectors'

export default {

  name: 'DeckSaveList',

  components: {
    SaveIcon, PlusIcon
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

    active_deck() {
      return this.saved_decks.active;
    }
  },

  inject: [
    'saveDeck',
    'addDeck',
    'activateDeck'
  ],

  methods: {
    onSaveClicked() {
      prompt("Build Name", (name) => {
        if (name)
          this.saveDeck({ name: name })
      })
    },

    onNewDeckClicked() {
      prompt("Build Name", (name) => {
        if (name)
          this.addDeck({ name }).then(this.activateDeck({ name }))
      })
    },

    onDeckChanged(event) {
      this.activateDeck( { name: event.target.value });
    },
  }

}

</script>

<template>
  <span class="deck-save-list">
    <template v-if="!saved_decks.active">
      <select class="card-header-select">
        <option>(Untitled)</option>
      </select>
      <button class="btn btn-sm btn-secondary btn-savelist text-light" @click="onSaveClicked">
        <SaveIcon title="Save build" />
      </button>
    </template>
    <template v-else>
      <select class="card-header-select" :value="active_deck" @input="onDeckChanged">
        <option v-for="name in deck_names" :key="name" :value="name">{{ name }}</option>
      </select>
      <button class="btn btn-sm btn-secondary btn-savelist text-light" @click="onNewDeckClicked">
        <PlusIcon title="Create new build" />
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
  min-width: 85px;
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