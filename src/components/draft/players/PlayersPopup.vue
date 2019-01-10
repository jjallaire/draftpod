<script>

import PlayersPlayer from './PlayersPlayer.vue'

export default {
  name: 'PlayersPopup',

  props: {
    players: {
      type: Array,
      required: true
    }
  },

  components: {
    PlayersPlayer
  }
}

</script>

<template>

<div class="players">
  <div class="players-column players-column-left">
    <PlayersPlayer :player="players[0]" />
    <PlayersPlayer :player="players[1]"/>
    <PlayersPlayer :player="players[2]"/>
    <PlayersPlayer :player="players[3]"/>
  </div>

  <div class="players-table">
    
  </div>
  <div class="players-column players-column-right">
    <PlayersPlayer :player="players[7]"/>
    <PlayersPlayer :player="players[6]"/>
    <PlayersPlayer :player="players[5]"/>
    <PlayersPlayer :player="players[4]"/>
  </div>
  
</div>

</template>


<style>

.players {
  width: 300px;
  height: 260px;
}


.players-table {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 80px;
  width: 140px;
  border: 5px solid #aaa;
  border-radius: 15px;
}

.players-column {
  position: absolute;
  top: 10px;
  bottom: 10px;
  width: 80px;
}

.players-column-left {
  left: 0;
}

.players-column-right {
  right: 0;
}


</style>