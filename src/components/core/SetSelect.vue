

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
          <option value="woe">
            Wilds of Eldraine
          </option>
          <option value="mom">
            March of the Machine
          </option>
          <option value="one">
            Phyrexia: All Will Be One
          </option>
          <option value="bro">
            The Brothers' War
          </option>
          <option value="dmu">
            Dominaria United
          </option>
          <option value="snc">
            Streets of New Capenna
          </option>
          <option value="neo">
            Kamigawa: Neon Dynasty
          </option>
          <option value="vow">
            Innistrad: Crimson Vow 
          </option>
          <option value="mid">
            Innistrad: Midnight Hunt 
          </option>
        </optgroup>
        <optgroup label="Pioneer">
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
      </select>
    </div>
  </div>
</template>

<style>


</style>