

<script>

export default {
  name: 'SetSelect',

  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
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
  <label for="draft-set" class="col-sm-3 col-form-label">Set:</label>
  <div class="col-sm-8">
    <select :disabled="disabled" id="draft-set" class="form-control" v-model="inputVal">
      <option value="rna">Ravnica Allegiance</option>
      <option value="grn">Guilds of Ravnica</option>
      <option value="m19">Core Set 2019</option>
      <option value="dom">Dominaria</option>
      <option value="ust">Unstable</option>
      <option value="mma">Modern Masters</option>
      <option value="isd">Innistrad</option>
    </select>
  </div>
</div>

</template>

<style>


</style>