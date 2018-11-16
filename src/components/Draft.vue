
<template>

  <Table v-if="draft_id" :draft_id="draft_id" />
  <Navigator v-else />

</template>

<script>

import Table from './draft/table/Table.vue'
import Navigator from './draft/navigator/Navigator.vue'

export default {
  name: 'Draft',

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
        if (draft_id in this.$store.state.drafts)
          this.draft_id = draft_id;
        else
          this.draft_id = null;
      } else {
        this.draft_id = null;
      }
    }
  },

  components: {
    Table, Navigator
  }
}

</script>

<style>

</style>



