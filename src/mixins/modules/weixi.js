import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 获取员工管理-员工列表
    fetchGetEmployeeList (query) {
      return $fetch('/work/member/list', {query})
    },
    // 删除员工
    removeEmployee (memUid) {
      return $fetch(`/work/member/${memUid}`, {
        method: 'DELETE',
      })
    },
    // 员工管理-批量导入
    allImport (body) {
      return $fetch('/work/member/import', {
        method: 'POST',
        body,
      })
    },
    // 下载模板
    downloadTemp () {
      return $fetch('/work/member/download_template')
    },
    // 员工管理-批量导出
    allExport () {
      return $fetch('/work/member/export')
    },
    // 新增员工
    createEmployee (body) {
      return $fetch('/work/member/create', {
        method: 'POST',
        body,
      })
    },
    // 修改员工
    updateWashingSetting (body) {
      return $fetch(`/work/member/${body.memUid}`, {
        method: 'PUT',
        body,
      })
    },
    // 获取员工详情
    fetchEmployee (memUid) {
      return $fetch(`/work/member/detail/${memUid}`)
    },
    // 岗位列表
    fetchJobList (query) {
      return $fetch('/work/job', {query})
    },
    // 删除岗位
    removeJob (jobId) {
      return $fetch(`/job/${jobId}`, {
        method: 'DELETE',
      })
    },
    // 新增岗位
    createJob (body) {
      return $fetch('/work/job', {
        method: 'POST',
        body,
      })
    },
    // 编辑岗位
    updateJob (body) {
      return $fetch(`/work/job/${body.jobId}`, {
        method: 'PATCH',
        body,
      })
    },
    // 组织列表
    fetchDepartmentList (query) {
      return $fetch('/work/department', {query})
    },
    // 删除组织
    removeDepartment (dpId) {
      return $fetch(`/job/${dpId}`, {
        method: 'DELETE',
      })
    },
    // 新增组织
    createDepartment (body) {
      return $fetch('/work/department', {
        method: 'POST',
        body,
      })
    },
    // 编辑组织
    updateDepartment (body) {
      return $fetch(`/work/department/${body.dpId}`, {
        method: 'PUT',
        body,
      })
    },
    // 获取员工详情
    fetchDepartment (dpId) {
      return $fetch(`/work/department/${dpId}`)
    },
  },
}
