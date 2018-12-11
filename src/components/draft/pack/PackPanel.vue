<script>

import MtgCard from '@/components/draft/core/MtgCard.vue';
import UiPanel from '@/components/core/UiPanel.vue';

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
    MtgCard, UiPanel
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
    <div v-else>
      Waiting for pack....
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

@media only screen and (max-width: 1000px) {
.pack-panel .mtgcard img {
  width: 10%;
  min-height: 13.95%;
} 
}

</style>

