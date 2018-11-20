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

  <div class="mtgdraft-cardview">
    <img :src="card_preview" />
  </div>

</template>


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