<template lang="pug">
  .section-layout
    // tab
    service-tab.top-nav(v-model="tab_select", :tabs="tab_list", :have-icon="false", :have-quantity="false")
    .revenue.top-total(v-if="tab_select.type == 3" style="padding: 20px 20px 0" )
      div
        div.income
          div.statistics
            div 未分账金额
            div ￥{{count_data.no_separate_amount}}
          div.statistics
            div 未结算金额
            div ￥{{count_data.unCount}}
          div.statistics
            div 已结算金额
            div ￥{{count_data.setCount}}
          div.statistics
            div 累计订单金额
            div ￥{{count_data.count}}
    .section-filter.is-horizontal(v-if="tab_select.type == 3")
      .field-group.is-horizontal
        .field
          label.label 按时间筛选
          .field.is-horizontal
            el-date-picker(
            v-model="start_time"
            type="month"
            placeholder="选择月"
            size="small"
            )
        .field
          .space-text 至
        .field
          label.label
          .field.is-horizontal
            el-date-picker(
            v-model="end_time"
            type="month"
            size="small"
            placeholder="选择月"
            )
        .field.keyword-wrapper
          label.label 门店搜索
          custom-input(v-model="search_data.store", placeholder="请输入门店名称", @keyupEnter="search")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
        .field
          a.button(@click="confirmBossModal(1)") 导出全部数据
      p.tip 注：每月最后一个工作日为结算日，“未结算金额”“已结算金额”“累计平台订单金额”均不包含已退款金额。
    empty-page(v-if="!list_boss.length && tab_select.type - 0 === 3", tip="暂无数据")
    // 列表
    .content-wrapper.list-wrapper(v-if="tab_select.type - 0 === 3 && list_boss.length")
      .choose-content
        transition(name="sliding")
          .batched-operations(v-if="selected_boss.length>0")
            .batched-operation-segment.batched-operation.is-secondary.btn-cover(@click="cannelChoose") 取消选择
            .batched-operation-divider
            .batched-operation-segment
              | 已选择
              span.selected-item-count(v-text="selected_boss.length")
              | 个账单
            a.button.srue-btn.primary(@click="confirmBossModal(2)") 导出所选数据
      .table-wrapper
        table.table
          thead
            tr
              td(width="50")
              td(width="100") 结算日期
              td(width="100") 结算门店
              td(width="100") 累计平台订单金额
              td(width="100") 累计已结算金额
              td(width="100") 累计已退款金额
              td(width="100") 累计已预约金额
              td(width="100") 累计待核销金额
              td(width="100") 本月已退款金额
              td(width="100") 本月待结算金额
              td(width="100") 操作
          tbody(v-if="list_boss.length")
            tr(v-for="(item, i) in list_boss")
              td
                .simple-td
                  .checkbox
                    input(type="checkbox", :id="item.trade_order_settle_id", :value="item", name="modal", v-model="selected_boss", :checked='item.selected')
                    label.sepcific-setting(:for="item.trade_order_settle_id")
              td
                .simple-td.width-120 {{item.settle_time}}
              td
                .simple-td.width-120(v-text="item.store_name ? item.store_name : '--'")
              td
                .simple-td {{item.total_amount}}
              td
                .simple-td {{item.set_amount}}
              td
                .simple-td {{item.refund_amount}}
              td
                .simple-td {{item.reserve_amount}}
              td
                .simple-td {{item.write_amount}}
              td
                .simple-td {{item.month_refund_amount}}
              td
                .simple-td {{item.month_wait_amount}}
              td
                .operation-td
                  span.operation-link(@click="goOrderList(item)") 查看
                  span.operation-link(@click="downExcel(item)") 下载账单
      pagination(:pagination-data="page_data", @input="paging")
    .section-filter.is-horizontal(v-if="tab_select.type - 0 < 3")
      // 筛选
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="search_data.keyword", placeholder="请输入完整的订单号", @keyupEnter="search")
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
        .field.fr
          a.button.fr(@click="exportData") 全部导出
        .field.fr
          a.button.fr(v-if="tab_select.type == 2", @click="confirmModal(1)") 全部确认分账
      p.tip 温馨提示：微信分账将收取千分之六的手续费。

    empty-page(v-if="tab_select.type - 0 < 3 && !list.length", tip="暂无数据")
    // 列表
    .content-wrapper.list-wrapper(v-if="tab_select.type - 0 < 3 && list.length")
      .choose-content
        transition(name="sliding")
          .batched-operations(v-if="selected_item.length>0")
            .batched-operation-segment.batched-operation.is-secondary.btn-cover(@click="cannelChoose") 取消选择
            .batched-operation-divider
            .batched-operation-segment
              | 已选择
              span.selected-item-count(v-text="selected_item.length")
              | 件订单
            a.button.srue-btn.primary(@click="confirmModal(2)") 确认分账
      .table-wrapper
        table.table
            thead
              tr
                td(width="50" v-if="tab_select.type == 2")
                td(width="80") 订单内容/订单号
                td(width="100") 客户信息
                td(width="80") 商品总额
                td(width="80") 商品数量
                td(width="80") 分账状态
                td(width="100") 下单时间
                td(width="100") 下单门店
                td(width="80") 操作
            tbody(v-if="list.length")
              tr(v-for="(item, i) in list")
                td( v-if="tab_select.type == 2")
                  .simple-td
                    .checkbox
                      input(type="checkbox", :id="item.trade_order_id", :value="item", name="modal", v-model="selected_item", :checked='item.selected')
                      label.sepcific-setting(:for="item.trade_order_id")
                td
                  .multi-content-td
                    .content-item(v-text="item.trade_order_no")
                    //  (@click="clickImg(item.item)")
                    .content-item(v-if="item.order_type === 5")
                      span.bottom-image
                        img(:src="scaleImage('https://oss2.chedianai.com/images/assets/upkeep_bg.png', 1, 36, 36)")
                    .content-item(v-else)
                      span.bottom-image(v-for="(img,index) in item.item_pics" v-if="index < 4")
                        img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
                td
                  .multi-content-td
                    .content-item
                      span.left-image.inline
                        img(v-if="item.avatar", :src="scaleImage(item.avatar, 1, 16, 16)")
                        img(v-else, src="../../assets/user-avatar.png")
                      span(v-text="item.nick_name")
                    .content-item
                      span(v-text="item.mobile")
                      span.content-divider.inline(v-if="item.license_plate")
                      span(v-text="item.license_plate || ''")
                td
                  .simple-td(v-text="'￥' + item.final_amount")
                td
                  .simple-td(v-text="'共' + item.item_num + '种商品'")
                td
                  .simple-td {{item.is_separate==2?'未分账':item.is_separate==1?'已分账':''}}
                td
                  .simple-td {{item.created_at | formatDate}}
                td
                  .simple-td.width-160 {{item.store_name}}
                td.operation-td
                  router-link.operation-link(:to="{name: 'orderSplitDetail', query: {id: item.trade_order_id, shop: item.shop_id}}") 查看
      pagination(:pagination-data="page_data", @input="paging")
</template>

<script>
import ReportFormApi from '@/mixins/modules/reportForm'
import imageScale from '@/mixins/utilities/imageScale'

import { root } from '@/plugins/Fetch'
import getYearMonth from '@/mixins/utilities/formateDate'
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import DatePicker from '@/components/generics/form/DatePicker'
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import CustomSelect from '@/components/generics/form/CustomSelect'
export default {
  name: 'OrderSplitList',
  components: { ServiceTab, CustomInput, DatePicker, EmptyPage, Pagination, CustomSelect },
  mixins: [ ReportFormApi, imageScale, getYearMonth ],
  computed: {
    tab_list () { // 头部的tab
      return [ { name: '未分账', type: '2' }, { name: '已分账', type: '1' }, { name: '平台订单结算', type: '3' } ]
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
      list_boss: [],
      start_time: '',
      end_time: '',
      selected_boss: [], // 平台订单分账选择
      selected_item: [], // 未分账的选择
      tab_select: { name: '未分账', type: '2' }, // 选中的 tab
      search_data: {
        keyword: null,
        store: null,
        time: null,
      },
      list: [], // 列表
      page_data: null,
      count_data: {
        count: '',
        setCount: '',
        unCount: '',
        no_separate_amount: '',
      },
    }
  },
  created () {
    this.resetPageData()
  },
  mounted () {
    let data = sessionStorage.getItem('searchData')
    if (data) {
      data = JSON.parse(data)
      this.tab_select = data.tab_select
      this.page_data = data.page_data
      this.search_data = data.search_data
      sessionStorage.setItem('searchData', '')
    }
    this.tab_select.type - 0 === 3 ? this.fetchBossList() : this.fetchDataList()
  },
  methods: {
    // 获取某年月的开始结束时间
    getMonthDateRange (year, month) {
      let start = new Date(year, month - 1, 1).getTime() / 1000
      let end = (new Date(year, month - 0, 0).getTime() / 1000) + 3600 * 24 - 1
      return {start: start, end: end}
    },
    // 平台订单总数据
    async getBossCount () {
      try {
        const { response, result } = await this.getBossCountApi()
        if (response.status === 200 && result.code === 0) {
          result.data.count = (result.data.count / 100).toFixed(2)
          result.data.unCount = (result.data.unCount / 100).toFixed(2)
          result.data.setCount = (result.data.setCount / 100).toFixed(2)
          result.data.no_separate_amount = (result.data.no_separate_amount / 100).toFixed(2)
          this.count_data = result.data
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        console.log(e, '平台订单总数据')
      }
    },
    /*
    * 去订单列表
    * item 订单对象
    * */
    goOrderList (item) {
      let date = this.getMonthDateRange(item.year, item.month)
      let searchData = {
        tab_select: this.tab_select,
        search_data: this.search_data,
        page_data: this.page_data,
        store: item.store_name,
        start_time: date.start,
        end_time: date.end,
      }
      sessionStorage.setItem('searchData', JSON.stringify(searchData))
      this.$router.push({
        name: 'orderBossList',
      })
    },
    // 取消选择
    cannelChoose () {
      this.selected_item = []
      this.selected_boss = []
    },
    /*
     * 导出平台订单结算
     * type 1 全部 2 选择
     * */
    confirmBossModal (type) {
      let _url = ''
      this.formateDate()
      let params = {
        start_time: this.start_time ? new Date(this.start_time).getTime() / 1000 : '',
        end_time: this.end_time ? new Date(this.end_time).getTime() / 1000 : '',
        store_name: this.search_data.store, // 门店名称搜索（模糊查询）
        ids: '',
      }
      if (type === 2) {
        let ids = ''
        this.selected_boss.forEach((item, index) => {
          ids += (item.trade_order_settle_id + ',')
        })
        ids = ids.slice(0, ids.length - 1)
        params.ids = ids
      }
      for (let key in params) {
        if (params[key]) _url += `&${key}=${params[key]}`
      }
      this.selected_boss = []
      window.open(`${root}/accounts/count-list/export${_url.replace('&', '?')}`)
    },
    /*
    * 确认分账
    * type 1 全部 2 选择
    * */
    async confirmModal (type) {
      this.formateDate()
      let params = {
        start_time: this.search_data.start_time,
        end_time: this.search_data.end_time,
        search: this.search_data.keyword, // 搜索条件（完整订单号或者手机号)
        store_name: this.search_data.store, // 门店名称搜索（模糊查询）
        order_ids: [],
      }
      if (type === 2) {
        let arr = []
        this.selected_item.forEach(item => {
          arr.push(item.trade_order_id)
        })
        params.order_ids = arr
      }
      try {
        const { response, result } = await this.getCountApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            title: '是否确定分账',
            content: '分账统计：' + '<br>' +
              '门店' + result.data.store_total + '家' + '<br>' +
              '订单数' + result.data.order_total + '个' + '<br>' +
              '订单总金额' + (result.data.amount_sum / 100).toFixed(2) + '元',
            isRejectable: 1,
            resolve: () => {
              this.confirmAccount(params)
            },
          })
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        console.log(e, '选择订单统计')
      }
    },
    // 确认分账接口confirmAccountsApi
    async confirmAccount (params) {
      try {
        const { response, result } = await this.confirmAccountsApi(params)
        if (response.status === 200 && result.code === 0) {
          this.selected_item = []
          this.fetchDataList()
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        console.log(e, '选择订单统计')
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
      if (this.tab_select.type - 0 === 3) {
        this.fetchBossList()
      } else {
        this.fetchDataList()
      }
    },
    reset () {
      this.page_data = {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      }
      this.search_data = {
        keyword: null,
        store: null,
        time: null,
      }
      this.start_time = ''
      this.end_time = ''
      this.tab_select.type - 0 === 3 ? this.fetchBossList() : this.fetchDataList()
    },
    // 分页跳转
    paging (state) {
      this.page_data = state
      this.tab_select.type - 0 === 3 ? this.fetchBossList() : this.fetchDataList()
    },
    async fetchDataList () {
      try {
        const { response, result } = await this.OrderSplitListApi({
          is_separate: this.tab_select.type,
          page: this.page_data.current_page,
          per_page: this.page_data.per_page,
          start_time: this.search_data.start_time,
          end_time: this.search_data.end_time,
          search: this.search_data.keyword, // 搜索条件（完整订单号或者手机号)
          store_name: this.search_data.store,
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
          title: '获取订单列表失败',
          content: `服务异常，请稍后再试（${e}）`,
        })
      }
    },
    async fetchBossList () {
      try {
        const { response, result } = await this.getCountListApi({
          page: this.page_data.current_page,
          per_page: this.page_data.per_page,
          start_time: this.start_time ? new Date(this.start_time).getTime() / 1000 : '',
          end_time: this.end_time ? new Date(this.end_time).getTime() / 1000 : '',
          store_name: this.search_data.store,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            let data = this.getYearMonth(item.settle_time)
            item.settle_time = data.data
            item.year = data.year
            item.month = data.month
            item.total_amount = (item.total_amount / 100).toFixed(2)
            item.set_amount = (item.set_amount / 100).toFixed(2)
            item.refund_amount = (item.refund_amount / 100).toFixed(2)
            item.reserve_amount = (item.reserve_amount / 100).toFixed(2)
            item.write_amount = (item.write_amount / 100).toFixed(2)
            item.month_refund_amount = (item.month_refund_amount / 100).toFixed(2)
            item.month_wait_amount = (item.month_wait_amount / 100).toFixed(2)
          })
          this.list_boss = result.data
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
    downExcel (item) {
      let date = this.getMonthDateRange(item.year, item.month)
      let _url = ''
      let params = {
        is_separate: 1,
        store_name: item.store_name,
        start_time: date.start,
        end_time: date.end,
      }
      for (let key in params) {
        if (params[key]) _url += `&${key}=${params[key]}`
      }
      window.open(`${root}/accounts/export${_url.replace('&', '?')}`)
    },
    exportData () {
      let _url = ''
      this.formateDate()
      let params = {
        is_separate: this.tab_select.type,
        page: this.page_data.current_page,
        per_page: this.page_data.per_page,
        start_time: this.search_data.start_time,
        end_time: this.search_data.end_time,
        search: this.search_data.keyword, // 搜索条件（完整订单号或者手机号)
        store_name: this.search_data.store, // 门店名称搜索（模糊查询）
      }
      for (let key in params) {
        if (params[key]) _url += `&${key}=${params[key]}`
      }
      window.open(`${root}/accounts/export${_url.replace('&', '?')}`)
    },
  },
  watch: {
    tab_select () {
      this.selected_item = []
      this.selected_boss = []
      this.page_data = {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      }
      this.search_data = {
        keyword: '',
        store: '',
        time: '',
      }
      if (this.tab_select.type - 0 === 3) {
        this.fetchBossList()
        this.getBossCount()
      } else {
        this.fetchDataList()
      }
    },
    'start_time' () {
      if (this.end_time) {
        if ((new Date(this.start_time).getTime() / 1000) - (new Date(this.end_time).getTime() / 1000) > 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '开始月份要不大于结束月份',
          })
          this.start_time = ''
        }
      }
    },
    'end_time' () {
      if (this.start_time) {
        if ((new Date(this.start_time).getTime() / 1000) - (new Date(this.end_time).getTime() / 1000) > 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '开始月份要不大于结束月份',
          })
          this.end_time = ''
        }
      }
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
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.space-text
  line-height 32px
.width-160 {
  max-width 160px !important
}
.width-120 {
  max-width 120px !important
}
.srue-btn {
  margin-left:30px
  height: 24px !important
  line-height 24px !important
}
.revenue {
  background #e8e9eb
  box-sizing: border-box;
  overflow: auto;
}
.income {
  background: #ffffff;
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.statistics {
  width: 33%;
  text-align: left;
  padding-left: 30px;
  border-left: 1px solid #D9D9D9;
  box-sizing: border-box;
}
.statistics:first-child {
  border: none;
}
.statistics div:first-child {
  font-size: 16px;
  color: #999999;
  font-weight: 500;
}
.statistics div:last-child {
  margin-top: 10px;
  font-size: 30px;
  color: #404040;
  font-weight: 500;
}
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
.margin {
  margin: 0 8px;
  font-size: 14px;
}

.choose-content {
  overflow: hidden;
}

.batched-operations {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
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
.top-total {
  overflow: unset !important;
  background: #e8e9eb !important;
  padding: 20px 30px 0 !important;
}
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
  .tip
    font-size: 12px
    color: #f00
    line-height: 16px
</style>
