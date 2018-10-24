

<template>
  <Panel caption="Deck" panel_class="mtgdraft-deck">

  </Panel>
</template>

<script>

import Panel from './Panel.vue'
import Pile from './Pile.vue'

export default {
  name: 'Deck',

  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    Panel, Pile
  }
}

</script>

<style>


</style>



