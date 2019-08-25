import * as types from './types'
let count = 0
export default {
  [types.FETCH_LOADING] (state, res) {
    count = count + res
    count === 0 ? state.fetchLoading = false : state.fetchLoading = true
  },
}
