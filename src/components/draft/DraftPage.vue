
<template>

<DraftTable v-if="draft_id" :draft_id="draft_id" />
<DraftNavigator v-else />

</template>

<script>

import DraftTable from './table/DraftTable.vue'
import DraftNavigator from './navigator/DraftNavigator.vue'

import { useDraftModule } from '@/store'

export default {
  name: 'DraftPage',

  data: function() {
    return {
      draft_id: null,
    }
  },

  created: function() {
    this.updateDraftId(this.$route.hash);
  },

  beforeRouteUpdate (to, from, next) {
    this.updateDraftId(to.hash);
    next();
  },

  methods: {
    updateDraftId(hash) {
      if (hash) {
        let draft_id = hash.substring(1);
        if (draft_id in this.$store.state.drafts) {
          this.draft_id = draft_id;
          useDraftModule(draft_id, { preserveState: true });
        } else {
          this.draft_id = null;
        }
      } else {
        this.draft_id = null;
      }
    }
  },

  components: {
    DraftNavigator, DraftTable 
  }
}

</script>

<style>

</style>



