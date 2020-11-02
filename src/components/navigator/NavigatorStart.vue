<script>

import HelpIcon from "vue-material-design-icons/HelpCircleOutline.vue"

import * as log from '@/core/log'
import * as utils from '@/components/core/utils'
import ContentPanel from '@/components/core/ContentPanel.vue'
import SetSelect from '@/components/core/SetSelect.vue'
import CardpoolSelect from '@/components/core/cardpool/CardpoolSelect.vue'
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

// number of packs
const PACKS_THREE = "three";
const PACKS_FIVE = "five";

import * as messagebox from '@/components/core/messagebox.js'

import _debounce from 'lodash/debounce'
import jquery from 'jquery'

import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

import * as selectors from '@/store/modules/draft/selectors'

export default {
  name: 'NavigatorStart',

  components: {
    ContentPanel, SetSelect, CardpoolSelect, HelpIcon,
    PlayersSelect, MultiplayerPending, MultiplayerOptions
  },

  data: function() {
    return {
      set_code: 'znr',
      cardpool: CARDPOOL.CUBE + '6/3/1/1',
      format: 'draft',
      number_of_packs: PACKS_THREE,
      pick_timer: false,
      pick_ratings: false,
      sealed_number_of_packs: 6,
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

    is_draft_format() {
      return this.format === 'draft';
    },

    is_sealed_format() {
      return this.format === 'sealed';
    },
    
    is_multi_player() {
      return this.players.startsWith('multiple');
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
    this.format = this.preferences.format || 'draft';
    if (this.$route && this.$route.query.format)
      this.format = this.$route.query.format;
    this.pick_timer = this.preferences.pick_timer;
    this.pick_ratings = this.preferences.pick_ratings;
    this.number_of_packs = PACKS_THREE;
    this.sealed_number_of_packs = this.preferences.sealed_number_of_packs || 6;
    this.multi_player.player_name = this.player.name;
    this.applySetPreferences();
  },

  mounted() {
    jquery('#packs-help-popover').popover({
      trigger: 'hover',
      content: 'Use 5 packs to draft 60 card decks that are compatible with Arena Direct ' +
               'Challlenge. Alternatively, you can draft a 40 card deck and a 60 card ' + 
               'version (with extras of random cards) will be provided for use on Arena. '
    });
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
            this.$router.push({ path: `/${this.format}/` + this.multi_player.draft_id });
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
        format: this.format,
        pick_timer: this.pick_timer,
        pick_ratings: this.pick_ratings,
        number_of_packs: this.number_of_packs,
        sealed_number_of_packs: this.sealed_number_of_packs
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
        this.$router.push({ path: `/${this.format}/` + draft_id });
      }
    },

    validateDraft() {

      return new Promise((resolve) => {

        // validate that we don't have an unresolved new-cardpool
        if (this.cardpool === 'new-cardpool') {
          messagebox.alert("Unable to Start",
                          "Please complete the details for the new cardpool and then click " +
                          "the <strong>Use Cardpool</strong> button to confirm you want to use it.");
          resolve(false);
        } else if (!this.sealed_number_of_packs) {

          messagebox.alert("Unable to Start",
                           "Please enter the number of packs to include in each sealed pool.");
          resolve(false);
          
        // validation for multi-user drafts
        } else if (this.is_multi_player) {

          if (this.is_sealed_format && this.sealed_number_of_packs === -1) {
            messagebox.alert("Unable to Start", "Full set sealed pool is not supported for multiple players.");
            resolve(false);

          } else if (!this.multi_player.draft_id) {
            messagebox.alert("Unable to Start", "Please wait for the game be created before starting it.");
            resolve(false);
          }

          else if (!this.multi_player.player_name) {
            messagebox.alert("Unable to Start", "Please enter the name you want to be identified by.");
            resolve(false);
          }

          else if (this.multi_players.length <= 1) {
            messagebox.confirm(
              "Startaft",
              "<p>No other players have yet joined so you will be the only player.<p>" +
              "Are you sure you want to start?",
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

      // force cardpool to 4/4/4/4 for sealed full set
      let cardpool = this.cardpool;
      if (this.format === 'sealed' & this.sealed_number_of_packs === -1) {
        cardpool = CARDPOOL.CUBE + '4/4/4/4'
      }

      return this.initDraft({ 
        set_code: this.set_code, 
        cardpool: cardpool, 
        format: this.format,
        options: { 
          number_of_packs: this.number_of_packs === PACKS_FIVE ? 5 : 3,
          deck_size: (this.is_draft_format && this.number_of_packs === PACKS_FIVE) ? 60 : 40,
          pick_timer: this.pick_timer, 
          pick_ratings: this.pick_ratings,
          multi_player: this.is_multi_player,
          sealed_number_of_packs: this.sealed_number_of_packs
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
  },
}

</script>

<template>
  <ContentPanel 
    ref="startNewDraft" 
    caption="Play" 
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
          for="draft-format" 
          class="col-sm-3 col-form-label"
        >
          Format:
        </label>
        <div id="draft-format" class="col-sm-8">
          <div class="form-check form-check-inline">
            <input id="draft-format-draft" v-model="format" class="form-check-input" type="radio" value="draft" :disabled="is_multi_player">
            <label class="form-check-label" for="draft-format-draft">
              Booster Draft
            </label>
          </div>
          <div class="form-check form-check-inline">
            <input id="draft-format-sealed" v-model="format" class="form-check-input" type="radio" value="sealed" :disabled="is_multi_player">
            <label class="form-check-label" for="draft-format-sealed">
              Sealed Deck
            </label>
          </div>
        </div>
      </div>
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
          <div v-show="false" id="draft-packs">
            <div class="form-check-inline">
              <input id="draft-packs-three" v-model="number_of_packs" class="form-check-input" type="radio" value="three" :disabled="is_multi_player">
              <label class="form-check-label" for="draft-packs-three">
                3 Packs (40 Card Deck)
              </label>
            </div>
            
            <div class="form-check-inline">
              <input id="draft-packs-five" v-model="number_of_packs" class="form-check-input" type="radio" value="five" :disabled="is_multi_player">
              <label class="form-check-label" for="draft-packs-five">
                5 Packs (60 Card Deck)
              </label>
            </div>

            <div class="form-check-inline">
              <button id="packs-help-popover" class="icon-button" data-toggle="popover" data-placement="bottom">
                <HelpIcon id="packs-help-icon" title="" />
              </button>
            </div>
            
          </div>
          <div v-show="is_draft_format" class="form-check">
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
          <div v-show="is_draft_format" class="form-check">
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
          <div v-show="is_sealed_format">
            <select 
              id="sealed-number-of-packs" 
              v-model.number="sealed_number_of_packs" 
              class="form-control" 
              :disabled="is_multi_player" 
            >
              <option value="6">
                6 Packs
              </option>
              <option value="8">
                8 Packs
              </option>
              <option value="10">
                10 Packs
              </option>
              <option value="12">
                12 Packs
              </option>
              <option value="18">
                18 Packs
              </option>
              <option value="-1">
                Full Set (4x)
              </option>
            </select>
            <small class="form-text text-muted">
              Number of packs to include in each player's sealed pool.
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
            Start
          </button>
        </div>
      </div>
    </form>
  </ContentPanel>
</template>


<style>

#draft-format .form-check-inline {
  margin-right: 20px;
  margin-top: 13px;
}

#draft-packs {
  margin-bottom: 16px;
}

#draft-packs .form-check-inline {
  margin-right: 20px;
}

#draft-options {
  margin-bottom: 15px;
}

#draft-options .form-check:first-child {
  margin-top: 0;
}

label[for="draft-options"] {
  padding-top: 0;
}

#start-draft {
  margin-top: 16px;
}

.card-body.navigator-inline-panel {
  margin-top: 8px;
  padding-top: 10px;
  padding-bottom: 15px;
}

#packs-help-popover {
  min-width: 20px;
  padding-left: 0 !important;

}

#packs-help-icon svg {
  width: 22px;
  height: 22px;
  color: #aaa;
}


</style>

