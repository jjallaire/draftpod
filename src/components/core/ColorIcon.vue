

<script>

export default {
  name: 'ColorIcon',

  props: {
    color: {
      type: Object,
      required: true
    }
  }


}

</script>


<template>
  <img 
    :src="color.img" 
    :title="color.name + ' (' + Math.round(color.percent * 100) + '%)'"
    class="color-icon"
  >
</template>

<style>


</style>
