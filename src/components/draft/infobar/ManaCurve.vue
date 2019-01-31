<script>

import Chartist from 'chartist'
import "chartist/dist/chartist.min.css"

import * as filters from '@/store/modules/draft/card-filters'

export default {
  name: 'ManaCurve',

  props: {
     cards: {
      type: Array,
      required: true
    },
    height: {
      type: Number,
      default: 120,
    }
  },

  state: {
    chart: null
  },

  watch: {
    cards: function(cards) {
      this.chart.update(
        chartData(cards)
      );
    }
  },

  mounted() {
    this.chart = new Chartist.Bar(this.$el, 
      chartData(this.cards),
      chartOptions(this.height)
    );
  }
}


function chartData(cards) {
  let creatures = new Array(6).fill(0);
  let other = new Array(6).fill(0);
  for (let i=0; i<cards.length;i++) {
    let card = cards[i];
    let isCreature = filters.creature(card);
    let isLand = filters.land(card);
    if (isLand)
      continue;

    if (card.cmc <= 1)
      if (isCreature)
        creatures[0]++;
      else
        other[0]++; 
    else if (card.cmc >= 6)
      if (isCreature)
        creatures[5]++;
      else
        other[5]++;
    else
      if (isCreature)
        creatures[card.cmc-1]++;
      else
        other[card.cmc-1]++;
  }

  return {
    labels: ['1', '2', '3', '4', '5', '6+'],
    series: [
      {
        name: "Creature",
        data: creatures
      },
      {
        name: "Other",
        data: other,
      },
    ],
  }
}

function chartOptions(height) {
  return {
    stackBars: true,
    seriesBarDistance: 5,
    high: 16,
    low: 0,
    onlyInteger: true,
    height: height,
  
    axisX: {
      showGrid: true,
    },
    axisY: {
      type: Chartist.FixedScaleAxis,
      ticks: [0, 8, 16],
      low: 0,
      offset: 0,
      labelInterpolationFnc: () => '',
      showGrid: true,
    },
  }
}

</script>

<template>
  <div class="mana-curve ct-chart ct-perfect-fourth" />
</template>

<style>
.mana-curve {
  height: 115px;
}

.mana-curve .ct-bar {
  stroke-width: 11%;
}

.mana-curve .ct-label {
  fill: rgba(0,0,0,.5);
  color: rgba(0,0,0,.5);
}

.mana-curve .ct-series-a .ct-bar {
  stroke: #ee5f5b;
}
.mana-curve .ct-series-b .ct-bar {
   stroke: #5bc0de;
}

</style>

