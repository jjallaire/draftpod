<script>

import NavigatorPanel from './NavigatorPanel.vue'
import ManaLegend from '@/components/draft/infobar/ManaLegend.vue'
import ManaCurve from '@/components/draft/infobar/ManaCurve.vue'
import ManaColors from '@/components/draft/infobar/ManaColors.vue'
import RemoveDraft from './RemoveDraft.vue'

import RotateRight from "vue-material-design-icons/RotateRight.vue"

import { mapGetters } from 'vuex'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'NavigatorResume',

  props: {
    draft_id: {
      type: String,
      required: true
    },
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
    card_preview_image: function() {
      if (this.active_cards.length > 0)
        return this.active_cards[0].image;
      else
        return this.draft.table.picks.pack[0].image;
    },
    deck_total_cards: function() {
      return selectors.deckTotalCards(this.draft.table.deck);
    },
  },

 
  methods: {
    onResumeDraft: function() {
      this.$router.push({ path: "/draft/", hash: "#" + this.draft_id });
    }
  },

  components: {
    NavigatorPanel, RotateRight, ManaLegend, ManaCurve, ManaColors, RemoveDraft
  }

}

</script>

<template>

  <NavigatorPanel name="resume-draft" caption="Draft in Progress"
                  class="resume-draft">
    <template slot="icon"><RotateRight/></template>
    <div class="row">
      <div class="col-sm-3">
        <h4>{{ draft.options.set_name }}</h4>
        <p>
          <span v-if="draft.table.picks_complete">
            Deck: {{ deck_total_cards }} / 40
          </span>
          <span v-else>
            Pack {{ draft.table.current_pack }}, Pick {{ draft.table.current_pick }}
          </span>
          <RemoveDraft :draft_id="draft_id"  remove_source="resume"/>
        </p>
        <button type="button" class="btn btn-warning resume-button" 
                @click="onResumeDraft">
            Resume Draft
        </button>
      </div>
      <div class="col-sm-3">
        <ManaLegend :cards="active_cards" />
        <ManaCurve :cards="active_cards" :height="150" />
      </div>
      <div class="col-sm-3">
        <ManaColors :cards="active_cards" />
      </div>
      <div class="col-sm-2">
        <img class="card-preview" :src="card_preview_image" height="150"/>
      </div>
    </div>
  </NavigatorPanel>

</template>

<style>

.resume-draft .resume-button {
  margin-top: 25px;
}

.resume-draft .mana-curve {
  height: 140px;
}

.resume-draft .mana-curve .ct-label {
  color: #aaa;
}

.resume-draft .material-design-icon svg {
  padding-bottom: 4px;
  padding-left: 6px
}

.resume-draft .card-preview {
  margin-top: 5px;
  padding-left: 30px;
}

</style>