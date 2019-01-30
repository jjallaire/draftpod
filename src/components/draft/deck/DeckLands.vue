<script>

import * as messagebox from '@/components/core/messagebox.js'

export default {

  name: 'DeckLands',

  props: {
    deck: {
      type: Object,
      required: true,
    }
  },

  computed: {

    colors: function() {
      let colors = [
        {
          color: "W",
          name: "Plains",
          img: "/images/mana-white.svg",
          count: this.deck.lands.basic.W,
        },
        {
          color: "B",
          name: "Swamp",
          img: "/images/mana-black.svg",
          count: this.deck.lands.basic.B,
        },
        {
          color: "U",
          name: "Island",
          img: "/images/mana-blue.svg",
          count: this.deck.lands.basic.U,
        },
        {
          color: "R",
          name: "Mountain",
          img: "/images/mana-red.svg",
          count: this.deck.lands.basic.R,
        },
        {
          color: "G",
          name: "Forest",
          img: "/images/mana-green.svg",
          count: this.deck.lands.basic.G,
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
    },

    color_order: function() {
      return this.deck.lands.color_order;
    }
  },

  inject: [
    'setBasicLands',
    'disableAutoLands'
  ],

  methods: {

    handleLandInput: function(color, event) {
      
      // code to apply input
      const applyInput = () => {
        let lands = parseInt(event.target.value);
        if (!isNaN(lands))
          this.setBasicLands({color, lands});
      };

      // if we are in auto-lands then prompt
      if (this.deck.lands.auto) {
        
        messagebox.confirm(
          "Disable Auto Lands",
          "<p>Editing the number of lands will disable auto-lands " + 
          "(lands for your deck will no longer be automatically calculated).</p> " +
          "Do you want to disable auto-lands?", 
          () => {
            // disable auto-lands
            this.disableAutoLands({
              color_order: this.colors.map((count) => count.color)
            });
              
            // apply the user's original input
            applyInput();
          },
          () => {
            // revert to previous value
            event.target.value = this.deck.lands.basic[color];
          });
       
      } else {

        // we are already in manual mode so just apply the input
        applyInput();

      }
    },

    handleLandBlur: function(color, event) {
      // if we aren't in auto-land mode then losing focus with an empty
      // field resets to the previously entered value
      if (!this.deck.lands.auto) {
        let lands = parseInt(event.target.value);
        if (isNaN(lands))
          event.target.value = this.deck.lands.basic[color];
      }
      
    }
  }

}

</script>


<template>

  <div class="deck-lands">
    <table class="table table-sm deck-colors">
      <tbody>
        <tr 
          v-for="color in colors" 
          :key="color.img">
          <td align="center"><img 
            :src="color.img" 
            :title="color.name" 
            width="18"></td>
          <td align="center"><input 
            :value="color.count" 
            type="number" 
            min="0" 
            @input="handleLandInput(color.color, $event)" 
            @blur="handleLandBlur(color.color, $event)"></td>
        </tr>
      </tbody>
    </table>
  </div>

</template>


<style>

.deck-lands .deck-colors {
  margin-top: 10px;
}

.deck-lands .deck-colors td img {
  margin-left: 0;
  margin-top: 3px;
}

.deck-lands .deck-colors td input {
  width: 40px;
  padding-left: 5px;
}

@media only screen and (max-width: 1000px) {
  .deck-lands .deck-colors td input {
    width: 35px;
  }
  .deck-lands .deck-colors td {
    padding-left: 0;
  }
}

</style>

