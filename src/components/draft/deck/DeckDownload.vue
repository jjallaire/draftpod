<script>

import DownloadIcon from "vue-material-design-icons/ArrowDownBoldBox.vue"

import JSZip from 'jszip'
import saveAs from 'file-saver';
import * as draftlog from '@/store/modules/draft/draftlog'

import * as selectors from '@/store/modules/draft/selectors'

export default {

  name: 'DeckDownload',

  components: {
    DownloadIcon
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
    onDownloadDeck(event) {

      // draft file/folder name
      let log = this.generateDraftLog();
      let dateString = new Date(log.time).toISOString();
      let draftName =  this.set.name + " (" + dateString + ")";

      let README = `This archive contains a record of your draft:

  - Draftlog.txt: Log of every pick made in the draft
  - Decklist.txt: Cards in main deck and sideboard (standard format)
  - Decklist-Arena.txt: Cards in main deck and sideboard (MTG Arena format)
         
If you want to share your draft with others, these sites 
enable you to publish your draft log and deck list:
      
  - https://magic.flooey.org/draft/upload
  - http://draftsignals.com/
`;

      // generate deck lists
      let deckList = selectors.deckList(this.set.code, 'normal', false, this.deck);
      let arenaDeckList = selectors.deckList(this.set.code, 'arena', false, this.deck);

      // generate mtgo log then download
      draftlog.asMtgoLog(log).then(mtgoLog => {
        let zip = new JSZip();
        zip.file("Draftlog.txt", mtgoLog);
        zip.file("Decklist.txt", deckList);
        zip.file("Decklist-Arena.txt", arenaDeckList);
        zip.file("README.txt", README);
        return zip.generateAsync({type:"blob"});
      }).then(blob => {
        saveAs(blob, draftName + ".zip");
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