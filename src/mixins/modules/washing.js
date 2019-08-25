import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 获取洗车服务设置列表
    fetchWashingSettings () {
      return $fetch('washing/services')
    },
    // 获取洗车技工业绩汇总
    fetchWashingSalesGather (query) {
      return $fetch('washing/sales/gather', {
        body: query,
      })
    },
    // 获取洗车开单记录
    fetchWashingRecords (query) {
      return $fetch('washing/records')
    },
    // 修改洗车服务
    updateWashingSetting (type) {
      const {id} = type
      delete type.id
      return $fetch(`washing/services/${id}`, {
        method: 'PATCH',
        body: type,
      })
    },
    // 获取洗车套餐列表
    fetchWashingPackages (query) {
      return $fetch('washing/packages', {query})
    },
    // 获取洗车套餐详情
    fetchWashingPackage (packageID) {
      return $fetch(`washing/packages/${packageID}`)
    },
    // 更新洗车套餐部分属性
    updatePackageSetting (body) {
      const {id} = body
      delete body.id
      return $fetch(`washing/packages/${id}`, {
        method: 'PATCH',
        body,
      })
    },
    // 删除洗车套餐
    removePackage (id) {
      return $fetch(`washing/packages/${id}`, {
        method: 'DELETE',
      })
    },
    // 创建洗车套餐
    createPackage (body) {
      return $fetch('washing/packages', {
        method: 'POST',
        body,
      })
    },
    // 更新洗车套餐
    updatePackage (id, body) {
      return $fetch(`washing/packages/${id}`, {
        method: 'PUT',
        body,
      })
    },
    // 获取完善信息奖励
    fetchCompleteInformationActivites () {
      return $fetch('reward_activities/complete_information')
    },
    // 获取完善信息奖励
    fetchShareActivites () {
      return $fetch('reward_activities/share')
    },
    // 更新洗车奖励活动
    updateCompleteInformationActivites (data) {
      return $fetch('reward_activities/complete_information', {
        method: 'PUT',
        body: {
          ...data,
        },
      })
    },
    // 更新洗车奖励活动
    updateShareActivites (data) {
      return $fetch('reward_activities/share', {
        method: 'PUT',
        body: {
          ...data,
        },
      })
    },
    // 获取店内洗车 技工业绩
    fetchWorkerPerformance (data) {
      return $fetch('washing/sales', {
        body: {
          ...data,
        },
      })
    },
    // 获取店内洗车 技工业绩统计
    fetchWorkerPerformanceStatics (data) {
      return $fetch('washing/sales/summary', {
        body: {
          ...data,
        },
      })
    },
    // 获取店内洗车单列表
    fetchWashingOrders (data) {
      return $fetch('washing/service_tickets', {
        body: {...data},
      })
    },
    // 获取店内洗车统计
    fetchWashingOrderStatics (data) {
      return $fetch('washing/service_tickets/summary', {
        body: {...data},
      })
    },
    // 获取店内洗车订单
    fetchWashingOfflineOrders (data) {
      return $fetch('washing/trade_orders', {
        body: {...data},
      })
    },
    // 获取店内洗车订单统计
    fetchWashingOfflineStatics (data) {
      return $fetch('washing/trade_orders/summary', {
        body: {...data},
      })
    },
    fetchWashingOrderDetail (orderNo) {
      return $fetch(`washing/trade_orders/${orderNo}`)
    },
    // 洗车套餐推荐
    fetchPackageRecommendation () {
      return $fetch('washing/packages/recommend')
    },
    // 更新推荐配置
    modifyPackageRecommendation (data) {
      const {id} = data
      delete data.id
      return $fetch(`washing/packages/${id}/recommend`, {
        method: 'POST',
        body: data,
      })
    },
    fetchRedpackSetting () {
      return $fetch('reward_activities/coupon_share')
    },
    updateRedpackSetting (data) {
      return $fetch('reward_activities/coupon_share', {
        method: 'PUT',
        body: data,
      })
    },
    updateSettingOfRecommendation (data) {
      return $fetch('settings/WASHING_ORDER_RECOMMENDATION_ON_OFF', {
        method: 'PUT',
        body: data,
      })
    },
    // 新人礼包
    fetchNewCommerGiftSetting () {
      return $fetch('reward_activities/newcomer')
    },
    // 更新新人礼包配置
    updateNewCommerGiftSetting (data) {
      return $fetch('reward_activities/newcomer', {
        method: 'PUT',
        body: data,
      })
    },
  },
}
