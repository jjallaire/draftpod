<script>

import PickList from './PickList.vue'
import PickRatings from './PickRatings.vue'

export default {
  name: 'PickPanel',
  props: {
    picks: {
      type: Object,
      required: true
    },
    pick_ratings: {
      type: Boolean,
      required: true
    }
  },
  components: {
    PickList, PickRatings
  },
}

</script>

<template>

  <div class="pick-panel card bg-white">
  
    <div class="card-header tabs-header">
      <ul class="nav" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="deck-tab" data-toggle="tab" href="#deck" 
                role="tab" aria-controls="deck" aria-selected="true">
              Picks
          </a>
        </li>
        <li v-if="pick_ratings" class="nav-item">
          <a class="nav-link" id="pick-ratings-tab" data-toggle="tab" href="#pick-ratings"
            role="tab" aria-controls="pick-ratings" aria-selected="false">
              Ratings
          </a>
        </li>
      </ul>
    </div>

    <div class="card-body tab-content">
      <div id="deck" class="tab-pane fade show active" role="tabpanel" aria-labelledby="deck-tab" >
        <PickList :piles="picks.piles" />
      </div>
      <div v-if="pick_ratings" id="pick-ratings" class="tab-pane fade" role="tabpanel" aria-labelledby="pick-ratings-tab">
        <PickRatings  />
      </div>
  </div>
  </div>

</template>

<style>

.pick-panel .card-body {
  position: relative;
  overflow-y: scroll;
}

</style>

