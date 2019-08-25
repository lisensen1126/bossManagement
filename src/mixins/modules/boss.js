import {
  $fetch,
} from '@/plugins/Fetch'

export default {
  methods: {
    // 设为主推 product/main-push
    setSkuPushApi (query) {
      return $fetch('shop/main-push', {
        method: 'GET',
        body: query,
      })
    },
    // 平台商品 service/hub_list
    bossProductApi (query) {
      return $fetch('shop/hub_list', {
        method: 'GET',
        body: query,
      })
    },
    bossServiceApi (query) {
      return $fetch('service/hub_list', {
        method: 'GET',
        body: query,
      })
    },
    // 删除品牌
    delBrandApi (query) {
      return $fetch('brand/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 分类新增
    addClassify (query) {
      return $fetch('category/create', {
        method: 'POST',
        body: query,
      })
    },
    // 分类编辑
    editClassify (query) {
      return $fetch('category/update', {
        method: 'PUT',
        body: query,
      })
    },
    // 商品分类、服务分类列表
    classifyList (query) {
      return $fetch('category/list', {
        method: 'GET',
        body: query,
      })
    },
    // 分类属性添加 编辑 删除
    classifyAttrAdd (query) {
      return $fetch('attribute/save', {
        method: 'POST',
        body: query,
      })
    },
    // 分类属性列表
    classifyAttrList (query) {
      return $fetch('attribute/list', {
        method: 'GET',
        body: query,
      })
    },
    // 分类关联品牌
    classifyRelationBrand (query) {
      return $fetch('category/brands', {
        method: 'PUT',
        body: query,
      })
    },
    // 品牌列表
    brandList (query) {
      return $fetch('brand', {
        method: 'GET',
        body: query,
      })
    },
    // 品牌新增
    brandAdd (query) {
      return $fetch('brand', {
        method: 'POST',
        body: query,
      })
    },
    // 品牌编辑
    brandEdit (query) {
      return $fetch('brand/update', {
        method: 'POST',
        body: query,
      })
    },
    // 商品新增
    commoditycreate (query) {
      return $fetch('shop', {
        method: 'POST',
        body: query,
      })
    },

    // 商品编辑
    commodityEdit (query) {
      return $fetch('shop/update', {
        method: 'POST',
        body: query,
      })
    },
    // 商品详情
    commodityDetail (query) {
      return $fetch(`shop/${query.product_id}`, {
        method: 'GET',
      })
    },
    // 商品上下架
    commodityUpdateSale (query) {
      return $fetch('shop/update_sale', {
        method: 'POST',
        body: query,
      })
    },
    // 服务列表
    serviceList (query) {
      return $fetch('service/list', {
        method: 'GET',
        body: query,
      })
    },

    // 服务新增
    serviceAdd (query) {
      return $fetch('service/create', {
        method: 'POST',
        body: query,
      })
    },
    // 服务编辑
    serviceEdit (query) {
      return $fetch('service/update', {
        method: 'POST',
        body: query,
      })
    },
    // 服务详情
    serviceDetail (query) {
      return $fetch('service/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 服务上下架
    serviceUpdateSale (query) {
      return $fetch('service/update_sale', {
        method: 'POST',
        body: query,
      })
    },
    // 商品列表
    commodityList (query) {
      return $fetch('shop', {
        method: 'GET',
        body: query,
      })
    },
    // 商品新增
    commodityAdd (query) {
      return $fetch('product/create', {
        method: 'POST',
        body: query,
      })
    },
    // 商户列表
    commercialList (query) {
      return $fetch('product/create', {
        method: 'POST',
        body: query,
      })
    },
    // 获取含（品牌）的分类属性列表
    getBrandAttrApi (query) {
      return $fetch('attribute/category_brand_list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取分类属性关联的品牌
    getClassfiyBrandApi (query) {
      return $fetch('attribute/brand_list', {
        method: 'GET',
        body: query,
      })
    },
    // 含（品牌）的分类属性配置保存
    setClassifyBrandApi (query) {
      return $fetch('attribute/category_brand_save', {
        method: 'POST',
        body: query,
      })
    },
    // 保存分类下设置属性的品牌
    setClassifyBrandListApi (query) {
      return $fetch('attribute/brand_save', {
        method: 'POST',
        body: query,
      })
    },
    // 删除商品
    deleteGoodsApi (query) {
      return $fetch('product/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 删除服务
    deleteServiceApi (query) {
      return $fetch('service/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 商品sku列表
    getSkuGoods (query) {
      return $fetch('product/product_list', {
        method: 'POST',
        body: query,
      })
    },
    // 服务sku列表 product/service_list
    getSkuServe (query) {
      return $fetch('product/service_list', {
        method: 'POST',
        body: query,
      })
    },
  },
}
