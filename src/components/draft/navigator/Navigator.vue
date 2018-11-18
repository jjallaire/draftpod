<script>

import Navbar from '@/components/core/Navbar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorRecent from './NavigatorRecent.vue'

import { Events, EventBus } from '@/components/draft/eventbus'

import { mapGetters, mapMutations } from 'vuex'

import { REMOVE_DRAFTS } from '@/store/mutations'

import * as messagebox from '@/components/core/messagebox.js'

export default {
  name: 'Navigator',

  data: function() {
    return {
      draft_removed: false
    }
  },

  computed: {
    ...mapGetters([
      'draft_history',
      'draft_in_progress'
    ]),
  },

  created() {
    // keep only the most recent 5 drafts
    let purge_draft_ids = this.draft_history
      .slice(7)
      .map((draft) => draft.id);

    // perform purge
    this.removeDrafts(purge_draft_ids);

    // subscribe to draft remove
    EventBus.$on(Events.DraftRemove, this.onDraftRemove);
  },

  beforeDestroy() {
    EventBus.$off(Events.DraftRemove, this.onDraftRemove);
  },

  methods: {
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
    }),
    onDraftRemove(draft_id) {
      messagebox.confirm(
        "<p>Remove draft from history?</p> ",
        () => {
          this.removeDrafts([draft_id]);
          this.draft_removed = true;
        })
    }
  },

  components: {
    Navbar, NavigatorResume, NavigatorStart, NavigatorRecent
  },
}

</script>

<template>

  <div>

  <Navbar /> 

  <div class="mtgdrafter container">

  <div class="mtgdrafter-navigator">
    <NavigatorResume v-if="draft_in_progress && !draft_removed" 
      :draft_id="draft_in_progress.id" 
    />
    <NavigatorStart />
    <NavigatorRecent 
      :draft_history="draft_history" 
    />   
  </div>

  </div>

  </div>

</template>

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
