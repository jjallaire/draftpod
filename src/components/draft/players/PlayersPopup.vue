<script>

import PlayersPlayer from './PlayersPlayer.vue'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'PlayersPopup',

  props: {
    players: {
      type: Array,
      required: true
    },
    set: {
      type: Object,
      required: true
    },
    table: {
      type: Object,
      required: true
    }
  },

  methods: {
    currentPick(player_id) {
      if (selectors.picksComplete(player_id, this.set.code, this.table))
        return 0;
      else
        return selectors.currentPick(player_id, this.set.code, this.table);
    }
  },

  provide: function() {
    return {
      currentPick: this.currentPick
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
    <PlayersPlayer :player="players[0]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[1]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[2]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[3]" :picks_complete="table.picks_complete"/>
  </div>

  <div class="players-table">
    
  </div>
  <div class="players-column players-column-right">
    <PlayersPlayer :player="players[7]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[6]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[5]" :picks_complete="table.picks_complete"/>
    <PlayersPlayer :player="players[4]" :picks_complete="table.picks_complete"/>
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