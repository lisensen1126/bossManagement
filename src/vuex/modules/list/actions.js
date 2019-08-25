import * as types from './types'

export default {
  setCurrentPageStorage ({ commit }, page) {
    commit(types.SET_CURRENT_PAGE_STORAGE, page)
  },
  setLastPageStorage ({ commit }, page) {
    commit(types.SET_LAST_PAGE_STORAGE, page)
  },
}
