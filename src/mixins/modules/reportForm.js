import {
  $fetch,
} from '@/plugins/Fetch'

export default {
  methods: {
    // 平台订单结算统计 accounts/count
    getBossCountApi (query) {
      return $fetch('accounts/count', {
        method: 'POST',
        body: query,
      })
    },
    // accounts/count-list 平台订单统计列表
    getCountListApi (query) {
      return $fetch('accounts/count-list', {
        method: 'POST',
        body: query,
      })
    },
    // 所选未分账的数据 accounts/manual-separate-count
    getCountApi (query) {
      return $fetch('accounts/manual-separate-count', {
        method: 'POST',
        body: query,
      })
    },
    // 确认分账 accounts/manual-separate
    confirmAccountsApi (query) {
      return $fetch('accounts/manual-separate', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡统计 upkeep/sale_statistics
    getBossCardApi (query) {
      return $fetch('upkeep/sale_statistics', {
        method: 'GET',
        body: query,
      })
    },
    // 分类新增
    generalTableApi (query) {
      return $fetch('data/excel/list_for_total', {
        method: 'GET',
        body: query,
      })
    },
    // 每日明细
    detailedApi (query) {
      return $fetch('data/excel/list_for_store', {
        method: 'GET',
        body: query,
      })
    },
    // 导出总表
    exportGeneralApi (query) {
      return $fetch('data/excel/export_all', {
        method: 'GET',
        body: query,
      })
    },
    // 小程序点击数导出
    appClickAPi (query) {
      return $fetch('data/excel/export_app_click_num', {
        method: 'GET',
        body: query,
      })
    },
    // 注册车主数导出
    appRegisterApi (query) {
      return $fetch('data/excel/export_app_register_num', {
        method: 'GET',
        body: query,
      })
    },
    // 订单数导出
    appOrderAPi (query) {
      return $fetch('data/excel/export_app_order_num', {
        method: 'GET',
        body: query,
      })
    },
    // 客户下单数导出
    appCustomerApi (query) {
      return $fetch('data/excel/export_app_order_customer_num', {
        method: 'GET',
        body: query,
      })
    },
    // 订单金额导出
    appAmountApi (query) {
      return $fetch('data/excel/export_app_order_total_amount', {
        method: 'GET',
        body: query,
      })
    },
    // 全部每日明细导出
    exportAllDayApi (query) {
      return $fetch('data/excel/export_all_day', {
        method: 'GET',
        body: query,
      })
    },
    // 小程序点击数每日明细导出
    appClickDayAPi (query) {
      return $fetch('data/excel/export_app_click_num_day', {
        method: 'GET',
        body: query,
      })
    },
    // 注册车主数每日明细导出
    appRegisterDayApi (query) {
      return $fetch('data/excel/export_app_register_num_day', {
        method: 'GET',
        body: query,
      })
    },
    // 订单数每日明细导出
    appOrderDayAPi (query) {
      return $fetch('data/excel/export_app_order_num_day', {
        method: 'GET',
        body: query,
      })
    },
    // 客户下单数每日明细导出
    appCustomerDayApi (query) {
      return $fetch('data/excel/export_app_order_customer_num_day', {
        method: 'GET',
        body: query,
      })
    },
    // 订单金额每日明细导出
    appAmountDayApi (query) {
      return $fetch('data/excel/export_app_order_total_amount_day', {
        method: 'GET',
        body: query,
      })
    },
    // 每日订单列表
    appOrderListDayApi (query) {
      return $fetch('data/excel/order_list_by_day', {
        method: 'GET',
        body: query,
      })
    },
    // 访问详情
    appClickListDayApi (query) {
      return $fetch('data/excel/app_click_num_detail', {
        method: 'GET',
        body: query,
      })
    },
    // 注册详情
    appRegisterListDayApi (query) {
      return $fetch('data/excel/app_register_num_detail', {
        method: 'GET',
        body: query,
      })
    },
    // 收入汇总
    GetRevenueApi (query) {
      return $fetch('order/summary', {
        method: 'POST',
        body: query,
      })
    },
    // 获取交易明细
    GetTransactionApi (query) {
      return $fetch('order/transaction', {
        method: 'POST',
        body: query,
      })
    },
    // 获取流水明细
    GetFlowApi (query) {
      return $fetch('order/turnover_list', {
        method: 'POST',
        body: query,
      })
    },
    // 获取交易明细的门店详情
    GetOrderDetailApi (query) {
      return $fetch('order/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 获取美团支付查询
    GetMeiTuanApi (query) {
      return $fetch('meituan_finance', {
        method: 'GET',
        body: query,
      })
    },
    // 获取美团支付查询
    GetMeiTuanDetailApi (query) {
      return $fetch('meituan_finance/payment_detail', {
        method: 'GET',
        body: query,
      })
    },
    /**
     * 订单分账 - 列表
     * @param {Object} query 参数
     */
    OrderSplitListApi (query) {
      return $fetch('/accounts', {
        method: 'GET',
        body: query,
      })
    },
    /**
     * 订单分账 - 详情
     * @param {Number} id ID
     */
    OrderSplitDetailsApi (id, query) {
      return $fetch(`/accounts/${id}`, { body: query })
    },
    // 车检统计--总计
    GetInspectTotalApi () {
      return $fetch('/data/excel/inspect_total')
    },
    // 车检统计--分门店统计(搜索)
    GetInspectOfStoreApi (query) {
      return $fetch('/data/excel/inspect_of_store', { body: query })
    },
    // 获取资金统计流水图
    GetEcharReportSumApi (query) {
      return $fetch('/dashboard/order_statistics/daily_summary', { body: query })
    }
  },
}
