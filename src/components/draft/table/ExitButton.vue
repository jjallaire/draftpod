

<script>

import ExitToAppIcon from "vue-material-design-icons/ExitToApp.vue"

export default {

  name: 'ExitButton',

  components: {
    ExitToAppIcon
  },

}

</script>

<template>

  <li class="nav-item">
    <a class="nav-link icon-link">
      <ExitToAppIcon 
        title="Exit Draft" 
        @click.native="$emit('clicked')"
      />
    </a>
  </li>

</template>