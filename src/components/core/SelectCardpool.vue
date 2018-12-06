

<script>

import { SET_CARDPOOL, REMOVE_CARDPOOL } from '@/store/mutations'

import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'SelectCardpool',

  props: {
    value: {
      type: String,
      required: true
    },
    set_code: {
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

  computed: {
    ...mapGetters([
      'cardpool',
      'cardpools'
    ])
  },

  methods: {
    ...mapMutations({
      setCardpool: SET_CARDPOOL,
      removeCardpool: REMOVE_CARDPOOL
    })
  }
}

</script>

<template>

<div class="form-group row">
  <label for="draft-cardpool" class="col-sm-3 col-form-label">Cardpool:</label>
  <div class="col-sm-8">
    <select id="draft-cardpool" class="form-control" v-model="inputVal">
      <optgroup label="Set Cube">
        <option value="4/4/1/1">4x Common, 4x Uncommon, 1x Rare, 1x Mythic</option>
        <option value="4/4/2/1">4x Common, 4x Uncommon, 2x Rare, 1x Mythic</option>
        <option value="3/2/1/1">3x Common, 2x Uncommon, 1x Rare, 1x Mythic</option>
        <option value="4/4/0/0">4x Common, 4x Uncommon</option>
      </optgroup>
      <optgroup label="Custom">
        <option v-for="cardpool in cardpools(set_code)" :key="cardpool.name"
                :value="'cardpool:' + cardpool.name">{{ cardpool.name }}</option>
        <option value="new-cardpool">Create Cardpool...</option>
      </optgroup>
    </select>
    <div>
      <div class="custom-cardpool">
        <div class="card-body bg-primary" v-if="inputVal === 'new-cardpool'">
          <div class="form-group">
            <label for="custom-cardpool-name">Cardpool name:</label>
            <input class="form-control" id="custom-cardpool-name" placeholder="Enter name">
          </div>
          <div class="form-group">
            <label for="custom-cardpool-upload">Upload Cardpool CSV:</label>
            <input type="file" class="form-control cardpool-upload" aria-describedby="custom-cardpool-upload-help" id="custom-cardpool-upload"
                   accept="text/csv" />
            <small id="custom-cardpool-upload-help" class="form-text text-muted">
              Please upload a CSV file that enumerates the cards in your cardpool. 
              The CSV should include an <em>id</em> field (Multiverse ID) and a <em>quantity</em>
              field indicating how many of each card are in the pool. The most straightforward way 
              to do this is to create a <a href="http://www.deckedbuilder.com" target="_blank">Decked Builder</a> 
              collection and export it as a CSV.
            </small>
          </div>
        </div>
        <div v-else-if="inputVal.startsWith('cardpool:')">
          Custom
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style>

.custom-cardpool {
  margin-top: 20px;
  margin-bottom: 20px;
}

.cardpool-upload {
  background: transparent;
  border: 0;
}

.form-text.text-muted a {
  color: #cbd3da !important;
  text-decoration: none;
}

.form-text.text-muted a:hover {
  text-decoration: underline;
}




</style>