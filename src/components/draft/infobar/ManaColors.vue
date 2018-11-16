<script>

import * as selectors from '@/store/modules/draft/selectors'

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
      return selectors.cardColors(this.cards);
    }
  },
}

</script>


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


<style>

.mtgdraft .mtgdraft-deck-colors {
  width: 92%;
}

</style>