<script>

import * as filters from '@/store/modules/draft/card-filters'

export default {
  name: 'SealedFilterPopup',

  components: {
   
  },

  props: {
   
  },

  data: function() {
    return {
      common: true,
      uncommon: true,
      rare: true,
      mythic: true
    }
  },

  computed: {
    filter: function() {
      let filter = [];
      if (this.common)
        filter.push(filters.common);
      if (this.uncommon)
        filter.push(filters.uncommon);
       if (this.rare)
        filter.push(filters.rare);
       if (this.mythic)
        filter.push(filters.mythic);

      if (filter.length > 0)
        return (card) => {
          for (let i=0; i<filter.length; i++)
            if (filter[i](card))
              return true;
          return false;
        }
      else
        return null;
    }
  },

  methods: {
   
    updateFilter() {
      this.$emit('changed', this.filter)
    }

  },


}

</script>

<template>
  <div class="sealed-filter">
    <div>
      <input v-model="common" name="common" type="checkbox" @change="updateFilter">
      <label for="common"> Common</label>
    </div>
    <div>
      <input v-model="uncommon" name="uncommon" type="checkbox" @change="updateFilter">
      <label for="uncommon"> Uncommon</label>
    </div>
    <div>
      <input v-model="rare" name="rare" type="checkbox" @change="updateFilter">
      <label for="rare"> Rare</label>
    </div>
    <div>
      <input v-model="mythic" name="mythic" type="checkbox" @change="updateFilter">
      <label for="mythic"> Mythic</label>
    </div>

  </div>
  
</template>

<style>

.sealed-filter {
  width: 310px;
  height: 290px;
}

</style>