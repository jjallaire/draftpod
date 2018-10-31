
<template>

<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in color_counts" :key="color.img">
    <td align="center"><img :src="color.img" :title="color.name" width=18></td>
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
     deck: {
      type: Object,
      required: true
    }
  },

  computed: {

    color_counts: function() {
      let counts = [
        {
          name: "Plains",
          img: "images/mana-white.svg",
          count: this.deck.basic_lands.W,
        },
        {
          name: "Swamp",
          img: "images/mana-black.svg",
          count: this.deck.basic_lands.B,
        },
        {
          name: "Island",
          img: "images/mana-blue.svg",
          count: this.deck.basic_lands.U,
        },
        {
          name: "Mountain",
          img: "images/mana-red.svg",
          count: this.deck.basic_lands.R,
        },
        {
          name: "Forest",
          img: "images/mana-green.svg",
          count: this.deck.basic_lands.G,
        },
      ];

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

