
<script>

import PlayerIcon from 'vue-material-design-icons/Account.vue'
import BotIcon from 'vue-material-design-icons/AccountOutline.vue'
import ColorIcon from  '@/components/core/ColorIcon.vue'

import * as selectors from '@/store/modules/draft/selectors'

import { DECK } from '@/store/modules/draft/constants'

import _flatten from 'lodash/flatten'

export default {
  name: 'PlayersPlayer',

  props: {
    player: {
      type: Object,
      required: true
    },
    show_bot_colors: {
      type: Boolean,
      required: true
    }
  },
  
  computed: {
    bot_colors: function() {
      if (this.show_bot_colors) {
        let piles = this.player.picks.piles;
        let cards = _flatten(piles.slice(0, DECK.PILES));
        return selectors.cardColors(cards, false, 0, 2);
      } else {
        return [];
      }
    },
  },

  components: {
    PlayerIcon,
    BotIcon,
    ColorIcon
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
    <div v-else class="player-colors">
      <span v-if="show_bot_colors">
        <ColorIcon v-for="color in bot_colors" :key="color.name" :color="color" />
      </span>
      <span v-else class="player-name">
        Bot
      </span>
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

.player .player-colors {
  width: 100%;
}

.player .player-colors .color-icon {
  width: 12px;
  height: auto;
  margin-top: -10px;
}

.player .player-colors .color-icon:not(:last-child) {
  margin-right: 3px;
}

</style>