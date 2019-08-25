import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 工位列表(不分页)
    fetchStation (document) {
      return $fetch('stations/index_no_page', {
        body: {
          ...document,
        },
      })
    },
    // 工位列表(分页)
    fetchStations (document) {
      return $fetch('stations', {
        body: {
          ...document,
        },
      })
    },
    // 创建工位
    fetchStationCreate (document) {
      return $fetch('stations', {
        method: 'POST',
        body: {
          ...document,
        },
      })
    },
    // 工位详情
    fetchStationDetail (query, document) {
      return $fetch(`stations/${query}`, {
        body: {
          ...document,
        },
      })
    },
    // 工位修改
    fetchStationModify (query, document) {
      return $fetch(`stations/${query}`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },
    // 开启、关闭工位预约
    operateStationsReservation (id, action) {
      return $fetch(`stations/${id}/${action}`, {
        method: 'PATCH',
      })
    },
    // 工位排期
    fetchStationSchedule (query, document) {
      return $fetch(`stations/${query}/schedule`, {
        body: {
          ...document,
        },
      })
    },
    // 工单列表
    fetchServiceTickets (query) {
      return $fetch('service_tickets', {query})
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
    // 目标管理类型
    fetchRankingsSettings () {
      return $fetch('aims/settings')
    },
    // 管理更新
    fetchUpdateRankingsSettings (id, document) {
      return $fetch(`aims/settings/${id}`, {
        method: 'PUT',
        body: {
          ...document,
        },
      })
    },
    // 目标管理
    fetchRankings (query) {
      return $fetch('aims/ranking', {query})
    },
    // 车检档案
    fetchInspectionReports (query) {
      return $fetch('inspection/reports', {query})
    },
    // 车检详情
    fetchInspectionReportsDetail (no) {
      return $fetch(`inspection/reports/${no}`)
    },
  },
}
