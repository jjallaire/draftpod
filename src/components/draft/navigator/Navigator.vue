

<template>

<div>

<Navbar /> 

<div class="mtgdrafter container">

<div class="mtgdrafter-navigator">
  <NavigatorResume v-if="draft_in_progress" :draft_id="draft_in_progress.id" />
  <NavigatorStart />
  <NavigatorRecent v-if="draft_history.length > 0" :draft_history="draft_history" />   
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
      .slice(5)
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

.mtgdrafter-navigator .navigator-panel {
  margin-bottom: 20px;
}

.mtgdrafter-navigator .btn {
  padding-left: 20px;
  padding-right: 20px;
  min-width: 160px;
  border: 0;
}

.mtgdrafter-navigator .form-check {
  margin-top: 10px;
}

</style>
