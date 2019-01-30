
<script>


import PersonIcon from 'vue-material-design-icons/Account.vue'

export default {
  name: 'MultiplayerPlayers',

  components: { 
    PersonIcon
  },

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
    <div 
      id="multiplayer-draft-players" 
      class="card-body bg-light">
      <div 
        v-for="(player, index) in players" 
        :key="index">
        <PersonIcon /> <span>{{ player }}</span>
      </div>
    </div>
  </div> 

</template>


<style>

#multiplayer-draft-players {
  position: relative;
  overflow-y: scroll;
}

#multiplayer-draft-players span {
  vertical-align: middle;
  color: #52575C;
  margin-right: 5px;
}

#multiplayer-draft-players .material-design-icon svg {
  padding-bottom: 2px;
}

</style>


