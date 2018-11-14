

<template>

<NavigatorPanel name="recent-drafts" caption="Recent Drafts" :parent="parent" :show="show"
                class="mtgdrafter-navigator-recent-drafts">
  <template slot="icon"><HistoryIcon /></template>
  <div v-for="draft in draft_history" :key="draft.id" class="row">
    <div class="col-sm-3">
      <router-link :to="'/draft/' + draft.id">
      {{ draft.set_name }}
      </router-link>
    </div>
  </div>
</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'

import HistoryIcon from "vue-material-design-icons/History.vue"

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

  components: {
    NavigatorPanel, HistoryIcon
  }

}

</script>

<style>

.mtgdrafter-navigator-recent-drafts a {
  color: inherit;
}

</style>