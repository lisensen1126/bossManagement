<template lang="pug">
  .section-layout
    .content-wrapper
      h2.header-title 订单详情
      .order-box
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
          dd(v-if="info.status == '1'") 待付款
          dd(v-if="info.status == '2' && (!info.reserve || info.reserve.status != '2')") 待核销
          dd(v-if="info.status == '3'") 已完成
          dd(v-if="info.status == '4'") 已关闭
          dd(v-if="info.status == '2' && info.reserve && info.reserve.status == '2' && info.reserve.reserve_status == '0'") 已预约
          dd(v-if="info.status == '2' && info.reserve && info.reserve.status == '2' && info.reserve.reserve_status == '1'") 已过期
          dd(v-if="info.status == '6'") 拼团中
          dd(v-if="info.status == '7'") 正在退款
          dd(v-if="info.status == '8'") 退款成功
          dd(v-if="info.status == '9'") 退款失败
        dl
          dt 总额
          dd(v-text="info.final_amount + '元'")
        dl(v-if="info.reserve && info.reserve.reserve_time")
          dt 预约到店时间
          dd {{info.reserve.reserve_time}}
        dl
          dt 订单类型
          dd
            span(v-if="info.goods_type === 1 && (info.order_type === 1 || info.order_type === 2 || info.order_type === 3 || info.order_type === 4)") 商品服务订单
            span(v-if="info.goods_type === 2 && (info.order_type === 1 || info.order_type === 2 || info.order_type === 3 || info.order_type === 4)") 养护卡订单
            span(v-if="info.order_type === 6") 线下买单订单
            span(v-if="info.order_type === 7") 线下买单(快速开单)订单
        dl(v-if="Number(info.store_random_coupon)>0")
          dt  门店立减金
          dd  ￥ {{info.store_random_coupon / 100}}
        dl(v-if="info.order_type === 3")
          dt 团单编号
          dd {{info.object_id}}
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
      .order-box
        table.table
          thead
            tr
              td(width="120") 商品/服务
              td(width="90")
                span(v-if="info.order_type < 3 || info.order_type > 4") 单价
                span(v-if="info.order_type === 3 || info.order_type === 4 ")
                  span(v-if="info.item && info.item[0]", v-text="info.item[0].item_type")
                  span 原价
              td(width="80") 数量
              td(width="80")
                span(v-if="info.order_type < 3 || info.order_type > 4") 金额
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
                .simple-td(v-if="info.order_type < 3 || info.order_type > 4")
                  span(v-text="'￥' + item.activity_price")
              td
                .simple-td(v-text="item.quantity")
              td
                .simple-td(v-text="'￥' + item.sub_activity_price")
              td
                .simple-td
                  span(v-if="item.item_type") {{item.item_type}}
                  span(v-if="info.order_type === 6 && !item.item_type") 线下商品/服务
              td
                .simple-td
                  span(v-if="info.order_type === 6 && !item.category") 线下商品/服务
                  span(v-if="item.category || info.order_type !== 6") {{item.category ? item.category : '- -'}}
      .order-box
        dl.cright
          dt.ctd
            div
              span(v-if="info.order_type === 3 || info.order_type === 4 ")
                span(v-text="info.item[0].item_type")
                span 原价：
              span(v-if="info.order_type < 3 || info.order_type > 4") 订单金额：
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") 工时费用：
            div 优惠券：
            div(v-if="Number(info.user_random_coupon)>0") 用户立减金：
            div 实付金额：
          dt.t-r
            div ￥{{info.total_amount}}
            div(v-if="info.order_type==2&&info.maintenance_fee!=0") ￥{{(info.maintenance_fee/100).toFixed(2)}}
            div -￥{{info.preferential_price}}
            div(v-if="Number(info.user_random_coupon)>0") - ￥{{info.user_random_coupon / 100}}
            div ￥{{info.final_amount}}
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回

</template>

<script>
import Api from '@/mixins/modules/reportForm'
import imageScale from '@/mixins/utilities/imageScale'

export default {
  name: 'incomeOrderDetail',
  mixins: [Api, imageScale],
  data () {
    return {
      isInitiated: false,
      tradeOrderId: '',
      shop_id: '',
      info: {
        trade_order_id: '',
        trade_order_no: '',
        status: '',
        created_at: '',
        payment_channel: '',
        payment_no: '',
        write_off_at: '',
        paid_at: '',
        object_id: '',
        final_amount: '',
        customer: {
          name: '',
          mobile: '',
          avatar: '',
          vehicle: {
            license_plate: '',
            brand_name: '',
            series_name: '',
            model_name: '',
            vehicle_name: '',
            product_year: '',
            output_volume: '',
          },
        },
        items: [],
      },
    }
  },
  methods: {
    // 获取订单详情
    async getInfo () {
      let params = {
        trade_order_id: this.tradeOrderId,
        shop_id: this.shop_id,
      }
      try {
        const { response, result } = await this.GetOrderDetailApi(params)
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
          this.info = result.data
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
      window.history.back()
    },
  },
  mounted () {
    this.tradeOrderId = this.$route.query.trade_order_id
    this.shop_id = this.$route.query.id
    if (this.tradeOrderId) {
      this.getInfo() // 获取订单详情
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/creation-modal';

.content-first {
  line-height: 16px;
}

.header-title {
  border-bottom: 1px solid #eee;
}

.order-box {
  padding: 20px 30px;
  font-size: 14px;
  line-height: 25px;
  border-bottom: 1px solid #eee;

  .title {
    width: 15%;
    text-align: right;
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  dl {
    float: left;
    padding-top: 10px;
    width: 50%;
    overflow: hidden;

    dt {
      float: left;
      width: 30%;
      color: #222;
      text-align: right;
    }

    dd {
      float: left;
      width: 70%;
      color: #747474;
      box-sizing: border-box;
      padding-left: 20px;
    }
  }

  .cright {
    float: right;
    padding-left: 100px;
    dl {
      dt {
        width: 50%
      }
    }
  }
  .t-r{
    text-align: left;
  }
}
</style>
