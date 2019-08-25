<template lang="pug">
  .section-layout
    service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    .content-layout-list
      //- 养护卡统计开始
      .revenue.top-total(v-if="tab.type - 0 === 7 && total",)
        div
          h2.m-b-20 累计售卡统计
          div.income
            div.statistics
              div.title 总售卖金额
              div.price ￥{{total.total_amount}}
            div.statistics
              div.title 总实收金额
              div.price ￥{{total.final_amount}}
            div.statistics
              div.title 总售卖数量
              div.price {{total.sale_cnt}}
          div.order-statistics.m-t-10
            div
              ul.order-income
                li 养护卡类型
                li 总售卖总额
                li 总实收总额
                li 总售卖数量
            div
              ul.order-income-content
                li 壳养护卡
                li ￥{{total.boss_upkeep_total_amount}}
                li ￥{{total.boss_upkeep_final_amount}}
                li {{total.boss_upkeep_sale_cnt}}
              ul.order-income-content
                li 养护卡
                li ￥{{total.upkeep_total_amount}}
                li ￥{{total.upkeep_final_amount}}
                li {{total.upkeep_sale_cnt}}
              ul.order-income-content
                li 次卡
                li ￥{{total.sub_upkeep_total_amount}}
                li ￥{{total.sub_upkeep_final_amount}}
                li {{total.sub_upkeep_sale_cnt}}
      h2.title-filter(v-if="tab.type - 0 === 7") 近期售卡统计
      .section-filter(v-if="tab.type - 0 === 7")
        .field-group.is-horizontal
          .field
            label.label 养护卡名称
            custom-input.fl.w-160(v-model="filter_data.keywords", placeholder="请输入养护卡名称", @keyupEnter="search")
          .field
            label.label 养护卡类型
            custom-select(v-model="classify_status", :list="classify_list")
          .field
            label.label 起止时间
            .field.is-horizontal
              date-picker.w-160(type="single", placeholder="选择开始时间", v-model="start_time")
              span.margin 至
              date-picker.w-160(type="single", placeholder="选择结束时间", v-model="end_time")
          .field
            a.button.primary(@click="search") 搜索
          .field
            a.button(@click="reset") 重置
        .time
          div.day(:class="[date_type===1? 'active' : '']", @click="changeTime(1)") 今日
          div.month(:class="[date_type===2? 'active' : '']", @click="changeTime(2)") 本月
      empty-page.list-height(v-if="!list.length && isInitiated && parseInt(default_value)==7", :tip="'暂无数据'")
      .content-wrapper.revenue(v-if="parseInt(default_value)===7 && list.length")
        div(v-if="present")
          div.income
            div.statistics
              div.title 总售卖金额
              div.price ￥{{present.total_amount}}
            div.statistics
              div.title 总实收金额
              div.price ￥{{present.final_amount}}
            div.statistics
              div.title 总售卖数量
              div.price {{present.sale_cnt}}
        div.order-statistics.p-t-20.inspect-store
          div
            ul.order-income
              li 养护卡名称
              li 在售门店数
              li 售卖数量
              li 售卖金额
              li 实收金额
              li 微信售卖金额
              li 微信实收金额
              li 美团售卖金额
              li 美团实收金额
          div(v-for="(item, index) in list")
            ul.order-income-content
              li {{item.name}}
              li {{item.store_cnt}}
              li {{item.sale_cnt}}
              li {{item.total_amount}}
              li {{item.final_amount}}
              li {{item.wechat_total_amount}}
              li {{item.wechat_final_amount	}}
              li {{item.meituan_total_amount	}}
              li {{item.meituan_final_amount}}
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
      //- 养护卡统计结束

      //- 车检统计开始
      .revenue.top-total(v-if="tab.type - 0 === 8 && inspect_total",)
        div
          div.income
            div.statistics
              div.title 总车检单数量
              div.price {{inspect_total.total_record_count}} 单
            div.statistics
              div.title 启用车检门店
              div.price {{inspect_total.on_shelves_inspect_store_count}} 家
            div.statistics
              div.title 生成车检单门店
              div.price {{inspect_total.inspect_record_store_count}} 家
          div.order-statistics.m-t-10
            div
              ul.order-income
                li 车检类型
                li 车检数量
            div
              ul.order-income-content
                li 安全车检数量
                li(v-if="inspect_total.inspect_record_count.security_inspect_count") {{inspect_total.inspect_record_count.security_inspect_count}} 单
                li(v-else) --
              ul.order-income-content
                li 夏季车检数量
                li(v-if="inspect_total.inspect_record_count.summer_inspect_count") {{inspect_total.inspect_record_count.summer_inspect_count}} 单
                li(v-else) --
              ul.order-income-content
                li 冬季车检数量
                li(v-if="inspect_total.inspect_record_count.winter_inspect_count") {{inspect_total.inspect_record_count.winter_inspect_count}} 单
                li(v-else) --
              ul.order-income-content
                li 全面车检数量
                li(v-if="inspect_total.inspect_record_count.full_inspect_count") {{inspect_total.inspect_record_count.full_inspect_count}} 单
                li(v-else) --
              ul.order-income-content
                li 其他车检数量
                li(v-if="inspect_total.inspect_record_count.other_inspect_count") {{inspect_total.inspect_record_count.other_inspect_count}} 单
                li(v-else) --
      .section-filter(v-if="tab.type - 0 === 8")
        .field-group.is-horizontal
          .field
            label.label 起止时间
            .field.is-horizontal
              date-picker.w-160(type="single", placeholder="选择开始时间", v-model="start_time")
              span.margin 至
              date-picker.w-160(type="single", placeholder="选择结束时间", v-model="end_time")
          .field
            a.button.primary(@click="search") 搜索
          .field
            a.button(@click="reset") 重置
          .field
            a.button(@click="exportExcel") 导出
        .time
          div.day(:class="[date_type===1? 'active' : '']", @click="changeTime(1)") 今日
          div.month(:class="[date_type===2? 'active' : '']", @click="changeTime(2)") 本月
      empty-page.list-height(v-if="!inspect_store_list.length && parseInt(default_value)===8", :tip="'暂无数据'")
      .content-wrapper.revenue(v-if="parseInt(default_value)===8 && inspect_store_list.length", style="padding-bottom: 36px")
        div.order-statistics.inspect-store(style="margin-top: 0")
          div
            ul.order-income
              li 门店名称
              li 企业名称
              li 车检单总量
              li 全面车检
              li 冬季车检
              li 夏季车检
              li 安全车检
              li 其他车检
          div(v-for="(item, index) in inspect_store_list")
            ul.order-income-content
              li {{item.store_name}}
              li {{item.enterprise_name}}
              li {{item.total_inspect}}
              li {{item.full_inspect}}
              li {{item.winter_inspect}}
              li {{item.summer_inspect}}
              li {{item.security_inspect}}
              li {{item.other_inspect}}
          .tfoot(v-if="inspect_store_list.length")
            pagination(:pagination-data="paginationData", @input="paging")
      //- 车检统计结束
      
      //- 其他统计列表开始
      .section-filter(v-if="tab.type - 0 !== 7 && tab.type - 0 !== 8")
        .field-group.is-horizontal
          .field
            label.label 起止时间 {{tab.type}}
            .field.is-horizontal
              date-picker.w-160(type="single", placeholder="选择开始时间", v-model="filter_data.start_time")
              span.margin 至
              date-picker.w-160(type="single", placeholder="选择结束时间", v-model="filter_data.end_time")
          .field
            label.label 区域
            custom-select.fl.w-100(:list="provinceList", v-model="filter_data.province", @input="changeProvince", placeholder="请选择省")
          .field
            input.input.fl.w-100(@click="getCity", placeholder="请选择市", :disabled="!filter_data.province.id" type="text", v-model="filter_data.cityText")
          .field
            input.input.fl.w-100(@click="getStore", placeholder="请选择门店", :disabled="filter_data.cityText === ''" type="text", v-model="filter_data.storeText")
          .field
            label.label 门店
            custom-input.fl.w-160(placeholder="请输入门店名称", type="text", v-model="filter_data.keywords",@keyupEnter="search")
          .field
            a.button.primary(@click="search") 搜索
          .field
            a.button(@click="reset") 重置
          .field.fr
            a.button.fr(@click="exportExcel") 导出
      empty-page(v-if="list.length === 0 && isInitiated && tab.type - 0 !== 7 && tab.type - 0 !== 8", :tip="'暂无数据'")
      .content-wrapper.list-wrapper(v-if="list.length && list.length > 0 && tab.type - 0 !== 7 && tab.type - 0 !== 8")
        .table-wrapper
          table.table
            thead
              tr
                td(width="80") 省
                td(width="80") 市
                td(width="80") 区
                //- td(width="80") 经销商
                //- td(width="80") 经销商ID
                //- td(width="80") 督导
                td(width="40") 经销商编码
                td(width="120") 门店名称
                td(width="50") 门店id
                td(width="90") 小程序
                td(width="40") ERP ID
                td(width="130", v-if="default_value == 1 || default_value == 2") 小程序访问数
                td(width="90", v-if="default_value == 1 || default_value == 3") 注册车主数
                td(width="60", v-if="default_value == 1 || default_value == 4") 订单数
                td(width="100", v-if="default_value == 1 || default_value == 5") 下单车主数
                td(width="60", v-if="default_value == 1 || default_value == 6") 订单金额
                td(width="100") 壳牌订单数
                td(width="110") 壳牌订单金额
                td(width="110", v-if="tab.type == 1") 壳牌精英店 
                td(width="80") 操作
            tbody(v-if="list.length")
              tr(v-for="(item, index) in list")
                td
                  .multi-content-td.textzh(v-text="item.province")
                td
                  .multi-content-td.textzh(v-text="item.city")
                td
                  .multi-content-td.textzh(v-text="item.district")
                //- td
                //-   .simple-td(v-text="'--'")
                //- td
                //-   .simple-td(v-text="'--'")
                //- td
                //-   .simple-td(v-text="'--'")
                td
                  .multi-content-td.textzh {{item.dealer_code ? item.dealer_code : '--'}}
                td
                  .multi-content-td.textzh(v-text="item.store_name")
                td
                  .multi-content-td.textzh(v-text="item.store_id")
                td
                  .multi-content-td.textzh(v-if="item.app_name == ''", v-text="'--'")
                  .multi-content-td.textzh(v-if="item.app_name != ''", v-text="item.app_name")
                td
                  .multi-content-td.textzh(v-text="item.erp_id")
                td(v-if="default_value == 2 || default_value == 1")
                  .multi-content-td.textzh(v-text="item.app_click_num")
                td(v-if="default_value == 3 || default_value == 1")
                  .multi-content-td.textzh(v-text="item.app_register_num")
                td(v-if="default_value == 4 || default_value == 1")
                  .multi-content-td.textzh(v-text="item.app_order_num")
                td(v-if="default_value == 5 || default_value == 1")
                  .multi-content-td.textzh(v-text="item.app_order_customer_num")
                td(v-if="default_value == 6 || default_value == 1")
                  .multi-content-td.textzh(v-text="item.app_order_total_amount")
                td
                  .multi-content-td.textzh(v-text="item.shell_order_num")
                td
                  .multi-content-td.textzh(v-text="item.shell_order_total_amount")
                td(v-if="tab.type == 1")
                  .multi-content-td.textzh(v-if="item.is_elite == 1") 是
                  .multi-content-td.textzh(v-else) 否
                td
                  .operation-td
                    a.operation-link.left(@click="goDailyDetails(item)") 每日明细
            .tfoot(v-if="list.length")
              pagination(:pagination-data="paginationData", @input="paging")
      //- 其他统计列表结束

    choose-city(v-model="itemCity" ,v-if="itemCity", @resolve="addCity", :provinceId="filter_data.province.id", :nowCityList="nowCityList")
    choose-store(v-model="itemStore" ,v-if="itemStore", @resolve="addStore", :cityIds="filter_data.cityIds", :nowStoreList="nowStoreList")
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import EmptyPage from '@/components/generics/EmptyPage'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import ChooseCity from '@/components/generics/ChooseCity'
import ChooseStore from '@/components/generics/ChooseStore'
import drawApi from '@/mixins/modules/draw'
import reportFormApi from '@/mixins/modules/reportForm'
import {root} from '@/plugins/Fetch'
export default {
  name: 'PageSetting',
  mixins: [drawApi, reportFormApi],
  components: {
    ServiceTab,
    CustomInput,
    Pagination,
    EmptyPage,
    CustomSelect,
    DatePicker,
    ChooseCity,
    ChooseStore,
  },
  data () {
    return {
      root,
      date_type: 1,
      default_value: '1',  // 页面tab初始值
      isInitiated: false,    // 页面初始状态
      classify_list: [{
        name: '壳养护卡',
        id: '1',
      }, {
        name: '养护卡',
        id: '2',
      }, {
        name: '次卡',
        id: '3',
      }],
      tabList: [
        {
          name: '总表',
          type: '1',
        },
        {
          name: '小程序访问数',
          type: '2',
        },
        {
          name: '注册车主数',
          type: '3',
        },
        {
          name: '订单数',
          type: '4',
        },
        {
          name: '下单车主数',
          type: '5',
        },
        {
          name: '订单金额',
          type: '6',
        },
        {
          name: '养护卡统计',
          type: '7',
        },
        {
          name: '车检统计',
          type: '8',
        },
      ],
      tab: {               // 默认选中tab
        name: '总表',
        type: '1',
      },
      paginationData: {
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 0,
      },
      is_true: true, // 开始是否大于结束
      itemCity: false, // 是否展示城市组件
      itemStore: false, // 是否展示门店组件
      nowCityList: [], // 当前选择的城市
      nowStoreList: [], // 当前选择的门店
      provinceList: [],
      list: [],
      sendData: {},
      is_first_enter: false, // 是否第一次进入
      filter_data: {
        start_time: '',
        end_time: '',
        province: {}, //  所有省
        cityIds: [], // 选择城市ids
        cityText: '',  // 市文本框显示文字
        storeIds: [], // 门店ids
        storeText: '', // 门店文本框显示文字
        keywords: '', // 门店名称搜索字段
      },
      classify_status: {
        name: '壳养护卡',
        id: '1',
      },
      query_data: {},
      start_time: '',
      end_time: '',
      present: null, // 养护卡统计
      total: null, // 养护卡总
      inspect_total: null, // 车检统计-总计
      inspect_store_list: [], // 车检统计-分门店统计列表
    }
  },
  watch: {
    'filter_data.start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.start_time.replace(/-/g, '') - 0
        this.end_time === '' ? end = 0 : end = this.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'filter_data.end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.start_time === '' ? start = 0 : start = this.start_time.replace(/-/g, '') - 0
        end = this.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
  },
  methods: {
    // 车检统计--总计
    async getInspectTotal () {
      try {
        const {response, result} = await this.GetInspectTotalApi()
        if (response.status === 200 && result.code === 0) {
          this.inspect_total = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检统计失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        console.error(err, '车检统计-总计')
      }
    },
    // 车检统计--分门店统计(搜索)
    async getInspectOfStore () {
      let time = this.start_time
      time = (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end_time
      time2 = ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start_time && this.end_time) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '结束时间要大于开始时间',
        })
        return
      }
      let params = {
        page: this.paginationData.current_page,
        per_page: this.paginationData.per_page,
      }
      if (this.start_time) params.start_date = time
      if (this.end_time) params.end_date = time2
      if (!this.end_time && !this.start_time) {
        params.date_type = this.date_type
      } else {
        this.date_type = 0
      }
      try {
        const {response, result} = await this.GetInspectOfStoreApi(params)
        if (response.status === 200 && result.code === 0) {
          this.inspect_store_list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检统计列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        console.error(err, '车检统计-分门店统计')
      }
    },
    // 今日或搜索
    changeTime (type) {
      if (this.date_type === type || this.date_type === 3 || this.date_type === 0) {
        return
      }
      if (type === 1) {
        this.date_type = 1
      } else {
        this.date_type = 2
      }

      if (this.default_value - 0 === 7) {
        this.getBossList()
      } else if (this.default_value - 0 === 8) {
        this.getInspectOfStore()
      }
    },
    async getBossList () {
      let time = this.start_time
      time = (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end_time
      time2 = ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start_time && this.end_time) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '结束时间要大于开始时间',
        })
        return
      }
      let params = {
        name: this.filter_data.keywords,
        type: this.classify_status.id,
        page: this.paginationData.current_page,
        per_page: this.paginationData.per_page,
      }
      if (this.start_time) params.start_time = time
      if (this.end_time) params.end_time = time2
      if (!this.end_time && !this.start_time) {
        params.date_type = this.date_type
      } else {
        this.date_type = 3
      }
      try {
        const {response, result} = await this.getBossCardApi(params)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data.data.list
          this.present = result.data.present
          this.total = result.data.total
          this.paginationData = result.data.data.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取总表数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        console.error(err, '养护卡统计列表')
      }
    },
    // 搜索
    search () {
      if (!this.is_true && this.end_time !== '' && (this.default_value - 0 !== 7 || this.default_value - 0 !== 8)) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => this.$emit('failure'),
        })
        return false
      }
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      let time = this.query_data.start_time
      time = (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.query_data.end_time
      time2 = ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.query_data.start_time && this.query_data.end_time) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '开始时间不能大于结束时间',
        })
        return false
      }
      this.paginationData.current_page = 1
      if (this.default_value - 0 === 7) {
        this.getBossList()
      } else if (this.default_value - 0 === 8) {
        this.getInspectOfStore()
      } else {
        this.fetchList()
      }
    },
    // 重置
    reset () {
      this.filter_data = {
        start_time: '',
        end_time: '',
        province: {},
        cityIds: [],
        cityText: '',
        storeIds: [],
        storeText: '',
        keywords: '',
      }
      this.classify_status = {
        name: '壳养护卡',
        id: '1',
      }
      this.start_time = ''
      this.end_time = ''
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.nowCityList = []
      this.nowStoreList = []
      this.is_true = true
      this.paginationData.current_page = 1
      this.date_type = 1 // 养护卡统计为今日
      if (this.default_value - 0 === 7) {
        this.getBossList()
      } else if (this.default_value - 0 === 8) {
        this.getInspectTotal()
        this.getInspectOfStore()
      } else {
        this.fetchList()
      }
    },
    // 分页操作
    paging (state) {
      this.paginationData = state
      if (this.default_value - 0 === 7) {
        this.getBossList()
      } else if (this.default_value - 0 === 8) {
        this.getInspectOfStore()
      } else {
        this.fetchList()
      }
    },

    // tab切换
    changePage (params) {
      if (params.type === this.default_value) return   // 已是选中状态不再请求接口
      this.default_value = params.type
      this.reset()
    },

    // 获取省份
    async getSheng () {
      try {
        const {response, result} = await this.fetchRegions()
        if (response.status === 200 && result.code === 0) {
          let arr = this.provinceList
          result.data.forEach(item => {
            arr.push(item)
          })
          this.provinceList = arr
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取省列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取省列表失败',
          content: `错误：${err}`,
        })
      }
    },

    // 选择省份
    changeProvince () {
      this.filter_data.cityIds = []
      this.filter_data.cityText = ''
      this.filter_data.storeIds = []
      this.filter_data.storeText = ''
      this.nowCityList = []
      this.nowStoreList = []
    },

    // 选择城市
    getCity () {
      if (!this.filter_data.province.id) return
      this.itemCity = true
    },

    // 选择门店
    getStore () {
      if (this.filter_data.cityText === '') return
      this.itemStore = true
    },

    // 接收组件选择的门店
    addStore (item) {
      let _this = this
      this.filter_data.storeText = ''
      let citys = this.filter_data.cityIds
      let brr = []
      let arr = this.nowStoreList
      if (this.filter_data.cityIds[0] === 'All') {
        arr = []
      } else {
        if (this.nowStoreList.length > 0) {
          arr.forEach((item, index) => {
            citys.forEach(cell => {
              if (item.city_id === cell) {
                brr.push(index)
              }
            })
          })
        }
      }
      for (let i in brr) {
        arr[brr[i]].isClick = true
      }
      let res = []
      for (let j in arr) {
        if (!arr[j].isClick) {
          res.push(arr[j])
        }
      }
      let last = res.concat(item)
      this.nowStoreList = last
      this.filter_data.storeIds = []
      this.nowStoreList.forEach(n => {
        _this.filter_data.storeText = n.store_name + ';' + _this.filter_data.storeText
        _this.filter_data.storeIds.push(n.store_id)
      })
    },

    // 接收组件选择的城市
    addCity (q) {
      this.filter_data.storeIds = []
      this.filter_data.storeText = ''
      this.nowStoreList = []
      this.nowCityList = q
      let arr = []
      let arrName = []
      q.forEach(item => {
        arr.push(item.id)
        arrName.push(item.name)
      })
      this.filter_data.cityIds = arr
      this.filter_data.cityText = arrName.toString()
    },

    // 去往每日明细页面
    goDailyDetails (params) {
      this.dataFilter()
      this.$router.push({
        name: 'dailyDetails',
        query: {
          id: params.store_id,
          type: this.default_value,
          time: this.sendData.date,
        },
      })
    },

    // 数据格式格式化
    dataFilter () {
      let nowTime = new Date()
      if (this.query_data.start_time === '' && this.query_data.end_time !== '') {
        this.sendData.date = nowTime.getFullYear() - 1 + '-' + (nowTime.getMonth() - 0 + 1) + '-' + nowTime.getDate() + '~' + this.query_data.end_time
      } else if (this.query_data.start_time !== '' && this.query_data.end_time === '') {
        this.sendData.date = this.query_data.start_time + '~' + nowTime.getFullYear() + '-' + (nowTime.getMonth() - 0 + 1) + '-' + nowTime.getDate()
      } else if (this.query_data.start_time === '' && this.query_data.end_time === '') {
        this.sendData.date = nowTime.getFullYear() - 1 + '-' + (nowTime.getMonth() - 0 + 1) + '-' + nowTime.getDate() + '~' + nowTime.getFullYear() + '-' + (nowTime.getMonth() - 0 + 1) + '-' + nowTime.getDate()
      } else {
        this.sendData.date = this.query_data.start_time + '~' + this.query_data.end_time
      }
      this.query_data.province.id ? this.sendData.province = this.query_data.province.id : this.sendData.province = ''
      this.query_data.cityIds.length > 0 ? this.sendData.city = this.query_data.cityIds.toString() : this.sendData.city = ''
      this.query_data.storeIds.length > 0 ? this.sendData.store_ids = this.query_data.storeIds.toString() : this.sendData.store_ids = ''
      this.sendData.page = this.paginationData.current_page
      this.sendData.per_page = this.paginationData.per_page
      this.sendData.type = this.tab.type
      this.sendData.store_name = this.query_data.keywords
    },

    // 导出按钮点击
    exportExcel () {
      // this.judgeTime()
      // this.dataFilter()
      if (this.default_value - 0 === 1) this.exportAll()
      if (this.default_value - 0 === 2) this.exportAppClick()
      if (this.default_value - 0 === 3) this.exportAppRegister()
      if (this.default_value - 0 === 4) this.exportAppOrder()
      if (this.default_value - 0 === 5) this.exportAppCustomer()
      if (this.default_value - 0 === 6) this.exportAppAmount()
      if (this.default_value - 0 === 8) this.exportInspect()
    },

    // 获取总表数据
    async fetchList () {
      this.dataFilter()
      try {
        const {response, result} = await this.generalTableApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取总表数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取总表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 导出总表数据 exportGeneralApi
    async exportAll () {
      try {
        const {response, result} = await this.exportGeneralApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 小程序点击导出 appClickAPi
    async exportAppClick () {
      try {
        const {response, result} = await this.appClickAPi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 注册车主数导出
    async exportAppRegister () {
      try {
        const {response, result} = await this.appRegisterApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 订单数导出
    async exportAppOrder () {
      try {
        const {response, result} = await this.appOrderAPi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 客户下单数导出
    async exportAppCustomer () {
      try {
        const {response, result} = await this.appCustomerApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },

    // 订单金额导出
    async exportAppAmount () {
      try {
        const {response, result} = await this.appAmountApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name, '_self')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导出表数据失败',
          content: `错误：${err}`,
        })
      }
    },
    // 车检统计-导出
    async exportInspect () {
      let time = this.start_time
      time = time && (new Date(time.replace(/-/g, '/'))).getTime() / 1000
      let time2 = this.end_time
      time2 = time2 && ((new Date(time2.replace(/-/g, '/'))).getTime() / 1000) + 3600 * 24 - 1
      if (time > time2 && this.start_time && this.end_time) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: '结束时间要大于开始时间',
        })
        return
      }
      let url = `${root}/data/excel/export_inspect?date_type=${this.date_type}&start_date=${time}&end_date=${time2}`
      window.open(url)
    },
  },
  mounted () {
    this.getSheng()
    // this.fetchList()
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'dailyDetails') {
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
@import '~@/stylus/mixins';
.time {
  position: absolute;
  right: 40px;
  bottom: 20px;
  border-radius: 3px;
  border: 1px solid #D9D9D9;
  box-sizing: border-box;
}
.time .day, .time .month{
  display: inline-block;
  width: 78px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  font-size: 14px;
  border-radius: 3px;
  background: #D9D9D9;
  color: #9A9B9A;
  cursor: pointer;
}
.active {
  color: #121212!important;
  background: #FFFFFF!important;
}
.revenue {
  padding-top: 0px;
  box-sizing: border-box;
  // overflow: auto;
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
.statistics .title {
  font-size: 16px;
  color: #999999;
  font-weight: 500;
}
.statistics .price {
  margin-top: 10px;
  font-size: 30px;
  color: #404040;
  font-weight: 500;
}
.order-statistics {
  background: #ffffff;
  margin-top: 20px;
  box-sizing: border-box;
}
.order-income, .order-income-content {
  background: #ffffff;
  display: flex;
  height: 40px;
  line-height: 40px;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #F1F1F1;
  box-sizing: border-box;
}
.order-income-content {
  border-bottom: none;
  height: 40px;
  line-height: 40px;
}
.order-income li, .order-income-content li {
  width: 33%;
  font-size: 14px;
  color: #999999;
  font-weight: 500;
  padding-left: 30px;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}
.order-income-content li {
  color: #353535;
  font-weight: 400;
}
td {
  vertical-align: middle !important;
}
.multi-content-td{
  vertical-align: middle;
}
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 8px;
}
.section-layout
  height calc(100% - 56px)
.top-nav {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 48px;
  padding-left: 64px;
  padding-right: 64px;
  background-color: #fcfcfc;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  z-index: 8;
}
.fr{
  float: right;
}
.w-100{
  width: 100px;
}
.w-160{
  width: 160px;
}
.margin{
  margin: 0 8px;
  font-size: 14px;
}
.top-total {
  overflow: unset !important;
  background: #e8e9eb !important;
  padding: 20px 30px 0 !important;
}
.m-t-10 {
  margin-top 10px !important
}
.content-layout-list{
  min-height: calc(100% - 346px);
  overflow-y auto
}
.revenue-empty{
  margin-top 50px
}
.p-t-20 {
  padding-bottom 20px
}
.m-b-20 {
  margin-bottom 20px
}
.title-filter{
  padding 20px 32px 10px
  background #e8e9eb
}
.list-height {
  height 300px
}
.inspect-store {
  max-height 300px
  overflow-y auto
}
</style>


