

<script>

import FullScreenIcon from "vue-material-design-icons/Fullscreen.vue"
import FullScreenExitIcon from "vue-material-design-icons/FullscreenExit.vue"

export default {

  name: 'FullscreenButton',

  components: {
    FullScreenIcon, FullScreenExitIcon
  },

  props: {
    fullscreen: {
      type: Boolean,
      required: true
    }
  }

}

</script>

<template>

  <li class="nav-item">
    <a class="nav-link icon-link">
      <FullScreenExitIcon 
        v-if="fullscreen" 
        title="Exit fullscreen mode" 
        @click.native="$emit('clicked')"
      />
      <FullScreenIcon 
        v-else 
        title="Fullscreen mode" 
        @click.native="$emit('clicked')"
      />
    </a>
  </li>

</template>