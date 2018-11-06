

<template>
<div class="container">

<div id="navigator-accordion" class="mtgdraft-navigator">
  <NavigatorResume parent="#navigator-accordion" :show="true" />
  <NavigatorStart :player="player" parent="#navigator-accordion" />
  <NavigatorPrevious parent="#navigator-accordion" />   
</div>

</div>

</template>

<script>

import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorPrevious from './NavigatorPrevious.vue'

export default {
  name: 'Navigator',
  props: {
    player: {
      type: Number,
      required: true
    }
  },

  components: {
    NavigatorResume, NavigatorStart, NavigatorPrevious
  },
}

</script>


<style>


.mtgdraft-navigator .btn {
  padding-left: 25px;
  padding-right: 25px;
  border: 0;
}

.mtgdraft-navigator .form-check {
  margin-top: 10px;
}

</style>
