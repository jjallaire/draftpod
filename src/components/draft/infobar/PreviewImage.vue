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
  <div :class="{ 'card-viewer': true }">
    <img :src="card_preview" draggable="false">
  </div>
</template>


<style>

.card-viewer {
  width: 100%;  
  margin-bottom: 4px;
}


.card-viewer img {
  width: 100%;
  height: auto;
}

</style>