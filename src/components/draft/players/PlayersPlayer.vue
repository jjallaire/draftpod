
<script>

import PlayerIcon from 'vue-material-design-icons/Account.vue'
import BotIcon from 'vue-material-design-icons/AccountOutline.vue'
import ColorIcon from  '@/components/core/ColorIcon.vue'
import RemoveIcon from 'vue-material-design-icons/AccountRemove.vue'

import * as messagebox from '@/components/core/messagebox.js'

import * as selectors from '@/store/modules/draft/selectors'

import { DECK } from '@/store/modules/draft/constants'

import _flatten from 'lodash/flatten'
import { mapGetters } from 'vuex';

export default {
  name: 'PlayersPlayer',

 components: {
    PlayerIcon,
    BotIcon,
    ColorIcon,
    RemoveIcon
  },

  props: {
    player: {
      type: Object,
      required: true
    },
    draft: {
      type: Object,
      required: true
    },
  },

   computed: {
    ...mapGetters({
      activePlayer: 'player' 
    }),
    set: function() {
      return this.draft.set;
    },
    options: function() {
      return selectors.draftOptions(this.draft);
    },
    table: function() {
      return this.draft.table;
    },

    is_host_player: function() {
      // get the index of the active player
      let player_index = this.draft.table.players.findIndex(
        (player) => player.id === this.activePlayer.id
      );

      // get the host index (first non-bot player)
      let host_index = this.draft.table.players.findIndex(
        (player) => player.id !== null
      );

      // check if we are the host
      return player_index === host_index;
    },
    bot_colors: function() {
      if (this.options.show_bot_colors || this.picks_complete) {
        if (this.picks_complete) {
          return selectors.orderColorPair(
            this.player.picks.colors.map(selectors.cardColorInfo)
          );
        } else {
          let piles = this.player.picks.piles;
          let cards = _flatten(piles.slice(0, DECK.PILES));
          return selectors.orderColorPair(
            selectors.cardColors(cards, false, 0, 2)
          );
        }
      } else {
        return [];
      }
    },
    picks_complete: function() {
      return this.draft.table.picks_complete;
    },
    current_pack: function() {
      return this.draft.table.current_pack;
    },
    current_pick: function() {
      if (!this.picks_complete) {
        
        // determime if the player is done with all picks
        let player_id = this.player.id;
        let playerPicksComplete = selectors.picksComplete(player_id, this.set.code, this.options, this.table);
        if (playerPicksComplete)
          return "Done";

        // determine if the player has finished the current pack
        let playerPack = selectors.currentPack(player_id, this.set.code, this.options, this.table);
        if (playerPack > this.current_pack)
          return "Done";
      
        // display pick number
        let playerPick = selectors.currentPick(player_id, this.set.code, this.options, this.table);
        return "Pick " + playerPick;
       
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
    'removePlayer'
  ],
}

</script>

<template>
  <div :class="{ player: true, 'host-player': is_host_player }">
    <div>
      <div 
        v-if="player.id" 
        class="player-remove"
      >
        <RemoveIcon 
          title="Remove Player from Draft" 
          @click.native="onRemovePlayer"
        />
      </div>
      <div>
        <PlayerIcon 
          v-if="player.id" 
          title="Player"
        />
        <BotIcon 
          v-else 
          title="Bot"
        />
      </div> 
      <div 
        v-if="player.id" 
        class="player-name"
      >
        {{ player.name || "Me" }} 
        <div 
          v-if="!picks_complete" 
          class="pick-number"
        >
          {{ current_pick }}
        </div>
      </div>
      <div 
        v-else 
        class="player-colors"
      >
        <div v-if="bot_colors.length > 0">
          <ColorIcon 
            v-for="color in bot_colors" 
            :key="color.name" 
            :color="color"
          />
        </div>
        <div 
          v-else 
          class="player-name"
        >
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
  right: 8px;
  width: 15px;
  height: 15px;
  display: none;
  cursor: pointer;
}


.host-player:hover .player-remove {
  display: initial;
}

.player-remove .account-remove-icon svg {
  width: 15x;
  height: 15px;
  margin-top: -15px;
  color: #ee5f5b;
}

.player div div {
  text-align: center;
}

.player .pick-number {
  margin-top: -1px;
  font-size: 0.6rem;
}


.player .player-name {
  width: 70px;
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