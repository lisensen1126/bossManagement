<template lang="pug">
  .section-layout
    h2.level.header-wrapper
      .level-left
        .nav-back-btn(@click="goBack")
        .header-title(style={'padding-left':'25px'}) 参加活动
    .content-wrapper
      .section-setting.tops
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 活动信息
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 活动名称
                  .labelname(v-text='detail.name')
                .field.is-horizontal
                  label.label 起止时间
                  .labelname
                    span.iocns_svg
                    span(v-if='detail.end_time', v-text='detail.start_time + "~" + detail.end_time')
                    span(v-if='!detail.end_time', v-text=' "长期" ')
                .field.is-horizontal(v-show='detail.lottery_nums!=0 || detail.share_nums!=0')
                  label.label 抽奖机会
                  .labelname
                    .yuan(v-if='detail.lottery_nums!=0')
                    span(v-if='detail.lottery_nums!=0') 赠送一次
                    .yuan(v-if='detail.share_nums!=0')
                    span(v-if='detail.share_nums!=0') 分享送一次
                .field.is-horizontal
                  label.label 活动简介
                  .labelname(v-text='detail.description')
      .section-setting.sheng2
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 商户范围
        empty-page(v-if="!detail.store_item.length && isInitiated", :tip="'暂无商户'",style={'margin-top':'40px'})
        .table-wrapper(style={'border-bottom':'16px solid #f0f1f2','margin-bottom':'13px'},v-if="detail.store_item.length")
         table.table.table_cleardefault
            thead
              tr
                td(width="100") 省份
                td(width="100") 城市
                td(width="200") 店铺
            tbody
              tr(v-for="(cell, index) in detail.store_item")
                td
                  .simple-td(v-text="cell.province_name")
                td
                  .simple-td(v-text="cell.city_name")
                td
                  .simple-td(v-text="cell.store_name")
      .section-setting.sheng(style={position:'relative'})
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 中奖客户清单
            .field
              custom-input(v-model="queryData.keyword" ,placeholder="电话/名称", @keyupEnter="applyFilter")
            .field
              a.button.primary(@click="applyFilter") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!list.length && isInitiated", :tip="'暂无中奖客户'",style={'margin-top':'40px'})
        .table-wrapper(style={'border-bottom':'8px solid #f0f1f2','margin-bottom':'13px'},v-if="list.length")
          table.table.table_cleardefault
            thead
              tr
                td(width="120") 时间
                td(width="100") 名称
                td(width="100") 电话
                td(width="100") 车牌号
                td(width="140") 车型
                td(width="140") 门店
                td(width="120") 奖品
            tbody
              tr(v-for="(coupon, index) in list")
                td
                  .simple-td(v-text="coupon.created_at")
                td
                  .simple-td(v-text="coupon.nick_name")
                td
                  .simple-td(v-text="coupon.mobile")
                td
                  .simple-td(v-if="coupon.license_plate === ''") 暂无数据
                  .simple-td(v-else) {{coupon.license_plate}}
                td
                  .simple-td(v-if="coupon.model_name === ''") 暂无数据
                  .simple-td(v-else) {{coupon.model_name}}
                td
                  .simple-td(v-text="coupon.store_name")
                td
                  .simple-td(v-text="coupon.coupon_name")
        .tfoot(v-if="list.length")
          pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import drawApi from '@/mixins/modules/draw'
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import EmptyPage from '@/components/generics/EmptyPage'
  import filterTools from '@/mixins/utilities/filterTools'

  export default {
    name: 'EventDetail',
    mixins: [drawApi, filterTools],
    components: {
      CustomInput,
      Pagination,
      EmptyPage,
    },
    data () {
      return {
        isLoading: false,
        isInitiated: false,
        filterData: {
          keyword: '',
        },
        queryData: {
          keyword: '',
        },
        // 分页的数据
        paginationData: {
          current_page: 1, // 当前页
          per_page: 20, // 每页的数据
          last_page: 2, // 最后一页
          total: 31, // 总数据
        },
        // 活动详情
        detail: {
          store_item: [], // 支持门店列表
        },
        activeId: null, // 活动id
        list: [], // 中奖清单列表
      }
    },
    methods: {
      // 返回
      goBack () {
        if (this.isLoading) {
          return
        }
        this.$router.push({
          name: 'drawList',
        })
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
        // console.log(this.queryData.keyword)
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.paginationData.current_page = 1
        this.queryData.keyword = ''
        this.recallFilter()
        this.fetchData()
      },
      // 重置搜索数据
      recallFilter () {
        this.switchFilterData(this.queryData, this.filterData)
      },
      // 获取活动详情
      async getDetail () {
        try {
          const {response, result} = await this.eventDetail({
            activity_id: this.activeId,
          })
          if (response.status === 200) {
            result.data.start_time = this.changeDateTime(result.data.start_time)
            result.data.end_time = this.changeDateTime(result.data.end_time)
            this.detail = result.data
            this.fetchData()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取活动详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          // console.log(err)
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取活动详情失败',
            content: '服务异常，请稍后再试',
          })
        }
        this.isInitiated = true
      },
      // 获取中奖清单列表数据
      async fetchData () {
        // this.list = list
        try {
          const {response, result} = await this.getDrawList({
            activity_id: this.activeId,
            keyword: this.queryData.keyword,
            page: this.paginationData.current_page,
            per_page: this.paginationData.per_page,
          })
          if (response.status === 200) {
            result.data.forEach(item => {
              var temp = ''
              temp += item.brand_name ? item.brand_name + ' ' : ''
              temp += item.model_name ? item.model_name + ' ' : ''
              temp += item.vehicle_name ? item.vehicle_name + ' ' : ''
              item.model_name = temp
              item.created_at = this.changeDateTime(item.created_at)
            })
            this.list.splice(0, this.list.length, ...result.data)
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取中奖客户清单失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取中奖客户清单失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.isInitiated = true
      },
      /**
       * 时间戳转年月日
       * @val  时间戳
       */
      changeDateTime (val) {
        if (!val) {
          return ''
        }
        let date = new Date(val * 1000)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = this.judgeTime(date.getDate()) + ' '
        let h = this.judgeTime(date.getHours()) + ':'
        let m = this.judgeTime(date.getMinutes())
        return Y + M + D + h + m
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
    },
    mounted () {
      this.activeId = this.$route.query.eventId
      this.getDetail()
      // this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .content-wrapper
    padding-top 0
  .label
    color #353535
    font-size 13px
  .labelname
    color #999
    font-size 13px
    line-height 29px
  .iocns_svg
    background center no-repeat url('~@/assets/calendar/input-calendar.svg')
    background-size 100% 100%
    display inline-block
    width 16px
    height 16px
    margin-top -2px
    margin-right 5px
    vertical-align middle
  .labelname.red
    color #F4381E
  .blue
    color #2FABDD
  .yuan
    width 16px
    height 16px
    border-radius 50%
    border 5px solid #ffc723
    display inline-block
    vertical-align middle
    margin-right 5px
    margin-top -2px
  .yuan:nth-of-type(2)
    margin-left 25px
  .field.is-horizontal .label_50px
    flex 0 0 50px
    margin-right 0
  .section-layout
    overflow-y auto

  .section-setting
    + .section-setting
      margin-top 16px
    background #ffffff
    padding-bottom 24px
  .sheng
    margin-top 0 !important
  .header-wrapper
    height 56px
    align-items center
    padding-left 32px
    border-bottom 1px solid line

  .header-title
    font-size 18px
    line-height 24px
    color darker
    position relative

  .level-left
    align-items center
    flex 1
  .level-left  .field
    margin-left 30px
  .clearflex
    display block !important

  .switch-title
    margin-left 8px
    font-size 13px
    line-height 18px
    word-break keep-all

  .form-wrapper
    padding 0
    padding-left 64px
    padding-top 24px
    padding-right 64px
    width 100%
    &.disabled
      opacity .5
  .form-wrapper_clearmargin
    margin 0
    padding 0
  .form-wrapper-zhigong
    padding-left 0
    padding-right 0
    padding-bottom 15px
  .form-wrapper-zhigong .field-group
    flex-direction row
    align-items center
  .form-wrapper-zhigong .field-group.field_m_t_0
    margin-top 5px
  .form-wrapper-zhigong .field-group .field
    width 350px
    margin-top 0
  .form-wrapper-zhigong .field-group .field_200px
    width 200px

  .field-group
    width 100%
    + .field-group
      margin-top 15px
  .field-group-m-t-15
    margin-top 8px
  .custom-input
    width 106px
  .custom_39px
    width 62px
  .service-title
    line-height 16px
    font-size 13px
    color darker
    font-weight bold
    margin-bottom 8px

  .service-content
    font-size 12px
    color lightGrey
    line-height 20px
    + .service-content
      margin-top 8px

  .service-description
    width 305px
    margin-top 42px
    padding-left 16px
    border-left 1px solid line
    flex-shrink 0

  .level-content
    align-items flex-start
  .wide-form-wrapper
    width 320px
    .custom-input
      flex-grow 0
      width 95px
    .field.is-horizontal.has-tips::after
      right 50px

  .setting-type-wrapper
    height auto

  .type-item
    display flex
    align-items baseline
    height auto
    &:last-child
      margin-top 10px
  .radio label
    padding-left 32px
  .checkbox
    width 230px
    height auto
  .sepcific-setting
    display flex
    align-items center
    .number-input
      margin 0 8px
      width 64px
    .price-input
      margin 0 8px
      width 95px

  .gift-package-wrapper
    width 272px
  .coupon-item
    display flex
    align-items center
    margin-bottom 8px
    cursor pointer
    &:hover
      .delete-icon
        display block
      .coupon-detail
        box-shadow 0 2px 8px -2px rgba(0,0,0,0.08)
  .coupon-detail
    display flex
    justify-content space-between
    align-items center
    padding 12px
    width 240px
    height 40px
    border 1px solid #e5e5e5
    border-radius 2px
    font-size 13px
    line-hight 16px
    color #353535
  .delete-icon
    display none
    margin 0 8px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/trash.svg')
  .select-button
    margin-top 16px
    display flex
    align-items center
    font-size 13px
    line-height 16px
    color #353535
    cursor pointer
    .add-icon
      width 24px
      height 24px
      background #ffbb29 center no-repeat url('~@/assets/plus-l.svg')
      border-radius 24px
      margin-right 8px
  .field.is-horizontal .control
    flex-grow inherit
  .btn-wrapper
    padding 20px 0 0 116px
    border-top 1px solid rgba(0,0,0,0.08)
    margin-top 20px
  .nav-back-btn
    position absolute
    top 12px
    left 15px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 2
  .table.table_cleardefault
    padding 0 20px
    border-spacing 0 0
  .table.table_cleardefault thead tr
    background-color #fff
    padding 14px 0
  .table.table_cleardefault thead tr td
    padding 8px 0 8px 0
    border-bottom 1px solid rgba(48,48,48,0.1)
  .table.table_cleardefault thead tr td:first-child
    padding-left 14px
  .table.table_cleardefault tbody tr td
    border-bottom 1px solid rgba(48,48,48,0.1)
  .table.table_cleardefault tbody tr:last-child td
    border-bottom 0
  .table_cleardefault.table tbody tr:hover
    box-shadow none
    td:first-child
      border-left 2px solid #fff
  .sheng, .sheng2
    padding-bottom 0 !important
</style>
