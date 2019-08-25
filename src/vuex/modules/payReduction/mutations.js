import * as types from './types'
export default{
  [types.saveTransDetail] (state, params) {
    state.prData = params
  },
  [types.clearTransDetail] (state) {
    state.prData = {}
  },
}
