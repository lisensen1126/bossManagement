import { $fetch, root } from '@/plugins/Fetch'
import { $axios } from '@/plugins/axios'

export default {
  methods: {
    // 海报背景列表
    getPosterListApi (query) {
      return $fetch('poster/list', {
        method: 'GET',
        body: query,
      })
    },
    // 海报背景详情
    getPosterDetailApi (query) {
      return $fetch('poster/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 海报背景删除
    getPosterDeleteApi (query) {
      return $fetch('poster/delete', {
        method: 'GET',
        body: query,
      })
    },
    // 海报背景添加
    getPosterAddApi (query) {
      return $fetch('poster/add', {
        method: 'POST',
        body: query,
      })
    },
    // 海报背景编辑
    getPosterSaveApi (query) {
      return $fetch('poster/save', {
        method: 'POST',
        body: query,
      })
    },
    // 海报背景状态 getPosterStatusApi
    getPosterStatusApi (query) {
      return $fetch('poster/status', {
        method: 'POST',
        body: query,
      })
    },
    // 获取直供奖品列表
    getPrizeList (query) {
      return $fetch('lottery/prize_list', {
        method: 'GET',
        body: query,
      })
    },
    // 中奖清单
    getDrawList (query) {
      return $fetch('lottery/prize/draw_list', {
        method: 'GET',
        body: query,
      })
    },
    // 下架活动
    downEvent (params) {
      return $fetch('lottery/lottery/down', {
        method: 'POST',
        body: params,
      })
    },
    // 省市区
    fetchRegions (query) {
      return $fetch('common/area', { query })
      // return $fetch('regions', {query})
    },
    // 创建活动
    createEvents (body) {
      return $fetch('lottery/lottery/create', {
        method: 'POST',
        body: body,
      })
    },
    // 活动列表
    eventList (body) {
      return $fetch('lottery/lottery/list', {
        method: 'GET',
        body: body,
      })
    },
    // 活动详情
    eventDetail (body) {
      return $fetch('lottery/lottery/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 获取门店列表
    storeList (body) {
      return $fetch('lottery/lottery/stores', {
        method: 'POST',
        body: body,
      })
    },
    // 创建奖品
    createPrize (body) {
      // console.log(body)
      return $fetch('lottery/prize/create', {
        method: 'POST',
        body: body,
      })
    },
    // 删除奖品
    delPrize (params) {
      return $fetch('lottery/prize/delete', {
        method: 'POST',
        body: params,
      })
    },
    // 奖品列表
    prizeList (body) {
      return $fetch('lottery/prize/list', {
        method: 'GET',
        body: body,
      })
    },
    // 短信模板 - 短信模板列表
    smsListApi (body) {
      return $fetch('sms-template/list', {
        method: 'GET',
        body: body,
      })
    },
    // 短信模板 - 删除短信模板
    smsDeleteApi (body) {
      return $fetch('sms-template/delete', {
        method: 'POST',
        body: body,
      })
    },
    // 短信模板 - 模板分类列表
    smsTypeApi (body) {
      return $fetch('sms-template/type-list', {
        method: 'GET',
        body: body,
      })
    },
    // 短信模板 - 新增短信模板
    smsAddApi (body) {
      return $fetch('sms-template/add', {
        method: 'POST',
        body: body,
      })
    },
    // 短信模板 - 更新短信模板
    smsUpdateApi (body) {
      return $fetch('sms-template/update', {
        method: 'POST',
        body: body,
      })
    },
    // 短信模板 - 短信模板详情
    smsDetailApi (body) {
      return $fetch('sms-template/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 短信发送记录详情 send-detail/{id}
    getSendDetailApi (query) {
      return $fetch('sms/send-detail', {
        method: 'GET',
        body: query,
      })
    },
    // 获取门店购买记录列表
    getAllowanceApi (data) {
      return $fetch('sms/allowance', {
        method: 'GET',
        body: data,
      })
    },
    // 获取统计数据
    getStatisticalApi (data) {
      return $fetch('sms/statistics', {
        method: 'GET',
        body: data,
      })
    },
    // 短信发送记录
    getSmsSendList (query) {
      return $fetch('sms/send-list', { query })
    },
    // 推荐客户分类数据 sms/recommend_category_list
    getSmsCategoryApi (query) {
      return $fetch('sms/recommend_category_list', {
        method: 'GET',
        body: query,
      })
    },
    // 推荐客户手机号列表 sms/recommend_list
    getSmsRecListApi (query) {
      return $fetch('sms/recommend_customer', {
        method: 'GET',
        body: query,
      })
    },
    // 导入用户手机号码
    exportPhoneApi (body) {
      let formdata = new FormData()
      formdata.append('excel', body.excel)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/sms/import`,
          method: 'post',
          data: formdata,
        }).then((res) => {
          return reslove(res)
        })
      })
      return promise
    },
    //  发送消息
    sendMsmApi (query) {
      return $fetch('sms/send', {
        method: 'POST',
        body: query,
      })
    },
    // 支付立减报名列表
    getPayStoreListApi (query) {
      return $fetch('/random_coupon/apply_list', {
        method: 'POST',
        body: query,
      })
    },
    // 支付立减报名详情
    getPayStoreDetail (query) {
      return $fetch('/random_coupon/store_apply_info', {
        method: 'POST',
        body: query,
      })
    },
    // 修改门店报名状态
    editPayStoreStatus (body) {
      return $fetch('/random_coupon/store_apply_edit', {
        method: 'POST',
        body,
      })
    },
    // 支付立减 统计总数据
    payReductionStatisticMainApi () {
      return $fetch('/random_coupon/statistics', {
        method: 'GET',
      })
    },
    // 支付立减 统计列表
    payReductionStatisticListApi (body) {
      return $fetch('/random_coupon/statistics_list', {
        method: 'GET',
        body,
      })
    },
    // 支付立减 门店交易明细
    payReductionStoreDetailApi (body) {
      return $fetch('/random_coupon/turnover_list', {
        method: 'GET',
        body,
      })
    },
  },
}
