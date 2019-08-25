import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 拼团详情
    pinDetail (id) {
      return $fetch(`pin_tuan/${id}`)
    },
    // 创建拼团
    createPin (data) {
      return $fetch('pin_tuan', {
        method: 'POST',
        body: data,
      })
    },
    // 编辑拼团
    editPin (data) {
      const {id} = data
      delete data.id
      return $fetch(`pin_tuan/${id}`, {
        method: 'PATCH',
        body: data,
      })
    },
    // 拼团列表
    pinList (query) {
      return $fetch('pin_tuan', {query})
    },
    // 终止拼团
    terminatePin (id) {
      return $fetch(`pin_tuan/${id}/stop`, {
        method: 'PATCH',
      })
    },
    // 删除拼团
    deletePin (id) {
      return $fetch(`pin_tuan/${id}`, {
        method: 'DELETE',
      })
    },
    // 设为精选
    recommendation (data) {
      const {id} = data
      delete data.id
      return $fetch(`pin_tuan/${id}/choice`, {
        method: 'PATCH',
        body: data,
      })
    },
    // 拼团订单列表
    pinOrderList (query) {
      return $fetch('pin_tuan/orders', {query})
    },
    // 拼团订单统计数据
    pinOrderStatistics (query) {
      return $fetch('pin_tuan/orders/order_total', {query})
    },
    // 拼团订单详情
    pinOrderDetail (number) {
      return $fetch(`pin_tuan/orders/${number}`)
    },
  },
}
