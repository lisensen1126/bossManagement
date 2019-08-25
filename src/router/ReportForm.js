import ReportFormLayout from '@/components/reportForm/ReportFormLayout'
import OperateList from '@/components/reportForm/OperateList'
import DailyDetails from '@/components/reportForm/DailyDetails'
import OperateOrderDetail from '@/components/reportForm/OperateOrderDetail'
import OperateClickDetail from '@/components/reportForm/OperateClickDetail'
import OperateRegisterDetail from '@/components/reportForm/OperateRegisterDetail'
import IncomeSummary from '@/components/reportForm/IncomeSummary'
import IncomeTransaction from '@/components/reportForm/IncomeTransaction'
import IncomeOrderDetail from '@/components/reportForm/IncomeOrderDetail'
import OrderSplitList from '@/components/reportForm/OrderSplitList'
import OrderBossList from '@/components/reportForm/OrderBossList'
import OrderSplitDetail from '@/components/reportForm/OrderSplitDetail'
import EcharReport from '@/components/reportForm/EcharReport'
export default {
  path: 'report',
  component: ReportFormLayout,
  children: [
    // 财务管理
    {
      name: 'incomeSummary',
      path: 'incomeSummary',
      component: IncomeSummary,
      meta: {
        module: 'report',
        keepAlive: true,
        isBack: false,
      },
    },
    {
      name: 'incomeTransaction',
      path: 'incomeSummary/incomeTransaction',
      component: IncomeTransaction,
      meta: {
        module: 'report',
      },
    },
    {
      name: 'incomeOrderDetail',
      path: 'incomeSummary/incomeOrderDetail',
      component: IncomeOrderDetail,
      meta: {
        module: 'report',
      },
    },
    // 运营报表
    {
      name: 'reportList',
      path: 'reportList',
      component: OperateList,
      meta: {
        module: 'report',
        keepAlive: true,
        isBack: false,
      },
    },
    {
      name: 'dailyDetails',
      path: 'reportList/dailyDetails',
      component: DailyDetails,
      meta: {
        module: 'report',
      },
    },
    {
      name: 'operateOrderDetail',
      path: 'reportList/operateOrderDetail',
      component: OperateOrderDetail,
      meta: {
        module: 'report',
      },
    },
    {
      name: 'operateClickDetail',
      path: 'reportList/operateClickDetail',
      component: OperateClickDetail,
      meta: {
        module: 'report',
      },
    },
    {
      name: 'operateRegisterDetail',
      path: 'reportList/operateRegisterDetail',
      component: OperateRegisterDetail,
      meta: {
        module: 'report',
      },
    },
    // 订单分账 - 列表
    {
      name: 'orderSplitList',
      path: 'orderSplitList',
      component: OrderSplitList,
      meta: {
        module: 'report',
      },
    },
    {
      name: 'orderBossList',
      path: 'orderSplitList/orderBossList',
      component: OrderBossList,
      meta: {
        module: 'report',
      },
    },
    // 订单分账 - 详情
    {
      name: 'orderSplitDetail',
      path: 'orderSplitList/orderSplitDetail',
      component: OrderSplitDetail,
      meta: {
        module: 'report',
      },
    },
    // 趋势图
    {
      name: 'echarReport',
      path: 'echarReport',
      component: EcharReport,
      meta: {
        module: 'report',
      },
    },
    {
      path: '/',
      redirect: { name: 'incomeSummary' },
    },
  ],
}
