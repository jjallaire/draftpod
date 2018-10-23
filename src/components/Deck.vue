

<template>

<div class="mtgdraft-deck card bg-light">
  <div class="card-header tabs-header">
      <ul class="nav" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="deck-tab" data-toggle="tab" href="#deck" 
                role="tab" aria-controls="deck" aria-selected="true">
              Deck
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="pick-analysis-tab" data-toggle="tab" href="#pick-analysis"
            role="tab" aria-controls="pick-analysis" aria-selected="false">
            Pick Analysis
          </a>
        </li>
      </ul>
  </div>
  <div class="card-body tab-content">
    <div id="deck" class="tab-pane fade show active" role="tabpanel" aria-labelledby="deck-tab" >
      <Pile :player="player" :key="0" :number="0"></Pile>
      <Pile :player="player" v-for="number in 6" :key="number" :number="number"></Pile>
      <div class="mtgpile mtgpile-separator"></div>
      <Pile caption="Sideboard" :center_caption="true" :player="player" :key="7" :number="7"></Pile>
    </div>
    <div id="pick-analysis" class="tab-pane fade" role="tabpanel" aria-labelledby="pick-analysis-tab">
      <p>Pick Analysis</p>
    </div>
</div>
</div>

</template>


<script>

import Pile from './Pile.vue';

export default {
  name: 'Deck',
  props: {
    player: {
      type: Number,
      required: true
    }
  },
  components: {
    Pile
  },
}

</script>

<style>
.mtgdraft-deck .card-body {
  position: relative;
  overflow-y: scroll;
}
</style>

