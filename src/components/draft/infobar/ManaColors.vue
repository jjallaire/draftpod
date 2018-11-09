
<template>

<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in colors" :key="color.img">
    <td width="60%"><img :src="color.img" width=18> {{ color.name }}</td>
    <td align="right">{{ color.count }}</td>
    <td align="right">{{ (color.percent * 100).toFixed(0) + '%' }}</td>
  </tr>
  </tbody>
</table>

</template>

<script>

import * as filters from '@/store/modules/draft/card-filters'

export default {
  name: 'ManaColors',

  props: {
     cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    colors: function() {
      let colors = {
        W: {
          name: "Plains",
          img: "images/mana-white.svg",
          count: 0
        },
        B: {
          name: "Swamp",
          img: "images/mana-black.svg",
          count: 0
        },
        U: {
          name: "Island",
          img: "images/mana-blue.svg",
          count: 0
        },
        R: {
          name: "Mountain",
          img: "images/mana-red.svg",
          count: 0
        },
        G: {
          name: "Forest",
          img: "images/mana-green.svg",
          count: 0
        },
        C: {
          name: "Colorless",
          img: "images/mana-colorless.svg",
          count: 0
        },
      };
      for (let i=0; i<this.cards.length; i++) {
        let card = this.cards[i];
        if (filters.land(card))
          continue;
        if (card.colors.length === 0)
          colors["C"].count++;
        else
          for (let c=0; c<card.colors.length; c++)
            colors[card.colors[c]].count++;
      }

      // get array of colors
      colors = Object.keys(colors).map(val => colors[val]);

      // compute percents
      let total_cards = colors.reduce((total, color) => total + color.count, 0);
      colors = colors.map(function(color) {
        return {...color, percent: total_cards > 0 ? color.count / total_cards : 0 }
      });

      // return
      return colors.sort(function(a, b) {
        return b.count - a.count;
      });
    }
  },
}

</script>

<style>

.mtgdraft .mtgdraft-deck-colors {
  width: 92%;
}

</style>