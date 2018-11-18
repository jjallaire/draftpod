
<script>

import NavigatorPanel from './NavigatorPanel.vue'

import HistoryIcon from "vue-material-design-icons/History.vue"
import SetIcon from '@/components/core/SetIcon.vue'

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
    }
  },

  methods: {
    onDraftNavigate(draft) {
      this.$router.push("/draft/" + draft.id);
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
                  class="mtgdrafter-navigator-recent-drafts">
    <template slot="icon"><HistoryIcon /></template>

    <div v-if="draft_history.length > 0" class="row">
    <div class="col-sm-12">
    <table class="table table-hover">
      <transition-group tag="tbody" name="recent-draft-row">
        <tr v-for="draft in draft_history" :key="draft.id"
            @click="onDraftNavigate(draft)">
          <td class="td-set">
            <SetIcon :set_code="draft.set_code" />
            <span class="set-name">{{ draft.set_name }}</span>
          </td>
          <td>
            <img v-for="color in draft.card_colors" :key="color.name" 
                class="color-icon"
                :src="color.img"
                :title="color.name + ' (' + Math.round(color.percent * 100) + '%)'"/>
          </td>
          <td class="text-muted">
            <span v-if="draft.picks_complete">
              Deck: {{ draft.deck_total_cards }} / 40
            </span>
            <span v-else>
              Pack {{ draft.current_pack }}, Pick {{ draft.current_pick }}
            </span>
          </td>
          <td class="text-muted">
            {{ formatDateTime(draft.start_time) }}
          </td>
          <td class="draft-remove text-muted">
            <RemoveDraft :draft_id="draft.id" />
          </td>
        </tr>
      </transition-group>
    </table>
    </div>
    </div>
    <div v-else class="row">
      <div class="col-sm-12">
        <p class="text-center text-muted no-drafts">No previous drafts</p>
      </div>
    </div>

  </NavigatorPanel>

</template>

<style>

.mtgdrafter-navigator-recent-drafts .card-body {
  padding-left: 1.3rem;
}

.mtgdrafter-navigator-recent-drafts a {
  color: inherit;
}

.mtgdrafter-navigator-recent-drafts .simple-svg-wrapper {
  display: inline-block;
  margin-right: 13px;
  width: 25px;
}

.mtgdrafter-navigator-recent-drafts .simple-svg-wrapper svg {
  width: 20px;
  padding-bottom: 4px;
}

.mtgdrafter-navigator-recent-drafts .simple-svg-wrapper svg>path {
  fill: darkslategray;
}

.mtgdrafter-navigator-recent-drafts .table th,
.mtgdrafter-navigator-recent-drafts .table td {
  border-top: none !important;
  height: 50px;
}

.mtgdrafter-navigator-recent-drafts .table-hover tbody tr:hover {
  background-color: rgba(255,255,255,0.8);
  cursor: pointer;
}

.recent-draft-row-enter-active, .recent-draft-row-leave-active {
  transition: all 0.4s;
}
.recent-draft-row-enter, .recent-draft-row-leave-to {
  opacity: 0;
  transform: translateX(1000px);
}

.mtgdrafter-navigator-recent-drafts .set-name {
  font-size: 1.2em;
}
.mtgdrafter-navigator-recent-drafts .draft-remove {
  padding-top: 0.6rem;
}

.mtgdrafter-navigator-recent-drafts .color-icon {
  margin-right: 8px;
  padding-bottom: 2px;
  width: 18px;
}

.mtgdrafter-navigator-recent-drafts .no-drafts {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

</style>