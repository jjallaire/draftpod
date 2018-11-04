

<template>

  <span class="mtgdraft-pack-timer badge badge-secondary text-light">0:43</span>

</template>

<script>

export default {
  name: 'PackTimer',
  props: {
    player: {
      type: Number,
      required: true
    }
  },
}

</script>

<style>


</style>