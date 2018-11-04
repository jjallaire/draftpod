<template>

<button class="btn btn-sm btn-secondary"
        @click="onDownloadDeck" >
  <DownloadIcon/> Download Decklist
</button>

</template>

<script>

import { mapGetters } from 'vuex';

import DownloadIcon from "vue-material-design-icons/FileDownloadOutline.vue"

import saveAs from 'file-saver';

export default {

  name: 'DeckDownload',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapGetters([
      'deck_list'
    ]),
  },

  components: {
    DownloadIcon
  },

  methods: {
    onDownloadDeck(event) {
      let deck_list = this.deck_list(this.player);
      let blob = new Blob([deck_list], { type: "text/plain;charset=utf-8" });
      saveAs(blob, "decklist.txt");
      event.target.blur();
    }
  },
}

</script>

<style>

</style>