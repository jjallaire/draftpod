
<template>

<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in color_counts" :key="color.img">
    <td><img :src="color.img" width=18> {{ color.name }}</td>
    <td>{{ color.count }}</td>
  </tr>
  </tbody>
</table>

</template>

<script>

import * as filters from '../../../store/card-filters'

export default {
  name: 'ManaColors',

  props: {
     cards: {
      type: Array,
      required: true
    }
  },

  computed: {
    color_counts: function() {
      let counts = {
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
        let colors = card.colors;
        if (colors.length === 0)
          counts["C"].count++;
        else
          for (let c=0; c<colors.length; c++)
            counts[colors[c]].count++;
      }

      counts = Object.keys(counts).map(val => counts[val]);
      return counts.sort(function(a, b) {
        return b.count - a.count;
      });
    }
  },


}

</script>

<style>

.mtgdraft-deck-colors {
  font-size: 0.8em;
  font-weight: 500;
  margin-top: 3px;
}

.mtgdraft-deck-colors th,
.mtgdraft-deck-colors td {
  border-top: none;
}

.mtgdraft-deck-colors td img {
  margin-top: -2px;
  margin-right: 6px;
  margin-left: 4px;
}

</style>