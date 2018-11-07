<template>

<div class="mtgdraft-cardview">
  <img :src="preview_image" />
</div>

</template>


<script>

export default {
  name: 'PreviewImage',

  props: {
    preview_image: {
      type: String,
      required: true
    }
  },
}

</script>


<style>

.mtgdraft-cardview {
  width: 100%;  
  margin-bottom: 4px;
}

.mtgdraft-cardview img {
  width: 100%;
  height: auto;
}

</style>