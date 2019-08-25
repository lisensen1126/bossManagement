import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 客户列表
    fetchCustomers (query) {
      return $fetch('customers', {query})
    },
    // 客户详情
    fetchCustomerDetail (id) {
      return $fetch(`customers/${id}`)
    },
    // 新建客户
    createCustomer (query) {
      return $fetch('customers', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑客户信息
    updateCustomer (query) {
      const id = query.id
      delete query.id
      return $fetch(`customers/${id}`, {
        method: 'PUT',
        body: query,
      })
    },
    // 更新车辆里程
    updateVehicleMilage (id, query) {
      return $fetch(`customer_vehicles/${id}/maintenance_mileage`, {
        method: 'PATCH',
        body: query,
      })
    },
    // 更新车辆最后保养时间
    updateVehicleLastMaintenanceDate (id, query) {
      return $fetch(`customer_vehicles/${id}/last_maintained_at`, {
        method: 'PATCH',
        body: query,
      })
    },
    // 添加车辆
    addCar (query) {
      return $fetch('category/list', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑车辆信息
    updateCar (query) {
      const id = query.id
      // delete query.id
      return $fetch(`customer_vehicles/${id}`, {
        method: 'PUT',
        body: query,
      })
    },
    // 删除车辆信息
    deleteCar (id) {
      return $fetch(`customer_vehicles/${id}`, {
        method: 'DELETE',
      })
    },
    // 车型列表
    fetchVehicleModels (query) {
      return $fetch('vehicles/models', {query})
    },
    // 客户消费记录
    fetchOrderList (query) {
      const id = query.customer_id
      delete query.customer_id
      return $fetch(`customers/${id}/orders`, {query})
    },
    // 客户工单记录
    fetchTicketList (query) {
      const id = query.customer_id
      delete query.customer_id
      return $fetch(`service_tickets/customers/${id}`, {query})
    },
    // 客户车检记录
    fetchReportList (query) {
      return $fetch('inspection/reports', {query})
    },
    // 客户服务次数
    fetchServiceList (query) {
      return $fetch('service_rights', {query})
    },
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
    // 核销服务
    writeOffService (query) {
      return $fetch('shop/reservation/write_off', {
        method: 'POST',
        body: query,
      })
    },
    removeRight (id) {
      return $fetch(`service_rights/${id}`, {
        method: 'DELETE',
      })
    },
    // 评分列表
    fetchFeedback (query) {
      return $fetch('feedback', {query})
    },
    // 工单详情
    fetchTicketDetail (number) {
      return $fetch(`service_tickets/${number}`)
    },
    // 修改预约到店时间
    updateReserveStartTime (query) {
      const ticketNumber = query.ticket_number
      delete query.ticket_number
      return $fetch(`service_tickets/${ticketNumber}/reservation_time`, {
        method: 'PATCH',
        body: query,
      })
    },
    // 修改预估完成时间
    updateEstimatedFinishTime (query) {
      const ticketNumber = query.ticket_number
      delete query.ticket_number
      return $fetch(`service_tickets/${ticketNumber}/finish_time`, {
        method: 'PATCH',
        body: query,
      })
    },
    // 客户优惠券列表
    fetchCoupons (query) {
      const {id} = query
      delete query.id
      return $fetch(`customers/${id}/coupons`, {
        query,
      })
    },
  },
}
