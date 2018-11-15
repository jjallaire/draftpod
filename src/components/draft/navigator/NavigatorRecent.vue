

<template>

<NavigatorPanel name="recent-drafts" caption="Recent Drafts" :parent="parent" :show="show"
                class="mtgdrafter-navigator-recent-drafts">
  <template slot="icon"><HistoryIcon /></template>

  <div class="row">
  <table class="table table-hover">
    <tbody>
      <tr v-for="draft in draft_history" :key="draft.id"
          @click="onClickedDraft(draft)">
        <td>
          <SetIcon :set_code="draft.set_code" />
          <span class="set-name">{{ draft.set_name }}</span>
        </td>
        <td>
          <img class="color-icon" v-for="i in 2" :key="i" 
               :src="draft.card_colors[i-1].img"
               :title="draft.card_colors[i-1].name + ' ('  
                 + Math.round(draft.card_colors[i-1].percent * 100) + '%)'"/>
        </td>
        <td>
          <span v-if="draft.picks_complete">
            Deck: {{ draft.deck_total_cards }} / 40
          </span>
          <span v-else>
            Pack {{ draft.current_pack }}, Pick {{ draft.current_pick }}
          </span>
        </td>
        <td>
          {{ formatDateTime(draft.start_time) }}
        </td>
      </tr>
    </tbody>
  </table>
  </div>

</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'

import HistoryIcon from "vue-material-design-icons/History.vue"
import SetIcon from '@/components/core/SetIcon.vue'

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
    onClickedDraft(draft) {
      this.$router.push("/draft/" + draft.id);
    },
    formatDateTime(dt) {
      let date = new Date(dt);
      return date.toLocaleDateString() + ', ' +
             date.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', hour12: true });
    }
  },

  components: {
    NavigatorPanel, HistoryIcon, SetIcon
  }

}

</script>

<style>

.mtgdrafter-navigator-recent-drafts a {
  color: inherit;
}

.mtgdrafter-navigator-recent-drafts .simple-svg-wrapper {
  display: inline-block;
  margin-right: 5px;
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

.mtgdrafter-navigator-recent-drafts .set-name {
  font-size: 1.1em;
}

.mtgdrafter-navigator-recent-drafts .color-icon {
  margin-right: 10px;
  padding-bottom: 2px;
  width: 18px;
}

</style>