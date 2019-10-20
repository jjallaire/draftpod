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

        // don't retain focus
        event.target.blur();

        // draft log
        let log = this.generateDraftLog();
        
        // deck list
        let deckList = selectors.deckList(this.set.code, 'normal', this.deck);
      
        // generate mtgo log then download
        draftlog.asMtgoLog(log).then(mtgoLog => {

          // create form data
          let draftForm = new FormData();
          draftForm.append("draft", mtgoLog);
          draftForm.append("deck", deckList);
          draftForm.append("apiKey", "fXHmRumUkwF0Hq0wVDvsWX");
          draftForm.append("platform", "draftpod");

          // application/x-www-form-urlencoded
          let data = '';
          const encode = str => encodeURIComponent(str).replace(/%20/g,'+'); 
          for (let field of draftForm.entries()) {
            data += (data ? '&' : '') + encode(field[0]) + '=' + encode(field[1]);
          }
         
          // post 
          progress.start();
          axios({
            method: 'POST',
            url: 'https://magicprotools.com/api/draft/add',
            data: data,
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
  </button>
</template>


<style>

</style>