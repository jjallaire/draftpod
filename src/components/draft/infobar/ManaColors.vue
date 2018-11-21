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

  <table class="table table-sm deck-colors">
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

.draftpod .deck-colors {
  width: 92%;
}

.draftpod .deck-colors {
  font-size: 0.8em;
  font-weight: 400;
  margin-top: 3px;
}

.draftpod .deck-colors th,
.draftpod .deck-colors td {
  border-top: none;
}

.draftpod .deck-colors td img {
  margin-top: -2px;
  margin-right: 5px;
  margin-left: 4px;
}

</style>