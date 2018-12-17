
<script>


export default {
  name: 'MultiplayerPlayers',

  props: {
    players: {
      type: Array,
      required: true
    },
  },

}

</script>


<template>
  
<div class="multiplayer-players form-group">
  <label for="multiplayer-draft-players">Players:</label>
  <div id="multiplayer-draft-players" class="card-body bg-light">
    <span v-for="(player, index) in players" :key="index">
      {{  player }} <br/>
    </span>
  </div>
</div> 

</template>


<style>

.multiplayer-draft-players {
  position: relative;
  overflow-y: scroll;
}

</style>


