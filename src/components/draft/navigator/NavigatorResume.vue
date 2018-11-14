

<template>

<NavigatorPanel name="resume-draft" caption="Draft in Progress" :parent="parent" :show="show">
    <template slot="icon"><RotateRight/></template>
    <div class="form-group row">
      <div class="col-sm-10">
      {{ draft.id }} <br/>
      {{ draft.set_name }}
      </div>
    </div>
    <br/>
    <div class="form-group row">
      <div class="col-sm-10">
        <button type="button" class="btn btn-warning" @click="onResumeDraft">Resume Draft</button>
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
    },
    draft: {
      type: Object,
      required: true
    }
  },

  methods: {
    onResumeDraft: function() {
      this.$router.push("/draft/" + this.draft.id);
    }
  },

  components: {
    NavigatorPanel, RotateRight
  }

}

</script>

<style>

</style>