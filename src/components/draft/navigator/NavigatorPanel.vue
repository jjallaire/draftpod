
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

<template>

  <div class="navigator-panel card">
    <div class="card-header" :id="name + '-heading'">
      <h5 class="mb-0">
        <slot name="icon"></slot>
        <button class="btn btn-link" :class="{ collapsed: collapsed }" 
                :data-toggle="parent ? collapse : null" :data-target="'#' + name" 
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

<style>

.navigator-panel {
  border: 0;
}

.navigator-panel .card-header {
  padding: 0;
  border: 1px solid #fff;
  background: #757F9A;  /* fallback for old browsers */
  background-image: linear-gradient(to left, rgb(174, 182, 197), #757F9A);
  background-repeat: no-repeat;
  background-color: transparent;
}

.navigator-panel .card-header .material-design-icon {
  color: #fff;
  width: 20px;
  padding-left: 0.4rem;
}

.navigator-panel .card-header h5 button {
  font-size: 0.9rem;
  text-align: left;
  text-decoration: none;
  padding: 0.5rem;
  padding-left: 0.4rem;
  color: #fff;
}

.navigator-panel .card-header h5 button.collapsed {
  color: #e9e9e9;
}

.navigator-panel .card-header h5 button:hover {
  text-decoration: none;
  color: #fff;
}

.navigator-panel .card-body {
  background-image: linear-gradient(to top, #e6e9f0 0%, #eef1f5 100%);
  background-repeat: no-repeat;
  background-color: transparent;
  padding-left: 2rem;
  padding-top: 20px;
  padding-bottom: 20px;
}

.navigator-panel .card-body button {
  min-width: 140px;
}

</style>