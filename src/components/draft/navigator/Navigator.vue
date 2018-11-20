<script>

import Navbar from '@/components/core/Navbar.vue'
import NavigatorResume from './NavigatorResume.vue'
import NavigatorStart from './NavigatorStart.vue'
import NavigatorRecent from './NavigatorRecent.vue'

import { mapGetters, mapMutations } from 'vuex'

import { REMOVE_DRAFTS } from '@/store/mutations'

import * as messagebox from '@/components/core/messagebox.js'

export default {
  name: 'Navigator',

  data: function() {
    return {
      show_resume: true
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
        "<p>Remove draft from history?</p> ",
        () => {
          this.removeDrafts([draft_id]);
          if (source === "resume")
            this.show_resume = false;
        });
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
    <transition name="resume-slide-out">
      <NavigatorResume v-if="draft_in_progress && show_resume" 
        :draft_id="draft_in_progress.id"
      />
    </transition>
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
