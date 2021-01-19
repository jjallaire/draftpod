<script>

export default {
  name: 'PreviewImage',

  props: {
    card_preview: {
      type: String,
      required: true
    },
    dual_faced: {
      type: Boolean,
      default: false
    }
  },
}

</script>

<template>
  <div :class="{ 'card-viewer': true, 'dual-faced': dual_faced }">
    <img :src="card_preview" draggable="false">
  </div>
</template>


<style>

.card-viewer {
  width: 100%;  
  display: inline-block;
  margin-bottom: 4px;
}

.card-viewer.dual-faced {
  width: 50%;  
}


.card-viewer img {
  width: 100%;
  height: auto;
}

</style>