<script>

import DownloadIcon from "vue-material-design-icons/ArrowDownBoldBox.vue"

import JSZip from 'jszip'
import saveAs from 'file-saver';
import * as draftlog from '@/store/modules/draft/draftlog'

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

  inject: [
    'generateDraftLog'
  ],

  methods: {
    onDownloadDeck(event) {

      // draft file/folder name
      let log = this.generateDraftLog();
      let dateString = new Date(log.time).toISOString();
      let draftName =  this.set_name + " (" + dateString + ")";

      // generate mtgo log then download
      draftlog.asMtgoLog(log).then(mtgoLog => {
        let zip = new JSZip();
        zip.file("Decklist.txt", this.deck_list);
        zip.file("Draftlog.txt", mtgoLog);
        return zip.generateAsync({type:"blob"});
      }).then(blob => {
        saveAs(blob, "Draftpod - " + draftName + ".zip");
      });

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
    <DownloadIcon /> Download
  </button>
</template>


<style>

</style>