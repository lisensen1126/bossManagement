import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 员工列表(不分页)
    fetchStaff (query) {
      return $fetch('staffs/index_no_page', {query})
    },
    // 员工列表(分页)
    fetchStaffs (document) {
      return $fetch('staffs', {
        body: {
          ...document,
        },
      })
    },
    // 客户经理列表(不分页)
    fetchSa (query) {
      return $fetch('sa/index_no_page', {query})
    },
    // 客户经理（分页）
    fetchSas (document) {
      return $fetch('sa', {
        body: {
          ...document,
        },
      })
    },
    // 创建员工
    fetchStaffCreate (document) {
      return $fetch('staffs', {
        method: 'POST',
        body: {
          ...document,
        },
      })
    },
    // 员工详情
    fetchStaffDetail (query, document) {
      return $fetch(`staffs/${query}`, {
        body: {
          ...document,
        },
      })
    },
    // 员工修改
    fetchStaffModify (query, document) {
      return $fetch(`staffs/${query}`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },
    // 员工禁用
    fetchStaffDisable (query, document) {
      return $fetch(`staffs/${query}/disable`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },
    // 员工启用
    fetchStaffEnable (query, document) {
      return $fetch(`staffs/${query}/enable`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },

    // 员工删除
    fetchStaffDelete (query, document) {
      return $fetch(`staffs/${query}`, {
        method: 'DELETE',
        body: {
          ...document,
        },
      })
    },

    // 员工重置密码
    fetchStaffResetPassword (query, document) {
      return $fetch(`staffs/${query}/reset_password`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },

    // 员工修改
    fetchSaModify (id, document) {
      return $fetch(`sa/${id}`, {
        method: 'PATCH',
        body: {
          ...document,
        },
      })
    },

    // 客户经理启用
    fetchSaEnable (query) {
      return $fetch(`sa/${query}/enable`, {
        method: 'PATCH',
      })
    },

    // 客户经理停用
    fetchSaDisable (query) {
      return $fetch(`sa/${query}/disable`, {
        method: 'PATCH',
      })
    },

    // 客户经理二维码
    fetchSaQrCode (id) {
      return $fetch(`sa/${id}/flower_qrcode`)
    },
  },
}
