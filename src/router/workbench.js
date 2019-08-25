import WorkbenchLayout from '@/components/workbench/WorkbenchLayout'
import WorkbenchOverview from '@/components/workbench/WorkbenchOverview'

export default {
  path: 'workbench',
  component: WorkbenchLayout,
  children: [{
    name: 'workbenchOverview',
    path: 'overview',
    component: WorkbenchOverview,
    meta: {
      module: 'workbench',
    },
  }, {
    path: '/',
    redirect: 'overview',
  }],
}
