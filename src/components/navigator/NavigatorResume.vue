<script>

import ContentPanel from '@/components/core/ContentPanel.vue'
import ManaLegend from '@/components/draft/infobar/ManaLegend.vue'
import ManaCurve from '@/components/draft/infobar/ManaCurve.vue'
import ManaColors from '@/components/draft/infobar/ManaColors.vue'
import RemoveDraft from './RemoveDraft.vue'

import { mapGetters } from 'vuex'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'NavigatorResume',

  components: {
    ContentPanel, ManaLegend, ManaCurve, ManaColors, RemoveDraft
  },

  props: {
    draft_id: {
      type: String,
      required: true
    },
  },

  computed: {
    ...mapGetters({
      draft_info: 'draft', 
      player: 'player'
    }),
    draft: function() {
      return this.draft_info(this.draft_id);
    },
    options: function() {
      return selectors.draftOptions(this.draft);
    },
    active_player: function() {
      return selectors.activePlayer(this.player.id, this.draft.table);
    },
    active_cards: function() {
      return selectors.activeCards(this.player.id, this.draft.table);
    },
    current_pack: function() {
      return selectors.currentPack(this.player.id, this.draft.set.code, this.options, this.draft.table);
    },
    current_pick: function() {
      return selectors.currentPick(this.player.id, this.draft.set.code, this.options, this.draft.table);
    },
    picks_complete: function() {
      return selectors.picksComplete(this.player.id, this.draft.set.code, this.options, this.draft.table);
    },
    card_preview_image: function() {
      return selectors.draftThumbnail(this.player.id, this.draft);
    },
    deck_total_cards: function() {
      return selectors.deckTotalCards(this.active_player.deck);
    },
  },

 
  methods: {
    onResumeDraft: function() {
      this.$router.push({ path: `/${this.draft.format}/` + this.draft_id });
    }
  },

}

</script>

<template>
  <ContentPanel 
    caption="In Progress" 
    class="resume-draft user-select-none"
  >
    <div class="row">
      <div class="col-sm-4 col-lg-3">
        <h4>{{ draft.set.name }}</h4>
        <p>
          <span v-if="picks_complete">
            Deck: {{ deck_total_cards }} / {{ options.deck_size }}
          </span>
          <span v-else>
            Pack {{ current_pack }}, Pick {{ current_pick }}
          </span>
          <RemoveDraft 
            :draft_id="draft_id" 
            remove_source="resume"
          />
        </p>
        <button 
          type="button" 
          class="btn btn-warning resume-button" 
          @click="onResumeDraft"
        >
          Resume
        </button>
      </div>
      <div class="col-sm-4 col-lg-3">
        <ManaLegend :cards="active_cards" />
        <ManaCurve 
          :cards="active_cards" 
          :height="150"
        />
      </div>
      <div class="col-sm-4 col-lg-3">
        <ManaColors :cards="active_cards" />
      </div>
      <div class="col-lg-3 d-none d-lg-block">
        <img 
          :src="card_preview_image" 
          class="card-preview" 
          height="150"
        >
      </div>
    </div>
  </ContentPanel>
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