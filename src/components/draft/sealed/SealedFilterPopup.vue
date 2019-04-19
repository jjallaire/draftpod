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
      filters: {
        Rarity: [
          {
            caption: "Common",
            filter: filters.common,
            value: true
          },
          {
            caption: "Uncommon",
            filter: filters.uncommon,
            value: true
          },
          {
            caption: "Rare",
            filter: filters.rare,
            value: true
          },
          {
            caption: "Mythic",
            filter: filters.mythic,
            value: true
          },
        ],
        Type: [
          {
            caption: "Creature",
            filter: filters.creature,
            value: true
          },
          {
            caption: "Planeswalker",
            filter: filters.planeswalker,
            value: true
          },
          {
            caption: "Instant",
            filter: filters.instant,
            value: true
          },
          {
            caption: "Sorcery",
            filter: filters.sorcery,
            value: true
          },
          {
            caption: "Enchantment",
            filter: filters.enchantment,
            value: true
          },
          {
            caption: "Artifact",
            filter: filters.artifact,
            value: true
          },
          {
            caption: "Land",
            filter: filters.land,
            value: true
          },
        ],
        // Cost
        // Color
      }
    }
  },

  computed: {


    sealed_filter: function() {
      
      // each group has a filter that applies an OR across the group
      let groupFilters = Object.keys(this.filters).map(group => {
        let filters = this.filters[group];
        return (card) => {
          for (let i=0; i<filters.length; i++)
            if (filters[i].value && filters[i].filter(card))
              return true;
          return false;
        }
      });
      
      // group filters are then applied with AND
      return (card) => {
        for (let i=0; i<groupFilters.length; i++)
          if (!groupFilters[i](card))
            return false;
        return true;
      };
    }
  },

  methods: {
   
    updateFilter() {
      this.$emit('changed', this.sealed_filter)
    }

  },


}

</script>



<template>
  <div class="sealed-filter">
    <div v-for="(group, caption) in filters" :key="caption" class="form-group">
      <h5>{{ caption }}</h5>
      <div v-for="filter in group" :key="filter.caption" class="form-check">
        <input 
          :id="filter + group + filter.caption" 
          v-model="filter.value" 
          class="form-check-input" 
          type="checkbox" @change="updateFilter"
        >
        <label class="form-check-label" :for="filter + 'group' + filter.caption"> {{ filter.caption }}</label>
      </div>
    </div>
  </div>
  
</template>

<style>

.sealed-filter {
  width: 310px;
  height: 290px;
}

</style>