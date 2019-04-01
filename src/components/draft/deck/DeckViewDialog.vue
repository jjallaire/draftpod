

<script>

import jquery from 'jquery'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'DeckViewDialog',

  data: function() {
    return {
      set_code: null,
      deck: null,
      format: null
    }
  },

  computed: {
    normal_deck_list: function() {
      if (this.deck) {
        return selectors.deckList(this.set_code, this.format, this.deck);
      } else {
        return null;
      }
    },

    arena_deck_list: function() {
      if (this.deck) {
        return selectors.arenaDeckList(this.set_code, this.deck);
      } else {
        return null;
      }
    }
  },

  mounted() {
    window.document.body.appendChild(this.$el);
    jquery(this.$el).on('hidden.bs.modal', e => {
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
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="decklistDialogTitle" class="modal-title">Decklist</h5>
        </div>
        <div class="modal-body">
          <textarea v-model="arena_deck_list" readonly class="decklist-content" />
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
  padding: 0.6rem;
}

#decklistDialog .modal-body {
  padding-top: 0;
  padding-bottom: 0;
}

.decklist-content {
  width: 100%;
  height: 100px;
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

