<script>

import * as log from '@/core/log'
import * as utils from '@/components/core/utils'
import ContentPanel from '@/components/core/ContentPanel.vue'
import SetSelect from '@/components/core/SetSelect.vue'
import CardpoolSelect from './cardpool/CardpoolSelect.vue'
import PlayersSelect from './multiplayer/PlayersSelect.vue'
import MultiplayerPending from './multiplayer/MultiplayerPending.vue'
import MultiplayerOptions from './multiplayer/MultiplayerOptions.vue'

// eslint-disable-next-line 
import { store } from '@/store'
import * as set from '@/store/modules/draft/set'
import firestore from '@/store/modules/draft/firestore'
import { CARDPOOL } from '@/store/constants'
import { SET_PLAYER_INFO, UPDATE_PREFERENCES, REMOVE_DRAFTS } from '@/store/mutations'
import { JOIN_DRAFT, START_DRAFT } from '@/store/modules/draft/actions'
import { WRITE_TABLE } from '@/store/modules/draft/mutations'
import { INIT_DRAFT } from '@/store/actions'

// drafts namespace
const NS_DRAFTS = "drafts";

import * as messagebox from '@/components/core/messagebox.js'

import _debounce from 'lodash/debounce'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'NavigatorStart',

  components: {
    ContentPanel, SetSelect, CardpoolSelect, 
    PlayersSelect, MultiplayerPending, MultiplayerOptions
  },

  data: function() {
    return {
      set_code: 'rna',
      cardpool: CARDPOOL.CUBE + '6/3/1/1',
      pick_timer: false,
      pick_ratings: false,
      players: 'single',
      multi_player: {
        draft_id: null,
        player_name: null,
        firestoreUnsubscribe: null
      }
    }
  },

  computed: {
    ...mapGetters([
      'cardpool_options'
    ]),
    ...mapState([
      'player',
      'preferences'
    ]),
    
    is_multi_player() {
      return this.players.startsWith('multiple');
    },

    is_arena_mode() {
      return this.players === 'multiple-arena';
    },

    is_editing_new_cardpool() {
      return this.cardpool === 'new-cardpool';
    },

    multi_players() {
      if (this.is_multi_player && this.multi_player.draft_id) {
        let draft = this.$store.state[NS_DRAFTS][this.multi_player.draft_id];
        return selectors.allPlayerNames(draft.table);
      } else {
        return [];
      }
    }
  },

  created() {
    this.set_code = this.preferences.set_code;
    this.cardpool = this.cardpool;
    this.pick_timer = this.preferences.pick_timer;
    this.pick_ratings = this.preferences.pick_ratings;
    this.multi_player.player_name = this.player.name;
    this.applySetPreferences();
  },

  beforeDestroy() {
    this.multiplayerDraftDisconnect();
  },

  methods: {
    
    ...mapMutations({
      updatePreferences: UPDATE_PREFERENCES,
      setPlayerInfo: SET_PLAYER_INFO,
      removeDrafts: REMOVE_DRAFTS,
      writeTable(dispatch, payload) {
        return dispatch(NS_DRAFTS + '/' + this.multi_player.draft_id + '/' + WRITE_TABLE, payload);
      },
    }),

    ...mapActions({
      initDraft: INIT_DRAFT,
      startDraft(dispatch, draft_id) {
        return dispatch(NS_DRAFTS + '/' + draft_id + '/' + START_DRAFT);
      },
      joinDraft(dispatch, payload) {
        return dispatch(NS_DRAFTS + '/' + this.multi_player.draft_id + '/' + JOIN_DRAFT, payload);
      },
    }),

    onStartDraft: function() {

      // validate the draft
      this.validateDraft().then(valid => {
        if (valid) {
          // if this is a multiplayer draft then it's already created 
          // so we simply join it
          if (this.is_multi_player) {

            this.beginDraft(this.multi_player.draft_id);

          } else {
            // create the draft then navigate to it
            this.createDraft().then(draft_id => {
              this.beginDraft(draft_id);
            })
            .catch((error) => {
              if (!firestore.isConnectivityError(error))
                log.logException(error, "onStartDraft");
              messagebox.alert("Draft Error", "Unable to start draft: " + error.message);
            });   
          }
        }
      });
    
    },

    onPlayersChanged() {

      // if this is a request for a multi-player draft then create a new draft
      if (this.is_multi_player) {
        
        // if this is arena mode then force the 4/4/1/1 cardpool
        if (this.is_arena_mode)
          this.cardpool = CARDPOOL.CUBE + '4/4/1/1';

        // create the draft 
        this.createDraft().then(draft_id => {
          this.multi_player.draft_id = draft_id;
          this.joinMultiplayerDraft();
          this.multiplayerDraftConnect();
          utils.scrollIntoView(this.$refs.provideCardRatings);
        })
        .catch((error) => {
          log.logException(error, "onCreateMultiplayerDraft");
          messagebox.alert(
            "Draft Error",
            "Unable to start draft: " + error.message,
            () => window.location.reload());
        }); 

      } else {

        // clear multiplayer state and remove any existing draft
        if (this.multi_player.draft_id) {
          this.removeDrafts([this.multi_player.draft_id]);
          this.multi_player.draft_id = null;
        }

        // disconnect from firestore
        this.multiplayerDraftDisconnect();

        // scroll to top
        this.scrollToStartNewDraft();
      }
    },

    multiplayerDraftConnect() {
      this.multiplayerDraftDisconnect();
      this.multi_player.firestoreUnsubscribe = firestore.onDraftTableChanged(
        this.multi_player.draft_id, 
        table => {
          if (selectors.isStarted(table))
            this.$router.push({ path: "/draft/" + this.multi_player.draft_id });
          else
            this.writeTable({ table });
        });
    },

    multiplayerDraftDisconnect() {
      if (this.multi_player.firestoreUnsubscribe) {
        this.multi_player.firestoreUnsubscribe();
        this.multi_player.firestoreUnsubscribe = null;
      }
    },


    beginDraft(draft_id) {

      // set player name for future drafts
      this.setPlayerInfo({
        name: this.multi_player.player_name
      });

      // update prefs for future drafts
      this.updatePreferences({
        set_code: this.set_code,
        cardpool: this.cardpool,
        pick_timer: this.pick_timer,
        pick_ratings: this.pick_ratings
      });

      // multiplayer info if we have it
      let player_info = null;
      if (this.is_multi_player) {
        player_info = {
          id: this.player.id,
          name: this.multi_player.player_name
        }
      }

      // start the draft
      this.startDraft(draft_id, player_info);

      // navivate to it for single-player mode (in multi-player mode
      // we wait for the commit to propagage all the way through)
      if (!this.is_multi_player) {
        this.$router.push({ path: "/draft/" + draft_id });
      }
    },

    validateDraft() {

      return new Promise((resolve) => {

        // validate that we don't have an unresolved new-cardpool
        if (this.cardpool === 'new-cardpool') {
          messagebox.alert("Unable to Start Draft",
                          "Please complete the details for the new cardpool and then click " +
                          "the <strong>Use Cardpool</strong> button to confirm you want to use it for this draft.");
          resolve(false);
        }

        // validation for multi-user drafts
        else if (this.is_multi_player) {

          if (!this.multi_player.draft_id) {
            messagebox.alert("Unable to Start Draft", "Please wait for the draft be created before starting it.");
            resolve(false);
          }

          else if (!this.multi_player.player_name) {
            messagebox.alert("Unable to Start Draft", "Please enter the name you want to be identified by during the draft.");
            resolve(false);
          }

          else if (this.multi_players.length <= 1) {
            messagebox.confirm(
              "Start Draft",
              "<p>No other players have yet joined this draft so you will be the only player.<p>" +
              "Are you sure you want to start drafting?",
              () => resolve(true), () => resolve(false));
          } else {
            resolve(true);
          }
        } else {
          resolve(true);
        }
      });

    },

    createDraft() {

      // check for special multi-player arena mode, if we are in it then
      // provide extra arena-specific options
      let extra_options = {};
      if (this.is_arena_mode) {
        extra_options = {
          number_of_packs: 5,
          deck_size: 60,
          deck_list_format: 'arena'
        }
      }

      return this.initDraft({ 
        set_code: this.set_code, 
        cardpool: this.cardpool, 
        options: { 
          pick_timer: this.pick_timer, 
          pick_ratings: this.pick_ratings,
          multi_player: this.is_multi_player,
          ...extra_options
        }
      });
    },


    joinMultiplayerDraft() {
      this.joinDraft({
        id: this.player.id,
        name: this.multi_player.player_name
      });
    },

    onCardpoolInput(value) {
      this.cardpool = value;
    },

    onSetChanged() {
      this.$nextTick(() => {
        this.applySetPreferences();
      });
    },

    // update the player name as we type (but no more than every 1 second)
    onMultiplayerOptionsChanged: _debounce(function() {
       this.joinMultiplayerDraft();
    }, 500),

    onNewCardpoolComplete() {
      this.scrollToStartNewDraft();
    },

    scrollToStartNewDraft() {
      utils.scrollIntoView(this.$refs.startNewDraft.$el);
    },

    applySetPreferences() {

      // check whether we have a given input valuu
      function hasInputVal(options, value) {
        return options.filter((option) => option.value == value).length > 0
      }

      // apply set prefs if we have them
      let set_prefs = this.preferences.sets[this.set_code];
      let cardpool_options = this.cardpool_options(this.set_code);
      if (set_prefs && set_prefs.cardpool) {
        if (hasInputVal(cardpool_options.cubes, set_prefs.cardpool) || 
            hasInputVal(cardpool_options.custom, set_prefs.cardpool)) {
          this.cardpool = set_prefs.cardpool;
        } else {
          this.cardpool = set.default_cube(this.set_code);
        }
      } else {
        this.cardpool = set.default_cube(this.set_code);
      }
    },

  }



}

</script>

<template>
  <ContentPanel 
    ref="startNewDraft" 
    caption="Start New Draft" 
    class="user-select-none"
  >
    <form @submit.prevent>
      <SetSelect 
        v-model="set_code" 
        :disabled="is_multi_player" 
        @input="onSetChanged"
      />
      <CardpoolSelect 
        :disabled="is_multi_player" 
        :value="cardpool" 
        :options="cardpool_options(set_code)"
        :set_code="set_code"
        @input="onCardpoolInput" 
        @newCardpoolComplete="onNewCardpoolComplete"
      />
      <div class="form-group row">
        <label 
          for="draft-options" 
          class="col-sm-3 col-form-label"
        >
          Options:
        </label>
        <div 
          id="draft-options" 
          class="col-sm-8"
        >
          <div class="form-check">
            <input 
              id="draft-timer" 
              v-model="pick_timer" 
              :disabled="is_multi_player" 
              type="checkbox" 
              class="form-check-input"
            >
            <label 
              class="form-check-label" 
              for="draft-timer"
            >
              Apply pick time limit
            </label>
            <small class="form-text text-muted">
              1 minute, 15 seconds for the first pick (5 seconds less for each pick thereafter).
            </small>
          </div>
          <div class="form-check">
            <input 
              id="draft-analysis" 
              ref="provideCardRatings" 
              v-model="pick_ratings" 
              :disabled="is_multi_player" 
              type="checkbox" 
              class="form-check-input"
            >
            <label 
              class="form-check-label" 
              for="draft-analysis"
            >
              Provide card ratings
            </label>
            <small class="form-text text-muted">
              Optional display of ratings for the cards in the current pack.
            </small>
          </div>
        </div>
      </div>
      <PlayersSelect 
        ref="playersSelect" 
        v-model="players" 
        :set_code="set_code"
        :disabled="is_editing_new_cardpool" 
        @input="onPlayersChanged"
      >
        <div v-if="multi_player.draft_id">
          <MultiplayerOptions 
            v-model="multi_player" 
            :players="multi_players" 
            :arena_mode="is_arena_mode"
            @input="onMultiplayerOptionsChanged"
          />
        </div>
        <div v-else>
          <MultiplayerPending />
        </div>
      </PlayersSelect>
      <div class="form-group row">
        <div class="col-sm-10">
          <button 
            id="start-draft"
            ref="startDraft" 
            type="button" 
            class="btn btn-success" 
            @click="onStartDraft"
          >
            Start Draft
          </button>
        </div>
      </div>
    </form>
  </ContentPanel>
</template>


<style>

#draft-options {
  margin-bottom: 15px;
}

#start-draft {
  margin-top: 16px;
}

.card-body.navigator-inline-panel {
  margin-top: 8px;
  padding-top: 10px;
  padding-bottom: 15px;
}


</style>

