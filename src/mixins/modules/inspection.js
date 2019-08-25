import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 获取车检项目
    fetchInspectionItems (query) {
      return $fetch('inspection/spots', {query})
    },
    // 更新车检部件设置
    updateInspectionPart (partId, params) {
      return $fetch(`inspection/spots/${partId}/config`, {
        method: 'PATCH',
        body: params,
      })
    },
    // 获取车检部件详情
    fetchInspectionPartDetail (partId) {
      return $fetch(`inspection/spots/${partId}`)
    },
    // 获取工时
    fetchLaborList () {
      return $fetch('settings')
    },
    // 更新工时
    updateDetailLaborTime (name, params) {
      return $fetch(`settings/${name}`, {
        method: 'PUT',
        body: params,
      })
    },
    // 获取检测部件区域列表
    fetchInspectionPartList () {
      return $fetch('inspection/groups')
    },
    // 业绩列表
    fetchMechanicPerformance (query) {
      return $fetch('inspection/reports/statistics', {query})
    },
    // 业绩统计数据
    fetchPerformanceStatistics (query) {
      return $fetch('inspection/reports/count', {query})
    },
  },
}
