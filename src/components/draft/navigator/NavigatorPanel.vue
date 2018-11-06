

<template>

<div class="navigator-panel card">
    <div class="card-header" :id="name + '-heading'">
      <h5 class="mb-0">
        <slot name="icon"></slot>
        <button :class="'btn btn-link ' + (collapsed ? 'collapsed' : '')" 
                data-toggle="collapse" :data-target="'#' + name" 
                :aria-expanded="collapsed ? 'false' : 'true'" :aria-controls="name">
          {{ caption }}
        </button>
      </h5>
    </div>

    <div :id="name" :class="'collapse ' + (collapsed ? '' : 'show')" :aria-labelledby="name + '-heading'" 
          :data-parent="parent">
      <div class="card-body bg-light">
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

  computed: {
    collapsed: function() {
      return this.parent && !this.show;
    }
  }

}

</script>

<style>

.navigator-panel {
  border: 0;
}

.navigator-panel .card-header {
  padding: 0;
  border: 1px solid #fff;
}

.navigator-panel .card-header h5 button {
  font-size: 0.9rem;
  width: 100%;
  text-align: left;
  text-decoration: none;
  padding: 0.5rem;
  color: #fff;
}

.navigator-panel .card-header h5 button.collapsed {
  color: #e9e9e9;
}

.navigator-panel .card-header h5 button:hover {
  text-decoration: none;
  color: #fff;
}

</style>