import * as types from './types'

export default {
  saveTransDetail ({ commit }, params) {
    commit(types.saveTransDetail, params)
  },
  clearTransDetail ({ commit }) {
    commit(types.clearTransDetail)
  },
}
