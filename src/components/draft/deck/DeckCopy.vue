<script>

import Vue       from 'vue'
import Clipboard from 'v-clipboard'
Vue.use(Clipboard)

import ClipboardIcon from "vue-material-design-icons/ClipboardOutline.vue"

import jquery from 'jquery'

export default {

  name: 'DeckCopy',

  props: {
    deck_list: {
      type: String,
      required: true
    }
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

<template>

  <button id="copy-deck-to-clipboard"
      class="btn btn-sm btn-secondary text-light deck-copy" 
      v-clipboard="deck_list"
      v-clipboard:success="onClipboardSuccess"
      data-toggle="tooltip"  data-placement="top">
    <ClipboardIcon/> Copy <span class="btn-extra-text">Decklist</span>
  </button>

</template>


<style>

</style>