import AdminList from '@/components/basics/AdminList'
import BasicsLayout from '@/components/basics/BasicsLayout'
import AdminAdd from '@/components/basics/AdminAdd'
import SmallEditionList from '@/components/basics/SmallEditionList'
import MiniProgramAuditStatus from '@/components/basics/MiniProgramAuditStatus'
import SettingAuthentication from '@/components/basics/SettingAuthentication'
import SettingService from '@/components/basics/SettingService'
import IndexGuide from '@/components/basics/IndexGuide'
import OpenScreen from '@/components/basics/OpenScreen'
import BannersPage from '@/components/basics/BannersPage'
import HotBannersPage from '@/components/basics/HotBannersPage'
import RecommendOil from '@/components/basics/RecommendOil'
import Tips from '@/components/basics/Tips'
import BrandArea from '@/components/basics/BrandArea'
import PageSetting from '@/components/basics/PageSetting'
import SuperBannersPage from '@/components/basics/SuperBannersPage'
import PassWordSetting from '@/components/basics/PassWordSetting'
import ReportForm from '@/components/basics/ReportForm'
import MaintenanceTools from '@/components/basics/MaintenanceTools'
export default {
  path: 'basics',
  component: BasicsLayout,
  children: [
    {
      name: 'adminList',
      path: 'adminList',
      component: AdminList,
      meta: {
        module: 'basics',
        keepAlive: true,
      },
    },
    {
      name: 'reportForm',
      path: 'reportForm',
      component: ReportForm,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'adminAdd',
      path: 'adminAdd',
      component: AdminAdd,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'smallEditionList',
      path: 'smallEditionList',
      component: SmallEditionList,
      meta: {
        module: 'basics',
        keepAlive: true,
      },
    },
    {
      name: 'miniProgramAuditStatus',
      path: 'smallEditionList/miniProgramAuditStatus',
      component: MiniProgramAuditStatus,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'settingAuthentication',
      path: 'settingAuthentication',
      component: SettingAuthentication,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'settingService',
      path: 'settingService',
      component: SettingService,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'pageSetting',
      path: 'pageSetting',
      component: PageSetting,
      children: [
        {
          name: 'indexGuide',
          path: 'indexGuide',
          component: IndexGuide,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'openScreen',
          path: 'openScreen',
          component: OpenScreen,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'bannersPage',
          path: 'bannersPage',
          component: BannersPage,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'hotBannersPage',
          path: 'hotBannersPage',
          component: HotBannersPage,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'recommendOil',
          path: 'recommendOil',
          component: RecommendOil,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'superBannersPage',
          path: 'superBannersPage',
          component: SuperBannersPage,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'brandArea',
          path: 'brandArea',
          component: BrandArea,
          meta: {
            module: 'basics',
          },
        },
        {
          name: 'tips',
          path: 'tips',
          component: Tips,
          meta: {
            module: 'basics',
          },
        },
        {
          path: '/',
          redirect: { name: 'indexGuide' },
        },
      ],
    },
    {
      name: 'passWordSetting',
      path: 'passWordSetting',
      component: PassWordSetting,
      meta: {
        module: 'basics',
      },
    },
    {
      name: 'maintenanceTools',
      path: 'maintenanceTools',
      component: MaintenanceTools,
      meta: {
        module: 'basics',
      },
    },
    {
      path: '/',
      redirect: { name: 'adminList' },
    },
  ],
}
