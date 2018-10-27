

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
      
      this.chart.update();
    }
  },

  mounted() {
    var data = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      series: [ [5, 2, 4, 2, 0]]
    };

    this.chart = new Chartist.Line(this.$el, data);
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

  return [
    other,
    creatures
  ]
}


</script>

<style>



</style>

