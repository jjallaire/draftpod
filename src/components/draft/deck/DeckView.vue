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
      messagebox.alert("Decklist", "<textarea readonly class='deck-list'>" + this.deck_list + "</textarea>", null, "Close");
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
  height: 100px;
}

@media only screen and (min-height: 320px) {
.deck-list {
  height: 250px;
} 
}

@media only screen and (min-height: 600px) {
.deck-list {
  height: calc(100vh - 270px);
} 
}

@media only screen and (min-height: 700px) {
.deck-list {
  height: calc(100vh - 200px);
} 
}

</style>