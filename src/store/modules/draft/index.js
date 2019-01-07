import initial_state from './state'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: true,
  state: initial_state,
  actions,
  mutations,
}


