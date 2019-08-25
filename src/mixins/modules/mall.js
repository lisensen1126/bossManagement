import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    /* APIs */
    // 获取商品列表
    fetchItems (query) {
      return $fetch('shop/items', {query})
    },
    // 获取商品详情
    fetchItemDetail (id) {
      return $fetch(`shop/items/${id}`)
    },
    // 获取商品分类
    // fetchCategories (query) {
    //   return $fetch('categories', {query})
    // },
    // 新建商品
    createItem (query) {
      return $fetch('shop/items', {
        method: 'POST',
        body: query,
      })
    },
    // 修改商品
    editItem (id, query) {
      return $fetch(`shop/items/${id}`, {
        method: 'PUT',
        body: query,
      })
    },
    // 修改商品在售状态
    setItemSellingStatus (id, sellingStatus) {
      return $fetch(`shop/items/${id}/selling_state`, {
        method: 'PATCH',
        body: {
          is_selling: !!sellingStatus,
        },
      })
    },
    // 批量修改商品在售状态
    quantitySetItemSellingStatus (ids, sellingStatus) {
      return $fetch('shop/items/selling_state', {
        method: 'PATCH',
        body: {
          ids,
          is_selling: !sellingStatus,
        },
      })
    },
    // 获取装修详情
    // fetchDecoration () {
    //   return $fetch('decorations')
    // },
    // 修改装修详情
    // updateDecoration (decoration) {
    //   return $fetch('decorations', {
    //     method: 'PUT',
    //     body: decoration,
    //   })
    // },
    // 获取聚合首页可用链接
    fetchAppRoutes () {
      return $fetch('homepage/routes')
    },
    // 获取聚合首页详情
    fetchHomepage () {
      return $fetch('homepage')
    },
    // 更新聚合首页详情
    updateHomepageSettings (decoration) {
      return $fetch('homepage', {
        method: 'PUT',
        body: decoration,
      })
    },
    // 订单列表
    fetchOrders (query) {
      return $fetch('trade_orders', {query})
    },
    // 订单详情
    fetchOrderDetail (id) {
      return $fetch(`trade_orders/${id}`)
    },
    // 关闭订单
    closeOrder (id) {
      return $fetch(`trade_orders/${id}/close`, {
        method: 'PATCH',
      })
    },
    // 取消预约
    reservedCancell (no) {
      return $fetch(`trade_orders/${no}/cancel_shop_reservation`)
    },
    // 发起退款
    createRefundOrder (query) {
      return $fetch('refund_orders', {
        method: 'POST',
        body: query,
      })
    },
    // 检查订单是否可退款
    checkRefundable (id) {
      return $fetch(`trade_orders/${id}/check_refundable`)
    },
    // 限时折扣列表
    fetchSeckillList (data) {
      return $fetch('shop/seckills', {
        body: data,
      })
    },
    // 删除限时折扣
    delSeckill (id) {
      return $fetch(`shop/seckills/${id}`, {
        method: 'DELETE',
      })
    },
    // 终止限时折扣
    stopSeckill (id) {
      return $fetch(`shop/seckills/${id}/stop`, {
        method: 'PATCH',
      })
    },
    // 创建限时折扣
    createSeckill (data) {
      return $fetch('shop/seckills', {
        method: 'POST',
        body: data,
      })
    },
    // 修改限时折扣
    modifySeckill (id, data) {
      return $fetch(`shop/seckills/${id}`, {
        method: 'PATCH',
        body: data,
      })
    },
    // 限时折扣详情
    fetchSeckillDetail (id) {
      return $fetch(`shop/seckills/${id}`)
    },
    // 分类管理
    fetchCategoryList (query) {
      return $fetch('shop/categories', {query})
    },
    // 创建分类
    createCategory (data) {
      return $fetch('shop/categories', {
        method: 'POST',
        body: data,
      })
    },
    // 删除分类
    deleteCategory (id) {
      return $fetch(`shop/categories/${id}`, {
        method: 'DELETE',
      })
    },
    // 修改分类
    updateCategory (data) {
      const {id} = data
      delete data.id
      return $fetch(`shop/categories/${id}`, {
        method: 'PUT',
        body: data,
      })
    },
    // 分类排序
    sortCategory (data) {
      const {id} = data
      delete data.id
      return $fetch(`shop/categories/${id}/sort`, {
        method: 'PATCH',
        body: data,
      })
    },
  },
}
