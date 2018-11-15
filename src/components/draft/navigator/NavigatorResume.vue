

<template>

<NavigatorPanel name="resume-draft" caption="Draft in Progress" :parent="parent" :show="show">
    <template slot="icon"><RotateRight/></template>
    <div class="row">
      <div class="col-sm-4">
        <h4>{{ draft.options.set_name }}</h4>
        <p>
          <span v-if="draft.table.picks_complete">
            Deck: {{ deck_total_cards }} / 40
          </span>
          <span v-else>
            Pack {{ draft.table.current_pack }}, Pick {{ draft.table.current_pick }}
          </span>
        </p>
        <br/>
        <button type="button" class="btn btn-warning navigator-button" 
                @click="onResumeDraft">
            Resume Draft
        </button>
      </div>
      <div class="col-sm-3">
        <ManaLegend :cards="active_cards" />
        <ManaCurve :cards="active_cards" :height="150" />
      </div>
      <div class="col-sm-3 offset-sm-1">
        <ManaColors :cards="active_cards" />
      </div>
    </div>
</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'
import ManaLegend from '@/components/draft/infobar/ManaLegend.vue'
import ManaCurve from '@/components/draft/infobar/ManaCurve.vue'
import ManaColors from '@/components/draft/infobar/ManaColors.vue'

import RotateRight from "vue-material-design-icons/RotateRight.vue"

import { mapGetters } from 'vuex'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'NavigatorResume',

  props: {
    parent: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    draft_id: {
      type: String,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      draft_info: 'draft' 
    }),
    draft: function() {
      return this.draft_info(this.draft_id);
    },
    active_cards: function() {
      return selectors.activeCards(this.draft.table);
    },
    deck_total_cards: function() {
      return selectors.deckTotalCards(this.draft.table.deck);
    },
  },

 
  methods: {
    onResumeDraft: function() {
      this.$router.push("/draft/" + this.draft_id);
    }
  },

  components: {
    NavigatorPanel, RotateRight, ManaLegend, ManaCurve, ManaColors
  }

}

</script>

<style>

.mtgdrafter-navigator .mtgdraft-mana-curve .ct-chart {
  height: 140px;
}

</style>