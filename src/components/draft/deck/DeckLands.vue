
<template>

<div>
<table class="table table-sm mtgdraft-deck-colors">
  <tbody>
  <tr v-for="color in colors" :key="color.img">
    <td align="center"><img :src="color.img" :title="color.name" width=18></td>
    <td align="center"><input type="number" min="0" :value="color.count" 
        @input="handleLandInput(color.color, $event)" 
        @blur="handleLandBlur(color.color, $event)"></td>
  </tr>
  </tbody>
</table>
</div>

</template>

<script>

import { mapGetters, mapMutations } from 'vuex'

import { DISABLE_AUTO_LANDS, SET_BASIC_LANDS } from '../../../store/mutations'

import * as messagebox from '../../core/messagebox.js'

export default {

  name: 'DeckLands',

  props: {
    draft_id: {
      type: String,
      required: true
    },
    player_id: {
      type: Number,
      required: true,
    }
  },

  data: function() {
    return {
      color_order: null,
    }
  },

  computed: {

    ...mapGetters([
      'deck',
    ]),

    auto_lands: function() {
      return this.deck(this.player_id).auto_lands;
    },

    basic_lands: function() {
      return this.deck(this.player_id).basic_lands;
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
          this.setBasicLands({color, lands, player_id: this.player_id});
      };

      // if we are in auto-lands then prompt
      if (this.auto_lands) {
        
        messagebox.confirm(
          "<p>Editing the number of lands will disable auto-lands " + 
          "(lands for your deck will no longer be automatically calculated).</p> " +
          "Do you want to disable auto-lands?", 
          () => {
            // disable auto-lands
            this.disableAutoLands({ player_id: this.player_id});

            // fix the current color order so colors don't jump around
            // during manual editing
            this.color_order = this.colors.map((count) => count.color);
              
            // apply the user's original input
            applyInput();
          },
          () => {
            // revert to previous value
            event.target.value = this.basic_lands[color];
          });
       
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

