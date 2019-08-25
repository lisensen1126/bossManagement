import EnterpriseLayout from '@/components/enterprise/EnterpriseLayout'
import EnterpriseList from '@/components/enterprise/EnterpriseList'
import EnterpriseCreate from '@/components/enterprise/EnterpriseCreate'
import EnterprisePay from '@/components/enterprise/EnterprisePay'
import YouLuoke from '@/components/enterprise/YouLuoKe'
import AppSetting from '@/components/enterprise/AppSetting'
import CheBang from '@/components/enterprise/CheBang'
import Administration from '@/components/enterprise/Administration'
export default {
  path: 'enterprise',
  component: EnterpriseLayout,
  children: [{
    name: 'enterpriseList',
    path: 'list',
    component: EnterpriseList,
    meta: {
      module: 'enterprise',
      keepAlive: true,
      isBack: false,
    },
  }, {
    name: 'enterpriseCreate',
    path: 'list/create',
    component: EnterpriseCreate,
    meta: {
      module: 'enterprise',
    },
  }, {
    name: 'administration',
    path: 'list/administration',
    component: Administration,
    meta: {
      module: 'enterprise',
    },
  }, {
    name: 'enterpriseEdit',
    path: 'list/edit/:enterpriseId',
    component: EnterpriseCreate,
    meta: {
      module: 'enterprise',
    },
  }, {
    name: 'enterprisePay',
    path: 'list/pay/:enterpriseId',
    component: EnterprisePay,
    meta: {
      module: 'enterprise',
    },
  }, {
    path: 'list/youluoke',
    component: YouLuoke,
    meta: {
      module: 'enterprise',
    },
    children: [{
      name: 'appSetting',
      path: 'app/:enterpriseId',
      component: AppSetting,
      meta: {
        module: 'enterprise',
      },
    }, {
      name: 'cheBang',
      path: 'cheBang/:enterpriseId',
      component: CheBang,
      meta: {
        module: 'enterprise',
      },
    }, {
      path: '/',
      redirect: {name: 'appSetting'},
    }],
  }, {
    path: '/',
    redirect: 'list',
  }],
}
