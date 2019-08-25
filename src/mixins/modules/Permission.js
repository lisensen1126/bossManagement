import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 操作日志
    getOperationLogApi (body) {
      return $fetch('operation_log/local/list', {
        method: 'POST',
        body,
      })
    },
  },
}
