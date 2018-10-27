

<template>

<div class="ct-chart ct-perfect-fourth">
</div>

</template>

<script>

import Chartist from 'chartist'


export default {
  name: 'ManaCurve',

  props: {
     cards: {
      type: Array,
      required: true
    }
  },

  state: {
    chart: null
  },

  watch: {
    cards: function(cards) {
      let data = chartData(cards);
      this.chart.update(data);
    }
  },

  mounted() {
    this.chart = new Chartist.Bar(this.$el, 
      chartData(this.cards),
      {
        stackBars: true,
        high: 10,
        low: 0,
        onlyInteger: true,
        axisY: {
          offset: 0,
          labelInterpolationFnc: () => '',
        }
      });
  }
}


function chartData(cards) {
  let creatures = new Array(6).fill(0);
  let other = new Array(6).fill(0);
  for (let i=0; i<cards.length;i++) {
    let card = cards[i];
    let isCreature = card.type_line.includes("Creature");
    if (card.cmc <= 1)
      if (isCreature)
        creatures[0]++;
      else
        other[0]++;
    else if (card.cmd >= 6)
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
      creatures,
      other
    ],
  }
}


</script>

<style src="chartist/dist/chartist.min.css">
</style>

