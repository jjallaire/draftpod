<script>

import * as filters from '@/store/modules/draft/card-filters'

import * as utils from '@/components/core/utils'

import jquery from 'jquery'

import { mapState, mapMutations } from 'vuex'

import { UPDATE_PREFERENCES } from '@/store/mutations'

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

    ...mapState([
      'preferences'
    ]),

    sealed_filter: function() {
      
      if (this.haveFilter()) {
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
      } else {
        return null;
      }
     
    },

    dropdown: function() {
      return jquery(this.$el).closest('.dropdown');
    },

    show_selected: {
      get: function() {
        return this.preferences.sealed_show_selected;
      },
      set: function(value) {
        this.updatePreferences({
          sealed_show_selected: value
        })
      }
    }
  },

  mounted() {
    this.dropdown.on('show.bs.dropdown', () => {
      this.focusRulesText();
    });
  },

  methods: {

    ...mapMutations({
      updatePreferences: UPDATE_PREFERENCES
    }),

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
      this.focusRulesText();
    },

    haveFilter() {
      let haveFilter = this.rules_text !== '';
      Object.keys(this.filters).forEach(group => {
        this.filters[group].forEach(filter => {
          if (!filter.value)
            haveFilter = true;
        });
      });
      return haveFilter;
    },

    onRulesTextChanged(event) {
      this.rules_text = event.target.value.trim().toLowerCase();
      this.updateFilter();
    },

    focusRulesText() {
      let rulesText = this.$refs.rulesText;
      if (rulesText)
        utils.focus(rulesText);
    },

    dismissDropdown() {
      this.dropdown.dropdown("toggle");
    }
  },


}

</script>



<template>
  <div class="sealed-filter">
    <div class="row">
      <div class="form-group col-sm-12">
        <label id="filterRulesTextLabel" for="filterRulesText"><strong>Rules text</strong></label>
        <input 
          id="filterRulesText" 
          ref="rulesText"
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
    <div class="row option-row">
      <div class="form-group col-sm-10">
        <div class="form-check">
          <input id="showSelectedCheckbox" v-model="show_selected" class="form-check-input" type="checkbox">
          <label class="form-check-label" for="showSelectedCheckbox">Include deck cards in sealed pool view</label>
          <small class="form-text checkbox-text text-muted">
            See which of the cards in your pool are already in your deck
            (deck cards are displayed with a check mark).  </small>
        </div>
      </div>
    </div>
    <div class="row button-row">
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

.sealed-filter .form-group {
  margin-bottom: 0.7rem;
}

.sealed-filter .option-row {
  margin-top: 7px;
}

.sealed-filter .button-row {
  margin-top: 10px;
}

.sealed-filter .checkbox-text {
  margin-top: 0px;
}

#filterRulesText {
  height: auto;
  padding: 0.2rem;
}

#filterRulesTextLabel {
  margin-bottom: 0.2rem;
}

</style>