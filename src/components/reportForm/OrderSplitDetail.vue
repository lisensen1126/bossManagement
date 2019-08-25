<template lang="pug">
  .section-layout
    .content-wrapper
      h2.header-title 订单详情
      .order-box(v-if="info.store")
        .title 订单信息
        dl
          dt 订单编号
          dd(v-text="info.trade_order_no")
        dl
          dt 支付方式
          dd(v-text="info.payment_channel ? info.payment_channel : '—'")
        dl
          dt 下单时间
          dd(v-text="info.created_at")
        dl
          dt 交易流水号
          dd(v-text="info.payment_no ? info.payment_no : '—'")
        dl
          dt 支付时间
          dd(v-text="info.paid_at ? info.paid_at : '—'")
        dl
          dt 核销时间
          dd(v-text="info.write_off_at ? info.write_off_at : '—'")
        dl
          dt 订单状态
          dd {{info.is_separate==2?'未分账':info.is_separate==1?'已分账':''}}
        dl
          dt 总额
          dd(v-text="info.final_amount + '元'")
        dl(v-if="info.reserve && info.reserve.reserve_time")
          dt 预约到店时间
          dd {{info.reserve.reserve_time}}
        dl
          dt 订单类型
          dd
            span(v-if="info.order_type === 1") 普通订单
            span(v-if="info.order_type === 2") 智能保养
            span(v-if="info.order_type === 3") 拼团订单
            span(v-if="info.order_type === 4") 秒杀订单
            span(v-if="info.order_type === 5")  养护卡
        dl(v-if="info.order_type === 3")
          dt 团单编号
          dd {{info.object_id}}
        dl
          dt 订单来源
          dd {{order_source_list[info.purchase_type-1]}}
        dl
          dt 下单门店
          dd {{info.store.store_name}}
      .order-box
        .title 客户信息
        dl
          dt 客户昵称
          dd(v-text="info.customer.name")
        dl
          dt 品牌车系
          dd(v-text="info.customer.vehicle.brand_info ? info.customer.vehicle.brand_info : '暂无数据'")
        dl
          dt 手机号
          dd(v-text="info.customer.mobile")
        dl
          dt 车牌号码
          dd(v-text="info.customer.vehicle.license_plate ? info.customer.vehicle.license_plate : '暂无数据'")
      .order-box(v-if="is_show")
        .title.table(style="text-align: left") 核销记录
        .write-off-box(v-for="(x, index) in info.write_off_record" :key="x.write_off_record_id")
          .write-off-item
            span 核销人: {{x.operator}}
            span 核销门店: {{x.write_off_store_name}}
            span 核销时间: {{x.write_off_at}}
          table.table
            thead
              tr
                td(width="150") 商品服务信息
                td(width="150") 核销数量
                td(width="150") 本次核销后剩余
            tbody
              tr(v-for="(y, index) in x.write_off_item" :key="index")
                td
                  .multi-content-td.has-image
                    .left-image
                      img(v-if="y.item.image_url", :src="scaleImage(y.item.image_url, 1, 40, 40)")
                    .simple-td.good-name {{y.item.item_title}} <br/> {{y.item.sku_name}}
                td
                  .simple-td.good-name(v-text="y.write_off_count")
                td
                  .simple-td(v-text="y.remain_count")
      .order-box
        .title.table(style="text-align: left") 商品/服务信息
        table.table
          thead
            tr
              td(width="120") 商品/服务
              td(width="90")
                span(v-if="info.order_type < 3 || info.order_type === 5") 单价
                span(v-if="info.order_type === 3 || info.order_type === 4 ")
                  span(v-if="info.item && info.item[0]", v-text="info.item[0].item_type")
                  span 原价
              td(width="80") 数量
              td(width="80")
                span(v-if="info.order_type < 3 || info.order_type === 5") 金额
                span(v-if="info.order_type === 3 || info.order_type === 4 ") 实付金额
              td(width="80") 类型
              td(width="60") 分类
          tbody
            tr(v-for="item in info.item")
              td
                .multi-content-td.has-image
                  .left-image(v-if="info.order_type === 5")
                    img(:src="scaleImage('https://oss2.chedianai.com/images/assets/upkeep_bg.png', 1, 36, 36)")
                  .left-image(v-if="info.order_type !== 5")
                    img(v-if="item.image_url", :src="scaleImage(item.image_url, 1, 36, 36)")
                  .content-item.content-first {{item.item_title}} <br> {{item.sku_name}}
              td
                .simple-td(v-if="info.order_type === 3 || info.order_type === 4 ")
                  span(v-text="'￥' + item.unit_price")
                .simple-td(v-if="info.order_type < 3 || info.order_type === 5")
                  span(v-text="'￥' + item.activity_price")
              td
                .simple-td(v-text="item.quantity")
              td
                .simple-td(v-text="'￥' + item.sub_activity_price")
              td
                .simple-td(v-text="item.item_type")
              td
                .simple-td(v-text="item.category ? item.category : '- -'")
      .order-box
        dl.cleft
        dl.cright
          dt.ctd
            div
              span(v-if="info.order_type === 3 || info.order_type === 4 ")
                span(v-text="info.item[0].item_type")
                span 总额：
              span(v-if="info.order_type < 3 || info.order_type === 5") 商品总额：
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") 工时费用：
            div 优惠券：
            div 实付金额：
          dt.t-r
            div ￥{{info.total_amount}}
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") ￥{{(info.maintenance_fee/100).toFixed(2)}}
            div -￥{{info.preferential_price}}
            div ￥{{info.final_amount}}
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回

</template>

<script>
import ReportFormApi from '@/mixins/modules/reportForm'
import imageScale from '@/mixins/utilities/imageScale'

export default {
  name: 'OrderSplitDetail',
  mixins: [ReportFormApi, imageScale],
  computed: {
    order_source_list () { // 订单来源列表：1 门店，2 平台， 3 第三方
      return [ '门店', '平台', '第三方' ]
    },
  },
  data () {
    return {
      is_show: false, // 是否显示核销记录
      isInitiated: false,
      tradeOrderId: '',
      info: {
        trade_order_id: '',
        trade_order_no: '',
        'status': '',
        'created_at': '',
        'payment_channel': '',
        'payment_no': '',
        'write_off_at': '',
        'paid_at': '',
        object_id: '',
        'customer': {
          'name': '',
          'mobile': '',
          'avatar': '',
          'vehicle': {
            'license_plate': '',
            'brand_name': '',
            'series_name': '',
            'model_name': '',
            'vehicle_name': '',
            'product_year': '',
            'output_volume': '',
          },
        },
        items: [],
      },
      name: '', // 记录上次路由name
      query: {}, // 记录上次路由query
    }
  },
  methods: {
    // 获取订单详情
    async getInfo () {
      try {
        const { response, result } = await this.OrderSplitDetailsApi(this.tradeOrderId, { shop_id: this.shop_id })
        if (response.status === 200 && result.code === 0) {
          let temp = ''
          temp += result.data.customer.vehicle.brand_name ? result.data.customer.vehicle.brand_name + ' ' : ''
          temp += result.data.customer.vehicle.model_name ? result.data.customer.vehicle.model_name + ' ' : ''
          temp += result.data.customer.vehicle.series_name ? result.data.customer.vehicle.series_name + ' ' : ''
          temp += result.data.customer.vehicle.vehicle_name ? result.data.customer.vehicle.vehicle_name + ' ' : ''
          temp += result.data.customer.vehicle.product_year ? result.data.customer.vehicle.product_year + ' ' : ''
          temp += result.data.customer.vehicle.output_volume ? result.data.customer.vehicle.output_volume + ' ' : ''
          result.data.customer.vehicle.brand_info = temp
          result.data.item.forEach(item => {
            if (item.item_type === '商品') {
              if (item.sku_attribute.length > 0) {
                var obj = JSON.parse(item.sku_attribute)
                var str = ''
                obj.forEach(cell => {
                  str += (cell.attribute_item_value + ' ')
                })
                item.sku_name = str
              } else {
                item.sku_name = ''
              }
            } else {
              item.sku_name = ''
            }
          })
          result.data.write_off_record.forEach(x => {
            x.write_off_item.forEach(y => {
              if (y.item.item_type === 1) {
                if (y.item.sku_attribute.length > 0) {
                  var obj = JSON.parse(y.item.sku_attribute)
                  var str = ''
                  obj.forEach(cell => {
                    str += (cell.attribute_item_value + ' ')
                  })
                  y.item.sku_name = str
                } else {
                  y.item.sku_name = ''
                }
              } else {
                y.item.sku_name = ''
              }
            })
          })
          this.info = result.data
          if (this.info.write_off_record.length) {
            this.is_show = true
          } else {
            this.is_show = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取订单详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取订单详情失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    goBack () {
      this.$router.push({
        name: this.name,
        query: Object.assign(this.query, { save: 1 }),
      })
    },
  },
  mounted () {
    this.tradeOrderId = this.$route.query.id
    this.shop_id = this.$route.query.shop
    if (this.tradeOrderId) {
      this.getInfo() // 获取订单详情
    }
  },
  /**
   * 组件内守卫(进入组件时调用)
   */
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (Object.keys(from.query).length > 0 && from.query.constructor === Object) {
        vm.query = from.query
      }
      vm.name = from.name
    })
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/creation-modal'
.content-first
  line-height 16px
.header-title
  border-bottom 1px solid #eee
.order-box
  padding 20px 30px
  font-size 14px
  line-height 25px
  border-bottom 1px solid #eee
  .title
    width 15%
    text-align right
    font-weight bold
    padding-top 10px
    padding-bottom 5px
  dl
    float left
    padding-top 10px
    width 50%
    overflow hidden
    dt
      float left
      width 30%
      color #222
      text-align right
    dd
      float left
      width 70%
      color #747474
      box-sizing border-box
      padding-left 20px
  .cright
    padding-left 250px
  .t-r
    text-align left
  .write-off-box
    margin-bottom 24px
    &:last-child
      margin-bottom 0
    .write-off-item span
      margin-right 24px
      font-size 13px
</style>
