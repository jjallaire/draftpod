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
  <div class="players-column">
    <PlayersPlayer />
    <PlayersPlayer />
    <PlayersPlayer />
    <PlayersPlayer />
  </div>
  <div class="players-table">
    
  </div>
  <div class="players-column">
    <PlayersPlayer />
    <PlayersPlayer />
    <PlayersPlayer />
    <PlayersPlayer />
  </div>
  
</div>

</template>


<style>

.players {
  display: table;
  width: 340px;
}


.players-table {
  width: 200px;
  display: table-cell;
  background-color: pink;
}

.players-column {

  width: 70px;
  display: table-cell;
}


</style>