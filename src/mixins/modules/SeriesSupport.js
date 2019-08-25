import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 分类列表 brand_category/list
    brandCategoryListApi (body) {
      return $fetch('brand_category/list', {
        method: 'GET',
        body: body,
      })
    },
    // 分类删除 brand_category/delete
    delBrandCategoryApi (body) {
      return $fetch('brand_category/delete', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌添加分类 brand_category/add
    addBrandCategoryApi (body) {
      return $fetch('brand_category/add', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌编辑分类 brand_category/save
    editBrandCategoryApi (body) {
      return $fetch('brand_category/save', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持添加brand_content/add
    addContentApi (body) {
      return $fetch('brand_content/add', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持编辑brand_content/add
    editContentApi (body) {
      return $fetch('brand_content/save', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持详情
    detailContentApi (body) {
      return $fetch('brand_content/detail', {
        method: 'GET',
        body: body,
      })
    },
    // 品牌支持删除
    delContentApi (body) {
      return $fetch('brand_content/delete', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持列表
    contentListApi (body) {
      return $fetch('brand_content/list', {
        method: 'GET',
        body: body,
      })
    },
    // 品牌支持切换顺序brand_content/switch_sort
    contentSortApi (body) {
      return $fetch('brand_content/switch_sort', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持切换分类brand_content/switch_sort
    contentCateApi (body) {
      return $fetch('brand_content/switch_cate', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌支持切换状态brand_content/switch_sort
    contentStatusApi (body) {
      return $fetch('brand_content/status', {
        method: 'POST',
        body: body,
      })
    },
    // 已经选择的id
    getChooseIdsApi (body) {
      return $fetch('brand_series/service_check_ids', {
        method: 'POST',
        body: body,
      })
    },
    // 保存服务 brand_series/service_edit_operation
    saveServiceApi (body) {
      return $fetch('brand_series/service_edit_operation', {
        method: 'POST',
        body: body,
      })
    },
    // 保存商品 save_goods
    saveGoodApi (body) {
      return $fetch('brand_series/save_goods', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌sku状态操作
    setSkuStatusApi (body) {
      return $fetch('brand_series/sku_status', {
        method: 'POST',
        body: body,
      })
    },
    // 设为主推
    setSkuMainApi (body) {
      return $fetch('brand_series/main_push', {
        method: 'POST',
        body: body,
      })
    },
    // 品牌系列列表
    getSeriesListApi (body) {
      return $fetch('brand_series/list', {
        method: 'POST',
        body: body,
      })
    },
    // 删除品牌系列
    delSeriesApi (body) {
      return $fetch('brand_series/del', {
        method: 'GET',
        body: body,
      })
    },
    // 引用商品列表
    goodListApi (body) {
      return $fetch('brand_series/shop', {
        method: 'POST',
        body: body,
      })
    },
    // 引用服务列表
    serviceListApi (body) {
      return $fetch('brand_series/service_list', {
        method: 'POST',
        body: body,
      })
    },
    // 商品上下架
    changeGoodApi (body) {
      return $fetch('brand_series/status', {
        method: 'POST',
        body: body,
      })
    },
    // 商品详情 goods_detail
    goodDetailApi (body) {
      return $fetch('brand_series/goods_detail', {
        method: 'GET',
        body: body,
      })
    },
    // 品牌系列排序 sort
    seriesSortApi (body) {
      return $fetch('brand_series/sort', {
        method: 'POST',
        body: body,
      })
    },
    // 添加
    seriesAddApi (body) {
      return $fetch('brand_series/add', {
        method: 'POST',
        body: body,
      })
    },
    // 编辑
    seriesEditApi (body) {
      return $fetch('brand_series/save', {
        method: 'POST',
        body: body,
      })
    },
  },
}
