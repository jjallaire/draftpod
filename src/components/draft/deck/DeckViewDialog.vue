

<script>

import ClipboardIcon from "vue-material-design-icons/ClipboardTextOutline.vue"

import jquery from 'jquery'

import * as selectors from '@/store/modules/draft/selectors'

import * as log from '@/core/log'
import * as utils from '@/components/core/utils'
import * as set from '@/store/modules/draft/set'

export default {
  name: 'DeckViewDialog',

  components: {
    ClipboardIcon
  },

  data: function() {
    return {
      set_code: null,
      deck: null,
      format: null,
      arena_convert: true,
      arena_60: null
    }
  },

  computed: {

    standard_deck_list: function() {
      if (this.deck) {
        return selectors.deckList(this.set_code, 'normal', this.deck);
      } else {
        return null;
      }
    },

    arena_deck_list: function() {
      if (this.deck && set.capabilities(this.set_code).arena_decklists) {
        if (this.arena_convert)
          return this.arena_60;
        else
          return selectors.deckList(this.set_code, 'arena', this.deck);
      } else {
        return null;
      }
    }
  },

  mounted() {
    // ensure we are a child of the body
    window.document.body.appendChild(this.$el);

    // clear fields on hide
    jquery(this.$el).on('hidden.bs.modal', () => {
      this.deck = null;
      this.set_code = null;
      this.format = null;
    });

    // setup copy tooltip
    jquery('#copy-deck-list-to-clipboard').tooltip({
      title: 'Decklist copied!',
      trigger: 'manual'
    });
  },


  methods: {

    show(set_code, deck, format) {
      this.set_code = set_code;
      this.format = format;
      this.deck = deck;
      this.arena_60 = selectors.arenaDeckList(this.set_code, this.deck);
      let dialog = jquery(this.$refs.dialog);
      dialog.modal();
    },

    onCopyDecklist(event) {
      
      event.stopPropagation();
      event.preventDefault();

      // select the join url
      this.selectDecklist(true);

      try {

        // perform the copy
        document.execCommand('copy');

        // remove selection
        this.selectDecklist(false);
    
        // show success message
        this.showCopyTooltip();

      } catch(error) {
        log.logException(error, "onCopyJoinURL");
      }
    },

    selectDecklist(select) {
      let activeDecklist = jquery("#decklistDialog .nav-tabs .active").attr('data-target');
      let decklist = jquery(activeDecklist + " > textarea")[0];
      utils.textareaCopySelection(decklist, select);
    },

    showCopyTooltip() {
      let copyDecklist = jquery('#copy-deck-list-to-clipboard');
      copyDecklist.tooltip('show');
      setTimeout(() => copyDecklist.tooltip('hide'), 1500);
    }
  },
}

</script>


<template>

  <div id="decklistDialog" ref="dialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="decklistDialogTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="decklistDialogTitle" class="modal-title">Decklist</h5> 
          <button id="copy-deck-list-to-clipboard" class="btn btn-sm btn-primary" @click="onCopyDecklist"><ClipboardIcon /> Copy to Clipboard</button>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs nav-fill">
            <li v-show="arena_deck_list" class="nav-item">
              <a id="standard-deck-list-tab" data-toggle="tab" role="tab" class="nav-link active" data-target="#standard-deck-list" aria-controls="standard-deck-list">Standard Format</a>
            </li>
            <li v-if="arena_deck_list" class="nav-item">
              <a id="arena-deck-list-tab" class="nav-link" data-toggle="tab" role="tab" data-target="#arena-deck-list" aria-controls="arena-deck-list">MTGA Format</a>
            </li>
          </ul>
          <div class="tab-content decklist-content">
            <div id="standard-deck-list" class="tab-pane show active" role="tabpanel" aria-labelledby="standard-deck-list-tab">
              <textarea id="standard-deck-list-cards" v-model="standard_deck_list" readonly />
            </div>
            <div v-if="arena_deck_list" id="arena-deck-list" class="tab-pane fade" role="tabpanel" aria-labelledby="arena-deck-list-tab">
              <div class="form-check">
                <input id="arena-convert-to-60" v-model="arena_convert" class="form-check-input" type="checkbox">
                <label class="form-check-label" for="arena-convert-to-60">
                  Convert to 60 card deck (required for Arena Direct Challenge)
                </label>
              </div>
              <textarea id="arena-deck-list-cards" v-model="arena_deck_list" readonly />
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
        </div>
       
      </div>
    </div>
  </div>

</template>

<style>

#decklistDialog .modal-header,
#decklistDialog .modal-body,
#decklistDialog .modal-footer {
  padding: 0.8rem;
}

#decklistDialog .modal-body {
  padding-top: 0;
  padding-bottom: 0;
}

#decklistDialog button {
  color: inherit; 
  min-width: 100px;
}

.decklist-content {
  width: 100%;
  height: 100px;
  position: relative;
}

.decklist-content .tab-pane,
.decklist-content textarea {
  width: 100%;
}

#arena-deck-list .form-check {
  height: 40px;
  padding-top: 8px;
}

#arena-deck-list-cards {
  position: absolute;
  top: 40px;
  bottom: 0;
}

#standard-deck-list-cards {
  position: absolute;
  top: 0;
  bottom: 0;
}

@media only screen and (min-height: 320px) {
.decklist-content {
  height: 250px;
} 
}

@media only screen and (min-height: 600px) {
.decklist-content  {
  height: calc(100vh - 350px);
} 
}

@media only screen and (min-height: 700px) {
.decklist-content {
  height: calc(100vh - 300px);
} 
}

</style>

