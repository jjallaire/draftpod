
<script>

import SetIcon from '@/components/core/SetIcon.vue'
import NavigatorPanel from './NavigatorPanel.vue'
import HistoryIcon from "vue-material-design-icons/History.vue"
import RemoveDraft from './RemoveDraft.vue'

export default {
  name: 'NavigatorRecent',

  props: {
    parent: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    draft_history: {
      type: Array,
      required: true
    },
  },

  methods: {
    onDraftNavigate(draft) {
      this.$router.push({ path: "/draft/", hash: "#" + draft.id });
    },
    formatDateTime(dt) {
      let date = new Date(dt);
      return date.toLocaleDateString() + ', ' +
             date.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
    }
  },

  components: {
    NavigatorPanel, HistoryIcon, SetIcon, RemoveDraft
  }

}

</script>

<template>

  <NavigatorPanel name="recent-drafts" caption="Recent Drafts" :parent="parent" :show="show"
                  class="recent-drafts">
    <template slot="icon"><HistoryIcon /></template>

    <transition-group v-if="draft_history.length > 0" name="recent-draft-row">
    <div v-for="draft in draft_history" :key="draft.id" class="row align-items-center"
         @click="onDraftNavigate(draft)">
      <div class="col-md-3">
         <SetIcon :set_code="draft.set_code" />
         <span class="set-name">{{ draft.set_name }}</span>
      </div>
      <div class="col-md-2">
         <img v-for="color in draft.card_colors" :key="color.name" 
              class="color-icon"
              :src="color.img"
              :title="color.name + ' (' + Math.round(color.percent * 100) + '%)'"/>
      </div>
      <div class="col-md-3 text-muted">
        <span v-if="draft.picks_complete">
              Deck: {{ draft.deck_total_cards }} / 40
        </span>
        <span v-else>
          Pack {{ draft.current_pack }}, Pick {{ draft.current_pick }}
        </span>
      </div>
      <div class="col-md-3 text-muted">
        {{ formatDateTime(draft.start_time) }}
      </div>
      <div class="col-md-1 text-muted">
        <RemoveDraft :draft_id="draft.id" remove_source="recent" />
      </div>
    </div>
    </transition-group>
    <div v-else class="row no-drafts align-items-center">
      <div class="col-sm-12">
        <div class="text-center text-muted">No previous drafts</div>
      </div>
    </div>

  </NavigatorPanel>

</template>

<style>

.recent-drafts .card-body {
  padding-left: 2.0rem;
  padding-top: 0.6rem;
}

.recent-drafts a {
  color: inherit;
}

.recent-drafts .simple-svg-wrapper {
  display: inline-block;
  margin-right: 13px;
  width: 25px;
}

.recent-drafts .simple-svg-wrapper svg {
  width: 20px;
  padding-bottom: 4px;
}

.recent-drafts .simple-svg-wrapper svg>path {
  fill: darkslategray;
}

.recent-drafts .row {
  height: 50px;
}

.recent-drafts .row:hover {
  background-color: rgba(255,255,255,0.8);
  cursor: pointer;
}


.recent-draft-row-enter-active, .recent-draft-row-leave-active {
  transition: all 0.5s;
  max-height: 50px;
}

.recent-draft-row-enter, .recent-draft-row-leave-to {
  opacity: 0;
  transform: translateX(1000px);
  max-height: 0;
}

.recent-drafts .set-name {
  font-size: 1.1em;
}

.recent-drafts .color-icon {
  margin-right: 8px;
  padding-bottom: 2px;
  width: 18px;
}

.recent-drafts .no-drafts {
  height: 80px;
}

</style>