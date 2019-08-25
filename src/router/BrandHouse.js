import BrandHouseLayout from '@/components/brandHouse/BrandHouseLayout'
import BrandHouseList from '@/components/brandHouse/BrandHouseList'
import AddBrandHouse from '@/components/brandHouse/AddBrandHouse'
import BrandVideo from '@/components/brandHouse/BrandVideo'
import BrandProductService from '@/components/brandHouse/BrandProductService'
import BrandContent from '@/components/brandHouse/BrandContent'

export default {
  path: 'brandHouse',
  component: BrandHouseLayout,
  children: [{
    name: 'brandHouseList',
    path: 'brandHouseList',
    component: BrandHouseList,
    meta: {
      module: 'brandHouse',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'addBrandHouse',
    path: 'brandHouseList/add',
    component: AddBrandHouse,
    meta: {
      module: 'brandHouse',
    },
  }, {
    name: 'brandVideo',
    path: 'brandHouseList/video',
    component: BrandVideo,
    meta: {
      module: 'brandHouse',
    },
  }, {
    name: 'brandProductService',
    path: 'brandHouseList/brandProductService',
    component: BrandProductService,
    meta: {
      module: 'brandHouse',
    },
  }, {
    name: 'brandContent',
    path: 'brandHouseList/brandContent',
    component: BrandContent,
    meta: {
      module: 'brandHouse',
    },
  }, {
    path: '/',
    redirect: {name: 'brandHouseList'},
  }],
}
