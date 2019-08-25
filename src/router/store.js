import StoreLayout from '@/components/store/StoreLayout'
import StoreList from '@/components/store/StoreList'
import WhiteStoreList from '@/components/store/WhiteStoreList'
import StoreCreate from '@/components/store/StoreCreate'
import StoreEvaluate from '@/components/store/StoreEvaluate'
import StorePay from '@/components/store/StorePay'
import StorePerfect from '@/components/store/StorePerfect'
import SecondBrandCard from '@/components/store/SecondBrandCard'
import ThirdEnterPay from '@/components/store/ThirdEnterPay'
import CheckStoreList from '@/components/store/CheckStoreList'
import CheckStoreEdit from '@/components/store/CheckStoreEdit'
import CheckManagement from '@/components/store/CheckManagement'
import CheckComment from '@/components/store/CheckComment'
import CheckManagementRange from '@/components/store/CheckManagementRange'
import StoreDetailNav from '@/components/store/StoreDetailNav'
import StoreInvalid from '@/components/store/StoreInvalid'
export default {
  path: 'store',
  component: StoreLayout,
  children: [{
    name: 'storeList',
    path: 'storelist',
    component: StoreList,
    meta: {
      module: 'store',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'storeCreate',
    path: 'storelist/create',
    component: StoreCreate,
    meta: {
      module: 'store',
    },
  }, {
    name: 'thirdEnterPay',
    path: 'storelist/thirdEnter',
    component: ThirdEnterPay,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storePay',
    path: 'storelist/pay',
    component: StorePay,
    meta: {
      module: 'store',
    },
  }, {
    name: 'secondBrandCard',
    path: 'storelist/second',
    component: SecondBrandCard,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storePerfect',
    path: 'storelist/perfect',
    component: StorePerfect,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storeEdit',
    path: 'storelist/edit/:storeId',
    component: StoreCreate,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storeEvaluate',
    path: 'storelist/storeEvaluate',
    component: StoreEvaluate,
    meta: {
      module: 'store',
    },
  }, {
    name: 'checkStoreList',
    path: 'checkStoreList',
    component: CheckStoreList,
    meta: {
      module: 'store',
    },
  }, {
    name: 'whiteStoreList',
    path: 'whiteStoreList',
    component: WhiteStoreList,
    meta: {
      module: 'store',
    },
  }, {
    name: 'checkStoreEdit',
    path: 'checkStoreList/checkStoreEdit/:storeCode',
    component: CheckStoreEdit,
    meta: {
      module: 'store',
    },
  }, {
    name: 'checkManagement',
    path: 'checkManagement',
    component: CheckManagement,
    meta: {
      module: 'store',
    },
  }, {
    name: 'checkComment',
    path: 'checkComment',
    component: CheckComment,
    meta: {
      module: 'store',
    },
  }, {
    name: 'checkManagementRange',
    path: 'checkManagementRange',
    component: CheckManagementRange,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storeDetailNav',
    path: 'storelist/storeDetailNav/:storeId',
    component: StoreDetailNav,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storeDetailNav',
    path: 'storelist/storeDetailNav/:storeId',
    component: StoreDetailNav,
    meta: {
      module: 'store',
    },
  }, {
    name: 'storeInvalid',
    path: 'storeInvalid',
    component: StoreInvalid,
    meta: {
      module: 'store',
    },
  }, {
    path: '/',
    redirect: {name: 'storeList'},
  }],
}
