

<template>

<NavigatorPanel name="recent-drafts" caption="Recent Drafts" :parent="parent" :show="show">
  <template slot="icon"><HistoryIcon /></template>

  Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry 
  richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor 
  brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, 
  sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch
  et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
  sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat 
  craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
  heard of them accusamus labore sustainable VHS.
</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'

import HistoryIcon from "vue-material-design-icons/History.vue"

export default {
  name: 'NavigatorRecent',

  props: {
    parent: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    }
  },

  components: {
    NavigatorPanel, HistoryIcon
  }

}

</script>

<style>

</style>