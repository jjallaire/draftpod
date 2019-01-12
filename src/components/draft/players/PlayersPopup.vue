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
    draft: {
      type: Object,
      required: true
    },
  },

  computed: {
    set: function() {
      return this.draft.set;
    },
    table: function() {
      return this.draft.table;
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
      currentPick: this.currentPick,
      multi_player: this.draft.options.multi_player
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
  width: 370px;
  height: 340px;
}

.player {
  height: 80px;
}

.players-table {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 100px;
  width: 170px;
  border: 5px solid #aaa;
  border-radius: 15px;
}

.players-column {
  position: absolute;
  top: 10px;
  bottom: 10px;
  width: 90px;
}

.players-column-left {
  left: 5px;
}

.players-column-right {
  right: 5px;
}

</style>