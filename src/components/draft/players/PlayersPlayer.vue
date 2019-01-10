
<script>

import PlayerIcon from 'vue-material-design-icons/Account.vue'
import BotIcon from 'vue-material-design-icons/AccountOutline.vue'

export default {
  name: 'PlayersPlayer',

  props: {
    player: {
      type: Object,
      required: true
    }
  },

  components: {
    PlayerIcon,
    BotIcon
  }
}

</script>

<template>

<div class="player">
  <div>
    <div>
      <PlayerIcon title="Player" v-if="player.id"/>
      <BotIcon title="Bot" v-else/>
    </div> 
    <div v-if="player.id" class="player-name">
      {{ player.name || "Me"}}
    </div>
    <div v-else class="player-name">
      Bot
    </div>
  </div>
</div>

</template>


<style>

.player {
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center; 
}

.player div div {
  text-align: center;
}



.player .player-name {
  width: 100%;
  font-size: 0.7rem;
  padding: 3px;
  padding-top: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

</style>