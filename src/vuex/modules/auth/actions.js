import * as types from './types'

export default {
  updateUser ({commit}, message) {
    commit(types.UPDATE_USER, message)
  },
  clearUser ({commit}) {
    commit(types.CLEAR_USER)
  },
}
