<script>

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'ManaLegend',

  props: {
     cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    card_types: function() {
      return selectors.cardTypes(this.cards);
    }
  },
}

</script>

<template>

  <div class="mana-curve-legend">
    <span class="mana-key creatures-key bg-danger">&nbsp;</span> Creatures ({{ card_types.creatures }})
    <span class="mana-key other-key bg-info">&nbsp;</span> Other ({{ card_types.other }})
  </div>

</template>

<style>

.mana-curve-legend {
  font-size: 0.8em;
  font-weight: 400;
  margin-top: 5px;
}

.mana-key {
  padding-right: 12px;
}

.creatures-key {
  margin-left: 10px;
}

.other-key {
  margin-left: 5px;
}

</style>