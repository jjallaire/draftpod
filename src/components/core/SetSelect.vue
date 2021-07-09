

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
        <optgroup label="Recent">
          <option value="afr">
            Adventures in the Forgotten Realms 
          </option>
          <option value="stx">
            Strixhaven
          </option>
        </optgroup>
        <optgroup label="Standard">
          <option value="afr">
            Adventures in the Forgotten Realms 
          </option>
          <option value="stx">
            Strixhaven
          </option>
          <option value="khm">
            Kaldheim
          </option>
          <option value="znr">
            Zendikar Rising
          </option>
          <option value="m21">
            Core Set 2021
          </option>
          <option value="iko">
            Ikoria
          </option>
          <option value="thb">
            Theros Beyond Death
          </option>
          <option value="eld">
            Throne of Eldraine
          </option>
        </optgroup>
        <optgroup label="Pioneer">
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
        <optgroup label="Remastered">
          <option value="klr">
            Kaladesh Remastered
          </option>
          <option value="akr">
            Amonkhet Remastered
          </option>
        </optgroup>
        <optgroup label="More">
          <option value="isd">
            Innistrad
          </option>
          <option value="mh1">
            Modern Horizons
          </option>
          <option value="2xm">
            Double Masters
          </option>
          <option value="ust">
            Unstable
          </option>
        </optgroup>
        <optgroup label="Cubes">
          <option value="cube_vintage_2020">
            Vintage Cube (Dec 2019)
          </option>
          <option value="cube_vintage_2019">
            Vintage Cube (May 2019)
          </option>
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