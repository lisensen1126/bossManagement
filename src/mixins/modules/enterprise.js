import {$fetch, root} from '@/plugins/Fetch'
import {$axios} from '@/plugins/axios'

export default {
  methods: {
    // 白名单门店列表
    whiteStoreListApi () {
      return $fetch('mini_app/white_lists', {
        method: 'POST',
      })
    },
    // 白名单添加
    addWhiteStoreApi (query) {
      return $fetch('mini_app/add_white', {
        method: 'POST',
        body: query,
      })
    },
    // 获取服务认证列表
    getFWList (query) {
      return $fetch('setting/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取门店列表
    fetchStoreList (query) {
      return $fetch('stores/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取门店列表
    fetchXianFengList (query) {
      return $fetch('xianfeng/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取门店编码为空的门店列表
    fetchNullCodeList (query) {
      return $fetch('stores/list_null_store_code', {
        method: 'POST',
        body: query,
      })
    },
    // 关联门店编码到已有的门店
    fetchUpdateCode (query) {
      return $fetch('stores/update_store_code', {
        method: 'POST',
        body: query,
      })
    },
    // 修改门店i
    updateStore (id, params) {
      return $fetch('stores/update', {
        method: 'POST',
        body: params,
      })
    },
    // 评论 - 门店评论列表
    fetchCommentStore (query) {
      return $fetch('comment/store', {query})
    },
    // 评论 - 删除
    deleteEvaluateApi (query) {
      return $fetch('comment/store/delete', {query})
    },
    // 省市区
    fetchRegions (query) {
      return $fetch('common/area', {query})
      // return $fetch('regions', {query})
    },
    // 下拉 - 省
    fetchProvinceList (query) {
      return $fetch('common/area', {query})
    },
    // 下拉 - 市
    fetchCityList (query) {
      return $fetch('common/area', {query})
    },
    // 创建门店
    addStore (body) {
      return $fetch('stores/create', {
        method: 'POST',
        body: body,
      })
    },
    // 门店详情
    storeDetail (body) {
      return $fetch('stores/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 门店临时数据详情
    storeXianFengDetail (body) {
      return $fetch('xianfeng/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 获取服务收集列表
    fuCollectionList (query) {
      return $fetch('service/collect_list', {query})
    },
    // 获取商品收集列表
    goodCollectionList (query) {
      return $fetch('product/collect_list', {query})
    },
    // 分类列表
    getCateList (query) {
      return $fetch('category/list', {query})
    },
    // 品牌列表
    getPai (query) {
      return $fetch('brand', {query})
    },
    // 添加到商品库
    AddGoods (query) {
      return $fetch('product/collect_add', {
        method: 'POST',
        body: query,
      })
    },
    // 添加到服务库
    AddServe (query) {
      return $fetch('service/collect_add', {
        method: 'POST',
        body: query,
      })
    },
    // 企业列表
    GetEnterList (query) {
      return $fetch('enterprise/list', {query})
    },
    // 企业修改
    updateEnter (query) {
      return $fetch('enterprise/update', {
        method: 'POST',
        body: query,
      })
    },
    // 企业添加
    addEnter (query) {
      return $fetch('enterprise/create', {
        method: 'POST',
        body: query,
      })
    },
    // 企业详情
    enterDetail (query) {
      return $fetch('enterprise/detail', {query})
    },
    // 悠洛客app配置
    setApp (query) {
      return $fetch('enterprise/setUlucuSetting', {
        method: 'POST',
        body: query,
      })
    },
    // 获取APP配置
    getApp (query) {
      return $fetch('enterprise/getUlucuSetting', {query})
    },
    // 设备列表
    equipmentList (query) {
      return $fetch('enterprise/getUlucuRelations', {query})
    },
    // 设备添加
    addEquipment (query) {
      return $fetch('enterprise/createUlucuRelation', {
        method: 'POST',
        body: query,
      })
    },
    // 设备删除
    delEquipment (query) {
      return $fetch('enterprise/deleteUlucuRelation', {
        method: 'POST',
        body: query,
      })
    },
    // 设备编辑
    updateEquipment (query) {
      return $fetch('enterprise/updateUlucuRelation', {
        method: 'POST',
        body: query,
      })
    },
    // 跳转门店
    goStore (id) {
      return $fetch(`enterprise/login/${id}`, {
        method: 'GET',
      })
    },
    // 获取支付
    getPay (query) {
      return $fetch('enterprise/getPaySetting', {query})
    },
    // 设置支付
    setPay (body) {
      let formdata = new FormData()
      formdata.append('private_key', body.private_key)
      formdata.append('public_key', body.public_key)
      formdata.append('channel_id', body.channel_id)
      formdata.append('merchant_id', body.merchant_id)
      formdata.append('merchant_key', body.merchant_key)
      formdata.append('enterprise_id', body.enterprise_id)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/enterprise/setPaySetting`,
          method: 'post',
          data: formdata,
        }).then((res) => { return reslove(res) })
      })
      return promise
    },
    // 管理员列表
    adminList (query) {
      return $fetch('admin/list', {
        method: 'GET',
        body: query,
      })
    },
    // 管理员添加 admin/save
    adminAdd (query) {
      return $fetch('admin/create', {
        method: 'POST',
        body: query,
      })
    },
    // 管理员更改
    adminUpdate (query) {
      return $fetch('admin/update', {
        method: 'POST',
        body: query,
      })
    },
    // 重置密码
    resetPassWord (query) {
      return $fetch('admin/reset', {
        method: 'POST',
        body: query,
      })
    },
    // 管理员禁用启用admin/state
    adminState (query) {
      return $fetch('admin/state', {
        method: 'GET',
        body: query,
      })
    },
    // 小程序版本切换
    updataMiniType (query) {
      return $fetch('stores/update_mini_type', {
        method: 'POST',
        body: query,
      })
    },
    // 自建门店上传电子合同
    upContractApi (query) {
      let formdata = new FormData()
      formdata.append('store_id', query.store_id)
      formdata.append('file', query.file)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/stores/update_compact_url`,
          method: 'post',
          data: formdata,
        }).then((res) => { return reslove(res) })
      })
      return promise
    },
    // 同步门店上传电子合同
    upAfferentApi (query) {
      let formdata = new FormData()
      formdata.append('id', query.id)
      formdata.append('file', query.file)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/xianfeng/upload_pdf`,
          method: 'post',
          data: formdata,
        }).then((res) => { return reslove(res) })
      })
      return promise
    },
    // 修改同步门店的签约状态
    setSigningApi (query) {
      return $fetch('xianfeng/update_sign_status', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序相关管理 - 体验二维码
    testCodeAPi (query) {
      return $fetch('debug/test_qrcode', {
        method: 'POST',
        body: query,
      })
    },
    // 小程序相关管理 - 体验者列表
    testerListAPi (query) {
      return $fetch('debug/tester_list', {
        method: 'GET',
        body: query,
      })
    },
    // 小程序相关管理 - 添加体验权限
    createTesterAPi (query) {
      return $fetch('debug/create_tester', {
        method: 'POST',
        body: query,
      })
    },
    // 超管删除企业
    deleteEnterpriseApi (body) {
      return $fetch('enterprise/delete', {
        method: 'POST',
        body,
      })
    },
    // 企业类型切换
    storeTypeChangeApi (body) {
      return $fetch('enterprise/check_chain', {
        method: 'POST',
        body,
      })
    },
  },
}
