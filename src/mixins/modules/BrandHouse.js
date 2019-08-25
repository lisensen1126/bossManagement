import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 保存品牌馆
    addBrandHouse (query) {
      return $fetch('brand_house/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌馆内容保存
    saveHouseContent (query) {
      return $fetch('brand_house_contents/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌馆服务商品保存
    saveHouseProducts (query) {
      return $fetch('brand_house_products/save', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌馆服务商品详情
    getHouseProducts (query) {
      return $fetch('brand_house_products/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 品牌馆列表
    brandHouseList (query) {
      return $fetch('brand_house/list', {
        method: 'GET',
        body: query,
      })
    },
    // 品牌馆视频保存
    saveHouseVideo (query) {
      return $fetch('brand_house_video/save', {
        method: 'POST',
        body: query,
      })
    },
    // 获取品牌馆视频
    getHouseVideo (query) {
      return $fetch('brand_house_video/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 获取品牌馆详情
    getHouseDetail (query) {
      return $fetch('brand_house/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 获取品牌馆图文详情
    getHouseContent (query) {
      return $fetch('brand_house_contents/detail', {
        method: 'GET',
        body: query,
      })
    },
  },
}
