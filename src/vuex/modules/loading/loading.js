import mutations from './mutations'
import actions from './actions'

const state = {
  fetchLoading: false,
}
const getters = {
  // 请求数据时加载状态
  fetchLoading: state => state.fetchLoading,
}
export default {
  state,
  getters,
  mutations,
  actions,
}
