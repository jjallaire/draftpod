

<template>

<NavigatorPanel name="resume-draft" caption="Draft in Progress" :parent="parent" :show="show">
    <template slot="icon"><RotateRight/></template>
    <div class="form-group row">
      <div class="col-sm-10">
      Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry 
      richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor 
      brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, 
      sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch
      et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt
      sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat 
      craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't
      heard of them accusamus labore sustainable VHS.
      </div>
    </div>
    <br/>
    <div class="form-group row">
      <div class="col-sm-10">
        <button type="button" class="btn btn-warning">Resume Draft</button>
      </div>
    </div>
</NavigatorPanel>

</template>

<script>

import NavigatorPanel from './NavigatorPanel.vue'

import RotateRight from "vue-material-design-icons/RotateRight.vue"

export default {
  name: 'NavigatorResume',

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
    NavigatorPanel, RotateRight
  }

}

</script>

<style>

</style>