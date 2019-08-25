import * as types from './types'

export default {
  showMessage ({commit}, message) {
    commit(types.SHOW_MESSAGE, message)
  },
  hideMessage ({commit}, message) {
    commit(types.HIDE_MESSAGE, message)
  },
}
