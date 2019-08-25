import { $fetch, root } from '@/plugins/Fetch'
import { $axios } from '@/plugins/axios'
export default {
  methods: {
    // 平台轮播保存
    bossBannerSaveApi (body) {
      return $fetch('change_image/save_slide', {
        method: 'POST',
        body,
      })
    },
    // 平台轮播列表
    bossBannerListApi () {
      return $fetch('change_image/slide', {
        method: 'GET',
      })
    },
    // 平台轮播关联城市
    bossBannerCityApi (query) {
      return $fetch('change_image/slide_city', {
        method: 'GET',
        query,
      })
    },
    // 上传导出
    allImport (body) {
      let formdata = new FormData()
      formdata.append('excel', body.file)
      let promise = new Promise((reslove, reject) => {
        return $axios({
          url: `${root}/excel/merge`,
          method: 'post',
          data: formdata,
        }).then(res => {
          return reslove(res)
        })
      })
      return promise
    },
    // z主引导列表
    indexList () {
      return $fetch('home/guide', {
        method: 'GET',
      })
    },
    // 平台开屏保存
    bossSaveOpenApi (body) {
      return $fetch('page_manage/save_open_screen', {
        method: 'POST',
        body,
      })
    },
    // 平台开屏列表
    bossOpenListApi () {
      return $fetch('page_manage/open_screen_list', {
        method: 'GET',
      })
    },
    // 保存推荐换油
    saveOilApi (body) {
      return $fetch('page_manage/save_oil_img', {
        method: 'POST',
        body,
      })
    },
    // 查看推荐换油
    oilDetailApi () {
      return $fetch('page_manage/oil_img', {
        method: 'GET',
      })
    },
    // 平台开屏选择过的城市列表 page_manage/open_screen_city
    getOpenCityApi (query) {
      return $fetch('page_manage/open_screen_city', {
        method: 'GET',
        query,
      })
    },
    // 更新引导列表
    updateIndex (query) {
      return $fetch('home/guide', {
        method: 'PATCH',
        body: query,
      })
    },
    // 爆品列表
    hotList (query) {
      return $fetch('hot/list', {
        method: 'POST',
        body: query,
      })
    },
    // 更新爆品
    updateHotList (query) {
      return $fetch('hot/add', {
        method: 'POST',
        body: query,
      })
    },
    // 管理员列表
    basicsAdminList (query) {
      return $fetch('bossAdmin/list', {
        method: 'GET',
        body: query,
      })
    },
    // 管理员添加 admin/save
    basicsAdminAdd (query) {
      return $fetch('bossAdmin/create', {
        method: 'POST',
        body: query,
      })
    },
    // 管理员禁用启用admin/state
    basicsAdminState (query) {
      return $fetch('bossAdmin/state', {
        method: 'GET',
        body: query,
      })
    },
    //  重置密码
    basicsResetPassword (query) {
      return $fetch('bossAdmin/reset', {
        method: 'GET',
        body: query,
      })
    },
    //  版本列表
    smallEditionlist (query) {
      return $fetch('mini/list', {
        method: 'GET',
        body: query,
      })
    },
    // 查看审核状态
    miniCheckApi (query) {
      return $fetch('mini/check', {
        method: 'POST',
        body: query,
      })
    },
    // 全部提审
    allAuditingApi () {
      return $fetch('debug/mini_program_code', {
        method: 'POST',
      })
    },
    // 提审
    auditing (query) {
      return $fetch('mini/submit', {
        method: 'POST',
        body: query,
      })
    },
    // 撤审
    revokeAudit (query) {
      return $fetch('mini/cancel', {
        method: 'POST',
        body: query,
      })
    },
    // 上线
    goOnline (query) {
      return $fetch('mini/online', {
        method: 'POST',
        body: query,
      })
    },
    // 下线
    downLine (query) {
      return $fetch('mini/offline', {
        method: 'POST',
        body: query,
      })
    },
    // 认证/服务  列表
    settingList (query) {
      return $fetch('setting/list', {
        method: 'GET',
        body: query,
      })
    },
    // 认证/服务  更新
    settingUpdate (query) {
      return $fetch('setting/update', {
        method: 'POST',
        body: query,
      })
    },
    // 认证/服务  删除
    settingDelete (query) {
      return $fetch('setting/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 认证/服务  创建
    settingCreate (query) {
      return $fetch('setting/create', {
        method: 'POST',
        body: query,
      })
    },
    // 轮播图列表
    getBannerList () {
      return $fetch('change_image/list', {
        method: 'GET',
      })
    },
    // 轮播图保存
    saveBanner (query) {
      return $fetch('change_image/save', {
        method: 'POST',
        body: query,
      })
    },
    // 超级品牌日列表
    getSuperBannerList () {
      return $fetch('brand_day/list', {
        method: 'GET',
      })
    },
    // 超级品牌日保存
    saveSuperBanner (query) {
      return $fetch('brand_day/save', {
        method: 'POST',
        body: query,
      })
    },
    // 修改密码
    updatePswd (query) {
      return $fetch('bossAdmin/update_password', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 品牌日锁定
    doLockSup (query) {
      return $fetch('/brand_day/set_locking', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 轮播图锁定
    doLock (query) {
      return $fetch('/change_image/set_locking', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 开机大屏列表
    fetchOpenScreenList () {
      return $fetch('/home_screen/list', {
        method: 'GET',
      })
    },
    // 开机大屏保存
    doSaveOpenScreen (query) {
      return $fetch('/home_screen/create_or_update_all', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 开机大屏锁定
    lockOpenScreen (query) {
      return $fetch('/home_screen/setting', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 品牌专区列表
    fetchBrandAreaApi (query) {
      return $fetch('brand-interval/list', {
        method: 'GET',
        body: query,
      })
    },
    // 品牌专区保存
    saveBrandAreaApi (query) {
      return $fetch('brand-interval/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌馆列表
    fetchBrandListApi (query) {
      return $fetch('brand_house/list', {
        method: 'GET',
        body: query,
      })
    },
    // 小贴士列表
    fetchTipListApi (query) {
      return $fetch('tip/list', {
        method: 'POST',
        body: query,
      })
    },
    // 小贴士保存
    saveTipListApi (query) {
      return $fetch('tip/add', {
        method: 'POST',
        body: query,
      })
    },
    // 指定轮播图列表
    getAppointBannerListApi () {
      return $fetch('change_image/list_new', {
        method: 'POST',
      })
    },
    // 指定轮播图保存
    saveAppointBannerApi (query) {
      return $fetch('change_image/save_store', {
        method: 'POST',
        body: query,
      })
    },
    // 指定选择过的城市列表
    getAppointCityApi (query) {
      return $fetch('change_image/city_chosen', {
        method: 'POST',
        body: query,
      })
    },
    // 获取门店列表数据
    getStoreListApi (query) {
      return $fetch('/change_image/store_list', {
        method: 'POST',
        body: { ...query },
      })
    },
    // 上传视频列表
    getVideoListApi (query) {
      return $fetch('/common/video_list', {
        method: 'POST',
        body: { ...query },
      })
    },
  },
}
