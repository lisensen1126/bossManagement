import {$fetch} from '@/plugins/Fetch'
// import Staff from './staff'

export default {
  // mixins: [Staff],
  methods: {
    // 门店列表
    fetchStores (query) {
      return $fetch('stores', { query })
    },
    // 省市区
    fetchRegions (query) {
      return $fetch('regions', {query})
    },
    // 创建门店
    createStore (params) {
      return $fetch('stores', {
        method: 'POST',
        body: {...params},
      })
    },
    // 获取门店详情
    fetchStoreDetail (storeId) {
      return $fetch(`stores/${storeId}`)
    },
    // 更新门店信息
    updateStore (storeId, params) {
      return $fetch(`stores/${storeId}`, {
        method: 'PATCH',
        body: {...params},
      })
    },
  },
}
