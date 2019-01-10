<script>

export default {
  name: 'PlayersPopup',

  props: {
    players: {
      type: Array,
      required: true
    }
  }
}

</script>

<template>

<div>
  <div v-for="(player, index) in players" :key="index">
    {{ player.id }}
  </div>
</div>

</template>


<style>

</style>