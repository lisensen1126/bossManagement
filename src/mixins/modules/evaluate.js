import {$fetch} from '@/plugins/Fetch'
// 商品服务管理模块接口
export default {
  methods: {
    // 评论列表 - 商品评论列表
    fetchCommentGoods (query) {
      return $fetch('comment/goods', {query})
    },
    // 评论列表 - 服务评论列表
    fetchCommentService (query) {
      return $fetch('comment/service', {query})
    },
    // 评论列表 - 门店评论列表
    fetchCommentStore (query) {
      return $fetch('comment/store', {query})
    },
  },
}
