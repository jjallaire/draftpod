
<script>

import PlayerIcon from 'vue-material-design-icons/Account.vue'
import BotIcon from 'vue-material-design-icons/AccountOutline.vue'
import ColorIcon from  '@/components/core/ColorIcon.vue'
import RemoveIcon from 'vue-material-design-icons/AccountRemove.vue'

import * as messagebox from '@/components/core/messagebox.js'

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
    picks_complete: {
      type: Boolean,
      required: true
    },
  },

  computed: {
    bot_colors: function() {
      if (this.picks_complete) {
        let piles = this.player.picks.piles;
        let cards = _flatten(piles.slice(0, DECK.PILES));
        return selectors.cardColors(cards, false, 0, 2);
      } else {
        return [];
      }
    },
    current_pick: function() {
      if (!this.picks_complete) {
        let pick = this.currentPick(this.player.id);
        if (pick === 0)
          return "Done"
        else
          return "Pick " + pick;
      } else {
        return "Done";
      }
    },
  },

  methods: {
    onRemovePlayer(event){
      event.stopPropagation();
      messagebox.confirm(
        "Remove Player", 
        "Are you sure you want to remove this player from the draft? Players "+
        "cannot rejoin the draft after they have been removed.",
        () => {
          this.removePlayer({ remove_player_id: this.player.id });
        });
    }

  },

  inject: [
    'currentPick',
    'multi_player',
    'is_host_player',
    'removePlayer'
  ],

  components: {
    PlayerIcon,
    BotIcon,
    ColorIcon,
    RemoveIcon
  }
}

</script>

<template>

<div class="player">
  <div>
    <div v-if="player.id && is_host_player" class="player-remove">
      <RemoveIcon title="Remove Player from Draft" @click.native="onRemovePlayer"/>
    </div>
    <div>
      <PlayerIcon title="Player" v-if="player.id"/>
      <BotIcon title="Bot" v-else/>
    </div> 
    <div v-if="player.id" class="player-name">
      {{ player.name || "Me"}} 
      <div class="pick-number" v-if="!picks_complete">{{ current_pick }}</div>
    </div>
    <div v-else class="player-colors">
      <div v-if="!multi_player && picks_complete">
        <ColorIcon v-for="color in bot_colors" :key="color.name" :color="color" />
      </div>
      <div v-else class="player-name">
        Bot
      </div>
    </div>
  </div>
</div>

</template>


<style>

.player {
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center; 
  cursor: default;
}

.player:hover {
  border: 1px solid #aaa;
  border-radius: 5px;
}

.player-remove {
  position: absolute;
  top: 0;
  right: 10px;
  width: 15px;
  height: 15px;
  display: none;
  cursor: pointer;
}


.player:hover .player-remove {
  display: initial;
}

.player-remove .account-remove-icon svg {
  width: 15x;
  height: 15px;
  margin-top: -8px;
  color: #ee5f5b;
}

.player div div {
  text-align: center;
}

.player .pick-number {
  margin-top: -1px;
  font-size: 0.5rem;
}


.player .player-name {
  width: 90px;
  font-size: 0.7rem;
  padding: 3px;
  margin-top: -3px;
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
  margin-top: -14px;
}

.player .player-colors .color-icon:not(:last-child) {
  margin-right: 3px;
}

</style>