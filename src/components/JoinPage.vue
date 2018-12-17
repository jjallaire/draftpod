<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'
import MultiplayerPlayers from './core/MultiplayerPlayers.vue'

import { mapState, mapGetters, mapMutations } from 'vuex'

// eslint-disable-next-line 
import { store } from '@/store'
import { SET_PLAYER_INFO } from '@/store/mutations'
import { JOIN_DRAFT, WRITE_TABLE } from '@/store/modules/draft/mutations'

import * as utils from './core/utils'
import * as selectors from '@/store/modules/draft/selectors'
import * as messagebox from '@/components/core/messagebox'
import firestore from '@/store/modules/draft/firestore'

import { CirclesToRhombusesSpinner } from 'epic-spinners'

const NS_DRAFTS = "drafts";

export default {
  name: 'JoinPage',

  props: {
    draft_id: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      player_name: '',
      firestoreUnsubscribe: null
    }
  },

  created() {
    this.player_name = this.player.name;

    if (this.is_available) {
      this.firestoreUnsubscribe = firestore.onDraftTableChanged(this.draft_id, table => {
        if (selectors.isStarted(table))
          this.$router.push({ path: "/draft/" +  this.draft_id });
        else
          this.writeTable({ table });
      });
    }
  },

  mounted() {
    if (this.is_available)
      utils.focus(this.$refs.playerName);
  },

  beforeDestroy() {
    if (this.firestoreUnsubscribe)
      this.firestoreUnsubscribe();
  },

  computed: {
    ...mapState({
      draft: function(state) {
        return state[NS_DRAFTS][this.draft_id];
      },
    }),
    ...mapGetters([
      'player'
    ]),

    host_player: function() {
      return selectors.hostPlayerName(this.draft.table);
    },

    set_name: function() {
      return this.draft.set.name;
    },

    is_started: function() {
      return this.draft.table.start_time !== null;
    },

    is_full: function() {
      return !this.is_joined &&  (this.multi_players.length >= 8);
    },

    is_available: function() {
      return !this.is_full && !this.is_started;
    },

    is_joined: function() {
      return selectors.activePlayer(this.player.id, this.draft.table) !== undefined;
    },

    namespace: function() {
      return NS_DRAFTS + '/' + this.draft_id;
    },

    multi_players: function() {
      return selectors.allPlayerNames(this.draft.table);
    }
  },

  methods: {
    ...mapMutations({
      joinDraft(dispatch, payload) {
        return dispatch(this.namespace+ '/' + JOIN_DRAFT, payload);
      },
      writeTable(dispatch, payload) {
        return dispatch(this.namespace + '/' + WRITE_TABLE, payload);
      },
      setPlayerInfo: SET_PLAYER_INFO
    }),

    onJoinDraft() {

      // get the player name
      let player_name = this.player_name.trim();

      // ensure we have a name
      if (player_name.length === 0) {
        messagebox.alert(
          "Please enter the name you want to be identified by during the draft.",
          () => { utils.focus(this.$refs.playerName); });
        return false;
      }

      // join the draft
      this.joinDraft({
        id: this.player.id,
        name: player_name
      });
     
      // update the player info for future drafts
      this.setPlayerInfo({
        name: player_name
      });
     
  
    },
    
  },

  components: {
    NavBar, SiteFooter, MultiplayerPlayers, CirclesToRhombusesSpinner
  }
}


</script>

<template>
 
  <div>
    
  <NavBar />

  <div class="container">

  <div class="join-content">

  <div class="row">

  <div class="col-sm-8 offset-sm-2">

  <h3>Guilds of Ravnica Draft</h3>

  <p>{{ host_player }} has invited you to join a {{ set_name }} draft.</p>


  <div v-if="is_started">
    <div class="alert alert-warning">
        This draft has already started, so it's no longer possible for you to 
        join. If you want to join, ask the host to create a new
        draft and re-invite all of the players.
    </div>
  </div>
  <div v-else-if="is_full">
    <div class="alert alert-warning">
        This draft already has 8 players so cannot be joined.
    </div>
  </div>
  <div v-else-if="!is_joined" class="row join-input">
    <label class="sr-only" for="join-draft-name">Name</label>
    <input v-model="player_name" ref="playerName" 
           v-on:keyup.enter="onJoinDraft"
           id="join-draft-name" class="form-control col-sm-8"  
           placeholder="Enter your name" />
    <button class="btn btn-success col-sm-3" @click="onJoinDraft">Join Draft</button>
  </div>

  <div v-else class="waiting-for-draft" >
   <CirclesToRhombusesSpinner 
      :circles-num="3"
      :circle-size="12"
      color="#aaa"
    /> 
    <div>Waiting for draft to start...</div> 
  </div>
  

  <MultiplayerPlayers :players="multi_players" />

  </div>
  
  </div>

  </div>

  <SiteFooter />

  </div>
    
  </div>

</template>


<style>

.join-content {
  min-height: 60vh;
}

.join-content .join-input,
.join-content .waiting-for-draft {
  height: 40px;
  margin-left: 0px;
  margin-top: 20px;
}



.join-content .waiting-for-draft div {
  display: inline-block;
}

.join-content .waiting-for-draft .circles-to-rhombuses-spinner .circle {
  border-width: 2px;
}

.join-content .alert {
  width: 96%;
}

.join-content .alert h4 {
  font-size: 18px;
}

.join-content .multiplayer-players {
  width: 96%;
  margin-top: 25px;
}

#join-draft-name {
  margin-right: 10px;
}

</style>



