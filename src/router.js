import Router from 'vue-router'
import store from './vuex/store'
import userMixin from '@/mixins/modules/user'
import ManagementLayout from '@/components/ManagementLayout'
import Login from '@/components/Login'
import enterprise from '@/router/enterprise'
import stores from '@/router/store'
import brandSeries from '@/router/BrandSeries'
import order from '@/router/order'
import material from '@/router/material'
import commodityServiceManagement from '@/router/commodityServiceManagement'
// import groupPurchase from '@/router/groupPurchase'
import basics from '@/router/basics'
import draw from '@/router/draw'
import BrandHouse from '@/router/BrandHouse'
import BrandSupport from '@/router/BrandSupport'
import Content from '@/router/Content'
import Functions from '@/router/FunctionSetting'
import ReportForm from '@/router/ReportForm'
import Customer from '@/router/Customer'
import Permission from '@/router/Permission'
import Test from '@/router/test'
const routes = [
  {
    path: '/console',
    component: ManagementLayout,
    children: [
      enterprise,
      stores,
      brandSeries,
      order,
      material,
      commodityServiceManagement,
      // groupPurchase,
      basics,
      draw,
      BrandHouse,
      Content,
      Functions,
      ReportForm,
      Customer,
      BrandSupport,
      Permission,
      Test,
      {
        path: '',
        redirect: {name: 'enterpriseList'},
      }],
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      isPublic: true,
    },
  },
  {
    path: '/',
    redirect: {name: 'enterpriseList'},
  },
]

const router = new Router({
  routes,
  linkActiveClass: 'is-active',
})

router.beforeResolve(async (to, from, next) => {
  if (!to.meta.isPublic && !store.getters.currentUser) {
    try {
      const {response} = await userMixin.methods.updateUserInfo()
      if (response.status !== 200) {
        return next({name: 'login'})
      }
    } catch (err) {
      // console.log(err)
      throw err
    }
  }
  next()
})

export default router
