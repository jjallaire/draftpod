<script>

import DownloadIcon from "vue-material-design-icons/FileDownloadOutline.vue"

import saveAs from 'file-saver';

export default {

  name: 'DeckDownload',

  props: {
    deck_list: {
      type: String,
      required: true
    }
  },

  components: {
    DownloadIcon
  },

  methods: {
    onDownloadDeck(event) {
      let blob = new Blob([this.deck_list], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "decklist.txt");
      event.target.blur();
    }
  },
}

</script>

<template>

  <button class="btn btn-sm btn-secondary text-light"
          @click="onDownloadDeck" >
    <DownloadIcon/> Download <span class="btn-extra-text">Decklist</span>
  </button>

</template>


<style>

</style>