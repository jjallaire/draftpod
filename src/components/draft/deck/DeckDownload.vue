<script>

import DownloadIcon from "vue-material-design-icons/ArrowDownBoldBox.vue"

import saveAs from 'file-saver';

export default {

  name: 'DeckDownload',

  components: {
    DownloadIcon
  },

  props: {
    set_name: {
      type: String,
      required: true
    },
    deck_list: {
      type: String,
      required: true
    }
  },

  methods: {
    onDownloadDeck(event) {
      let blob = new Blob([this.deck_list], { type: "text/plain;charset=utf-8" });
      let date = new Date();
      let dateString = date.toISOString();
      saveAs(blob, "Decklist - " + this.set_name + " (" + dateString + ").txt");
      event.target.blur();
    }
  },
}

</script>

<template>
  <button 
    class="btn btn-sm btn-secondary text-light deck-download"
    @click="onDownloadDeck"
  >
    <DownloadIcon /> Download <span class="btn-extra-text">
      Decklist
    </span>
  </button>
</template>


<style>

</style>