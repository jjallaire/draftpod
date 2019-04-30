<script>

import NavBar from '@/components/core/NavBar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorRecent from './NavigatorRecent.vue'
import SiteFooter from '@/components/core/SiteFooter.vue'

import { mapGetters, mapMutations } from 'vuex'

import { REMOVE_DRAFTS } from '@/store/mutations'

import * as messagebox from '@/components/core/messagebox.js'

export default {
  name: 'NavigatorPage',

  components: {
    NavBar, NavigatorResume, NavigatorStart, NavigatorRecent, SiteFooter
  },

  data: function() {
    return {
      show_resume: true
    }
  },

  computed: {
    ...mapGetters([
      'orphaned_drafts',
      'draft_history',
      'draft_in_progress'
    ]),
  },

  created() {

    // remove orphans
    this.removeDrafts(this.orphaned_drafts);

    // keep only the most recent 10 drafts
    let purge_draft_ids = this.draft_history
      .slice(10)
      .map((draft) => draft.id);

    // perform purge
    this.removeDrafts(purge_draft_ids);

    // turn off resume if a format is in the uri
    if (this.$route && this.$route.query.format)
      this.show_resume = false;
  },

  provide: function() {
    return {
      removeDraft: this.removeDraft
    }
  },

  methods: {
    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
    }),
    removeDraft({ draft_id, source }) {
      messagebox.confirm(
        "Remove Draft",
        "<p>You will no longer be able to access this draft after it is removed.</p>" + 
        "Remove draft from history?",
        () => {
          this.removeDrafts([draft_id]);
          if (source === "resume")
            this.show_resume = false;
        });
    }
  },
}

</script>

<template>
  <div>
    <NavBar /> 

    <div class="container">
      <transition name="resume-slide-out">
        <NavigatorResume 
          v-if="draft_in_progress && show_resume" 
          :draft_id="draft_in_progress.id"
        />
      </transition>
      <NavigatorStart />
      <NavigatorRecent 
        :draft_history="draft_history"
      />

      <SiteFooter />   
    </div>
  </div>
</template>

<style>

.resume-slide-out-leave-active {
  transition: all 0.5s;
  max-height: 300px;
}
.resume-slide-out-leave-to {
  opacity: 0;
  transform: translateX(1000px);
  max-height: 0;
}

</style>
