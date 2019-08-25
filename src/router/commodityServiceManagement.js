import CommodityServiceManagement from '@/components/commodityServiceManagement/CommodityServiceManagementLayout'
import CommodityManagement from '@/components/commodityServiceManagement/CommodityManagement'
import CommodityCollection from '@/components/commodityServiceManagement/CommodityCollection'
import CommodityAdd from '@/components/commodityServiceManagement/CommodityAdd'
import CommodityEdit from '@/components/commodityServiceManagement/CommodityEdit'
import CommodityDetail from '@/components/commodityServiceManagement/CommodityDetail'
import ServiceManagement from '@/components/commodityServiceManagement/ServiceManagement'
import ServiceCollection from '@/components/commodityServiceManagement/ServiceCollection'
import ServiceAdd from '@/components/commodityServiceManagement/ServiceAdd'
import ServiceEdit from '@/components/commodityServiceManagement/ServiceEdit'
import ServiceDetail from '@/components/commodityServiceManagement/ServiceDetail'
import CommodityCollectionDetail from '@/components/commodityServiceManagement/CommodityCollectionDetail'
import ServiceCollectionDetail from '@/components/commodityServiceManagement/ServiceCollectionDetail'
import goodsClassificationManagement from '@/components/commodityServiceManagement/GoodsClassificationManagement'
import serviceClassificationManagement from '@/components/commodityServiceManagement/ServiceClassificationManagement'
import brandManagement from '@/components/commodityServiceManagement/BrandManagement'
import ClassifyAttrAdd from '@/components/commodityServiceManagement/ClassifyAttrAdd'
export default {
  path: 'commodityServiceManagement',
  component: CommodityServiceManagement,
  children: [{
    name: 'brandManagement',
    path: 'brandManagement',
    component: brandManagement,
    meta: {
      module: 'brandManagement',
    },
  }, {
    name: 'commodityManagement',
    path: 'commoditymanagement',
    component: CommodityManagement,
    meta: {
      module: 'commodityServiceManagement',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'serviceManagement',
    path: 'servicemanagement',
    component: ServiceManagement,
    meta: {
      module: 'commodityServiceManagement',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'serviceAdd',
    path: 'servicemanagement/serviceadd',
    component: ServiceAdd,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'serviceEdit',
    path: 'servicemanagement/serviceedit',
    component: ServiceEdit,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'serviceDetail',
    path: 'servicemanagement/servicedetail',
    component: ServiceDetail,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'serviceCollection',
    path: 'servicecollection',
    component: ServiceCollection,
    meta: {
      module: 'commodityServiceManagement',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'serviceCollectionDetail',
    path: 'servicecollection/servicecollectiondetail',
    component: ServiceCollectionDetail,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'commodityAdd',
    path: 'commoditymanagement/commodityadd',
    component: CommodityAdd,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'commodityEdit',
    path: 'commoditymanagement/commodityedit',
    component: CommodityEdit,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'commodityDetail',
    path: 'commoditymanagement/commoditydetail',
    component: CommodityDetail,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'commodityCollectionDetail',
    path: 'commoditycollection/commoditycollectiondetail',
    component: CommodityCollectionDetail,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'commodityCollection',
    path: 'commoditycollection',
    component: CommodityCollection,
    meta: {
      module: 'commodityServiceManagement',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'goodsClassificationManagement',
    path: 'goodsClassificationManagement',
    component: goodsClassificationManagement,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'serviceClassificationManagement',
    path: 'serviceClassificationManagement',
    component: serviceClassificationManagement,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    name: 'classifyAttrAdd',
    path: 'goodsClassificationManagement/classifyAttrAdd',
    component: ClassifyAttrAdd,
    meta: {
      module: 'commodityServiceManagement',
    },
  }, {
    path: '/',
    redirect: {path: 'brandManagement'},
  }],
}
