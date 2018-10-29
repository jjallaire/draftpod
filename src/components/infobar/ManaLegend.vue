
<template>

<div class="mana-curve-legend">
  <span class="mana-key creatures-key">&nbsp;</span> Creatures ({{ creature_count }})
  <span class="mana-key other-key">&nbsp;</span> Other ({{ other_count }})
</div>

</template>

<script>

import * as filters from '../../store/card-filters'

export default {
  name: 'ManaLegend',

  props: {
     cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    creature_count: function() {
      return this.cards.filter(filters.creature).length;
    },
    other_count: function() {
      return this.cards.filter((card) => 
        !filters.creature(card) && !filters.land(card)).length;
    },
  },
}

</script>

<style>

.mtgdraft-deckstats .mana-curve-legend {
  font-size: 0.8em;
  font-weight: 400;
  color: #808080;
  margin-top: 6px;
}

.mtgdraft-deckstats .mana-key {
  padding-right: 12px;
}

.mtgdraft-deckstats .creatures-key {
  margin-left: 10px;
  background-color: #ee5f5b;
}

.mtgdraft-deckstats .other-key {
  margin-left: 5px;
  background-color: #5bc0de;
}

</style>