

const NS_DRAFTS = "drafts";

import fscreen from 'fscreen'
import MobileDetect from 'mobile-detect'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';

import * as selectors from '@/store/modules/draft/selectors.js'
import { DECK } from '@/store/modules/draft/constants.js'

import TouchDragManager from '../core/TouchDragManager.js'
import * as messagebox from '@/components/core/messagebox.js'

import { REMOVE_DRAFTS } from '@/store/mutations'

import { 
  RESUME_DRAFT, PACK_TO_PICK, PICK_TO_PILE, 
  DECK_TO_SIDEBOARD, DECK_TO_UNUSED, DECK_TO_DECK,
  SIDEBOARD_TO_DECK, SIDEBOARD_TO_UNUSED, 
  UNUSED_TO_DECK, UNUSED_TO_SIDEBOARD, ARRANGE_DECK_BY_COST,
  SET_DECK_OPTIONS, DISABLE_AUTO_LANDS, SET_BASIC_LANDS,
  REMOVE_PLAYER, ADD_DECK, ACTIVATE_DECK } from '@/store/modules/draft/actions';

import './TableCore.css'

export default {

  props: {
    draft_id: {
      type: String,
      required: true
    },
  },

  data() {
    return {
      fullscreen: false,
      fullscreenEnabled: fscreen.fullscreenEnabled,
      isMobile: false,
      isPhone: false,
      isTablet: false,
      isiOS: false,
      card_preview: null,
      touchDragManager: new TouchDragManager(),
    }
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

    set: function() {
      return this.draft.set;
    },
    options: function() {
      return selectors.draftOptions(this.draft);
    },
    table: function() {
      return this.draft.table;
    },   
    active_player: function() {
      return selectors.activePlayer(this.player.id, this.table);
    },
    active_cards: function() {
      return selectors.activeCards(this.player.id, this.table);
    },

    namespace: function() {
      return NS_DRAFTS + '/' + this.draft_id;
    },
  },
  
  created() {

    // detect mobile
    let md = new MobileDetect(window.navigator.userAgent);
    if (md.mobile())
      this.isMobile = true;
    if (md.tablet())
      this.isTablet = true;
    if (this.isMobile && !this.isTablet)
      this.isPhone = true;
    if (md.os() === 'iOS')
      this.isiOS = true;


    // update fullscreen state on change
    this.onFullscreenChange();
    fscreen.addEventListener('fullscreenchange', this.onFullscreenChange);   
  },

  beforeDestroy() {
    fscreen.removeEventListener('fullscreenchange', this.onFullscreenChange);
  },

  methods: {

    ...mapMutations({
      removeDrafts: REMOVE_DRAFTS,
    }),

    ...mapActions({
      packToPick(dispatch, payload) {
        return dispatch(this.namespace + '/' + PACK_TO_PICK, this.withPlayerId(payload));
      },
      pickToPile(dispatch, payload) {
        return dispatch(this.namespace + '/' + PICK_TO_PILE, this.withPlayerId(payload));
      },
      deckToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_SIDEBOARD, this.withPlayerId(payload));
      },
      deckToUnused(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_UNUSED, this.withPlayerId(payload));
      },
      deckToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + DECK_TO_DECK, this.withPlayerId(payload));
      },
      sideboardToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_DECK, this.withPlayerId(payload));
      },
      sideboardToUnused(dispatch, payload) {
        return dispatch(this.namespace + '/' + SIDEBOARD_TO_UNUSED, this.withPlayerId(payload));
      },
      unusedToDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + UNUSED_TO_DECK, this.withPlayerId(payload));
      },
      unusedToSideboard(dispatch, payload) {
        return dispatch(this.namespace + '/' + UNUSED_TO_SIDEBOARD, this.withPlayerId(payload));
      },
      setDeckOptions(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_DECK_OPTIONS, this.withPlayerId(payload));
      },
      arrangeDeckByCost(dispatch, payload) {
        return dispatch(this.namespace + '/' + ARRANGE_DECK_BY_COST, this.withPlayerId(payload));
      },
      disableAutoLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + DISABLE_AUTO_LANDS, this.withPlayerId(payload));
      },
      setBasicLands(dispatch, payload) {
        return dispatch(this.namespace + '/' + SET_BASIC_LANDS, this.withPlayerId(payload));
      },
      removePlayer(dispatch, payload) {
        return dispatch(this.namespace + '/' + REMOVE_PLAYER, this.withPlayerId(payload));
      },
      addDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + ADD_DECK, this.withPlayerId(payload));
      },
      activateDeck(dispatch, payload) {
        return dispatch(this.namespace + '/' + ACTIVATE_DECK, this.withPlayerId(payload));
      },
      resumeDraft(dispatch) {
        return dispatch(this.namespace + '/' + RESUME_DRAFT, this.withPlayerId({}));
      },
    }),

    withPlayerId: function(payload) {
      return {
        player_id: this.player.id,
        ...payload
      }
    },

    setCardPreview: function(card_preview) {
      this.card_preview = card_preview;
    },

    onFullscreenChange: function() {
      this.fullscreen = fscreen.fullscreenElement !== null;
    },
    onFullscreenToggle: function() {
      if (!this.fullscreen)
        fscreen.requestFullscreen(document.documentElement);
      else
        fscreen.exitFullscreen();
    },

    onExitDraft: function() {
      if (this.options.multi_player) {
         messagebox.confirm(
          "Exit Draft",
          "<p>You cannot rejoin the draft after you have exited.</p>" + 
          "Do you want to exit this draft? ",
          () => {
            this.removePlayer({ remove_player_id: this.player.id });
          });
      } else {
        messagebox.confirm(
          "Exit Draft",
          "<p>You can pick up where you left off in the draft later.</p>" + 
          "Do you want to exit this draft? ",
          () => {
            this.$router.push({ path: "/play/" });
          });
      }
    },
    onRemoveDraft: function() {
      messagebox.confirm(
        "Discard Draft",
        "<p>You will no longer be able to access this draft after it is discarded.</p>" +
        "Do you want to discard this draft? ",
        () => {
          this.removeDrafts([this.draft_id]);
          this.$router.push({ path: "/play/" });
        })
    },
  },

  provide: function() {
    return {
      packToPick: this.packToPick,
      pickToPile: this.pickToPile,
      deckToSideboard: this.deckToSideboard,
      deckToUnused: this.deckToUnused,
      deckToDeck: this.deckToDeck,
      sideboardToDeck: this.sideboardToDeck,
      sideboardToUnused: this.sideboardToUnused,
      unusedToDeck: this.unusedToDeck,
      unusedToSideboard: this.unusedToSideboard,
      disableAutoLands: this.disableAutoLands,
      setDeckOptions: this.setDeckOptions,
      arrangeDeckByCost: this.arrangeDeckByCost,
      setBasicLands: this.setBasicLands,
      removePlayer: this.removePlayer,
      addDeck: this.addDeck,
      activateDeck: this.activateDeck,
      setCardPreview: this.setCardPreview,
      touchDragManager: this.touchDragManager,
      cardInDeck: card => {
        return this.active_player.deck.piles[DECK.UNUSED].find(c => c.key === card.key) === undefined;  
      },
    }
  },

}