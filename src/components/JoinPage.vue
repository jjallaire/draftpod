<script>

import NavBar from './core/NavBar.vue'
import SiteFooter from './core/SiteFooter.vue'
import FirebaseError from './core/FirebaseError.vue'
import MultiplayerPlayers from './core/MultiplayerPlayers.vue'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

// eslint-disable-next-line 
import { store } from '@/store'
import { SET_PLAYER_INFO, SET_FIREBASE_ERROR } from '@/store/mutations'
import { JOIN_DRAFT, } from '@/store/modules/draft/actions'
import { WRITE_TABLE } from '@/store/modules/draft/mutations'

import * as utils from './core/utils'
import * as selectors from '@/store/modules/draft/selectors'
import * as messagebox from '@/components/core/messagebox'
import firestore from '@/store/modules/draft/firestore'

import { CirclesToRhombusesSpinner } from 'epic-spinners'

const NS_DRAFTS = "drafts";

export default {
  name: 'JoinPage',

  components: {
    NavBar, SiteFooter, FirebaseError, MultiplayerPlayers, CirclesToRhombusesSpinner
  },

  props: {
    draft_id: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      player_name: '',
      firestoreUnsubscribe: null,
      firebase_error: null
    }
  },

  computed: {
    ...mapState({
      draft: function(state) {
        return state[NS_DRAFTS][this.draft_id];
      },
      draft_exists: function(state) {
        return state[NS_DRAFTS].hasOwnProperty(this.draft_id);
      }
    }),
    ...mapGetters([
      'player',
    ]),

    host_player: function() {
      return selectors.hostPlayerName(this.draft.table);
    },

    set_name: function() {
      return this.draft.set.name;
    },

    format: function() {
      return selectors.draftFormat(this.draft);
    },

    is_started: function() {
      return this.draft.table.start_time !== null;
    },

    max_players: function() {
      return this.format === 'draft' ? 8 : (this.draft.table.all_packs.length / 6);
    },

    is_full: function() {
      return !this.is_joined &&  (this.multi_players.length >= this.max_players);
    },

    is_available: function() {
      return !this.firebase_error && this.draft_exists && !this.is_full && !this.is_started;
    },

    is_joined: function() {
      return !this.firebase_error && (selectors.activePlayer(this.player.id, this.draft.table) !== undefined);
    },

    namespace: function() {
      return NS_DRAFTS + '/' + this.draft_id;
    },

    multi_players: function() {
      return selectors.allPlayerNames(this.draft.table);
    }
  },

  created() {
    
    // cache player name
    this.player_name = this.player.name;

    // collect firebase if there is one
    if (this.$store.getters.firebase_error) {
      this.firebase_error = this.$store.getters.firebase_error;
      this.$store.commit(SET_FIREBASE_ERROR, null);
    }

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
    if (!this.is_joined && this.$refs.playerName)
      utils.focus(this.$refs.playerName);
  },

  beforeDestroy() {
    if (this.firestoreUnsubscribe)
      this.firestoreUnsubscribe();
  },
  

  methods: {
    ...mapMutations({
      writeTable(dispatch, payload) {
        return dispatch(this.namespace + '/' + WRITE_TABLE, payload);
      },
      setPlayerInfo: SET_PLAYER_INFO
    }),

    ...mapActions({
      joinDraft(dispatch, payload) {
        return dispatch(this.namespace+ '/' + JOIN_DRAFT, payload);
      },
    }),

    onJoinDraft() {

      // get the player name
      let player_name = this.player_name.trim();

      // ensure we have a name
      if (player_name.length === 0) {
        messagebox.alert(
          "Unable to Join",
          "Please enter the name you want to be identified by.",
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

}


</script>

<template>
  <div>
    <NavBar />

    <div class="container">
      <div class="join-content">
        <div class="row">
          <div class="col-sm-8 offset-sm-2">
            <div v-if="firebase_error">
              <FirebaseError :error="firebase_error" />
            </div>

            <div v-else-if="draft_exists">
              <h3>{{ set_name }} Draft</h3>
  
              <p>
                <span v-if="host_player">
                  {{ host_player }} has invited you
                </span> 
                <span v-else>
                  You have been invited
                </span>
                to join a {{ set_name }} game.
              </p>

              <div v-if="is_started">
                <div class="alert alert-warning">
                  This game has already started, so it's no longer possible for you to 
                  join. If you want to join, ask the host to create a new
                  game and re-invite all of the players.
                </div>
              </div>
              <div v-else-if="is_full">
                <div class="alert alert-warning">
                  This game already has {{ max_players }} players so cannot be joined.
                </div>
              </div>
              <div 
                v-else-if="!is_joined" 
                class="row join-input"
              >
                <label 
                  class="sr-only" 
                  for="join-draft-name"
                >
                  Name
                </label>
                <input 
                  id="join-draft-name" 
                  ref="playerName" 
                  v-model="player_name"
                  class="form-control col-sm-8" 
                  placeholder="Enter your name"  
                  @keyup.enter="onJoinDraft"
                >
                <button 
                  class="btn btn-success col-sm-3" 
                  @click="onJoinDraft"
                >
                  Join Draft
                </button>
              </div>

              <div 
                v-else 
                class="waiting-for-draft"
              >
                <CirclesToRhombusesSpinner 
                  :circles-num="3"
                  :circle-size="12"
                  color="#aaa"
                /> 
                <div>Waiting for draft to start...</div> 
              </div>
  
              <MultiplayerPlayers :players="multi_players" />
            </div>

            <div 
              v-else 
              class="no-draft-found"
            >
              <div class="alert alert-warning">
                The draft you were invited to could not be found.
              </div>
            </div>
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

.join-content .no-draft-found .alert {
  margin-top: 20px;
}

.join-content .waiting-for-draft .circles-to-rhombuses-spinner .circle {
  border-width: 2px;
}

.join-content h2 {
  margin-bottom: 20px;
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



