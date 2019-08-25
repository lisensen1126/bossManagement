<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="请输入公告标题", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createNotice")
            span.add-icon
            span 新建公告
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有公告'")
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 公告标题
              td(width="100") 发布时间
              td(width="100") 操作人
              td(width="120") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.m-r-20(v-text="item.title")
              td
                .multi-content-td.m-r-20(v-text="item.created_at")
              td
                .simple-td(v-text="item.admin_name")
              td
                .operation-td
                  span.release(v-if="item.release==1") 已发布
                  span.operation-link(v-else-if="item.release==2", @click="releaseNotice(item)") 发布
                  span.operation-link(@click="noticeDetail(item)") 查看
                  span.operation-link(@click="deleteNotice(item)") 删除
                  span.operation-link(@click="editNotice(item)") 再次编辑
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import bossApi from '@/mixins/modules/Content'
import EmptyPage from '@/components/generics/EmptyPage'
import filterTools from '@/mixins/utilities/filterTools'

export default {
  name: 'noticeList',
  mixins: [filterTools, bossApi],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    filterTools,
  },
  data () {
    const schema = {
      is_initiated: false,
      filter_data: {
        keyword: '',
      },
      query_data: {
        keyword: '',
      },
      list: [],
      pagination_data: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      is_search: false, // 是否搜索(翻页判断时使用)
      is_first_enter: false, // 是否第一次进入
    }
      // initialize conditions
      ;[schema.filter_data, schema.query_data].forEach(conditions => {
        conditions.keyword = ''
      })
    return schema
  },
  methods: {
    /*
    *  删除公告操作
    *  @item 删除的对象
    * */
    releaseNotice (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认发布该系统公告吗？',
        isRejectable: 1,
        resolve: () => {
          this.release(item)
        },
      })
    },
    async release (item) {
      try {
        let { response, result } = await this.ReleaseNoticeClassifyApi({
          id: item.id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '发布成功',
          })
          item.release = 1
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '发布失败',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '发布失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    /*
    *  删除公告操作
    *  @item 删除的对象
    * */
    deleteNotice (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认删除该系统公告吗？',
        isRejectable: 1,
        resolve: () => {
          this.deleteApi(item)
        },
      })
    },
    /*
    * 删除公告接口
    * @flag {Object} 删除公告的信息
    * */
    async deleteApi (item) {
      try {
        let { response, result } = await this.messageDeleteApi({
          id: item.id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '删除成功',
          })
          this.fetchData() // 刷新列表
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val, type) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      if (type === 'data') {
        return Y + M + D
      } else if (type === 'datetime') {
        return Y + M + D + h + m
      } else {
        return Y + M + D + h + m
      }
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
    // 获取公告列表数据
    async fetchData () {
      try {
        const { response, result } = await this.messageListApi({
          keyword: this.is_search ? this.filter_data.keyword : '',
          category_id: this.classify_id,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.created_at = this.changeDateTime(item.created_at)
          })
          this.list = result.data
          this.pagination_data = result.meta
          this.is_initiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取公告列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取公告列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.is_initiated = true
    },
    // 翻页操作
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },
    // 搜索
    applyFilter () {
      this.is_search = true
      this.pagination_data.current_page = 1
      this.fetchData()
    },

    // 重置
    resetFilter () {
      this.is_search = false
      this.filter_data.keyword = ''
      this.pagination_data.current_page = 1
      this.fetchData()
    },
    // 新建公告
    createNotice () {
      this.$router.push({
        name: 'noticeAdd',
        query: {
          edit: 1,
          classify_id: this.classify_id,
        },
      })
    },

    // 再次编辑公告（复制功能）
    editNotice (item) {
      // 记录列表页数
      this.$router.push({
        name: 'noticeAdd',
        query: {
          id: item.id,
          edit: 2,
          classify_id: this.classify_id,
        },
      })
    },

    // 公告详情
    noticeDetail (item) {
      // 记录列表页数
      this.$router.push({
        name: 'noticeAdd',
        query: {
          id: item.id,
          edit: 3,
        },
      })
    },
  },
  mounted () {
    this.is_first_enter = true
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if ((from.name === 'noticeAdd' || from.query.edit === 2) && to.query.save !== 1) {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    this.classify_id = this.$route.params.id
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter()
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.release {
  margin-right 12px
  color #999
}

td,.multi-content-td {
  vertical-align: middle;
  word-break break-all;
}

.prior-conditions {
  background-color: #fcfcfc;
}

.field {
  &.is-keyword {
    width: 300px;
  }

  &.is-narrow {
    width: 140px;
  }
}

.package-content {
  display: flex;
  padding-right: 18px;
  flex-direction: column;
  justify-content: center;
  line-height: 18px;
  height: 36px;
  overflow: hidden;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.button {
  align-items: center;
}

.page-selector {
  label {
    z-index: 5;
  }
}

.tfoot {
  overflow: hidden;
}

.batched-operations {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  background-color: #fff;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.08);
}

.sliding-enter-active {
  transition: top ease-in 0.2s;
}

.sliding-leave-active {
  transition: top ease-out 0.2s;
}

.sliding-enter, .sliding-leave-to {
  top: 100%;
}

.batched-operation-segment, .batched-operation-divider {
  margin-left: 16px;
  cursor: default;
}

.batched-operation-segment {
  line-height: 16px;
  font-size: 13px;
  color: lightGrey;
}

.batched-operation-divider {
  height: 13px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.selected-item-count {
  margin: 0 2px;
  color: standblack;
}

.batched-operation {
  color: #2fabdd;
  cursor: pointer;

  &.is-secondary {
    color: lightGrey;
  }

  &.is-danger {
    color: error;
  }
}

.m-r-20 {
  margin-right: 20px;
}

.tfoot {
  overflow: hidden;
}

.batched-operations {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  background-color: #fff;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.08);
}

.sliding-enter-active {
  transition: top ease-in 0.2s;
}

.sliding-leave-active {
  transition: top ease-out 0.2s;
}

.sliding-enter, .sliding-leave-to {
  top: 100%;
}

.batched-operation-segment, .batched-operation-divider {
  margin-left: 16px;
  cursor: default;
}

.batched-operation-segment {
  line-height: 16px;
  font-size: 13px;
  color: lightGrey;
}

.batched-operation-divider {
  height: 13px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.selected-item-count {
  margin: 0 2px;
  color: standblack;
}

.batched-operation {
  color: #2fabdd;
  cursor: pointer;

  &.is-secondary {
    color: lightGrey;
  }

  &.is-danger {
    color: error;
  }
}

.up-down {
  margin-right: 10px;
}

/* 批量上下 样式 */
.btn-up {
  position: absolute;
  right: 108px;
}

.btn-down {
  position: absolute;
  right: 16px;
}

.btn-cover {
  color: #121212;
  background: #ffbb29;
  border: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  padding: 6px 14px;
  border-radius: 3px;
}
</style>

