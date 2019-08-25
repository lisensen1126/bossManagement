<template lang="pug">
  .section-layout
    .nav-back-btn(@click="navBack")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 评论来源
          custom-select(:list="statusList", v-model="filterData.getStatus", :input="changeStatus")
        .field
            a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有门店评价'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 评价内容
              td(width="80") 打分
              td(width="80") 综合评分
              td(width="80") 门店名称
              td(width="80") 时间
              td(width="80") 门店回复
              td(width="80") 来源
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.word-break(v-text="item.comment_content")
                .pic(v-if="item.comment_image.length>0")
                  open-image(img-type="3",:img-url="item.comment_image",key-name="image_url",mini-width="20",mini-height="20",margin-bottom="0", margin-right="5", border-radius="2")
              td
                .simple-td(v-text="item.comment_score[0].score + '分'")
              td
                .simple-td(v-text="item.avg_score + '分'")
              td
                .simple-td(v-text="item.store_name")
              td
                .simple-td {{item.created_at | formatTime}}
              td
                .multi-content-td.word-break(v-if="item.sub_comment && item.sub_comment.length > 0") {{item.sub_comment[0].comment_content}}
                .multi-content-td.word-break(v-else) - -
              td
                .simple-td(v-if="item.source_type === 1") 门店小程序
                .simple-td(v-if="item.source_type === 2") 平台小程序
              td
                .operation-td
                  a.operation-link(@click="deleteEvaluateTrue(item)") 删除
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import Pagination from '@/components/generics/Pagination'
  import enterpriseMixin from '@/mixins/modules/enterprise'
  import EmptyPage from '@/components/generics/EmptyPage'
  import imageScale from '@/mixins/utilities/imageScale'
  import filterTools from '@/mixins/utilities/filterTools'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import { formatTime } from '@/constants/filters'
  import OpenImage from '@/components/generics/OpenImage'
  export default {
    name: 'storeEvaluate',
    mixins: [enterpriseMixin, filterTools, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      EmptyPage,
      Pagination,
      filterTools,
      SlideOutModal,
      OpenImage,
    },
    filters: {
      formatTime: formatTime,
    },
    data: _ => {
      const schema = {
        // 活动的状态
        statusList: [
          {
            name: '全部',
            status: '',
          }, {
            name: '平台',
            status: '2',
          }, {
            name: '门店',
            status: '1',
          }
        ],
        filterData: {
          getStatus: {
            name: '全部',
            status: '',
          },
        },
        isInitiated: false,
        store_id: '',
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        slideVisible: false,
      }
      return schema
    },
    methods: {
      /* 选择活动状态
      *  @ q 活动状态
      * */
      changeStatus (q) {
        this.getStatus = q
      },
      // 获取门店评价列表数据
      async fetchData () {
        let params = {
          source_type: this.filterData.getStatus.status,
          store_id: this.store_id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        }
        try {
          const {response, result} = await this.fetchCommentStore(params)
          if (response.status === 200 && result.code === 0) {
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店评价列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店评价列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.isInitiated = true
      },
      /**
       * 分页处理
       * @status  分页的状态
       */
      paging (state) {
        this.paginationData = state
        this.fetchData()
      },
      // 搜索
      applyFilter () {
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.filterData = {
          getStatus: {
            name: '全部',
            status: '',
          },
        },
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 返回上一层
      navBack () {
        this.$router.push({
          name: 'storeList',
        })
      },
      /**
       * 删除评论 确认框
       * @ item  评论对象
       */
      deleteEvaluateTrue (item) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该评价？',
          content: '删除后数据将无法恢复',
          isRejectable: 1,
          resolve: () => {
            this.deleteEvaluate(item)
          },
        })
      },
      /**
       * 删除评论 接口
       * @ item  评论对象
       */
      async deleteEvaluate (item) {
        try {
          const {response, result} = await this.deleteEvaluateApi({
            comment_id: item.comment_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => this.fetchData(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除评价失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除评价失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.store_id = this.$route.query.storeId
      // console.log('this.store_id', this.store_id)
      this.fetchData() // 获取门店评价列表数据
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.section-filter {
  padding: 14px 75px 20px;
}
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
td,.multi-content-td
  vertical-align: middle
.h-17
  height 17px
.word-break
  word-break break-all
  word-wrap break-word
.content
  background #000
.pic
  span
    display inline-block
    padding: 8px 5px 0 0
    img
      width 20px
      height 20px
</style>

