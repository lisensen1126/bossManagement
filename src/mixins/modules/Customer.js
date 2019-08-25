import {$fetch} from '@/plugins/Fetch'
/**
 * 客户管理相关接口
 * amujoe
 */
export default {
  methods: {
    // 客户管理 - 客户管理列表
    fetchCustomerList (query) {
      return $fetch('customer/list', {query})
    },
    // 客户管理 - 客户详情
    fetchCustomerDetail (query) {
      return $fetch('customer/detail', {query})
    },
    // 客户管理 - 车检报告列表
    fetchReportListApi (query) {
      return $fetch('customer/report-list', {query})
    },
    // 客户管理 - 消费记录列表
    fetchRecordListApi (query) {
      return $fetch('customer/order_list', {query})
    },
    // 客户管理 - 车检报告详情
    fetchReportDetailApi (query) {
      return $fetch('customer/report-detail', {query})
    },
  },
}
