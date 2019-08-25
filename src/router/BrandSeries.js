import brandSeriesLayout from '@/components/brandSeries/BrandSeriesLayout'
import SeriesTopNav from '@/components/brandSeries/SeriesTopNav'
import TypeList from '@/components/brandSeries/TypeList'
import SpuList from '@/components/brandSeries/SpuList'
import ServiceTypeList from '@/components/brandSeries/ServiceTypeList'
import GoodSpuList from '@/components/brandSeries/GoodSpuList'
import GoodSpuDetail from '@/components/brandSeries/GoodSpuDetail'
export default {
  path: 'brandseries',
  component: brandSeriesLayout,
  children: [{
    name: 'serviceTypeList',
    path: 'series/serviceTypeList',
    component: ServiceTypeList,
    meta: {
      module: 'brandseries',
    },
  }, {
    name: 'goodSpuList',
    path: 'series/goodSpuList',
    component: GoodSpuList,
    meta: {
      module: 'brandseries',
    },
  }, {
    name: 'goodSpuDetail',
    path: 'series/goodSpuDetail',
    component: GoodSpuDetail,
    meta: {
      module: 'brandseries',
    },
  }, {
    name: 'series',
    path: 'series',
    component: SeriesTopNav,
    meta: {
      module: 'brandseries',
    },
    children: [{
      name: 'typeList',
      path: 'typeList',
      component: TypeList,
      meta: {
        module: 'brandseries',
      },
    }, {
      name: 'spuList',
      path: 'spuList',
      component: SpuList,
      meta: {
        module: 'brandseries',
      },
    }, {
      path: '/',
      redirect: {name: 'type'},
    }],
  }, {
    path: '/',
    redirect: {name: 'series'},
  }],
}
