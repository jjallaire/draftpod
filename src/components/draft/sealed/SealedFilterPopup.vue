<script>

import * as filters from '@/store/modules/draft/card-filters'

export default {
  name: 'SealedFilterPopup',

  components: {
   
  },

  props: {
   
  },

  
  computed: {

   
  },

  methods: {
   
    updateFilter() {
      this.$emit('changed', filters.creature)
    }

  },


}

</script>

<template>
  <div class="sealed-filter">
    <button @click="updateFilter" />
  </div>
  
</template>

<style>

.sealed-filter {
  width: 310px;
  height: 290px;
}

</style>