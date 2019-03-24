


<script>

import * as set from '@/store/modules/draft/set/'

export default {

  name: 'PlayersSelect',

  props: {
    value: {
      type: String,
      required: true
    },
    set_code: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    }
  },

  data: function() {
    return {
      inputVal: this.value
    }
  },

  computed: {
    arena_mode_available: function() {
      if (set.capabilities(this.set_code).arena_draft &&
          this.$route && this.$route.query.arena)
        return true;
      else
        return false;
    },
    is_multi_player: function() {
      return this.inputVal.startsWith('multiple');
    }
  },

  methods: {
    onChangePlayers(event) {
      this.inputVal = event.target.value;
      this.$emit('input', this.inputVal);
    }
  }

}

</script>

<template>
  <div class="form-group row">
    <label 
      for="draft-players" 
      class="col-sm-3 col-form-label"
    >
      Players:
    </label>
    <div class="col-sm-8">
      <select 
        id="draft-players" 
        :disabled="disabled" 
        :value="inputVal" 
        class="form-control"
        @change="onChangePlayers"
      >
        <option value="single">
          Single Player
        </option>
        <option value="multiple">
          Multiple Players<span v-if="arena_mode_available"> (Paper)</span>
        </option>
        <option v-if="arena_mode_available" value="multiple-arena">
          Multiple Players (Arena)
        </option>
      </select>
      <div 
        v-if="is_multi_player" 
        class="players-multiple navigator-inline-panel card-body bg-primary"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>

#draft-players {
  background-color: rgb(236,236,236);
}

.players-multiple {
  margin-top: 8px;
}

</style>