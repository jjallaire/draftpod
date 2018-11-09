

export default {
  started: (state) => state.status.current_pack > 0,
  draft: (state) => (player) => state.players[player].draft,
  deck: (state) => (player) => state.players[player].deck,
}

