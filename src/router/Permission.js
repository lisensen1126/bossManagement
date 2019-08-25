import PermissionLayout from '@/components/permission/PermissionLayout'
import OperationLogList from '@/components/permission/OperationLogList'

export default {
  path: 'permission',
  component: PermissionLayout,
  children: [
    {
      name: 'operationLogList',
      path: 'operationLogList',
      component: OperationLogList,
      meta: {
        module: 'permission',
        keepAlive: true,
      },
    },
    {
      path: '/',
      redirect: { name: 'operationLogList' },
    },
  ],
}
