<script>

import ShareIcon from "vue-material-design-icons/ShareVariant.vue"

import DeckShareDialog from './DeckShareDialog'

export default {

  name: 'DeckShare',

  components: {
    ShareIcon, DeckShareDialog
  },

  props: {
    set: {
      type: Object,
      required: true
    },
    deck: {
      type: Object,
      required: true
    }
  },

  inject: [
    'generateDraftLog'
  ],

  methods: {
    onShareDeck(event) {
      this.$refs.deckShareDialog.show(this.set, this.deck);
      event.target.blur();
    }
  }
}

</script>

<template>
  <button 
    class="btn btn-sm btn-secondary text-light deck-share"
    @click="onShareDeck"
  >
    <ShareIcon /> Share

    <DeckShareDialog ref="deckShareDialog" />
  </button>


</template>

<style>

</style>