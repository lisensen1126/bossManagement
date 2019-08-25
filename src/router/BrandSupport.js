import BrandSupportLayout from '@/components/brandSupport/BrandSupportLayout'
import BrandSupportList from '@/components/brandSupport/BrandSupportList'
import ContentClassify from '@/components/brandSupport/ContentClassify'
import ContentAdd from '@/components/brandSupport/AddContent'
import ContentEdit from '@/components/brandSupport/EditContent'
export default {
  path: 'brandsupport',
  component: BrandSupportLayout,
  children: [{
    name: 'brandSupportList',
    path: 'brandSupportList',
    component: BrandSupportList,
    meta: {
      module: 'brandsupport',
    },
  }, {
    name: 'contentClassify',
    path: 'contentClassify',
    component: ContentClassify,
    meta: {
      module: 'brandsupport',
    },
  }, {
    name: 'addcontent',
    path: 'brandSupportList/add',
    component: ContentAdd,
    meta: {
      module: 'brandsupport',
    },
  }, {
    name: 'editbrand',
    path: 'brandSupportList/edit',
    component: ContentEdit,
    meta: {
      module: 'brandsupport',
    },
  }, {
    path: '/',
    redirect: {name: 'brandSupportList'},
  }],
}
