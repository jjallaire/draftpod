


<script>

export default {

  name: 'PlayersSelect',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      inputVal: this.value
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
  <label for="draft-players" class="col-sm-3 col-form-label">Players:</label>
  <div class="col-sm-8">
    <select id="draft-players" class="form-control" :value="inputVal"
            @change="onChangePlayers">
      <option value="single">Single Player</option>
      <option value="single">Multiple Players</option>
    </select>
    <div>
      
     <!-- Optional multi-player UI -->

    </div>
  </div>
</div>


</template>

<style>

</style>