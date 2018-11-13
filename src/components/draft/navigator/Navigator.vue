

<template>

<div>

<Navbar /> 

<div class="container">

<div class="mtgdraft-navigator">
  <NavigatorResume v-if="draft_in_progress" :draft="draft_in_progress" />
  <NavigatorStart />
  <NavigatorRecent :recent_drafts="recent_drafts" />   
</div>

</div>

</div>

</template>

<script>

import Navbar from '@/components/Navbar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorRecent from './NavigatorRecent.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'Navigator',

  computed: {
    ...mapGetters([
      'recent_drafts',
      'draft_in_progress'
    ])
  },

  components: {
    Navbar, NavigatorResume, NavigatorStart, NavigatorRecent
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
