

<template>

<div class="navigator-panel card">
    <div class="card-header" :id="name + '-heading'">
      <h5 class="mb-0">
        <button :class="'btn btn-link ' + (show ? '' : 'collapsed')" 
                data-toggle="collapse" :data-target="'#' + name" 
                :aria-expanded="show ? 'true' : 'false'" :aria-controls="name">
          {{ caption }}
        </button>
      </h5>
    </div>

    <div :id="name" :class="'collapse ' + (show ? 'show' : '')" :aria-labelledby="name + '-heading'" 
          :data-parent="parent">
      <div class="card-body">
        <slot></slot>
      </div>
    </div>
</div>

</template>

<script>

export default {
  name: 'NavigatorPanel',
  props: {
    name: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    },
    parent: {
      type: String,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
  },

}

</script>

<style>

.navigator-panel {

}

</style>