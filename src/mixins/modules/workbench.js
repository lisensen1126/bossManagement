import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 客户服务详情
    fetchServiceDetail (id) {
      return $fetch(`service_rights/${id}`)
    },
    // 工单状态变更
    updateTicketStatus (query) {
      const ticketNumber = query.ticket_number
      delete query.ticket_number
      return $fetch(`service_tickets/${ticketNumber}/status`, {
        method: 'PATCH',
        body: query,
      })
    },
    // 工单详情
    fetchTicketDetail (number) {
      return $fetch(`service_tickets/${number}`)
    },
    // 预约验证
    verifyReservation (query) {
      return $fetch('shop/reservation/verify', {
        method: 'POST',
        body: query,
      })
    },
    // 核销服务
    writeOffService (query) {
      return $fetch('shop/reservation/write_off', {
        method: 'POST',
        body: query,
      })
    },
    // 补全
    // 车牌列表
    searchVehicles (query) {
      return $fetch('customer_vehicles', {query})
    },
    // 客户列表
    searchCustomers (query) {
      return $fetch('customers', {query})
    },
    // 工单列表
    searchTickets (query) {
      return $fetch('service_tickets', {query})
    },
    // 预约列表
    fetchReservationList (query) {
      return $fetch('reservations', {query})
    },
    // 预约类型数量
    fetchReservationCounts (query) {
      return $fetch('reservations/types_count', {query})
    },
    // 团购核销列表
    fetchGroupData (query) {
      return $fetch('tuan_gou/coupon', {query})
    },
    // 团购分类列表
    fetchClassifyData (query) {
      return $fetch('tuan_gou/category', {query})
    },
    // 验证核销码
    verifyCoupon (query) {
      return $fetch('tuan_gou/coupon/verify', {
        method: 'POST',
        body: query,
      })
    },
    // 核销团购劵
    writeOffCoupon (query) {
      return $fetch('tuan_gou/coupon/write_off', {
        method: 'POST',
        body: query,
      })
    },

  },
}
