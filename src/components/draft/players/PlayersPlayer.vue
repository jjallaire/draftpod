
<script>

import PlayerIcon from 'vue-material-design-icons/Account.vue'

export default {
  name: 'PlayersPlayer',

  props: {
    player: {
      type: Object,
      default: null
    }
  },

  components: {
    PlayerIcon
  }
}

</script>

<template>

<div class="player">
  <div><PlayerIcon /></div> 
  <div class="player-name"> the </div>
</div>

</template>


<style>

.player {
  border: 1px solid red;
}

.player div {
  text-align: center;
}

.player .player-name {
  width: 100%;
  text-overflow: ellipsis;
}

</style>