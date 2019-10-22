

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
    <label 
      for="draft-set" 
      class="col-sm-3 col-form-label"
    >
      Set:
    </label>
    <div class="col-sm-8">
      <select 
        id="draft-set" 
        v-model="inputVal" 
        :disabled="disabled" 
        class="form-control"
      >
        <optgroup label="Standard">
          <option value="eld">
            Throne of Eldraine
          </option>
          <option value="m20">
            Core Set 2020
          </option>
          <option value="war">
            War of the Spark
          </option>
          <option value="rna">
            Ravnica Allegiance
          </option>
          <option value="grn">
            Guilds of Ravnica
          </option>
        </optgroup>
        <optgroup label="Pioneer">
          <option value="m19">
            Core Set 2019
          </option>
          <option value="dom">
            Dominaria
          </option>
          <option value="rix">
            Rivals of Ixalan
          </option>
          <option value="xln">
            Ixalan
          </option>
          <option value="hou">
            Hour of Devastation
          </option>
          <option value="akh">
            Amonkhet
          </option>
          <option value="aer">
            Aether Revolt
          </option>
          <option value="kld">
            Kaladesh
          </option>
          <option value="ktk">
            Khans of Tarkir
          </option>
        </optgroup>
        <optgroup label="More">
          <option value="isd">
            Innistrad
          </option>
          <option value="mh1">
            Modern Horizons
          </option>
          <option value="ust">
            Unstable
          </option>
        </optgroup>
        <optgroup label="Cubes">
          <option value="cube_gnt">
            Game Night Cube
          </option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<style>


</style>