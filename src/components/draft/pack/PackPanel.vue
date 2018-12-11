<script>

import MtgCard from '@/components/draft/core/MtgCard.vue';
import UiPanel from '@/components/core/UiPanel.vue';

import HourglassIcon from 'vue-material-design-icons/TimerSandEmpty.vue'

export default {
  name: 'PackPanel',
  props: {
    pack: {
      type: Array,
      default: null
    }
  },
  computed: {
    drag_source: () => "DRAG_SOURCE_PACK",
  },
  components: {
    MtgCard, UiPanel, HourglassIcon
  },
}
</script>

<template>
  <UiPanel class="pack-panel">
    <div v-if="pack">
      <MtgCard v-for="card in pack" :key="card.key" 
            :card="card" :drag_source="drag_source">
      </MtgCard>
    </div>
    <div class="waiting-for-pack" v-else>
      <HourglassIcon /> Waiting for pack...
    </div>
  </UiPanel>  

</template>

<style>

.pack-panel {
  background: transparent;
}

.pack-panel .card {
  padding: 0;
}

.draft-page .pack-panel .card-body {
  padding: 0;
  background-color: transparent;
}

.pack-panel .mtgcard img {
  width: 11.5%;
  min-height: 16.05%;
  margin-bottom: 3px;
}

.pack-panel .waiting-for-pack {
  width: 100%;
  text-align: center;
  margin-top: 8%;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
}

@media only screen and (max-width: 1000px) {
.pack-panel .mtgcard img {
  width: 10%;
  min-height: 13.95%;
} 
}

</style>

