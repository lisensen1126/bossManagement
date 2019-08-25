import MaterialLayout from '@/components/material/MaterialLayout'
import BangStickList from '@/components/material/BangStickList'
import BangStickAdd from '@/components/material/BangStickAdd'
import BangStickEdit from '@/components/material/BangStickEdit'
import PosterMaterialList from '@/components/material/PosterMaterialList'
import PosterMaterialAdd from '@/components/material/PosterMaterialAdd'
import PosterMaterialEdit from '@/components/material/PosterMaterialEdit'

export default {
  path: 'material',
  component: MaterialLayout,
  children: [
    {
      name: 'posterMaterialList',
      path: 'posterMaterialList',
      component: PosterMaterialList,
      meta: {
        module: 'material',
        keepAlive: true,
      },
    },
    {
      name: 'posterMaterialAdd',
      path: 'posterMaterialList/posterMaterialAdd',
      component: PosterMaterialAdd,
      meta: {
        module: 'material',
      },
    },
    {
      name: 'posterMaterialEdit',
      path: 'posterMaterialList/posterMaterialEdit',
      component: PosterMaterialEdit,
      meta: {
        module: 'material',
      },
    },
    {
      name: 'bangStickList',
      path: 'bangStickList',
      component: BangStickList,
      meta: {
        module: 'material',
        keepAlive: true,
      },
    },
    {
      name: 'bangStickAdd',
      path: 'bangStickList/bangStickAdd',
      component: BangStickAdd,
      meta: {
        module: 'material',
      },
    },
    {
      name: 'bangStickEdit',
      path: 'bangStickList/bangStickEdit',
      component: BangStickEdit,
      meta: {
        module: 'material',
      },
    },
    {
      path: '/',
      redirect: { name: 'PosterMaterialList' },
    },
  ],
}
