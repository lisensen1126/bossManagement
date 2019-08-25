<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter
      span.fl.m-t-20.l-h-36 访问详情
    empty-page(v-if="list.length === 0 && isInitiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 访问时间
              td(width="100") 客户头像
              td(width="150") 客户昵称
              td(width="150") 客户电话
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="formateDate(item.created_at, true)")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(:src="item.avatar")
              td
                .simple-td(v-text="item.nick_name") 待核销
              td
                .simple-td(v-text="item.mobile") 商品
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import reportFormApi from '@/mixins/modules/reportForm'
import EmptyPage from '@/components/generics/EmptyPage'
import formateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'OperateClickDetail',
  mixins: [reportFormApi, formateDate],
  components: {
    Pagination,
    EmptyPage,
  },
  data () {
    return {
      paginationData: {
        current_page: 1,
        per_page: 50,
        last_page: 2,
        total: 0,
      },
      default_value: 1,
      list: [],
      isInitiated: false,    // 页面初始状态
    }
  },

  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    },

    // 分页操作
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },

    // 获取注册详情
    async fetchList () {
      try {
        const {response, result} = await this.appClickListDayApi({
          date: this.$route.query.time,
          store_id: this.$route.query.id,
          page: this.paginationData.current_page,
          size: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取数据失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    this.fetchList()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
td
  vertical-align middle !important
.multi-content-td
  vertical-align middle
.has-image
  vertical-align top
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 40px
.fr
  float right
.fl
  float left
.l-h-36
  line-height 36px
  font-size 18px
  padding-left 30px
.m-t-20
  margin-top 20px
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
</style>
