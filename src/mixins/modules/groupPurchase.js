import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    /* APIs */
    // 团购列表
    getTuanGouListApi (query) {
      return $fetch('xmd/tuan_gou/list', {
        method: 'GET',
        body: query,
      })
    },
    // 团购详情
    getTuanGouDetailApi (id) {
      return $fetch(`xmd/tuan_gou/detail?id=${id}`, {
        method: 'GET',
      })
    },
    // 团购下架
    setTuanGouStopApi (query) {
      return $fetch('xmd/tuan_gou/stop', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑团购
    updateTuanGouApi (query) {
      return $fetch('xmd/tuan_gou/update', {
        method: 'POST',
        body: query,
      })
    },
    // 团单列表
    getTuanDanListApi (query) {
      return $fetch('xmd/tuan_dan/list', {
        method: 'GET',
        body: query,
      })
    },
    // 团单详情
    getTuanDanDetailApi (id) {
      return $fetch(`xmd/tuan_dan/detail?id=${id}`, {
        method: 'GET',
      })
    },
    // 团单下架
    setTuanDanStopApi (query) {
      return $fetch('xmd/tuan_dan/stop', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑团单
    updateTuanDanApi (query) {
      return $fetch('xmd/tuan_dan/update', {
        method: 'POST',
        body: query,
      })
    },
    // 团单分类列表
    getTuanDanCatgortListApi (query) {
      return $fetch('xmd/tuan_gou/category', {
        method: 'GET',
        body: query,
      })
    },
    // 创建团购
    addTuanGouApi (query) {
      return $fetch('xmd/tuan_gou/create', {
        method: 'POST',
        body: query,
      })
    },
    // 关联门店
    setTuanGouStoreApi (query) {
      return $fetch('xmd/tuan_gou/relation_store', {
        method: 'POST',
        body: query,
      })
    },
    getStoreListApi (query) {
      return $fetch('xmd/tuan_gou/stores', {
        method: 'GET',
        body: query,
      })
    },
  },
}
