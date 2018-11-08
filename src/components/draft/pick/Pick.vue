

<template>

<div class="mtgdraft-pick card bg-white">
 
  <div class="card-header tabs-header">
    <ul class="nav" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="deck-tab" data-toggle="tab" href="#deck" 
              role="tab" aria-controls="deck" aria-selected="true">
            Picks
        </a>
      </li>
      <li v-if="show_pick_analysis" class="nav-item">
        <a class="nav-link" id="pick-analysis-tab" data-toggle="tab" href="#pick-analysis"
          role="tab" aria-controls="pick-analysis" aria-selected="false">
            Analysis
        </a>
      </li>
    </ul>
  </div>

  <div class="card-body tab-content">
    <div id="deck" class="tab-pane fade show active" role="tabpanel" aria-labelledby="deck-tab" >
      <PickList :piles="piles" />
    </div>
    <div v-if="show_pick_analysis" id="pick-analysis" class="tab-pane fade" role="tabpanel" aria-labelledby="pick-analysis-tab">
      <PickAnalysis :player_id="player_id" />
    </div>
</div>
</div>

</template>


<script>

import PickList from './PickList.vue'
import PickAnalysis from './PickAnalysis.vue'

import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Pick',
  props: {
    player_id: {
      type: Number,
      required: true
    },
  },
  components: {
    PickList, PickAnalysis
  },
  computed: {
    ...mapState([
      'picks_complete',
      'show_pick_analysis'
    ]),
    ...mapGetters([
      'draft'
    ]),
    piles: function() {
      return this.draft(this.player_id).piles;
    }
  },
}

</script>

<style>

.mtgdraft-pick .card-body {
  position: relative;
  overflow-y: scroll;
}

</style>

