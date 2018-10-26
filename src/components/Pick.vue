

<template>

<div class="mtgdraft-pick card bg-light">
 
  <div class="card-header tabs-header">
    <ul class="nav" role="tablist">
      <li class="nav-item">
        <a class="nav-link active" id="deck-tab" data-toggle="tab" href="#deck" 
              role="tab" aria-controls="deck" aria-selected="true">
            Picks
        </a>
      </li>
      <li v-if="pick_analysis" class="nav-item">
        <a class="nav-link" id="pick-analysis-tab" data-toggle="tab" href="#pick-analysis"
          role="tab" aria-controls="pick-analysis" aria-selected="false">
            Analysis
        </a>
      </li>
    </ul>
  </div>

  <div class="card-body tab-content">
    <div id="deck" class="tab-pane fade show active" role="tabpanel" aria-labelledby="deck-tab" >
      <PickList :player="player" />
    </div>
    <div v-if="pick_analysis" id="pick-analysis" class="tab-pane fade" role="tabpanel" aria-labelledby="pick-analysis-tab">
      <PickAnalysis :player="player" />
    </div>
</div>
</div>

</template>


<script>

import PickList from './PickList.vue'
import PickAnalysis from './PickAnalysis.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'Pick',
  props: {
    player: {
      type: Number,
      required: true
    },
  },
  components: {
    PickList, PickAnalysis
  },
  computed: {
    ...mapGetters([
      'picks_complete',
      'pick_analysis'
    ])
  },
}

</script>

<style>

.mtgdraft-pick .card-body {
  position: relative;
  overflow-y: scroll;
}

</style>

