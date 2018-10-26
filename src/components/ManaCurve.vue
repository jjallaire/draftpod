

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

</script>

<style>



</style>

