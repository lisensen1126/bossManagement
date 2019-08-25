import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    /******************** 车检 ********************/
    // 车检列表
    getClassListApi (query) {
      return $fetch('inspect/list', {
        method: 'GET',
        body: query,
      })
    },
    // 创建车检
    createClassListApi (query) {
      return $fetch('inspect/create', {
        method: 'POST',
        body: query,
      })
    },
    // 删除车检
    delClassListApi (query) {
      return $fetch('inspect/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 获取车检详情
    getClassDetailApi (query) {
      return $fetch('inspect/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 编辑车检单
    editClassDetailApi (query) {
      return $fetch('inspect/update', {
        method: 'POST',
        body: query,
      })
    },
    /******************* 一级分类 ***********************/
    // 创建一级分类
    getFirstClassApi (query) {
      return $fetch('inspect_category/create', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑一级分类
    editFirstClassApi (query) {
      return $fetch('inspect_category/update', {
        method: 'POST',
        body: query,
      })
    },
    // 获取一级分类列表
    getFirstClassListApi (query) {
      return $fetch('inspect_category/list', {
        method: 'GET',
        body: query,
      })
    },
    // 获取一级分类详情
    getFirstDetailApi (query) {
      return $fetch('inspect_category/category_detail', {
        method: 'GET',
        body: query,
      })
    },
    // 删除项目或分类
    delProjectApi (query) {
      return $fetch('inspect_category/delete', {
        method: 'POST',
        body: query,
      })
    },
    /********************* 车检类型管理---车检项目 **************************/
    // 关联车检项目（关联）
    getRelationApi (query) {
      return $fetch('inspect_category/relation', {
        method: 'POST',
        body: query,
      })
    },
    // 获取车检详情
    getArticleDetailApi (query) {
      return $fetch('inspect_category/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 编辑车检项目详情
    editArticleDetailApi (query) {
      return $fetch('inspect_category/item_update', {
        method: 'POST',
        body: query,
      })
    },
    /********************* 车检项目 **************************/
    // 获取车检项目列表
    getArticleListApi (query) {
      return $fetch('inspect_item/list', {
        method: 'GET',
        body: query,
      })
    },
    // 保存车检项目
    saveInspectionApi (query) {
      return $fetch('inspect_item/create', {
        method: 'POST',
        body: query,
      })
    },
    // 编辑车检项目
    editInspectionApi (query) {
      return $fetch('inspect_item/update', {
        method: 'POST',
        body: query,
      })
    },
    // 获取车检项目详情
    getInspectionDetailApi (query) {
      return $fetch('inspect_item/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 删除项目
    delInspectionApi (query) {
      return $fetch('inspect_item/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡模板-列表
    cardTemplateListApi (query) {
      return $fetch('upkeep/template/list', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡模板-创建
    cardTemplateCreateApi (query) {
      return $fetch('upkeep/template/create', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡模板-启用禁用操作
    cardTemplateOperateApi (query) {
      return $fetch('upkeep/template/operate', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡模板-编辑
    cardTemplateUpdateApi (query) {
      return $fetch('upkeep/template/update', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡模板-详情
    cardTemplateDetailApi (query) {
      return $fetch('upkeep/template/detail', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡分类
    cardCategoryApi (query) {
      return $fetch('upkeep/card/category', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-上下架
    upkeepStatusApi (query) {
      return $fetch('upkeep/card/operate', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-列表
    upkeepListApi (query) {
      return $fetch('upkeep/card/list', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-创建
    upkeepCreateApi (query) {
      return $fetch('upkeep/card/create', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-更新
    upkeepUpdateApi (query) {
      return $fetch('upkeep/card/update', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-关联商品列表
    upkeepProductApi (query) {
      return $fetch('upkeep/card/goods', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-详情
    upkeepDetailApi (query) {
      return $fetch('upkeep/card/detail', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-删除
    upkeepDelApi (query) {
      return $fetch('upkeep/card/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 养护卡 - 养护卡-删除
    maintenanceDelApi (query) {
      return $fetch('upkeep/template/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 车检 - 车检场景&项目
    getVehicleSceneApi (query) {
      return $fetch('inspect/category-list-with-item', {
        method: 'GET',
        body: query,
      })
    },
    // 车检 - 场景设置项目
    setVehicleSceneApi (query) {
      return $fetch('inspect_category/save_item', {
        method: 'POST',
        body: query,
      })
    }, 
  },
}
