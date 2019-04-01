

<script>

import jquery from 'jquery'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'DeckViewDialog',

  data: function() {
    return {
      set_code: null,
      deck: null,
      format: null,
      arena_convert: true
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
      if (this.deck) {
        if (this.arena_convert)
          return selectors.arenaDeckList(this.set_code, this.deck);
        else
          return selectors.deckList(this.set_code, 'arena', this.deck);
      } else {
        return null;
      }
    }
  },

  mounted() {
    window.document.body.appendChild(this.$el);
    jquery(this.$el).on('hidden.bs.modal', () => {
      this.deck = null;
      this.set_code = null;
      this.format = null;
    });
  },


  methods: {

    show(set_code, deck, format) {
      this.set_code = set_code;
      this.format = format;
      this.deck = deck;
      let dialog = jquery(this.$refs.dialog);
      dialog.modal();
    }

  }

}

</script>


<template>

  <div id="decklistDialog" ref="dialog" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="decklistDialogTitle" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="decklistDialogTitle" class="modal-title">Decklist</h5>
        </div>
        <div class="modal-body">
          <ul class="nav nav-tabs nav-fill">
            <li class="nav-item">
              <a id="standard-deck-list-tab" data-toggle="tab" role="tab" class="nav-link active" href="#standard-deck-list" aria-controls="standard-deck-list">Standard Format</a>
            </li>
            <li class="nav-item">
              <a id="arena-deck-list-tab" class="nav-link" data-toggle="tab" role="tab" href="#arena-deck-list" aria-controls="arena-deck-list">MTGA Format</a>
            </li>
          </ul>
          <div class="tab-content decklist-content">
            <div id="standard-deck-list" class="tab-pane show active" role="tabpanel" aria-labelledby="standard-deck-list-tab">
              <textarea id="standard-deck-list-cards" v-model="standard_deck_list" readonly />
            </div>
            <div id="arena-deck-list" class="tab-pane fade" role="tabpanel" aria-labelledby="arena-deck-list-tab">
              <div class="form-check">
                <input class="form-check-input" type="checkbox" v-model="arena_convert" id="arena-convert-to-60">
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

