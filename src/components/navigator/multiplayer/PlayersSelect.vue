


<script>

export default {

  name: 'PlayersSelect',

  props: {
    value: {
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
    is_multi_player: function() {
      return this.inputVal === 'multiple';
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
      class="col-sm-3 col-form-label">Players:</label>
    <div class="col-sm-8">
      <select 
        id="draft-players" 
        :disabled="disabled" 
        :value="inputVal" 
        class="form-control"
        @change="onChangePlayers">
        <option value="single">Single Player</option>
        <option value="multiple">Multiple Players</option>
      </select>
      <div 
        v-if="is_multi_player" 
        class="players-multiple navigator-inline-panel card-body bg-primary">
        <slot/>
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