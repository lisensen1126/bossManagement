import * as types from './types'

export default {
  [types.SET_CURRENT_PAGE_STORAGE] (state, page) {
    // set current page
    state.currentPageStorage = page
  },
  [types.SET_LAST_PAGE_STORAGE] (state, page) {
    // set current page
    state.lastPageStorage = page
  },
}
