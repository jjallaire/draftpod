

<template>

<div>

<Navbar /> 

<div class="container">

<div class="mtgdraft-navigator">
  <NavigatorResume v-if="draft_in_progress" :draft="draft_in_progress" />
  <NavigatorStart />
  <NavigatorRecent :draft_history="draft_history" />   
</div>

</div>

</div>

</template>

<script>

import Navbar from '@/components/Navbar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorRecent from './NavigatorRecent.vue'

import { mapGetters, mapMutations } from 'vuex'

import { REMOVE_DRAFTS } from '@/store/mutations'

export default {
  name: 'Navigator',

  computed: {
    ...mapGetters([
      'draft_history',
      'draft_in_progress'
    ]),
  },

  created() {
    // keep only the most recent 5 drafts
    let purge_draft_ids = this.draft_history
      .slice(4)
      .map((draft) => draft.id);

    // perform purge
    this.removeDrafts(purge_draft_ids);
  },

  methods: {
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
    })
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
