<script>

import * as filters from '@/store/modules/draft/card-filters'

import jquery from 'jquery'

export default {
  name: 'SealedFilterPopup',

  components: {
   
  },

  props: {
   
  },

  data: function() {
    return {
      filters: {
         Color: [
          {
            icon: "/images/mana-white.svg",
            caption: "Plains",
            filter: filters.plains,
            value: true
          },
          {
            icon: "/images/mana-blue.svg",
            caption: "Island",
            filter: filters.island,
            value: true
          },
          {
            icon: "/images/mana-black.svg",
            caption: "Swamp",
            filter: filters.swamp,
            value: true
          },
          {
            icon: "/images/mana-red.svg",
            caption: "Mountain",
            filter: filters.mountain,
            value: true
          },
          {
            icon: "/images/mana-green.svg",
            caption: "Forest",
            filter: filters.forest,
            value: true
          },
          {
            icon: "/images/mana-colorless.svg",
            caption: "Colorless",
            filter: filters.colorless,
            value: true
          },
          {
            icon: "/images/mana-multicolor.svg",
            caption: "Multicolor",
            filter: filters.multicolor,
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
      },
      rules_text: ''
    }
  },

  computed: {


    sealed_filter: function() {
      
      // each group has a filter that applies an OR across the group
      let allFilters = Object.keys(this.filters).map(group => {
        let filters = this.filters[group];
        return (card) => {
          for (let i=0; i<filters.length; i++) {
            if (filters[i].value && filters[i].filter(card))
              return true;
          }
          return false;
        }
      });

      // add rules text filters
      if (this.rules_text) {
        this.rules_text.split(/[ ,]+/).forEach(term => {
          allFilters.push(card => {
            return card.oracle_text.toLowerCase().includes(term);
          });
        });
      }
      
      // group filters are then applied with AND
      return (card) => {
        for (let i=0; i<allFilters.length; i++)
          if (!allFilters[i](card))
            return false;
        return true;
      };
     
    }
  },

  methods: {
   
    updateFilter() {
      this.$emit('changed', this.sealed_filter)
    },

    onResetFilter(event) {
      Object.keys(this.filters).forEach(group => {
        this.filters[group].forEach(filter => {
          filter.value = true;
        });
      });
      this.rules_text = '';
      this.updateFilter();
      event.target.blur();
    },

    onRulesTextChanged(event) {
      this.rules_text = event.target.value.trim().toLowerCase();
      this.updateFilter();
    },

    dismissDropdown() {
      jquery(this.$el).closest(".dropdown").dropdown("toggle");
    }
  },


}

</script>



<template>
  <div class="sealed-filter">
    <div class="row">
      <div v-for="(group, caption) in filters" :key="caption" class="col-sm-4 form-group">
        <strong>{{ caption }}</strong>
        <div v-for="filter in group" :key="filter.caption" class="form-check">
          <input 
            :id="filter + group + filter.caption" 
            v-model="filter.value" 
            class="form-check-input" 
            type="checkbox" @change="updateFilter"
          >
          <label class="form-check-label" :for="filter + 'group' + filter.caption">
            <img 
              v-if="filter.icon"
              :src="filter.icon" 
              width="11"
            >
            {{ filter.caption }}
          </label>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="form-group col-sm-12">
        <label id="filterRulesTextLabel" for="filterRulesText"><strong>Rules text</strong></label>
        <input 
          id="filterRulesText" 
          :value="rules_text" 
          class="form-control" 
          type="text" 
          aria-describedby="rulesTextHelpBlock" 
          @input="onRulesTextChanged"
          @keyup.enter="dismissDropdown"
        >
        <small id="rulesTextHelpBlock" class="form-text text-muted">
          Filter by rules text (e.g. flying, surveil, +1/+1, proliferate, etc.)
        </small>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-4">
        <button class="btn btn-sm btn-block btn-warning" @click="onResetFilter">Reset Filter</button>
      </div>
      <div class="col-sm-4" />
      <div class="col-sm-4">
        <button class="btn btn-sm btn-block btn-success" @click="dismissDropdown">Apply</button>
      </div>
    </div>
  </div>
  
</template>

<style>

.sealed-filter {
  padding: 15px;
  width: 400px;
  font-size: 0.8em !important;
}

#filterRulesText {
  height: auto;
  padding: 0.2rem;
}

#filterRulesTextLabel {
  margin-bottom: 0.2rem;
}

</style>