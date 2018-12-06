

<script>

export default {
  name: 'SelectSet',

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

  watch: {
    inputVal(val) {
      this.$emit('input', val);
    }
  },
}

</script>

<template>

<div class="form-group row">
  <label for="draft-set" class="col-sm-3 col-form-label">Draft from:</label>
  <div class="col-sm-8">
    <select id="draft-set" class="form-control" v-model="inputVal">
      <option value="grn">Guilds of Ravnica</option>
      <option value="m19">Core Set 2019</option>
      <option value="dom">Dominaria</option>
    </select>
  </div>
</div>

</template>

<style>


</style>