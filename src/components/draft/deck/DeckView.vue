<script>

import ViewIcon from "vue-material-design-icons/ViewList.vue"

import * as messagebox from '@/components/core/messagebox.js'

export default {

  name: 'DeckView',

  props: {
    deck_list: {
      type: String,
      required: true
    }
  },

  components: {
    ViewIcon
  },

  methods: {
    onViewDeck(event) {
      messagebox.alert("Decklist", "<textarea class='deck-list'>" + this.deck_list + "</textarea>", null, "Close");
      event.target.blur();
    }
  },
}

</script>

<template>

  <button class="btn btn-sm btn-secondary text-light deck-view"
          @click="onViewDeck" >
    <ViewIcon/> View <span class="btn-extra-text">Decklist</span>
  </button>

</template>


<style>

.deck-list {
  width: 100%;
  height: calc(100vh - 200px);
}


</style>