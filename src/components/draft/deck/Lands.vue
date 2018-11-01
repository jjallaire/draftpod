
<template>

<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in colors" :key="color.img">
    <td align="center"><img :src="color.img" :title="color.name" width=18></td>
    <td align="center"><input type="number" :value="color.count" 
        @input="handleLandInput(color.color, $event)" 
        @blur="handleLandBlur(color.color, $event)"></td>
  </tr>
  </tbody>
</table>

</template>

<script>

import '../core/styles/deck-colors.css'

import { mapGetters, mapMutations } from 'vuex'

import { DISABLE_AUTO_LANDS, SET_BASIC_LANDS } from '../../../store/mutations'

export default {

  name: 'Lands',

  props: {
    player: {
      type: Number,
      required: true,
    }
  },

  data: function() {
    return {
      color_order: null
    }
  },

  computed: {

    ...mapGetters([
      'deck',
    ]),

    auto_lands: function() {
      return this.deck(this.player).auto_lands;
    },

    basic_lands: function() {
      return this.deck(this.player).basic_lands;
    },

    colors: function() {
      let colors = [
        {
          color: "W",
          name: "Plains",
          img: "images/mana-white.svg",
          count: this.basic_lands.W,
        },
        {
          color: "B",
          name: "Swamp",
          img: "images/mana-black.svg",
          count: this.basic_lands.B,
        },
        {
          color: "U",
          name: "Island",
          img: "images/mana-blue.svg",
          count: this.basic_lands.U,
        },
        {
          color: "R",
          name: "Mountain",
          img: "images/mana-red.svg",
          count: this.basic_lands.R,
        },
        {
          color: "G",
          name: "Forest",
          img: "images/mana-green.svg",
          count: this.basic_lands.G,
        },
      ];

      // order by either fixed order (in manual mode) or dynamically based
      // on the number of lands in each color
      if (this.color_order) {
        return colors.sort((a, b) => this.color_order.indexOf(a.color) - 
                                     this.color_order.indexOf(b.color));
      } else {
        return colors.sort((a, b) => b.count - a.count);
      }
    }
  },

  methods: {
    
    ...mapMutations({
      disableAutoLands: DISABLE_AUTO_LANDS,
      setBasicLands: SET_BASIC_LANDS,  
    }),

    handleLandInput: function(color, event) {
      
      // code to apply input
      const applyInput = () => {
        let lands = parseInt(event.target.value);
        if (!isNaN(lands))
          this.setBasicLands({color, lands, playerNumber: this.player});
      };

      // if we are in auto-lands then prompt
      if (this.auto_lands) {
        if (window.confirm("Do you want to disable auto lands?")) {
          setTimeout(() => {
            // disable auto-lands
            this.disableAutoLands({ playerNumber: this.player});

            // fix the current color order so colors don't jump around
            // during manual editing
            this.color_order = this.color_counts.map((count) => count.color);
            
            // apply the user's original input
            applyInput();

          }, 100);
        } else {

          // revert to previous value
          event.target.value = this.basic_lands[color];
        
        } 
      } else {
        // we are already in manual mode so just apply the input
        applyInput();
      }
    },

    handleLandBlur: function(color, event) {
      // if we aren't in auto-land mode then losing focus with an empty
      // field resets to the previously entered value
      if (!this.auto_lands) {
        let lands = parseInt(event.target.value);
        if (isNaN(lands))
          event.target.value = this.basic_lands[color];
      }
      
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

