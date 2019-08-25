import GroupPurchaseLayout from '@/components/groupPurchase/GroupPurchaseLayout'
import GroupPurchaseList from '@/components/groupPurchase/GroupPurchaseList'
import ReportCenter from '@/components/groupPurchase/ReportCenter'
import GroupPurchaseDetail from '@/components/groupPurchase/GroupPurchaseDetail'
import GroupPurchaseCreate from '@/components/groupPurchase/GroupPurchaseCreate'
import GroupPurchaseStoreList from '@/components/groupPurchase/GroupPurchaseStoreList'
import GroupPurchaseEdit from '@/components/groupPurchase/GroupPurchaseEdit'
import ReportDetail from '@/components/groupPurchase/ReportDetail'

export default {
  path: 'group',
  component: GroupPurchaseLayout,
  children: [{
    name: 'groupPurchaseList',
    path: 'groupPurchaseList',                // 活动管理
    component: GroupPurchaseList,
    meta: {
      module: 'group',
    },
  }, {
    name: 'groupPurchaseDetail',
    path: 'groupPurchaseList/groupPurchaseDetail/:id',             // 活动详情
    component: GroupPurchaseDetail,
    meta: {
      module: 'group',
    },
  }, {
    name: 'reportCenter',
    path: 'reportCenter',                   // 报表中心
    component: ReportCenter,
    meta: {
      module: 'group',
    },
  }, {
    name: 'groupPurchaseCreate',
    path: 'groupPurchaseList/groupPurchaseCreate',              // 新建团购
    component: GroupPurchaseCreate,
    meta: {
      module: 'group',
    },
  }, {
    name: 'groupPurchaseStoreList',
    path: 'groupPurchaseList/groupPurchaseStoreList',              // 新建团购
    component: GroupPurchaseStoreList,
    meta: {
      module: 'group',
    },
  }, {
    name: 'groupPurchaseEdit',
    path: 'groupPurchaseList/groupPurchaseEdit/:id',             // 编辑团购
    component: GroupPurchaseEdit,
    meta: {
      module: 'group',
    },
  }, {
    name: 'reportDetail',
    path: 'reportCenter/reportDetail/:id',              // 报表详情
    component: ReportDetail,
    meta: {
      module: 'group',
    },
  }, {
    path: '/',
    redirect: {name: 'groupPurchaseList'},
  }],
}
