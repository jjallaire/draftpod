
import * as set from './set/'

export default {
  started: (state) => state.status.current_pack > 0,
  set_name: (state) => {
    if (state.set_code)
      return set.name(state.set_code);
    else
      return null;
  },  
  draft: (state) => (player) => state.players[player].draft,
  deck: (state) => (player) => state.players[player].deck,
}

