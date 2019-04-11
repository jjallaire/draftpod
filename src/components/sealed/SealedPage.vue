
<script>

import NavBar from '@/components/core/NavBar.vue'

import ContentPanel from '@/components/core/ContentPanel.vue'
import SetSelect from '@/components/core/SetSelect.vue'
import CardpoolSelect from '@/components/core/cardpool/CardpoolSelect'

import { CARDPOOL } from '@/store/constants'

import { generateCardpool } from '@/components/core/cardpool/generate.js'

import { mapGetters } from 'vuex'

export default {
  name: 'SealedPage',

  components: { NavBar, ContentPanel, SetSelect, CardpoolSelect },

  data: function() {
    return {
      set_code: 'rna',
      cardpool: CARDPOOL.CUBE + '4/2/1/1',
      number_of_pools: 2,
      packs_per_pool: 6,
      pools: []
    }
  },

  computed: {
     ...mapGetters([
      'cardpool_options'
    ]),
  },

  methods: {

    onCardpoolInput(value) {
      this.cardpool = value;
    },

    onGeneratePools() {

      generateCardpool(this.set_code, this.cardpool)
        .then(cardpool => {

        });
      


    }
  },

}


</script>


<template>
  <div>
    <NavBar /> 

    <div class="sealed-page container">
      <ContentPanel caption="Sealed Pool">
        <form>
          <SetSelect v-model="set_code" />
          <CardpoolSelect 
            :disabled="false" 
            :value="cardpool" 
            :options="cardpool_options(set_code)"
            :set_code="set_code"
            @input="onCardpoolInput" 
          />
          <div class="form-group row">
            <label 
              for="number-of-pools" 
              class="col-sm-3 col-form-label"
            >
              Number of pools:
            </label>
            <div class="col-sm-8">
              <input 
                id="number-of-pools" 
                v-model.number="number_of_pools" 
                class="form-control" 
                type="number" 
                min="1"
              >
            </div>
          </div>
          <div class="form-group row">
            <label 
              for="packs-per-pool" 
              class="col-sm-3 col-form-label"
            >
              Packs per pool:
            </label>
            <div class="col-sm-8">
              <input 
                id="packs-per-pool" 
                v-model.number="packs_per_pool" 
                class="form-control" 
                type="number" 
                min="1"
              >
            </div>
          </div>
          <br>
          <div class="form-group row">
            <div class="col-sm-3">
              <button 
                type="button" 
                class="btn btn-success" 
                @click="onGeneratePools"
              >
                Generate Pools
              </button>
            </div>
          </div>
        </form>
      </ContentPanel>

      <ContentPanel v-if="pools.length > 0" caption="Sealed Pools">
        Pools
      </ContentPanel>
    </div>
  </div>
</template>

<style>

.sealed-page .form-control[type="number"] {
  width: 50%;
}

</style>