<script>

import { Drop } from 'vue-drag-drop'
import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'PickRatings',

  filters: {
    rating: function(value) {
      return (Math.round( value * 10 ) / 10).toFixed(1);
    }
  },

  components: {
    Drop
  },

  props: {
    pick_ratings: {
      type: Array,
      required: true
    }
  },

  inject: [
    'touchDragManager'
  ],

  mounted() {
    this.touchDragManager.registerDropTarget({
      element: this.$el,
      handlers: {
        onMove: this.handleDragover,
      }
    });
  },

  beforeDestroy() {
    this.touchDragManager.unregisterDropTarget(this.$el);
  },

  methods: {
    handleDragover(data) {
      this.$emit('pick-dragged', data);
      return true;
    },

    card_colors: function(card) {
      return selectors.cardColors([card], true).filter((color) => color.count > 0);
    }
  },
}

</script>


<template>
  <Drop 
    v-if="pick_ratings.length > 0" 
    @dragover="handleDragover(...arguments)">
    <table class="ratings-table table table-sm">
      <thead class="">
        <th>Card</th>
        <th>Colors</th>
        <th>Rating</th>
        <th>Color Bonus</th>
        <th>Pick Rating</th>
      </thead>
      <tbody>
        <tr 
          v-for="pick_rating in pick_ratings" 
          :key="pick_rating.card.id">
          <td width="15%">{{ pick_rating.card.name }}</td>
          <td width="20%">
            <img 
              v-for="color in card_colors(pick_rating.card)" 
              :key="color.name"
              :src="color.img" 
              class="mana-color">
          </td>
          <td width="15%">{{ pick_rating.base_rating | rating }}</td>
          <td 
            v-if="pick_rating.color_bonus > 0" 
            width="15%">+{{ pick_rating.color_bonus | rating }}</td>
          <td 
            v-else 
            width="15%" 
            class="no-color-bonus">&mdash;</td>
          <td width="15%">{{ pick_rating.rating | rating }}</td>
        </tr>
      </tbody>
    </table>



    <p class="ratings-note">
      Card ratings provide a rough idea of the relative power level between cards, 
      but don't necessarily reflect optimal draft selections. The pick rating displayed reflects a baseline
      card rating plus a bonus for matching the color of the deck (the bonuses are lower in pack 1). Ratings don't reflect
      draft signals, deck synergies, mana curve, and creatue/spell ratio&mdash;these considerations will often result in a
      pick different than the highest rated card. Ratings are based on the community P1P1 evaluations provided at 
      <a 
        target="_blank" 
        href="https://draftaholicsanonymous.com/">https://draftaholicsanonymous.com</a>.
    </p>


  </Drop>

</template>

<style>


.ratings-table {
  font-size: 0.8rem;
}

.ratings-note {
  font-size: 0.8rem;
  margin-left: 2px;
  margin-right: 2px;
  margin-top: 0;
  margin-bottom: 10px;
  padding: 12px;
  padding-top: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  background-color: rgb(232,232,232);
}

.ratings-note a {
  color: inherit;
}

.ratings-table .mana-color {
  width: 16px;
  margin-right: 5px;
}

.ratings-table th, .ratings-table td {
  text-align: center;
  border-top: 1px solid rgba(0,0,0,0.1);
}

.ratings-table thead th {
  border-bottom: none;
  font-weight: 600;
  background-color: rgb(232,232,232);
}

.ratings-table th:first-of-type, .ratings-table td:first-of-type {
  text-align: left;
}

.ratings-table .no-color-bonus {
  color: rgba(0,0,0,0.2);
}

</style>

