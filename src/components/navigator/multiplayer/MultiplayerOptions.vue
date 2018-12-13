

<script>

export default {
  name: 'MultiplayerOptions',

  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: function() {
    return {
      inputVal: this.value
    }
  },

  methods: {
    onNameChanged(event) {
      this.inputVal.player_name = event.target.value.trim();
      this.$emit('input', this.inputVal);
    }
  },
  
}

</script>


<template>

<div>

<div class="form-group">
  <label for="multiplayer-draft-name">Host player:</label>
  <input class="form-control" id="multiplayer-draft-name" placeholder="Enter your name" 
         :value="inputVal.player_name" @input="onNameChanged" ref="name"/>
</div>

{{ value.draft_id }}
</div>

</template>


<style>

</style>

