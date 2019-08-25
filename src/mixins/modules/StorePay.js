import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 美团省市区
    getAdressApi (body) {
      return $fetch('meituan/get_location', {
        method: 'GET',
        body,
      })
    },
    // 获取虚拟门店
    getMerchantApi (body) {
      return $fetch('meituan/get_merchant', {
        method: 'GET',
        body,
      })
    },
    // 创建虚拟门店
    createMerchantApi (body) {
      return $fetch('meituan/create_merchant_poi', {
        method: 'POST',
        body: body,
      })
    },
    // 银行卡验证
    brandCardApi (body) {
      return $fetch('meituan/verify_card', {
        method: 'POST',
        body: body,
      })
    },
    // 银行省市
    adressApi (body) {
      return $fetch('meituan/city_list', {
        method: 'GET',
        body,
      })
    },
    // 开户总行列表
    getTotalApi () {
      return $fetch('meituan/bank_info', {
        method: 'GET',
      })
    },
    // 开户支行
    getBranchApi (body) {
      return $fetch('meituan/bank_branch', {
        method: 'GET',
        body,
      })
    },
    // 提交支付
    openPayApi (body) {
      return $fetch('meituan/open_payment', {
        method: 'POST',
        body: body,
      })
    },
    // 重新开户
    resetMerchantApi (body) {
      return $fetch('meituan/reset_merchant', {
        method: 'POST',
        body: body,
      })
    },
    // 超管删除门店
    deleteStoreApi (query) {
      return $fetch('stores/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 第三方对接日志列表(小程序授权，服务号授权，美团支付)
    getOperationLogApi (body) {
      return $fetch('operation_log/third_party/list', {
        method: 'GET',
        body,
      })
    },
    // 获取平台门店列表
    fetchStoreApi (body) {
      return $fetch('apply_information/storeList', {
        method: 'GET',
        body: body,
      })
    },
    // 禁入/解禁/修改门店申请信息
    debarStoreApi (body) {
      return $fetch('apply_information/storeSave', {
        method: 'POST',
        body: body,
      })
    },
    // 查看门店申请信息
    seeStoreApi (body) {
      return $fetch('apply_information/storeDetail', {
        method: 'POST',
        body: body,
      })
    },
    // 删除门店信息
    delStoreApi (body) {
      return $fetch('apply_information/storeDelete', {
        method: 'GET',
        body: body,
      })
    },
    // 门店范围详情
    hubstorescopeDetailApi (body) {
      return $fetch('hubstorescope/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 门店范围保存
    hubstorescopeSaveApi (body) {
      return $fetch('hubstorescope/save', {
        method: 'POST',
        body: body,
      })
    },
    // 平台评论列表
    commentListApi (body) {
      return $fetch('comment/hub', {
        method: 'GET',
        body: body,
      })
    },
    // 删除平台评论列表
    delcommentApi (body) {
      return $fetch('comment/store/delete', {
        method: 'GET',
        body: body,
      })
    },
    // token失败小程序列表
    getTokenInvalidApi () {
      return $fetch('mini_app/mini_app_list', {
        method: 'POST',
      })
    },
    // 切换美团虚拟商户
    setChangeMerchantApi (body) {
      return $fetch('meituan/change_merchant', {
        method: 'POST',
        body,
      })
    },
  },
}
