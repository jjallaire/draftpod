

<template>

<div>

<Navbar /> 

<div class="container">

<div class="mtgdraft-navigator">
  <NavigatorResume  />
  <NavigatorStart :player_id="player_id"  />
  <NavigatorPrevious />   
</div>

</div>

</div>

</template>

<script>

import Navbar from '@/components/Navbar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorPrevious from './NavigatorPrevious.vue'

export default {
  name: 'Navigator',
  props: {
    player_id: {
      type: Number,
      default: 0
    }
  },

  components: {
    Navbar, NavigatorResume, NavigatorStart, NavigatorPrevious
  },
}

</script>


<style>

.mtgdraft-navigator .navigator-panel {
  margin-bottom: 20px;
}

.mtgdraft-navigator .btn {
  padding-left: 25px;
  padding-right: 25px;
  border: 0;
}

.mtgdraft-navigator .form-check {
  margin-top: 10px;
}

</style>
