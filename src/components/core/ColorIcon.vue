

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

<img class="color-icon" :src="color.img"
     :title="color.name + ' (' + Math.round(color.percent * 100) + '%)'"/>

</template>

<style>


</style>
