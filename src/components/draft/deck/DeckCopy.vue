<template>

<button id="copy-deck-to-clipboard"
    class="btn btn-sm btn-secondary" 
    v-clipboard="deck_list(this.player)"
    v-clipboard:success="onClipboardSuccess"
    data-toggle="tooltip"  data-placement="top">
  <ClipboardIcon/> Copy Deck to Clipboard
</button>

</template>

<script>

import Vue       from 'vue'
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

import ClipboardIcon from "vue-material-design-icons/ClipboardOutline.vue"

import { mapGetters } from 'vuex';

import jquery from 'jquery'

export default {

  name: 'DeckCopy',

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
    ClipboardIcon
  },

  mounted() {
    jquery('#copy-deck-to-clipboard').tooltip({
      title: 'Decklist copied!',
      trigger: 'manual'
    });
  }, 

  methods: {
    onClipboardSuccess() {
      let copy_deck = jquery('#copy-deck-to-clipboard');
      copy_deck.tooltip('show');
      setTimeout(() => copy_deck.tooltip('hide'), 1500);
    }
  },
}

</script>

<style>

</style>