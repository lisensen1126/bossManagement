<template lang="pug">
  .section-layout
    .page-title
      .left 活动名称：购超凡喜力，赠引擎延保
      button.right.button(:disabled="!list.length", :class="{disabled:!list.length}" @click="exportUser") 导出当前数据
      a.right.button(@click="$router.back()") 返回

    empty-page(v-if="!list.length", tip="暂无数据")
    // 列表
    .content-wrapper.list-wrapper(v-else)
      .table-wrapper
        table.table
            thead
              tr
                td(v-for="item in table_head_list", v-text="item.name", :width="item.width")
            tbody(v-if="list.length")
              tr(v-for="(item, i) in list")
                td {{item.nickname}}
                td
                  .multi-content-td
                    .content-item
                      span.bottom-image
                        img.w_h36(:src="scaleImage(item.pic_url, 1, 36, 36)")
                td {{item.iphone}}
                td {{item.from === 1 ? '门店小程序用户' : '平台小程序用户'}}
                td {{item.created_at | formatDate}}
        .tfoot(v-if="list.length")
          pagination(:pagination-data="page_data", @input="paging")
</template>

<script>
import ContentApi from '@/mixins/modules/Content'
import imageScale from '@/mixins/utilities/imageScale'

import { root } from '@/plugins/Fetch'

import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
export default {
  name: 'RegistrationUser',
  components: { EmptyPage, Pagination },
  mixins: [ ContentApi, imageScale ],
  computed: {
    table_head_list () { // 表头
      return [
        { name: '微信昵称', width: '20%' },
        { name: '头像', width: '20%' },
        { name: '联系电话', width: '20%' },
        { name: '用户来源', width: '20%' },
        { name: '参与时间', width: '20%' },
      ]
    },
  },
  data () {
    return {
      list: [], // 列表
      page_data: null,
    }
  },
  created () {
    this.content_id = this.$route.params.id
    this.resetPageData()
  },
  mounted () {
    this.fetchDataList()
  },
  methods: {
    resetPageData () {
      this.page_data = {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      }
    },
    // 分页跳转
    paging (state) {
      this.page_data = state
      this.fetchDataList()
    },
    async fetchDataList () {
      try {
        const { response, result } = await this.SignUpUserListApi({
          contents_id: this.content_id,
          page: this.page_data.current_page,
          per_page: this.page_data.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.page_data = result.meta
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表失败',
          content: `错误信息：（${e}）`,
        })
      }
    },
    exportUser () {
      window.open(`${root}/content/export_user?contents_id=${this.content_id}`)
    },
  },
  filters: {
    formatDate (date) {
      if (date) {
        date = new Date(date *= 1000)
        return `${date.getFullYear()}-${
          date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${
          date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        } ${
          date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }`
      }
      return ''
    },
  },
}
</script>

<style lang="stylus" scoped>
.section-layout
  .page-title
    display: flex
    flex: 0 0 48px
    align-items: center
    position: relative
    padding: 0 40px
    background-color: #e8e9eb
    z-index: 8
    .left
      flex 1
      color: #353535;
      font-size: 13px;
  .right
    margin-left 16px
  .w_h36
    width 36px
    height 36px
</style>