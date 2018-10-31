
<template>

<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in color_counts" :key="color.img">
    <td align="center"><img :src="color.img" width=18></td>
    <td align="center"><input type="number" :name="color.name + '_input'" :value="color.count"></td>
  </tr>
  </tbody>
</table>

</template>

<script>

import '../core/styles/deck-colors.css'

export default {

  name: 'Lands',

  props: {
     lands: {
      type: Object,
      required: true
    }
  },

  computed: {
    color_counts: function() {
      let counts = {
        W: {
          name: "Plains",
          img: "images/mana-white.svg",
          count: 4
        },
        B: {
          name: "Swamp",
          img: "images/mana-black.svg",
          count: 8
        },
        U: {
          name: "Island",
          img: "images/mana-blue.svg",
          count: 2
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
      };

      counts = Object.keys(counts).map(val => counts[val]);
      return counts.sort(function(a, b) {
        return b.count - a.count;
      });
    }
  }

}


</script>

<style>

.mtgpile .mtgdraft-deck-colors {
  margin-top: 10px;
}

.mtgpile .mtgdraft-deck-colors td img {
  margin-left: 0;
  margin-top: 3px;
}

.mtgpile .mtgdraft-deck-colors td input {
  width: 40px;
  padding-left: 5px;
}

@media only screen and (max-width: 1000px) {
  .mtgpile .mtgdraft-deck-colors td input {
    width: 35px;
  }
  .mtgpile .mtgdraft-deck-colors td {
    padding-left: 0;
  }
}

</style>

