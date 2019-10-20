<script>

import ShareIcon from "vue-material-design-icons/ShareVariant.vue"

import * as draftlog from '@/store/modules/draft/draftlog'
import * as selectors from '@/store/modules/draft/selectors'

import axios from 'axios'

import { logException } from '@/core/log'
import progress from '@/core/progress'

export default {

  name: 'DeckShare',

  components: {
    ShareIcon
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

        // draft log
        let log = this.generateDraftLog();
        
        // deck list
        let deckList = selectors.deckList(this.set.code, 'normal', this.deck);
      
        // generate mtgo log then download
        draftlog.asMtgoLog(log).then(mtgoLog => {

          let draftForm = new FormData();
          draftForm.append("draft", mtgoLog);
          draftForm.append("deck", deckList);
          draftForm.append("apiKey", "fXHmRumUkwF0Hq0wVDvsWX");
          draftForm.append("platform", "draftpod");
         
          progress.start();
          axios({
            method: 'POST',
            url: 'https://magicprotools.com/api/draft/add',
            data: urlencodeFormData(draftForm),
            config: {
              headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            }
          })
          .then(response => {
            let draftURL = response.data.url;
            window.open(draftURL, "_blank");
          })
          .catch(error => {
            logException(error, "onShareDeck");
          })
          .finally(() => {
            progress.stop();
          })
        });

        event.target.blur();
    }
  }
}

function urlencodeFormData(fd){
    var s = '';
    function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
    for(var pair of fd.entries()){
        if(typeof pair[1]=='string'){
            s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
        }
    }
    return s;
}

</script>

<template>
  <button 
    class="btn btn-sm btn-secondary text-light deck-share"
    @click="onShareDeck"
  >
    <ShareIcon /> Share
  </button>
</template>


<style>

</style>