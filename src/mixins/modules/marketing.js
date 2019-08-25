import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 获取优惠券列表
    fetchCoupons (query) {
      return $fetch('coupons', {query})
    },
    // 创建优惠券
    createCoupon (data) {
      return $fetch('coupons', {
        method: 'POST',
        body: data,
      })
    },
    // 删除优惠券
    deleteCoupon (id) {
      return $fetch(`coupons/${id}`, {
        method: 'DELETE',
      })
    },
    // 推荐
    recommendCoupon (data) {
      const {id} = data
      delete data.id
      return $fetch(`coupons/${id}/recommend`, {
        method: 'PATCH',
        body: data,
      })
    },
    // 展示
    displayCoupon (data) {
      const {id} = data
      delete data.id
      return $fetch(`coupons/${id}/display`, {
        method: 'PATCH',
        body: data,
      })
    },
    // 中奖客户列表
    winCustomerList (id, query) {
      return $fetch(`lottery/${id}/win_customer_list`, {query})
    },
    // 查看活动详情
    activeDetail (id) {
      return $fetch(`lottery/${id}`)
    },
    // 发布活动
    activeAdd (data, id) {
      return $fetch(`lottery/${id}`, {
        method: 'POST',
        body: data,
      })
    },
    // 活动列表
    activeList (query) {
      return $fetch('lottery', {query})
    },
    // 活动下架
    activeOff (data) {
      const id = data.id
      return $fetch(`lottery/${id}/off_shelves`, {
        method: 'PATCH',
      })
    },
    // 修改车检状态
    changeStatusApi (query) {
      return $fetch('inspect/operate', {
        method: 'POST',
        body: query,
      })
    },
  },
}
