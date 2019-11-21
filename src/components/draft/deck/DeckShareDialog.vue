

<script>

import jquery from 'jquery'

import * as draftlog from '@/store/modules/draft/draftlog'
import * as selectors from '@/store/modules/draft/selectors'

import axios from 'axios'

import { logException } from '@/core/log'


export default {
  name: 'DeckShareDialog',

  components: {
   
  },

  data: function() {
    return {
      set: {},
      deck: {},
      allowsharing: false,
    }
  },

  inject: [
    'generateDraftLog'
  ],

  computed: {

  },

  mounted() {
    // ensure we are a child of the body
    window.document.body.appendChild(this.$el);

    // clear fields on hide
    jquery(this.$el).on('hidden.bs.modal', () => {
      this.allowsharing = false;
      this.set = {};
      this.deck = {};
    });

  },

  beforeDestroy() {
    if (this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  },


  methods: {

    show(set, deck) {
      this.set = set;
      this.deck = deck;
      this.allowsharing = false;
      let dialog = jquery(this.$refs.dialog);
      dialog.modal();
    },

    onShareDeck(event) {
      
      event.stopPropagation();
      event.preventDefault();

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
          if (response.data.error) {
            logException(new Error(response.data.error), "onShareDeckPOST")
          } else {
            let draftURL = response.data.url;
            window.open(draftURL, "_blank");
          }
        })
        .catch(error => {
          logException(error, "onShareDeck");
        })
      });


      let dialog = jquery(this.$refs.dialog);
      dialog.modal('hide');

     
    },

  },
}

</script>


<template>

  <div id="deckShareDialog" ref="dialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="deckShareDialogDialogTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="deckShareDialogDialogTitle" class="modal-title">Share Deck</h5> 
        </div>
        <div class="modal-body">
          Publish your draft log and deck list to the
          <a href="https://magicprotools.com">Magic Pro Tools</a> draft viewer.


          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-primary" @click="onShareDeck">Publish to Magic Pro Tools</button>
        </div>
       
      </div>
    </div>
  </div>

</template>

<style>

#deckShareDialog .modal-dialog {
  max-width: 600px;
}

#deckShareDialog .modal-header,
#deckShareDialog .modal-body,
#deckShareDialog .modal-footer {
  padding: 0.8rem;
}



#deckShareDialog .modal-body {
  padding-top: 0;
  padding-bottom: 0;
}

</style>

