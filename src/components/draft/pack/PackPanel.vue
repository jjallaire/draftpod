<script>

import MtgCard from '@/components/draft/core/MtgCard.vue';
import UiPanel from '@/components/core/UiPanel.vue';

import HourglassIcon from 'vue-material-design-icons/TimerSandEmpty.vue'

export default {
  name: 'PackPanel',
  components: {
    MtgCard, UiPanel, HourglassIcon
  },
  props: {
    pack: {
      type: Array,
      default: null
    }
  },
  computed: {
    drag_source: () => "DRAG_SOURCE_PACK",
  },
}
</script>

<template>
  <UiPanel class="pack-panel card-select-panel">
    <div 
      v-if="pack" 
      class="card-select-container"
    >
      <MtgCard 
        v-for="card in pack" 
        :key="card.key" 
        :card="card" 
        :drag_source="drag_source"
      />
    </div>
    <div 
      v-else 
      class="waiting-for-pack"
    >
      <HourglassIcon /> <span>Waiting for pack...</span>
    </div>
  </UiPanel>
</template>

<style>


.pack-panel .waiting-for-pack {
  width: 100%;
  text-align: center;
  margin-top: 12%;
  font-size: 1.1rem;
  color: rgba(255,255,255,0.7);
}

.pack-panel .waiting-for-pack span {
  vertical-align: middle;
  margin-right: 3px;
}

.pack-panel .waiting-for-pack .material-design-icon svg {
  padding-bottom: 3px;
}


</style>

