<script>

import MtgCard from '@/components/draft/core/MtgCard.vue';
import UiPanel from '@/components/core/UiPanel.vue';

export default {
  name: 'PackPanel',
  props: {
    pack: {
      type: Array,
      required: true
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
  <UiPanel class="mtgdraft-pack">
    <div>
      <MtgCard v-for="card in pack" :key="card.key" 
            :card="card" :drag_source="drag_source">
      </MtgCard>
    </div>
  </UiPanel>  

</template>

<style>

.mtgdraft .mtgdraft-pack {
  background: transparent;
}

.mtgdraft .mtgdraft-pack .card {
  padding: 0;
}

.mtgdraft .mtgdraft-pack .card-body {
  padding: 0;
}

.mtgdraft-pack .mtgcard img {
  width: 11.5%;
  min-height: 16.05%;
  margin-bottom: 3px;
}

.mtgdraft-pack .mtgdraft-pack-timer {
  margin-left: 20px;
}

@media only screen and (max-width: 1000px) {
.mtgdraft-pack .mtgcard img {
  width: 10%;
  min-height: 13.95%;
} 
}

</style>

