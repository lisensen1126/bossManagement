import * as types from './types'

export default {
  FETCH_LOADING ({commit}, res) {
    commit(types.FETCH_LOADING, res)
  },
}
