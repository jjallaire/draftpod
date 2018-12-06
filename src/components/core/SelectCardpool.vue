

<script>

export default {
  name: 'SelectCardpool',

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
  <label for="draft-cardpool" class="col-sm-3 col-form-label">Cardpool:</label>
  <div class="col-sm-8">
    <select id="draft-cardpool" class="form-control" v-model="inputVal">
      <option value="4/3/2/1">4x Common, 3x Uncommon, 2x Rare, 1x Mythic</option>
      <option value="3/2/1/1">3x Common, 2x Uncommon, 1x Rare, 1x Mythic</option>
      <option value="4/4/0/0">4x Common, 4x Uncommon</option>
    </select>
  </div>
</div>

</template>

<style>


</style>