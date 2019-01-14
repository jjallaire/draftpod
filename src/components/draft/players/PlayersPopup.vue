<script>

import PlayersPlayer from './PlayersPlayer.vue'

export default {
  name: 'PlayersPopup',

  props: {
    draft: {
      type: Object,
      required: true
    },
  },

  
  computed: {

    current_pack: function() {
      return this.draft.table.current_pack;
    },
    picks_complete: function() {
      return this.draft.table.picks_complete;
    },
    players: function() {
      return this.draft.table.players;
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
    <PlayersPlayer :player="players[0]" :draft="draft"/>
    <PlayersPlayer :player="players[1]" :draft="draft"/>
    <PlayersPlayer :player="players[2]" :draft="draft"/>
    <PlayersPlayer :player="players[3]" :draft="draft"/>
  </div>

  <div class="players-table">
    <div v-if="!picks_complete" class="pack-number">
      Pack {{ current_pack }}
    </div>
  </div>

  <div class="players-column players-column-right">
    <PlayersPlayer :player="players[7]" :draft="draft"/>
    <PlayersPlayer :player="players[6]" :draft="draft"/>
    <PlayersPlayer :player="players[5]" :draft="draft"/>
    <PlayersPlayer :player="players[4]" :draft="draft"/>
  </div>
  
</div>

</template>

<style>

.players {
  width: 310px;
  height: 290px;
}

.players-menu {
  margin-top: 1px;
}

.player {
  height: 70px;
}

.players-table {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 80px;
  width: 150px;
  border: 5px solid #aaa;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.players-table .pack-number {
  font-size: 1.1em;
  font-weight: 500;
  color: rgba(255,255,255,0.4);
  padding-bottom: 20px;

}

.players-column {
  position: absolute;
  top: 5px;
  bottom: 5px;
  width: 70px;
}

.players-column-left {
  left: 5px;
}

.players-column-right {
  right: 5px;
}

</style>