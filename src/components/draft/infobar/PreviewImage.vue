<script>

export default {
  name: 'PreviewImage',

  props: {
    card_preview: {
      type: String,
      required: true
    },
    card_layout: {
      type: String,
      default: "normal"
    }
  },
}

</script>

<template>
  <div :class="{ 'card-viewer': true, 'layout-split': card_layout === 'split'}">
    <img :src="card_preview">
  </div>
</template>


<style>

.card-viewer {
  width: 100%;  
  margin-bottom: 4px;
}

.card-viewer.layout-split {
  transform: rotate(90deg); 
  transform-origin: left top; 
  margin-left: 100%;
}

.card-viewer img {
  width: 100%;
  height: auto;
}

</style>