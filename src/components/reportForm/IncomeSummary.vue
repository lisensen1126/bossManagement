<template lang="pug">
  .section-layout
    service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    .section-filter
      .field-group.is-horizontal
        .field(v-if="parseInt(default_value)===2 || parseInt(default_value)===3")
          label.label 关键字
          custom-input.fl.w-120(v-model="filterData.keywords", placeholder="请输入门店名称", @keyupEnter="search")
        .field(v-if="parseInt(default_value)===4")
          label.label 关键字
          custom-input.fl.w-160(v-model="filterData.store_name", placeholder="请输入门店名称", @keyupEnter="search")
        .field
          label.label 起止时间
          .field.is-horizontal
            date-picker.w-140(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker.w-140(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field.is-narrow(v-if="parseInt(default_value)===2")
          label.label 省
          custom-select(v-model="filterData.prov_ids", :list="province_list", nameField="name", placeholder="请选择省")
        .field.is-narrow(v-if="parseInt(default_value)===2")
          label.label 市
          custom-select(v-model="filterData.city_ids", :list="city_list", nameField="name", placeholder="请选择市")
        .field.is-narrow(v-if="parseInt(default_value)===2")
          label.label 订单分类
          custom-select.w-125(v-model="filterData.classification", :list="goods_classification")
        .field.is-narrow(v-if="parseInt(default_value)===4")
          label.label 订单分类
          custom-select(v-model="filterData.type", :list="goods_classification")
        .field.is-narrow(v-if="parseInt(default_value)===2")
          label.label 支付方式
          custom-select(v-model="filterData.payment_method", :list="payment_method")
        .field(v-if="parseInt(default_value)===4")
          label.label 省
          custom-select(v-model="filterData.prov_ids", :list="province_list", nameField="name", placeholder="请选择省")
        .field(v-if="parseInt(default_value)===4")
          label.label 市
          custom-select(v-model="filterData.city_ids", :list="city_list", nameField="name", placeholder="请选择市")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset(1)") 重置
        .field.fr(v-if="parseInt(default_value)===2 || parseInt(default_value)===4")
          a.button.fr(@click="exportExcel") 导出
      .time(v-if="parseInt(default_value)===1")
          div.day(:class="[date_type===1? 'active' : '']", @click="changeTime(1)") 今日
          div.month(:class="[date_type===2? 'active' : '']", @click="changeTime(2)") 本月
    empty-page(v-if="list.length === 0 && isInitiated && parseInt(default_value)===2", :tip="'暂无数据'")
    empty-page(v-if="list1.length === 0 && isInitiated && parseInt(default_value)===3", :tip="'暂无数据'")
    empty-page(v-if="!list2.length && parseInt(default_value)===4", :tip="'暂无数据'")
    //- 收入汇总
    .content-wrapper.revenue(v-if="parseInt(default_value)===1")
      //- 商品总额
      div
        div.income
          div.statistics
            div 商品总额
            div(v-if="goods_statistical_data.sum") ￥{{goods_statistical_data.sum.total_amount}}
          div.statistics
            div 实收金额
            div(v-if="goods_statistical_data.sum") ￥{{goods_statistical_data.sum.final_amount}}
          div.statistics
            div 订单数量
            div(v-if="goods_statistical_data.sum") {{goods_statistical_data.sum.count}}
          div.statistics
            div 交易门店数
            div(v-if="goods_statistical_data.sum") {{goods_statistical_data.sum.store_count}}
      div.order-statistics
        div
          ul.order-income
            li 商品订单类型
            li 商品总额
            li 实收金额
        div(v-for="item in goods_statistical_data.goods_type_list")
          ul.order-income-content
            li(v-if="item.type === 1")
              span  商品服务订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含直接下单、拼团、秒杀、智能保养+工时、平台小程序下单'")
                .el-icon-question(slot="reference")
            li(v-if="item.type === 2")
              span 养护卡订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含直接下单、拼团、秒杀下单'")
                .el-icon-question(slot="reference")
            li(v-if="item.type===3")
              span 线下买单订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含门店收款码和开单收款码付款订单'")
                .el-icon-question(slot="reference")
            li ￥{{item.total_amount}}
            li ￥{{item.final_amount}}   
      //- 营销总额
      div
        div.income
          div.statistics
            div 营销商品总额
            div(v-if="order_statistical_data.sum") ￥{{order_statistical_data.sum.total_amount}}
          div.statistics
            div 营销实收金额
            div(v-if="order_statistical_data.sum") ￥{{order_statistical_data.sum.final_amount}}
          div.statistics
            div 营销订单数量
            div(v-if="order_statistical_data.sum") {{order_statistical_data.sum.count}}
      div.order-statistics
        div
          ul.order-income
            li 营销订单类型
            li 商品总额
            li 实收金额
        div(v-for="item in order_statistical_data.order_type_list")
          ul.order-income-content
            li(v-if="item.order_type===3") 
              span  拼团订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品、服务、养护卡的拼团订单'")
                .el-icon-question(slot="reference")
            li(v-if="item.order_type===4")
              span  秒杀订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品、服务、养护卡的秒杀订单'")
                .el-icon-question(slot="reference")
            li(v-if="item.order_type===2") 
              span  智能保养订单
              el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="'包含商品+工时'")
                .el-icon-question(slot="reference")
            li ￥{{item.total_amount}}
            li ￥{{item.final_amount}}
      //- 渠道商品
      div
        div.income
          div.statistics
            div 渠道商品总额
            div(v-if="payment_statistical_data.sum") ￥{{payment_statistical_data.sum.total_amount}}
          div.statistics
            div 渠道实收金额
            div(v-if="payment_statistical_data.sum") ￥{{payment_statistical_data.sum.final_amount}}
          div.statistics
            div 渠道订单数量
            div(v-if="payment_statistical_data.sum") {{payment_statistical_data.sum.count}} 
      div.order-statistics
        div
          ul.order-income
            li 支付渠道
            li 商品总额
            li 实收金额
        div(v-for="item in payment_statistical_data.payment_type_list")
          ul.order-income-content
            li(v-if="item.payment_channel===1") 微信
            li(v-if="item.payment_channel===2") 美团
            li ￥{{item.total_amount}}
            li ￥{{item.final_amount}}
    //- 交易汇总
    .content-wrapper.list-wrapper(v-if="list.length && list.length > 0 && parseInt(default_value)===2")
      .table-wrapper
        table.table
          thead
            tr
              td(width="15%") 门店名称
              td(width="15%") 企业名称
              td(width="15%") 门店地址
              td(width="10%") 订单金额
              td(width="10%") 实收金额
              td(width="11%") 分类
              td(width="11%") 支付方式
              td(width="12%") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td(class="text-algin: left")
                .multi-content-td.textzh
                  ul(v-for="items in item.store_name") 
                    li(v-if="item.is_chain===1") (连锁){{items}}
                    li(v-if="item.is_chain===2") {{items}}
              td
                .multi-content-td.textzh(v-if="item.is_chain===1") (连锁){{item.enterprise_name}}
                .multi-content-td.textzh(v-if="item.is_chain===2") {{item.enterprise_name}}
              td  {{item.store_addres}}
              td  
                .simple-td ￥{{item.total_amount}}
              td
                .simple-td ￥{{item.final_amount}}
              td
                .simple-td(v-if="item.goods_type === 0") 全部
                .simple-td(v-if="item.goods_type === 1") 商品服务订单
                .simple-td(v-if="item.goods_type === 2") 养护卡订单
                .simple-td(v-if="item.goods_type === 3") 线下买单订单
              td
                .multi-content-td.textzh(v-if="item.payment_channel===0") 全部
                .multi-content-td.textzh(v-if="item.payment_channel===1") 微信支付
                .multi-content-td.textzh(v-if="item.payment_channel===2") 美团支付
              td
                .operation-td
                  a.operation-link.left(@click="goBusinessDetail(item)") 交易明细
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
    //- 美团支付查询
    .content-wrapper.list-wrapper(v-if="list1.length && list1.length > 0 && parseInt(default_value)===3")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 结算时间
              td(width="100") 账期时间
              //- td(width="20%") 企业名称
              td(width="120") 门店名称
              td(width="80") 交易金额
              td(width="80") 手续费
              td(width="80") 结算金额
              td(width="80") 打款时间
              td(width="80") 打款状态
              td(width="100") 操作
          tbody(v-if="list1.length")
            tr(v-for="(item, index) in list1[paginationData.current_page-1]")
              td
                .multi-content-td.textzh {{item.payment_time}}
              td
                .multi-content-td.textzh {{item.start_time}}-{{item.end_time}}
              td
                .multi-content-td.textzh {{item.store_name}}
              td
                .simple-td ￥{{item.trade_money}}
              td
                .simple-td ￥{{item.poundage_money}}
              td
                .simple-td ￥{{item.settle_money}}

              td
                .simple-td {{item.payment_finish_time}}
              td
                .simple-td {{item.pay_status}}
              td
                .operation-td
                  a.operation-link.left(@click="goTransactionDetail(item)") 交易详情
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="pagingMT")
    //- 交易明细
    .content-wrapper.list-wrapper(v-if="list2.length && list2.length > 0 && parseInt(default_value)===4")
      .table-wrapper
        table.table
          thead
            tr
              td(width="15%") 订单时间
              td(width="10%") 订单编号
              td(width="14%") 订单项目
              td(width="9%") 金额
              td(width="8%") 分类
              td(width="17%") 客户信息
              td(width="18%") 门店名称
              td(width="10%") 操作
          tbody(v-if="list2.length")
            tr(v-for="(item, index) in list2")
              td
                .multi-content-td.textzh {{item.turnover_time}}
              td
                .multi-content-td.textzh {{item.trade_order_no}}
              td
                .multi-content-td.textzh {{item.trade_order_item.length>11?(item.trade_order_item).slice(0, 11)+'...':item.trade_order_item}}
              td
                .multi-content-td.textzh(v-if="item.type===1") +{{item.amount}}
                .multi-content-td.textzh(v-if="item.type===2") -{{item.amount}}
              td
                .simple-td(v-if="item.goods_type === 1 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 商品服务订单
                .simple-td(v-if="item.goods_type === 2 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 养护卡订单
                .simple-td(v-if="item.order_type === 7 || item.order_type === 6") 线下买单订单
              td
                .simple-td {{item.nick_name}}/{{item.mobile}}
              td
                .simple-td(v-if="item.is_chain===1") (连锁){{item.store_name}}
                .simple-td(v-if="item.is_chain===2") {{item.store_name}}
              td
                .operation-td(@click="goOrderDetail(item)")
                  a.operation-link.left 订单详情
          .tfoot(v-if="list2.length")
            pagination(:pagination-data="paginationData", @input="pagingBusiness")
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import drawApi from '@/mixins/modules/draw'
import reportFormApi from '@/mixins/modules/reportForm'
import formateDate from '@/mixins/utilities/formateDate'
import { root } from '@/plugins/Fetch'
export default {
  name: 'PageSetting',
  mixins: [drawApi, reportFormApi, formateDate],
  components: {
    ServiceTab,
    CustomInput,
    Pagination,
    EmptyPage,
    CustomSelect,
    DatePicker,
  },
  data () {
    return {
      root,
      date_type: 1, // 本月-今日
      goods_statistical_data: {}, // 商品总额收入汇总的数据
      order_statistical_data: {}, // 营销商品总额收入汇总的数据
      payment_statistical_data: {}, // 支付渠道数据
      default_value: '1',  // 页面tab初始值
      isInitiated: false,    // 页面初始状态
      merchant_id: '',  // 美团支付商户ID
      tabList: [
        {
          name: '收入汇总',
          type: '1',
        },
        {
          name: '交易汇总',
          type: '2',
        },
        {
          name: '交易明细',
          type: '4',
        },
        {
          name: '美团支付查询',
          type: '3',
        },
      ],
      tab: {               // 默认选中tab
        name: '收入汇总',
        type: '1',
      },
      order_classification: [ // 订单分类
        { name: '全部', value: '0' },
        { name: '普通订单', value: '1' },
        { name: '智能保养', value: '2' },
        { name: '拼团订单', value: '3' },
        { name: '秒杀订单', value: '4' },
        { name: '养护卡', value: '5' },
        { name: '线下买单订单', value: '6' },
      ],
      goods_classification: [   // 订单分类 v3.8.5修改
        { name: '全部', value: '0' },
        { name: '商品服务订单', value: '1' },
        { name: '养护卡订单', value: '2' },
        { name: '线下买单订单', value: '3' },
      ],
      payment_method: [     // 支付方式
        { name: '全部', value: '0' },
        { name: '微信支付', value: '1' },
        { name: '美团支付', value: '2' },
      ],
      classify_list: [
        {
          type: '普通订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '拼团订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '秒杀订单',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '普通订单',
          order_money: 300,
          order_pay: 200,
        },
      ], // 订单分类统计数据
      payment_list: [
        {
          type: '美团支付',
          order_money: 300,
          order_pay: 200,
        },
        {
          type: '微信支付',
          order_money: 300,
          order_pay: 200,
        },
      ], // 支付渠道统计数据
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      is_true: true, // 开始是否大于结束
      list: [],
      list1: [], // 处理美团数据后的数组
      list2: [], // 交易明细数据
      sendData: {},
      province_list: [],  // 省列表
      city_list: [],  // 市列表
      filterData: {
        keywords: '', // 门店名称搜索字段
        start_time: '',
        end_time: '',
        classification: null, // 订单分类搜索字段
        payment_method: null, // 支付方式
        prov_ids: null,
        city_ids: null,
        store_ids: null, // 交易明细门店id
        store_name: null, // 交易明细门店name
        type: null, // 交易明细 - 订单商品类型：1=商品服务，2=保养卡，3=线下商品 0为全部
      },
      queryData: {},
      is_first_enter: false, // 是否第一次进入
    }
  },
  methods: {
    // 今日或搜索
    changeTime (type) {
      if (this.date_type === type || this.date_type === 3) {
        return
      }
      if (type === 1) {
        this.date_type = 1
      } else {
        this.date_type = 2
      }
      this.getIncomeSummary()
    },
    // 搜索
    search () {
      if (!this.is_true && this.filterData.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => this.$emit('failure'),
        })
        return false
      }
      for (let key in this.filterData) {
        if (this.queryData.hasOwnProperty(key)) {
          this.queryData[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      if (parseInt(this.default_value) === 1) {
        this.getIncomeSummary()
      } else if (parseInt(this.default_value) === 2) {
        this.fetchList()
      } else if (parseInt(this.default_value) === 3) {
        if (this.queryData.keywords) {
          this.fetchMeiTuanList()
        }
      } else if (parseInt(this.default_value) === 4) {
        this.getBusinessDetail()
      }
    },
    // 重置
    reset (type) {
      this.filterData = {
        keywords: '', // 门店名称搜索字段
        start_time: '',
        end_time: '',
        classification: null, // 订单分类搜索字段
        payment_method: null, // 支付方式
        prov_ids: null,
        city_ids: null,
        store_ids: null,
        store_name: null,
        type: null,
      }

      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.date_type = 1 // 收入汇总重置为今日
      if (parseInt(this.default_value) === 1) {
        this.getIncomeSummary()
      } else if (parseInt(this.default_value) === 2) {
        this.fetchList()
      } else if (parseInt(this.default_value) === 3) {
        if (this.queryData.keywords) {
          this.isInitiated = false
          this.fetchMeiTuanList()
        } else {
          this.list1 = []
          this.isInitiated = true
        }
      } else if (parseInt(this.default_value) === 4 && type === 1) {
        this.getBusinessDetail()
      }
    },
    // 分页操作
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },
    // 美团分页
    pagingMT (state) {
      this.paginationData = state
      this.sliceArr()
    },
    // 美团分页
    sliceArr () {
      this.list1 = []
      let lastPage = Math.ceil(this.list.length / 20)
      this.$set(this.paginationData, 'total', this.list.length)
      this.$set(this.paginationData, 'last_page', lastPage)
      for (let i = 0; i < this.list.length / this.paginationData.per_page + 1; i++) {
        this.list1.push(this.list.slice(i * this.paginationData.per_page, (i + 1) * this.paginationData.per_page))
      }
    },
    // 交易明细分页
    pagingBusiness (state) {
      this.paginationData = state
      this.getBusinessDetail()
    },
    // tab切换
    changePage (params, flag) {
      if (params.type === this.default_value) return   // 已是选中状态不再请求接口
      this.paginationData = {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      }
      this.default_value = params.type
      if (Number(this.default_value) === 4) {
        if (!flag) {
          this.filterData.start_time = ''
          this.filterData.end_time = ''
          this.filterData.prov_ids = null
          this.filterData.city_ids = null
        }
        this.getBusinessDetail()
      } else {
        this.reset()
      }
    },
    // 前往交易明细
    goBusinessDetail (data) {
      let flag = true
      this.filterData.store_ids = data.store_ids
      this.filterData.store_name = data.store_name[0]
      this.filterData.type = this.filterData.classification
      this.tab = {
        name: '交易明细',
        type: '4',
      }
      this.paginationData.current_page = 1
      this.changePage(this.tab, flag)
    },
    // 去订单详情
    goOrderDetail (params) {
      this.$router.push({
        name: 'incomeOrderDetail',
        query: {
          id: params.shop_id,
          trade_order_id: params.trade_order_id,
        },
      })
    },
    // 前往交易详情
    goTransactionDetail (params) {
      this.$router.push({
        name: 'incomeTransaction',
        query: {
          payment_id: params.payment_id,
          merchant_id: this.merchant_id,
        },
      })
    },

    // 数据格式格式化
    dataFilter () {
      this.sendData = {}
      if (parseInt(this.default_value) !== 1 || parseInt(this.default_value) !== 4) {
        this.sendData.start_time = this.queryData.start_time ? parseInt(new Date(this.queryData.start_time + ' 00:00').getTime() / 1000) : ''
        this.sendData.end_time = this.queryData.end_time ? parseInt(new Date(this.queryData.end_time + ' 23:59:59').getTime() / 1000) : ''
      }
      if (parseInt(this.default_value) === 1) {
        if (this.queryData.start_time || this.queryData.end_time) {
          this.date_type = 3
          this.sendData.start_time = this.queryData.start_time ? parseInt(new Date(this.queryData.start_time + ' 00:00').getTime() / 1000) : ''
          this.sendData.end_time = this.queryData.end_time ? parseInt(new Date(this.queryData.end_time + ' 23:59:59').getTime() / 1000) : ''
        } else {
          if (parseInt(this.date_type) === 1 || parseInt(this.date_type) === 2) {
            this.sendData.date_type = this.date_type
          } else if (parseInt(this.date_type) === 3) {
            this.sendData.date_type = 1
            this.date_type = 1
          }
        }
      } else if (parseInt(this.default_value) === 2) {
        let type = 0
        let payType = 0
        this.sendData.page = this.paginationData.current_page
        this.sendData.per_page = this.paginationData.per_page
        this.sendData.keyword = this.queryData.keywords
        this.sendData.province_id = this.filterData.prov_ids ? this.filterData.prov_ids.id : ''
        this.sendData.city_id = this.filterData.city_ids ? this.filterData.city_ids.id : ''
        switch (this.queryData.classification && parseInt(this.queryData.classification.value)) {
          case 0: type = 0; break
          case 1: type = 1; break
          case 2: type = 2; break
          case 3: type = 3; break
          case 4: type = 4; break
          case 5: type = 5; break
          case 6: type = 6; break
        }
        switch (this.queryData.payment_method && parseInt(this.queryData.payment_method.value)) {
          case 0: payType = 0; break
          case 1: payType = 1; break
          case 2: payType = 2; break
        }
        this.sendData.type = type
        this.sendData.payment_channel = payType
      } else if (parseInt(this.default_value) === 3) {
        this.sendData.store_name = this.queryData.keywords
      } else if (parseInt(this.default_value) === 4) {
        this.queryData = JSON.parse(JSON.stringify(this.filterData))

        this.sendData = {
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          store_ids: this.queryData.store_ids ? this.queryData.store_ids : null,
          store_name: this.queryData.store_name,
          type: this.queryData.type ? this.queryData.type.value : null,
          prov_ids: this.queryData.prov_ids ? this.queryData.prov_ids.id : null,
          city_ids: this.queryData.city_ids ? this.queryData.city_ids.id : null,
          start_time: this.queryData.start_time ? parseInt(new Date(this.queryData.start_time + ' 00:00').getTime() / 1000) : '',
          end_time: this.queryData.end_time ? parseInt(new Date(this.queryData.end_time + ' 23:59:59').getTime() / 1000) : '',
        }
      }
    },
    // 获取收入汇总
    async getIncomeSummary () {
      this.dataFilter()
      try {
        const { response, result } = await this.GetRevenueApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          // 商品订单总额格式化
          result.data.goods.sum.total_amount = (result.data.goods.sum.total_amount / 100).toFixed(2)
          result.data.goods.sum.final_amount = (result.data.goods.sum.final_amount / 100).toFixed(2)
          // 营销商品订单总额格式化
          result.data.order.sum.total_amount = (result.data.order.sum.total_amount / 100).toFixed(2)
          result.data.order.sum.final_amount = (result.data.order.sum.final_amount / 100).toFixed(2)
          // 支付渠道总额格式化
          result.data.payment.sum.total_amount = (result.data.payment.sum.total_amount / 100).toFixed(2)
          result.data.payment.sum.final_amount = (result.data.payment.sum.final_amount / 100).toFixed(2)
          // 商品总额列表格式化金额
          result.data.goods.goods_type_list.forEach(e => {
            e.total_amount = (e.total_amount / 100).toFixed(2)
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          // 营销商品总额列表格式化金额
          result.data.order.order_type_list.forEach(e => {
            e.total_amount = (e.total_amount / 100).toFixed(2)
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          // 支付渠道列表格式化金额
          result.data.payment.payment_type_list.forEach(e => {
            e.total_amount = (e.total_amount / 100).toFixed(2)
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          this.goods_statistical_data = result.data.goods
          this.order_statistical_data = result.data.order
          this.payment_statistical_data = result.data.payment
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取收入汇总数据失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取收入汇总数据失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取交易数据
    async fetchList () {
      this.dataFilter()
      try {
        const { response, result } = await this.GetTransactionApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(e => {
            e.total_amount = (e.total_amount / 100).toFixed(2)
            e.final_amount = (e.final_amount / 100).toFixed(2)
          })
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取交易详情失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取交易详情失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取美团支付数据
    async fetchMeiTuanList () {
      this.dataFilter()
      let self = this
      try {
        const { response, result } = await this.GetMeiTuanApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          result.data.list.forEach(e => {
            e.trade_money = (e.trade_money / 100).toFixed(2)
            e.settle_money = (e.settle_money / 100).toFixed(2)
            e.poundage_money = (e.poundage_money / 100).toFixed(2)
          })
          self.merchant_id = result.data.merchant_id
          self.list = result.data.list
          self.isInitiated = true
          if (self.list.length !== 0) {
            self.sliceArr()
          } else {
            this.list1 = []
          }
        } else {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取交易详情失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取交易详情失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取交易明细
    async getBusinessDetail () {
      this.dataFilter()
      try {
        const {response, result} = await this.GetFlowApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(e => {
            e.turnover_time = this.formateDate(e.turnover_time, true, 2)
            e.amount = (e.amount / 100).toFixed(2)
          })
          this.list2 = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取交易明细失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取交易明细失败',
          content: `错误：${err}`,
        })
      }
    },
    // 导出按钮点击
    exportExcel () {
      let url = null
      let query = JSON.parse(JSON.stringify(this.filterData))
      query.start_time = query.start_time ? parseInt(new Date(query.start_time + ' 00:00').getTime() / 1000) : ''
      query.end_time = query.end_time ? parseInt(new Date(query.end_time + ' 23:59:59').getTime() / 1000) : ''
      if (parseInt(this.default_value) === 2) {
        url = `${root}/order/transaction_export?start_time=${query.start_time}&end_time=${query.end_time}&page=1&keyword=${query.keywords}&type=${query.classification ? query.classification.value : ''}&payment_channel=${query.payment_method ? query.payment_method.value : ''}&province_id=${query.prov_ids ? query.prov_ids.id : ''}&city_id=${query.city_ids ? query.city_ids.id : ''}`
      } else if (parseInt(this.default_value) === 4) {
        let startTime = query.start_time ? query.start_time : ''
        let endTime = query.end_time ? query.end_time : ''
        let storeIds = query.store_ids ? query.store_ids : ''
        let storeName = query.store_name ? query.store_name : ''
        let goodsType = query.type ? query.type.value : ''
        let provIds = query.prov_ids ? query.prov_ids.id : ''
        let cityIds = query.city_ids ? query.city_ids.id : ''
        url = `${root}/order/turnover_export?start_time=${startTime}&end_time=${endTime}&page=1&store_ids=${storeIds}&store_name=${storeName}&type=${goodsType}&prov_ids=${provIds}&city_ids=${cityIds}`
      }
      window.open(url)
    },
    /**
     * 获取省市区
     * parentId  {Number, String}  省市区id
     * type  {String} 类别
     */
    async getRegions (type, parentId) {
      const { response, result } = await this.fetchRegions({ parent_id: parentId })
      if (response.status === 200 && result.code === 0) {
        type === 'province' ? this.province_list = result.data : this.city_list = result.data
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '网络出错了，请稍后再试',
          content: `${result.message}`,
        })
      }
    },
  },
  mounted () {
    this.is_first_enter = true
    this.getRegions('province', 0)
  },
  watch: {
    'filterData.prov_ids' (v) {
      this.filterData.city_ids = null
      this.city_list = []
      if (v) this.getRegions('city', v.id)
    },
    'filterData.start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.filterData.start_time.replace(/-/g, '') - 0
        this.filterData.end_time === '' ? end = 0 : end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'filterData.end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.filterData.start_time === '' ? start = 0 : start = this.filterData.start_time.replace(/-/g, '') - 0
        end = this.filterData.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'incomeStore') {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.reset()
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.field-group
  position relative
.time
  position absolute
  right 40px
  bottom 20px
  border-radius 3px
  border 1px solid #D9D9D9
  box-sizing border-box
.time .day, .time .month
  display inline-block
  width 78px
  height 28px
  line-height 28px
  text-align center
  font-size 14px
  border-radius 3px
  background #D9D9D9
  color #9A9B9A
  cursor pointer
.active
  color #121212 !important
  background #FFFFFF !important
.revenue
  padding-top 0
  box-sizing border-box
  overflow auto
.income
  background #ffffff
  height 100px
  display flex
  justify-content flex-start
  align-items center
.statistics
  width 33%
  text-align left
  padding-left 30px
  border-left 1px solid #D9D9D9
  box-sizing border-box
.statistics:first-child
  border none
.statistics div:first-child
  font-size 16px !important
  color #999999 !important
  font-weight 500 !important
.statistics div:last-child
  margin-top 10px
  font-size 30px
  color #404040
  font-weight 500
.order-statistics
  background #ffffff
  margin-top 5px
  margin-bottom 20px
  box-sizing border-box
.order-income, .order-income-content
  background #ffffff
  display flex
  height 40px
  line-height 40px
  justify-content flex-start
  align-items center
  border-bottom 1px solid #F1F1F1
  box-sizing border-box
.order-income-content
  border-bottom none
  height 40px
  line-height 40px
.order-income li, .order-income-content li
  width 33%
  font-size 14px
  color #999999
  font-weight 500
  padding-left 30px
.order-income-content li
  color #353535
  font-weight 400
td
  vertical-align middle !important
.multi-content-td
  vertical-align middle
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 40px
.section-layout
  height calc(100% - 56px)
.top-nav
  display flex
  flex 0 0 48px
  align-items center
  justify-content center
  position relative
  height 48px
  padding-left 64px
  padding-right 64px
  background-color #fcfcfc
  box-shadow 0 2px 8px 0 rgba(0, 0, 0, 0.08)
  z-index 8
.fr
  float right
.w-100
  width 100px
.w-120
  width 120px
.w-125
  width 125px
.w-140
  width 140px
.w-160
  width 160px
.margin
  margin 0 8px
  font-size 14px
</style>


