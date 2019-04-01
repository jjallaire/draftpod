<script>

import ViewIcon from "vue-material-design-icons/ViewList.vue"

import DeckViewDialog from './DeckViewDialog.vue'


export default {

  name: 'DeckView',

  components: {
    ViewIcon, DeckViewDialog
  },

  props: {
    set_code: {
      type: String,
      required: true
    },

    deck: {
      type: Object,
      required: true
    },

    format: {
      type: String,
      required: true
    }
  },

  methods: {
    onViewDeck(event) {
      this.$refs.deckViewDialog.show(this.set_code, this.deck, this.format);
      event.target.blur();
    }
  },
}

</script>

<template>
  <button 
    class="btn btn-sm btn-secondary text-light deck-view"
    @click="onViewDeck"
  >
    <ViewIcon /> View <span class="btn-extra-text">
      Decklist
    </span>

    <DeckViewDialog ref="deckViewDialog" />

  </button>
</template>


<style>


.deck-list {
  width: 100%;
  height: 100px;
}

@media only screen and (min-height: 320px) {
.deck-list {
  height: 250px;
} 
}

@media only screen and (min-height: 600px) {
.deck-list {
  height: calc(100vh - 270px);
} 
}

@media only screen and (min-height: 700px) {
.deck-list {
  height: calc(100vh - 200px);
} 
}

</style>