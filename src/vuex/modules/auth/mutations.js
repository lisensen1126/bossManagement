import * as types from './types'

export default {
  [types.UPDATE_USER] (state, user) {
    // update user
    state.user = user
  },
  [types.CLEAR_USER] (state) {
    // update user
    state.user = null
  },
}
