
<script>

import NavBar from '@/components/core/NavBar.vue'

import ContentPanel from '@/components/core/ContentPanel.vue'
import SelectSet from '@/components/draft/core/SelectSet.vue'
import SelectCardpool from '@/components/draft/core/SelectCardpool.vue'


export default {
  name: 'SimulatorPage',

  data: function() {
    return {
      set_code: 'grn',
      cardpool: '4/3/2/1',
    }
  },


  components: { NavBar, ContentPanel, SelectSet, SelectCardpool }
}


</script>


<template>

  <div>

  <NavBar /> 

  <div class="container">
    
    <ContentPanel caption="Simulate Drafts">
      <form>
        <SelectSet v-model="set_code" />
        <SelectCardpool v-model="cardpool" />
      </form>
    </ContentPanel>
  </div>

  </div>


</template>

<style>

</style>