import {$fetch} from '@/plugins/Fetch'
/**
 * 订单管理相关接口
 * zhangqi
 */
export default {
  methods: {
    // 宣传海报列表
    fetchPosterListApi (data) {
      return $fetch('poster_material/list', {
        method: 'GET',
        body: {
          ...data,
        },
      })
    },
    // 宣传海报详情
    fetchPosterDetailApi (data) {
      return $fetch('poster_material/detail', {
        method: 'GET',
        body: {
          ...data,
        },
      })
    },
    // 添加宣传海报
    addPosterApi (data) {
      return $fetch('poster_material/add', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 编辑宣传海报
    updatePosterApi (data) {
      return $fetch('poster_material/update', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 更改宣传海报状态
    updateStatusPosterApi (data) {
      return $fetch('poster_material/update_status', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 删除宣传海报
    deletePosterApi (data) {
      return $fetch('poster_material/delete', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 爆炸贴列表
    fetchBangStickListApi (data) {
      return $fetch('bang_stick_material/list', {
        method: 'GET',
        body: {
          ...data,
        },
      })
    },
    // 爆炸贴详情
    fetchBangStickDetailApi (data) {
      return $fetch('bang_stick_material/detail', {
        method: 'GET',
        body: {
          ...data,
        },
      })
    },
    // 添加爆炸贴
    addBangStickApi (data) {
      return $fetch('bang_stick_material/add', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 编辑爆炸贴
    updateBangStickApi (data) {
      return $fetch('bang_stick_material/update', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 更改爆炸贴状态
    updateStatusBangStickApi (data) {
      return $fetch('bang_stick_material/update_status', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
    // 删除爆炸贴
    deleteBangStickApi (data) {
      return $fetch('bang_stick_material/delete', {
        method: 'POST',
        body: {
          ...data,
        },
      })
    },
  },
}
