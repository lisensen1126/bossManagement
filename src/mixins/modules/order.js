import {$fetch} from '@/plugins/Fetch'
/**
 * 订单管理相关接口
 * zhangqi
 */
export default {
  methods: {
    // 退款接口
    refundPriceApi (data) {
      return $fetch('order/refund', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 客户服务详情
    fetchOrderList (query) {
      return $fetch('order', {query})
    },
    // 客户详情
    fetchOrderDetail (id, query) {
      return $fetch(`order/${id}`, {query})
    },
  },
}
