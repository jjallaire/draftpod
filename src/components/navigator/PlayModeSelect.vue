


<script>

export default {
  name: 'PlayModeSelect',

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
      for="draft-play-mode" 
      class="col-sm-3 col-form-label"
    >
      Play mode:
    </label>
    <div class="col-sm-8">
      <select 
        id="draft-play-mode" 
        v-model="inputVal" 
        :disabled="disabled" 
        class="form-control"
      >
        <option value="paper">
          Paper Cube
        </option>
        <option value="arena">
          Arena
        </option>
      </select>
      <small v-if="inputVal === 'arena'" id="arena-playmode-note" class="form-text text-muted">
        <p>
          Arena play mode enables you to draft decks that can be used in an Arena 
          <a href="https://mtgarena-support.wizards.com/hc/en-us/articles/360001447063-Direct-Challenge-FAQ" target="_blank">Direct Challenge</a>.
          Since this requires a 60 card deck, you will draft 5 packs rather than the normal 3. Note also that
          you will need a fairly complete playset of Arena cards (plus wildcards to fill in the gaps) to use
          this feature.
        </p>
      </small>
    </div>
  </div>
</template>

<style>

#arena-playmode-note {
  margin-top: 10px;
}

</style>