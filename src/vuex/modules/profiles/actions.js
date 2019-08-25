import * as types from './types'
import {$fetch} from '@/plugins/Fetch'

export default {
  synchronizeStaff ({commit}) {
    $fetch('staffs/index_no_page').then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_STAFF, res.result.data)
        } else {
          logError('获取员工列表失败', res.response.status)
        }
      },
      err => {
        logError('获取员工列表失败', err)
      }
    )
  },
  synchronizeStores ({commit}) {
    $fetch('stores/index_no_page').then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_STORES, res.result.data)
        } else {
          logError('获取门店列表失败', res.response.status)
        }
      },
      err => {
        logError('获取门店列表失败', err)
      }
    )
  },
  synchronizeInsurances ({commit}) {
    $fetch('insurance_companies').then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_INSURANCES, res.result.data)
        } else {
          logError('获取保险公司列表失败', res.response.status)
        }
      },
      err => {
        logError('获取保险公司列表失败', err)
      }
    )
  },
  synchronizeBrands ({commit}) {
    $fetch('vehicles/brands').then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_BRANDS, res.result.data)
        } else {
          logError('获取汽车品牌列表失败', res.response.status)
        }
      },
      err => {
        logError('获取汽车品牌列表失败', err)
      }
    )
  },
  synchronizeSalesAssistant ({commit}) {
    $fetch('sa/index_no_page', {query: {
      is_sa: true,
    }}).then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_SALES_ASSISTANT, res.result.data)
        } else {
          logError('获取销售经理列表失败', res.response.status)
        }
      },
      err => {
        logError('获取销售经理列表失败', err)
      }
    )
  },
  synchronizeMechanic ({commit}) {
    $fetch('sa/index_no_page', {query: {
      is_mechanic: true,
    }}).then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_MECHANIC, res.result.data)
        } else {
          logError('获取技工列表失败', res.response.status)
        }
      },
      err => {
        logError('获取技工列表失败', err)
      }
    )
  },
  synchronizeShopCategories ({commit}) {
    $fetch('shop/categories', {query: {
      with_items_count: true,
    }}).then(
      res => {
        if (res.response.status === 200) {
          commit(types.REFRESH_SHOP_CATEGORIES, res.result.data)
        } else {
          logError('获取分类列表失败', res.response.status)
        }
      },
      err => {
        logError('获取分类列表失败', err)
      }
    )
  },
}

function logError (title, error) {
  console.error(`[error] ${title}： ${(error && error.message) || '服务异常'}（${error && error.msgcode}）`, error)
}
