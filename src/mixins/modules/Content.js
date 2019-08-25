import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 内容列表
    ContentListApi (query) {
      return $fetch('content/list', {
        method: 'GET',
        body: query,
      })
    },
    // 内容-创建
    ContentCreateApi (query) {
      return $fetch('content/create', {
        method: 'POST',
        body: query,
      })
    },
    // 内容-更新
    ContentUpdateApi (query) {
      return $fetch('content/update', {
        method: 'POST',
        body: query,
      })
    },
    // 内容-详情
    ContentDetailApi (query) {
      return $fetch('content/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 内容-删除
    ContentDeleteApi (query) {
      return $fetch('content/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 报名用户 - 列表
    SignUpUserListApi (query) {
      return $fetch('content/list_user', {
        method: 'POST',
        body: query,
      })
    },
    // 开启报名 - 列表
    SignUpApi (query) {
      return $fetch('content/sign_up', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告-列表
    messageListApi (query) {
      return $fetch('message/list', {
        method: 'GET',
        body: query,
      })
    },
    // 系统公告-创建
    messageCreateApi (query) {
      return $fetch('message/create', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告-详情
    messageDetailApi (query) {
      return $fetch('message/detail', {
        method: 'GET',
        body: query,
      })
    },
    // 系统公告-删除
    messageDeleteApi (query) {
      return $fetch('message/delete', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告 - 公告分类列表
    NoticeClassifyListApi (query) {
      return $fetch('message/category_list', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告 - 创建公告分类
    CreateNoticeClassifyApi (query) {
      return $fetch('message/category_create', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告 - 修改公告分类
    UpdateNoticeClassifyApi (query) {
      return $fetch('message/category_update', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告 - 修改公告分类
    DeleteNoticeClassifyApi (query) {
      return $fetch('message/category_delete', {
        method: 'POST',
        body: query,
      })
    },
    // 系统公告 - 发布公告
    ReleaseNoticeClassifyApi (query) {
      return $fetch('message/release', {
        method: 'POST',
        body: query,
      })
    },
  },
}
