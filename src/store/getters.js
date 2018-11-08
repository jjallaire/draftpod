
import * as set from './set/'

export default {
  started: (state) => state.current_pack > 0,
  set_name: (state) => {
    if (state.set_code)
      return set.name(state.set_code);
    else
      return null;
  },
  pick_time_remaining: (state) => {
    return Math.round((state.pick_end_time - state.current_time) / 1000);
  },
  pick_time_expired: (state, getters) => {
    return state.pick_timer &&
           !state.picks_complete &&
           state.current_pack > 0 && 
           state.current_pick > 0 &&
           getters.pick_time_remaining < 0;
  },
  
  draft: (state) => (player) => state.players[player].draft,
  deck: (state) => (player) => state.players[player].deck,
}

