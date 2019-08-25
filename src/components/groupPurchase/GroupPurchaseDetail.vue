<template lang="pug">
  .section-layout
    h2.level.header-wrapper
      .level-left
        .nav-back-btn(@click="goBack")
        .header-title(style={'padding-left':'25px'}) 返回列表
    .content-wrapper
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 门店信息
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 省份
                  .store-list
                    .labelname(v-if='detail.province && detail.province.length != 0',v-for='item in detail.province') {{item}}
                    .labelname(v-if='detail.province && detail.province.length === 0') —
                .field.is-horizontal
                  label.label 城市
                  .store-list
                    .labelname(v-if='detail.city && detail.city.length != 0',v-for='item in detail.city') {{item}}
                    .labelname(v-if='detail.city && detail.city.length === 0') —
                .field.is-horizontal
                  label.label 门店
                  .store-list
                    .labelname(v-if='detail.store && detail.store.length != 0',v-for='(item,index) in detail.store')
                      span {{index<9 ? '0'+(index+1):index+1}} 、{{item.store_name}} &nbsp;
                      span.text-gray(v-if="item.check_status == '0'") (审核中) <br/>
                      span.text-gray(v-if="item.check_status == '1'") (待发布) <br/>
                      span.text-gray(v-if="item.check_status == '2'") (团购中) <br/>
                      span.text-gray(v-if="item.check_status == '3'") (已拒绝) <br/>
                      span.text-gray(v-if="item.check_status == '4'") (已完成) <br/>
                      span.text-gray(v-if="item.check_status == '5'") (已终止) <br/>
                    .labelname(v-if='detail.store && detail.store.length === 0') —
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 团购信息
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 团单名称
                  .labelname(v-text="detail.name")
                .field.is-horizontal
                  label.label 团单分类
                  .labelname(v-text="detail.category_id_ch")
                .field.is-horizontal
                  label.label 服务项目
                  .table-wrapper
                    table.table.table_cleardefault
                      thead
                        tr
                          td(width="100") 服务名称
                          td(width="70") 售价
                          td(width="70") 原价
                          td(width="70") 成本价
                      tbody
                        tr(v-for="(service, index) in detail.service")
                          td
                            .simple-td(v-text="service.title")
                          td
                            .simple-td(v-text="service.sell_price/100")
                          td
                            .simple-td(v-text="service.original_price/100")
                          td
                            .simple-td(v-text="service.cost_price/100")
                .field.is-horizontal
                  label.label 服务简介
                  .labelname.field-textarea(v-text="detail.services_intro")
                .field.is-horizontal
                  label.label 平台售价
                  .labelname(v-text="num_sum/100")
                .field.is-horizontal
                  label.label 发布渠道
                  .control
                    .switch(:class="{'disabled': true}")
                      input(type="checkbox", id="m", value="2", v-model="checkedNames")
                      label(for="m")
                    .radio.service-status 美团
                    .switch(:class="{'disabled': true}")
                      input(type="checkbox", id="d", value="1", v-model="checkedNames")
                      label(for="d")
                    .radio.service-status 大众点评网
                .field.is-horizontal
                  label.label 库存量
                  .labelname(v-text="detail.stock_qty + '份'")
                .field.is-horizontal
                  label.label 个人最大可售量
                  .labelname(v-text="detail.max_sale_qty + '份'")
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 购买须知
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 售卖时间
                  .labelname
                    span.iocns_svg
                    span(v-text="changeDateTime(detail.sale_begin_date) + '至' + changeDateTime(detail.sale_end_date)")
                .field.is-horizontal
                  label.label 服务有效期
                  .labelname
                    span.iocns_svg
                    span(v-text="changeDateTime(detail.effective_begin_date) + '至' + changeDateTime(detail.effective_end_date)")
                .field.is-horizontal
                  label.label 头图
                  .control.upLoad-image.pic-block
                    .upload-pic.is-normal
                      img(v-for='img in detail.head_images',:src="scaleImage(img, 1, 88, 88)")
                .field.is-horizontal(v-if='detail.other_images && detail.other_images.length !== 0')
                  label.label 其他图片
                  .control.upLoad-image.pic-block
                    .upload-pic.is-normal
                      img(v-for='img in detail.other_images',:src="scaleImage(img, 1, 88, 88)")
                .field.is-horizontal
                  label.label 产品介绍
                  .labelname.field-textarea(v-text="detail.product_intro")
                .field.is-horizontal(v-if='detail.customer_intro && detail.customer_intro.length !== 0')
                  label.label 商户介绍
                  .labelname.field-textarea(v-text="detail.customer_intro")
      .section-setting
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 结算方式（点评平台结算，与聚骧平台无关）
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 结算方式
                  .labelname 统一结算
                .field.is-horizontal
                  label.label 结算周期
                  .labelname 美团点评每14天结算一次
      .section-setting(v-if='type === 2 && detail.check_status && detail.check_status === 3')
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 拒绝原因
        .level.level-content
          .level-left
            .form-wrapper
              .field-group
                .field.is-horizontal
                  label.label 拒绝原因
                  .labelname {{detail.refusal_reason.length > 0 ? detail.refusal_reason : '-'}}
</template>

<script>
  import Api from '@/mixins/modules/groupPurchase'
  import imageScale from '@/mixins/utilities/imageScale'

  export default {
    name: 'groupPurchaseDetail',
    mixins: [Api, imageScale],
    data () {
      return {
        isLoading: false,
        isInitiated: false,
        detail: {},
        activeId: null,
        checkbox: false,
        checkedNames: [],
        num_sum: '',
        type: '',
      }
    },
    methods: {
      goBack () {
        if (this.isLoading) {
          return
        }
        this.$router.go(-1)
      },
      // 获取详情
      async getDetail () {
        try {
          const {response, result} = await this.getTuanGouDetailApi(this.$route.query.id)
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.data.publish_channel === 3) {
                this.checkedNames = ['1', '2']
              } else if (result.data.publish_channel === 2) {
                this.checkedNames = ['2']
              } else if (result.data.publish_channel === 1) {
                this.checkedNames = ['1']
              }
              let sum = 0
              result.data.service.forEach(ele => {
                sum += Number(ele.sell_price)
              })
              this.num_sum = sum
              this.detail = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取团购详情失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取团购详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团购详情失败',
            content: '服务异常，请稍后再试',
          })
        }
        this.isInitiated = true
      },
      // 获取详情
      async getTuanDanDetail () {
        try {
          const {response, result} = await this.getTuanDanDetailApi(this.$route.query.id)
          if (response.status === 200) {
            if (result.code === 0) {
              if (result.data.publish_channel === 3) {
                this.checkedNames = ['1', '2']
              } else if (result.data.publish_channel === 2) {
                this.checkedNames = ['2']
              } else if (result.data.publish_channel === 1) {
                this.checkedNames = ['1']
              }
              let sum = 0
              result.data.service.forEach(ele => {
                sum += Number(ele.sell_price)
              })
              this.num_sum = sum
              this.detail = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取团单详情失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取团单详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团单详情失败',
            content: '服务异常，请稍后再试',
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
        // let h = this.judgeTime(date.getHours()) + ':'
        // let m = this.judgeTime(date.getMinutes())
        return Y + M + D
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
      this.activeId = this.$route.query.id
      this.type = this.$route.query.type
      if (this.$route.query.type === 1) {
        this.getDetail()
      } else {
        this.getTuanDanDetail() // 获取详情
      }
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.text-gray
  color #999999
.section-layout
  height calc(100% - 56px)
.content-wrapper
  padding-top 0
.label
  color #353535
  font-size 13px
.labelname
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
.form-wrapper
  padding 0
  padding-left 64px
  padding-top 24px
  padding-right 64px
  width 100%
  &.disabled
    opacity .5
.field-group
  width 100%
  + .field-group
    margin-top 15px
.level-content
  align-items flex-start
.radio label
  padding-left 32px
.field.is-horizontal .control
  flex-grow inherit
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
  padding-left: 0
  margin-left: -14px
  margin-top: -10px
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
.field-textarea
  width 500px
  word-break break-all
.service-status
  padding-left 7px
  font-size 13px
  color darker
  margin-right 10px
.radio + .radio
  margin-left 28px
.pic-block img
  width 88px
  height 88px
  margin-right 10px
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.15)
.pic-block:not(:first-child)
  margin-right 20px
.field.is-horizontal .label
  flex 0 0 95px
.section-setting:last-child
  margin-bottom 20px
.store-list
  overflow hidden
  .labelname
    margin-right 10px
</style>
