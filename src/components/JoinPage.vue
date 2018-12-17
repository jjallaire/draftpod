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

    this.firestoreUnsubscribe = firestore.onDraftTableChanged(this.draft_id, table => {
      this.writeTable({ table });
      this.enterDraftIfStarted();
    });
  },

  mounted() {
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
     
      // update the player info
      this.setPlayerInfo({
        name: player_name
      });
     
  
    },

    enterDraftIfStarted() {
      if (this.draft.table.start_time !== null)
        this.$router.push({ path: "/draft/" +  this.draft_id });
    }
    
  },

  components: {
    NavBar, SiteFooter, MultiplayerPlayers
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

  <div v-if="!is_joined" class="row join-input">
    <label class="sr-only" for="join-draft-name">Name</label>
    <input v-model="player_name" ref="playerName" 
           v-on:keyup.enter="onJoinDraft"
           id="join-draft-name" class="form-control col-sm-8"  
           placeholder="Enter your name" />
    <button class="btn btn-success col-sm-3" @click="onJoinDraft">Join Draft</button>
  </div>

  <div v-else>
    Waiting for draft to start...
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

.join-content .multiplayer-players {
  width: 96%;
  margin-top: 25px;
}

.join-input {
  margin-left: 0px;
  margin-top: 30px;
}

#join-draft-name {
  margin-right: 10px;
}

</style>



