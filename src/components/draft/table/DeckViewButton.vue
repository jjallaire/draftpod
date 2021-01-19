

<script>

import DockBottomIcon from "./icons/DockBottom.vue"
import DockRightIcon from "./icons/DockRight.vue"

export default {

  name: 'DeckViewButton',

  components: {
    DockBottomIcon, DockRightIcon
  },

  props: {
    deck_right: {
      type: Boolean,
      required: true
    }
  }

}

</script>

<template>

  <li class="nav-item">
    <a class="nav-link icon-link">
      <DockRightIcon 
        v-if="!deck_right" 
        title="Deck to the right" 
        @click.native="$emit('clicked')"
      />
      <DockBottomIcon 
        v-else 
        title="Deck below" 
        @click.native="$emit('clicked')"
      />
    </a>
  </li>

</template>