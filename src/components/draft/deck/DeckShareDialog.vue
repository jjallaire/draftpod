

<script>

import jquery from 'jquery'

import * as draftlog from '@/store/modules/draft/draftlog'
import * as selectors from '@/store/modules/draft/selectors'

import axios from 'axios'

import { logException } from '@/core/log'

import { mapState, mapMutations } from 'vuex'

import { UPDATE_PREFERENCES } from '@/store/mutations'


export default {
  name: 'DeckShareDialog',

  components: {
   
  },

  data: function() {
    return {
      set: {},
      deck: {},
    }
  },

  inject: [
    'generateDraftLog'
  ],

  computed: {

    ...mapState([
      'preferences'
    ]),

    protools_apikey: {
      get: function() {
        return this.preferences.protools_apikey || '';
      },
      set: function(value) {
        this.updatePreferences({
          protools_apikey: value
        })
      }
    },

    protools_allowsharing: {
      get: function() {
        return this.preferences.protools_allowsharing || false;
      },
      set: function(value) {
        this.updatePreferences({
          protools_allowsharing: value
        })
      }
    }
  },

  mounted() {
    // ensure we are a child of the body
    window.document.body.appendChild(this.$el);

    // clear fields on hide
    jquery(this.$el).on('hidden.bs.modal', () => {
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

    ...mapMutations({
      updatePreferences: UPDATE_PREFERENCES
    }),

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
      let deckList = selectors.deckList(this.set.code, 'normal', false, this.deck);
    
      // generate mtgo log then download
      draftlog.asMtgoLog(log).then(mtgoLog => {

        // create form data
        let draftForm = new FormData();
        draftForm.append("draft", mtgoLog);
        draftForm.append("deck", deckList);
        draftForm.append("apiKey", this.protools_apikey || "fXHmRumUkwF0Hq0wVDvsWX");
        if (this.protools_allowsharing)
          draftForm.append("allowsharing", "true");
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
          <div class="form-group">
            Publish your draft log and deck list to the
            <a href="https://magicprotools.com" target="_blank">Magic Pro Tools</a> draft viewer.
          </div>

          <div class="form-group">
            Optionally, provide your Magic Pro Tools API Key to associate this draft with your
            account. You can find your API key at 
            <a href="https://magicprotools.com/account" target="_blank">https://magicprotools.com/account</a>. 
          </div>

          <div class="form-group">
            <label for="exampleInputEmail1">
              Magic Pro Tools API Key:
            </label>
            <input id="deckSharingApiKey" v-model="protools_apikey" type="email" class="form-control" aria-describedby="deckSharingApiKeyHelp" placeholder="(optional, not required)">
          </div>

          <div class="form-check">
            <input id="allowDeckSharing" v-model="protools_allowsharing" class="form-check-input" type="checkbox" aria-describedby="allowDeckSharingHelp">
            <label class="form-check-label" for="allowDeckSharing">
              Allow anonymized sharing
            </label>
            <small id="allowDeckSharingHelp" class="form-text text-muted">
              Allow this draft to be anonymized and combined with other users' drafts for analysis, 
              including being shared with third parties.
            </small>
          </div>


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
  padding: 1.2rem;
}

#deckShareDialog .modal-body {
  padding-top: 1.2em;
  padding-bottom: 1.2em;
}

</style>

