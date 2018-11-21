<script>

export default {
  name: 'PreviewImage',

  props: {
    card_preview: {
      type: String,
      required: true
    },
  },
}

</script>

<template>

  <div class="card-viewer">
    <img :src="card_preview" />
  </div>

</template>


<style>

.draftpod .draft-page .card-viewer {
  width: 100%;  
  margin-bottom: 4px;
}

.draftpod .draft-page .card-viewer img {
  width: 100%;
  height: auto;
}

</style>