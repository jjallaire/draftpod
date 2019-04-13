
export const CREATE_DRAFT = 'CREATE_DRAFT'
export const WRITE_TABLE = 'WRITE_TABLE'
export const SET_CONNECTED = 'SET_CONNECTED'
export const SET_WAITING = 'SET_WAITING'
export const CLEAR_WAITING = 'CLEAR_WAITING'
export const SET_SHOW_BOT_COLORS = 'SET_SHOW_BOT_COLORS'
export const CONVERT_TO_SINGLE_PLAYER = 'CONVERT_TO_SINGLE_PLAYER'

import * as set from './set/'
import * as draftbot from './draftbot'
import { generateBooster } from './booster.js'

import Vue from 'vue';

export default {

  [CREATE_DRAFT](state, { id, player, set_code, cardpool, format, options }) {

    // initialize id and event id
    state.id = id;

    // initialize set
    state.set = {
      code: set_code,
      name: set.name(set_code),
      pack_cards: set.pack_cards(set_code, options.number_of_packs)
    }

    // initialize format
    state.format = format;

    // initialize options
    state.options = {
      ...state.options,
      ...options,
    };

    initTable(state, (table, options) => {

      // set the player info to the first player
      table.players[0].id = player.id;
      table.players[0].name = player.name;
      table.players[0].bot = draftbot.createAutoPicker();

      // initialize packs and set them
      let all_packs = [];

      // for draft we generate ~ 24 packs (depending on number_of_packs option)
      if (format === 'draft') {
        for (let p=1; p<=options.number_of_packs; p++) {
          for (let b=0; b<8; b++) {
            all_packs.push(generateBooster(set_code, cardpool, p, options.number_of_packs))
          }
        }

      // for sealed we generate as many boosters as we can
      } else { // format === 'sealed'
        let p = 1;
        for(;;) {
          let pack = generateBooster(set_code, cardpool, p++, options.number_of_packs);
          if (pack.length !== set.pack_cards(set_code, options.number_of_packs))
            break;
          all_packs.push(pack);
        }
      }

      // set packs
      table.all_packs = all_packs;
    });

    // save the packs we started with
    state.packs = state.table.all_packs
      .map(pack => pack.map(card => card.id).join(','));
  },

  [WRITE_TABLE](state, { table }) {
    writeTable(state, table);
  },

  [SET_SHOW_BOT_COLORS](state, { show_bot_colors }) {
    state.options.show_bot_colors = show_bot_colors;
  },

  [SET_CONNECTED](state, { connected }) {
    state.connected = connected;
  },

  [SET_WAITING](state) {
    state.waiting = new Date().getTime();
  },

  [CLEAR_WAITING](state) {
    state.waiting = null;
  },

  [CONVERT_TO_SINGLE_PLAYER](state, { player_id }) {
    
    // convert any player not myself into a bot
    state.table.players.forEach(player => {
      if (player.id !== player_id) {
        player.id = null;
        player.name = null;
        player.bot = draftbot.create();
      }
    });

    // turn off master multi-player flag
    state.options.multi_player = false;

    // reset connected and waiting flags
    state.connected = true;
    state.waiting = null;
  }
};

// write initial values for the table (no firebase sync as we
// will want to initialize firebase with these values)
function initTable(state, writer) {
  let table = JSON.parse(JSON.stringify(state.table));
  writer(table, state.options);
  writeTable(state, table);
}

function writeTable(state, table) {
  Vue.set(state, "table", table);
}





