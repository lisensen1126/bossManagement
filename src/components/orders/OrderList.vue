<template lang="pug">
  .section-layout
    // tab
    service-tab.top-nav(v-model="tab_select", :tabs="tab_list", :have-icon="false", :have-quantity="false")
    .section-filter.is-horizontal
      // 筛选
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(need-type="number", v-model="search_data.keyword", placeholder="按订单号或手机号查询", @keyupEnter="search")
        .field.keyword-wrapper
          label.label 门店搜索
          custom-input(v-model="search_data.store", placeholder="请输入门店名称", @keyupEnter="search")
        .field
          label.label 按时间筛选
          .field.is-horizontal
            date-picker.w_236(type="range", placeholder="请选择", v-model="search_data.time")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
        .field
          a.button(@click="exportData") 导出

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
                td
                  .multi-content-td
                    .content-item(v-text="item.trade_order_no")
                    .content-item(v-if="item.order_type === 5")
                      span.bottom-image
                        img(:src="scaleImage('https://oss2.chedianai.com/images/assets/upkeep_bg.png', 1, 36, 36)")
                    .content-item(v-else)
                      span.bottom-image(v-for="(img,index) in item.item" v-if="index < 4")
                        img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
                td
                  .multi-content-td
                    .content-item
                      span.left-image.inline
                        img(v-if="item.customer.avatar", :src="scaleImage(item.customer.avatar, 1, 16, 16)")
                        img(v-if="!item.customer.avatar", src="../../assets/user-avatar.png")
                      span(v-text="item.customer && item.customer.name")
                    .content-item
                      span(v-text="item.customer && item.customer.mobile")
                      span.content-divider.inline(v-if="item.customer && item.customer.vehicle && item.customer.vehicle.license_plate")
                      span(v-text="item.customer && item.customer.vehicle && item.customer.vehicle.license_plate || ''")
                td
                  .simple-td(v-text="'￥' + item.final_amount")
                td
                  .simple-td(v-text="'共' + item.item_num + '种商品'")
                td
                  .simple-td
                    .status-dot(:class="{'primary': (item.status == '2' && (!item.reserve || item.reserve.status != '2')), 'green': item.status == '3' || item.status == '6' || item.status == '5', 'blue': (item.status == '2' && item.reserve && item.reserve.status == '2') || item.status == '7', 'grey': item.status == '4', 'red': item.status == '1' || item.status == '9'}")
                    span(v-if="item.status == '1'") 待付款
                    span(v-if="item.status == '2' && (!item.reserve || item.reserve.status != '2')") 待核销
                    span(v-if="item.status == '3'") 已完成
                    span(v-if="item.status == '4'") 已关闭
                    span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '0'") 已预约
                    span(v-if="item.status == '2' && item.reserve && item.reserve.status == '2' && item.reserve.reserve_status == '1'") 已过期
                    span(v-if="item.status == '6'") 拼团中
                    span(v-if="item.status == '7'") 正在退款
                    span(v-if="item.status == '5'") 退款成功
                    span(v-if="item.status == '9'") 退款失败
                td
                  .simple-td(v-if="item.purchase_type - 1 === 1")
                    span(v-if="item.cancelled_by === 5") ￥{{item.final_amount}}(自动)
                    span(v-if="item.cancelled_by === 6") ￥{{item.final_amount}}(手动)
                    span(v-if="item.cancelled_by < 5") --
                  .simple-td(v-else) --
                td
                  .simple-td(v-text="item.created_at")
                td
                  .simple-td.width-130 {{item.store_name}}
                td.operation-td
                  router-link.operation-link(:to="{name: 'orderDetail', params: {id: item.trade_order_id}, query: {cancelled_by: item.cancelled_by, shop: item.shop_id}}") 查看
                  a.operation-link(v-if="item.is_refund" @click="refundModal(item)")  退款
      pagination(:pagination-data="page_data", @input="paging")
</template>

<script>
import OrderApi from '@/mixins/modules/order'
import imageScale from '@/mixins/utilities/imageScale'

import { root } from '@/plugins/Fetch'

import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
export default {
  name: 'OrderSplit',
  components: { ServiceTab, CustomInput, DatePicker, EmptyPage, Pagination },
  mixins: [ OrderApi, imageScale ],
  computed: {
    tab_list () { // 头部的tab
      return [ // 订单状态 (1 待付款，2 已支付/待核销，3 已完成，4 已取消，5已预约)
        { name: '全部', type: null },
        { name: '待核销', type: '2' },
        { name: '已预约', type: '6' },
        { name: '已完成', type: '3' },
        { name: '已关闭', type: '4' },
      ]
    },
    table_head_list () { // 表头
      return [
        { name: '订单内容/订单号', width: '15%' },
        { name: '客户信息', width: '15%' },
        { name: '商品总额', width: '10%' },
        { name: '商品数量', width: '10%' },
        { name: '订单状态', width: '10%' },
        { name: '退款金额', width: '6%' },
        { name: '下单时间', width: '16%' },
        { name: '下单门店', width: '10%' },
        { name: '操作', width: '14%' },
      ]
    },
    order_source_list () { // 订单来源列表：1 门店，2 平台， 3 第三方
      return [
        { name: '门店', value: '1' },
        { name: '平台', value: '2' },
        { name: '第三方', value: '3' },
      ]
    },
  },
  data () {
    return {
      tab_select: { name: '全部', type: null }, // 选中的 tab
      search_data: {
        keyword: null,
        store: null,
        phone: null,
        time: null,
      },
      list: [], // 列表
      page_data: null,
    }
  },
  watch: {
    'tab_select': function () {
      this.resetPageData()
      this.search_data = {
        keyword: '',
        store: '',
        phone: '',
        time: '',
      }
      console.log(this.search_data)
      this.fetchDataList()
    },
  },
  created () {
    this.resetPageData()
  },
  mounted () {
    this.fetchDataList()
  },
  methods: {
    // 退款
    refundModal (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认退款${item.final_amount}给${item.customer.mobile}吗？`,
        isRejectable: 1,
        resolve: () => {
          this.refundApi(item)
        },
      })
    },
    async refundApi (item) {
      try {
        const {response, result} = await this.refundPriceApi({
          order_no: item.trade_order_no,
          shop_id: item.shop_id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              title: '退款成功!',
              autoClose: true, // 控制弹框自动消失
              type: 'success',
            })
            this.fetchDataList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '退款失败',
              content: `出错了:${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '退款失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err, '退款')
      }
    },
    resetPageData () {
      this.page_data = {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      }
    },
    search () {
      this.formateDate()
      this.resetPageData()
      this.fetchDataList()
    },
    reset () {
      this.search_data = {}
      this.fetchDataList()
    },
    async fetchDataList () {
      try {
        const { response, result } = await this.fetchOrderList({
          status: this.tab_select.type,
          page: this.page_data.current_page,
          per_page: this.page_data.per_page,
          start_time: this.search_data.start_time,
          end_time: this.search_data.end_time,
          search: this.search_data.keyword, // 搜索条件（完整订单号或者手机号)
          store_name: this.search_data.store, // 门店名称搜索（模糊查询）
        })
        if (response.status === 200 && result.code === 0) {
          let nowTime = Date.parse(new Date()) / 1000
          result.data.forEach(item => {
            item.is_refund = false
            if (item.paid_at + 2592000 > nowTime && item.status === 2 && item.is_separate === 2) {
              item.is_refund = true
            }
          })
          this.list = result.data
          this.page_data = result.meta
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取订单列表失败',
          content: `服务异常，请稍后再试（${e}）`,
        })
      }
    },
    // 分页跳转
    paging (page) {
      this.page_data = page
      this.fetchDataList()
    },
    formateDate () {
      if (this.search_data.time) {
        let tr = this.search_data.time.split(' 至 ')
        this.search_data.start_time = new Date(`${tr[0]} 00:00:00`).getTime() / 1000
        this.search_data.end_time = new Date(`${tr[1]} 23:59:59`).getTime() / 1000
      } else {
        this.search_data.start_time = null
        this.search_data.end_time = null
      }
    },
    exportData () {
      let _url = ''
      this.formateDate()
      let params = {
        status: this.tab_select.type,
        start_time: this.search_data.start_time,
        end_time: this.search_data.end_time,
        search: this.search_data.keyword, // 搜索条件（完整订单号或者手机号)
        store_name: this.search_data.store, // 门店名称搜索（模糊查询）
      }
      for (let key in params) {
        if (params[key]) _url += `&${key}=${params[key]}`
      }
      window.open(`${root}/order/export${_url.replace(/\&/, '?')}`)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.width-130
  max-width 130px !important
.section-layout
  height calc(100% - 56px)
  .top-nav
    display: flex
    flex: 0 0 48px
    align-items: center
    justify-content: center
    position: relative
    height: 48px
    padding-left: 64px
    padding-right: 64px
    background-color: #fcfcfc
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08)
    z-index: 8
  .w_236
    width 236px

.bottom-image {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 4px;

  img {
    height: 100%;
    width: 100%;
  }
}
.money{
  width: 82px;
  height:36px;
}
.fccc {
  width: 100px;
  height: 200px;
  background: red;
}

.bigImg {
  z-index: 9999;
}
.section-filter {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.margin {
  margin: 0 8px;
  font-size: 14px;
}

</style>
