<template lang="pug">
  .section-layout
    .section-layout(v-if="cur_page==='statistic'")
      .content-wrapper.revenue
        .income
          .statistics
            div 参与门店数
            div {{statistic_main.store_count}} 家
          .statistics
            div 活动门店交易总额
            div ￥ {{statistic_main.final_amount_sum/100 | fix2}}
          .statistics
            div 活动交易笔数
            div {{statistic_main.count}} 笔
          .statistics
            div 立减金发放数量
            div {{statistic_main.random_coupon_count}} 笔
          .statistics
            div 立减金发放用户数
            div {{statistic_main.customer_count}} 人
          .statistics
            div 用户立减金额
            div ￥ {{statistic_main.user_random_coupon_price_sum/100 | fix2}}
          .statistics
            div 门店立减金额
            div ￥ {{statistic_main.store_random_coupon_price_sum/100 | fix2}}
        .section-filter
          .field-group.is-horizontal.flex
            .field
              label.label 日期范围
              .field.is-horizontal
                date-picker.w-240(type="rangeAllowSingle", placeholder="请选择日期", v-model="searchData.date_range")
            .field.w-100
              label.label 省
              custom-select(v-model="searchData.province", :list="province_list", @input="clearCity")
            .field.w-100
              label.label 市
              custom-select(v-model="searchData.city", :list="city_list")
            .field.w-140
              label.label 关键字搜索
              custom-input(v-model="searchData.keyword", placeholder="门店名称", @keyupEnter="search()")
            .field
              button.button.primary(@click="search()") 搜索
            .field
              button.button(@click="reset(0)") 重置
            .field
              button.button(@click="exportExcel(1)") 导出全部
            .field.date-type-box
              .date-type(:class="{ 'active-type' : searchData.date_type === 1 }", @click="changeDateType(1,1)") 今日
              .date-type(:class="{ 'active-type' : searchData.date_type === 2}", @click="changeDateType(1,2)") 本月
        empty-page(v-if="statistic_list.length === 0 && page_init", :tip="'暂无数据'")
        .table-wrapper(v-if="statistic_list.length>0")
          table.table
            thead
              tr
                td(width="10%")  门店名称
                td(width="25%")  门店地址
                td(width="5%")  联系人
                td(width="5%")  联系电话
                td(width="10%")  支付金额/笔数
                td(width="10%")  用户立减金额/笔数
                td(width="10%")  门店立减金额/笔数
                td(width="10%")  操作
            tbody
              tr.p-r-10(v-for="item in statistic_list")
                td  {{item.store_name}}
                td.of-h.m-w-400 {{item.address}}
                td  {{item.contacts}}
                td  {{item.business_phone}}
                td.simple-td
                  div ￥{{item.final_amount_sum/100 | fix2}}
                  div {{item.count}}笔
                td.simple-td
                  div ￥{{item.user_random_coupon_price_sum/100 | fix2}}
                  div {{item.customer_count}}笔
                td.simple-td
                  div ￥{{item.store_random_coupon_price_sum/100 | fix2}}
                  div {{item.random_coupon_count}}笔             
                td.simple-td
                  .blue(@click="checkDetail(item.store_id)") 交易明细
            .tfoot()
              pagination(:pagination-data="paginationData", @input="paging")     
    .section-layout(v-if="cur_page==='detail'")
      .nav-back-btn(@click="goBack()")
      .section-filter
        .field-group.is-horizontal.flex
          .field
            label.label 时间范围
            date-picker.width-250(type="rangeAllowSingle", v-model="date_range", placeholder="请选择日期")
          .field
            button.button.primary(@click="searchDetail") 搜索
          .field
            button.button(@click="resetDetail(0)") 重置
          .field.right-field
            button.button(@click="exportExcel(2)") 导出全部
            .date-type-box
              .date-type(:class="{ 'active-type' : date_type_2 === 1 }", @click="changeDateType(2,1)") 今日
              .date-type(:class="{ 'active-type' : date_type_2 === 2 }", @click="changeDateType(2,2)") 本月
      empty-page(v-if="detail_data.length === 0 && page_init_2", :tip="'暂无数据'")
      .content-wrapper.list-wrapper
        .table-wrapper(v-if="detail_data.length>0")
          table.table
            thead
              tr
                td(width="15%")  订单时间
                td(width="10%")  订单编号
                td(width="20%")  订单项目
                td(width="10%")  金额
                td(width="10%")  分类
                td(width="20%")  客户信息
                td(width="10%")  操作
            tbody
              tr.p-r-10(v-for="item in detail_data")
                td  {{item.turnover_time | dateFormat}}
                td  {{item.trade_order_no}}
                td.of-h.m-w-300  {{item.trade_order_item}}                 
                td(v-if="item.type===1")  +￥{{item.amount/100 | fix2}}
                td(v-if="item.type===2")  -￥{{item.amount/100 | fix2}}
                td
                  span(v-if="item.goods_type === 1 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 商品服务订单
                  span(v-if="item.goods_type === 2 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 养护卡订单
                  span(v-if="item.order_type === 7 || item.order_type === 6") 线下买单订单
                td {{item.nick_name}}/{{item.mobile}}
                td.simple-td
                  .blue(@click="orderDetail(item.trade_order_id,item.shop_id)") 订单详情
            .tfoot()
              pagination(:pagination-data="paginationData_2", @input="pagingDetail")                     
</template>
<script>
import DatePicker from '@/components/generics/form/DatePicker'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import drawApi from '@/mixins/modules/draw'
import { root } from '@/plugins/Fetch'
import { mapGetters } from 'vuex'
// 由于beforeRouteEnter钩子函数执行时，vue还未加载完成，故不能在vue的data中定义
let needClear = true
export default {
  name: 'PayReduceStatistics',
  components: {
    DatePicker,
    CustomInput,
    CustomSelect,
    Pagination,
    EmptyPage,
  },
  mixins: [drawApi],
  data () {
    return {
      cur_page: 'statistic', // 当前显示的页面，statistic 统计数据，detail 交易明细
      searchData: {
        // 注：此处需要改成和接口一致的命名
        date_range: '',
        province: {},
        city: {},
        keyword: '',
        date_type: 1,
      },
      query: {}, // 处理过的搜索条件
      statistic_main: {}, // 统计总数据
      statistic_list: [], // 统计列表
      province_list: [],
      city_list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      temp_date_range: '', // 统计数据的日期，暂存，以便在显示交易明细的时候使用
      page_init: false, // 页面数据是否已经加载
      // 此处以下是交易明细的data，以上是统计数据的data
      date_type_2: 1,
      cur_store_id: '', // 当前的店铺id
      date_range: '',   // 交易明细的日期范围
      query_2: {},    // 交易明细的查询query
      detail_data: {}, // 交易明细的数据
      paginationData_2: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      page_init_2: false,
    }
  },
   // 导航守卫
  beforeRouteEnter (to, from, next) {
    // 如果从订单详情进入，那么不清空
    needClear = from.name !== 'orderDetail'
    next()
  },
  mounted () {
    if (!needClear) {
      // 否则显示交易详情页，并将vuex中的值付给当前页面
      this.cur_page = 'detail'
      Object.keys(this.prData).forEach(key => {
        this[key] = this.prData[key]
      })
      this.searchDetail()
    }
    // 赋值程序过后，vuex的数据就没用了，所有不论如何，清空vuex中的数据
    this.$store.dispatch('clearTransDetail')
    this.getMainData()
    this.getListData()
    this.getRegions('province', 0)
  },
  computed: {
    ...mapGetters({
      prData: 'prData',
    }),
  },
  methods: {
    /**
    * @description 获取统计总数据
    */
    async getMainData () {
      try {
        const { result, response } = await this.payReductionStatisticMainApi()
        if (result.code === 0 && response.status === 200) {
          this.statistic_main = result.data
        } else {
          this.$store.dispatch('showMessage', {
            title: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取统计数据失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    /**
     * 改变date_type
     * @param {index} 判断是来自统计数据的还是交易明细的，1统计数据，2交易明细
     */
    changeDateType (index, type) {
      if (index === 1 && this.searchData.date_type !== type) {
        // 不相等才改变并清空搜索条件，请求接口
        this.searchData.date_type = type
        this.reset(1)
      } else if (index === 2 && this.date_type_2 !== type) {
        this.date_type_2 = type
        this.resetDetail(1)
      }
    },
        /**
     * 获取省市区
     * @params  {String}  type          类别：省province，市city
     * @params  {Number}  id            省市区id
     */
    async getRegions (type, id) {
      const { response, result } = await this.fetchRegions({ parent_id: id })
      if (response.status === 200 && result.code === 0) {
        type === 'province' ? this.province_list = result.data : this.city_list = result.data
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '网络出错了，请稍后再试',
          content: `${response.status} ${result.message}`,
        })
      }
    },
    // 当省改变的时候，清空市
    clearCity () {
      this.searchData.city = {}
    },
    /**
     * 过滤请求数据，并将对象返回
     * @return query 过滤后的请求数据
     */
    dataFilter () {
      let query = {}
      this.temp_date_range = this.searchData.date_range
      // 如果这个搜索值不为空，则加入这个搜索条件
      Object.keys(this.searchData).forEach(key => {
        // 先判断是否为对象
        if (typeof this.searchData[key] === 'object') {
          // 如果是对象，是否为空
          if (Object.keys(this.searchData).length > 0) {
            query[key] = this.searchData[key]
          }
          // 不是对象，直接赋值
        } else if (this.searchData[key]) {
          query[key] = this.searchData[key]
        }
      })
      // 将query中的date_range键删除，替换为接口需要的start_time和end_time
      delete query.date_range
      // 如果用户选择了日期区间
      let start
      let end
      if (
        this.searchData.date_range &&
        this.searchData.date_range.indexOf('至') > -1
      ) {
        start = this.searchData.date_range.split(' 至 ')[0] + ' 00:00:00'
        start = new Date(start).getTime() / 1000
        end = this.searchData.date_range.split(' 至 ')[1] + ' 23:59:59'
        end = new Date(end).getTime() / 1000
        query.start_time = start
        query.end_time = end
      } else if (
        // 如果用户只选了一天
        this.searchData.date_range &&
        this.searchData.date_range.indexOf('至') === -1
      ) {
        start = new Date(this.searchData.date_range + ' 00:00:00').getTime() / 1000
        query.start_time = start
        end = new Date(this.searchData.date_range + ' 23:59:59').getTime() / 1000
        query.end_time = end
      }
      // 如果选了省市，那么query里是他们的对象，需要改成id的形式
      if (query.province) {
        query.province_id = query.province.id
        delete query.province
      }
      // 如果有选择时间范围，则让今日/本月都置灰
      if (query.start_time) {
        this.searchData.date_type = 0
      }
      // 此时query中的city是一个对象，我们需要city_id
      if (query.city) {
        query.city_id = query.city.id
        delete query.city
      }
      // 清空值为undefined的键值对
      Object.keys(query).forEach(key => {
        if (query[key] === undefined) {
          delete query[key]
        }
      })
      this.query = query
    },
    /**
    * @description 重置条件
    * @params {Boolean} resetDate 是否不要重置日期,不传或0为重置,1为不重置
    */
    reset (resetDate) {
      this.searchData.keyword = ''
      this.searchData.date_range = ''
      this.searchData.province = {}
      this.searchData.city = {}
      this.city_list = []
      this.paginationData.current_page = 1
      if (!resetDate) {
        this.searchData.date_type = 1
      }
      this.search()
    },
    // 统计数据的搜索按钮
    async search () {
      this.dataFilter()
      await this.getListData()
    },
    // 获取列表数据
    async getListData () {
      this.query.page = this.paginationData.current_page
      try {
        const { result, response } = await this.payReductionStatisticListApi(this.query)
        if (result.code === 0 && response.status === 200) {
          this.statistic_list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            'title': result.message,
          })
        }
      } catch ({ response, result }) {
        this.store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表失败',
          content: `服务异常，请稍后再试（$${response.status}$${result && result.code ? ' ' + result.code : ''}）`,
        })
      } finally {
        this.page_init = true
      }
    },
    paging (state) {
      this.paginationData = state
      this.getListData()
    },
    /**
    * @description 查看门店交易详情
    * @params {Number | String} id 门店id
    */
    checkDetail (id) {
      this.cur_page = 'detail'
      this.date_type_2 = this.searchData.date_type === 0 ? 1 : this.searchData.date_type
      // 在进入时将交易明细的date_range赋值为统计页面的date_range
      this.date_range = this.temp_date_range
      this.cur_store_id = id
      this.searchDetail()
    },
    // ----------------------------------------------
    // 以这里为分割，上面是统计数据的方法，下面是交易明细的方法
    // ----------------------------------------------
    // 交易明细的分页事件
    pagingDetail (state) {
      this.paginationData_2 = state
      this.getStoreDetail()
    },
    // 交易明细的搜索按钮
    async searchDetail () {
      this.dataFilterDetail()
      await this.getStoreDetail()
    },
    dataFilterDetail () {
      let start
      let end
      let query = {}
      if (this.date_range && this.date_range.indexOf('至') > -1) {
        start = this.date_range.split(' 至 ')[0] + ' 00:00:00'
        start = new Date(start).getTime() / 1000
        end = this.date_range.split(' 至 ')[1] + ' 23:59:59'
        end = new Date(end).getTime() / 1000
        query.start_time = start
        query.end_time = end
        // 如果用户只选了一天
      } else if (this.date_range && this.date_range.indexOf('至') === -1) {
        start = new Date(this.date_range + ' 00:00:00').getTime() / 1000
        end = new Date(this.date_range + ' 23:59:59').getTime() / 1000
        query.start_time = start
        query.end_time = end
      }
      // 如果选了时间范围，则让今日/本月置灰
      if (query.start_time) {
        this.date_type_2 = 0
      }
      query.store_id = this.cur_store_id
      query.date_type = this.date_type_2
      this.query_2 = query
    },
    // 获取店铺交易明细
    async getStoreDetail () {
      this.page_init_2 = false
      this.query_2.page = this.paginationData_2.current_page
      try {
        const { result, response } = await this.payReductionStoreDetailApi(this.query_2)
        if (result.code === 0 && response.status === 200) {
          this.detail_data = result.data
          this.paginationData_2 = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            'title': result.message,
          })
        }
      } catch ({ response, result }) {
        this.store.dispatch('showMessage', {
          type: 'failure',
          title: '获取店铺交易明细失败',
          content: `服务异常，请稍后再试（$${response.status}$${result && result.code ? ' ' + result.code : ''}）`,
        })
      } finally {
        this.page_init_2 = true
      }
    },
     // 从交易明细返回统计数据
    goBack () {
      this.date_range = ''
      this.date_type_2 = 1
      this.resetDetail()
      this.cur_page = 'statistic'
    },
    /**
    * @description 重置条件
    * @params {Boolean} resetDate 是否不要重置日期,不传或0为重置,1为不重置
    */
    resetDetail (resetDate) {
      this.date_range = ''
      this.paginationData_2.current_page = 1
      if (!resetDate) {
        this.date_type_2 = 1
      }
      this.searchDetail()
    },
    /**
    * @description 前往订单详情页
    * @params {Number} id 订单id
    * @params {Number} sid shop_id
    */
    orderDetail (id, sid) {
      // 离开页面时将数据缓存到vuex
      /**
       * 注意事项（重要）
       * 1、注意这里的key要和data里的名字一样，在mounted里赋值的时候要用到
       * 2、需要缓存什么数据，就把什么数据写进去
       */
      this.$store.dispatch('saveTransDetail', {
        cur_store_id: this.cur_store_id,
        date_range: this.date_range,
        date_type_2: this.date_type_2,
        paginationData: this.paginationData,
        paginationData_2: this.paginationData_2,
        searchData: this.searchData,
        query: this.query,
        query_2: this.query_2,
        city_list: this.city_list,
      })
      this.$router.push({
        name: 'orderDetail',
        params: {
          id: id,
        },
        query: {
          cancelled_by: 1,
          shop: sid,
        },
      })
    },
    // 导出excel
    exportExcel (type) {
      if (type === 1) {
        this.dataFilter()
        let url = `${root}/random_coupon/statistics_export?`
        Object.keys(this.query).forEach(key => {
          url = `${url}${key}=${this.query[key]}&`
        })
        window.open(url)
      } else {
        this.dataFilterDetail()
        let url = `${root}/random_coupon/turnover_export?`
        Object.keys(this.query_2).forEach(key => {
          url = `${url}${key}=${this.query_2[key]}&`
        })
        window.open(url)
      }
    },
  },
  watch: {
    'searchData.province' (val) {
      if (val.id) {
        this.getRegions('city', val.id)
      }
    },
  },
  filters: {
    dateFormat (val) {
      if (val) {
        let now = new Date(val * 1000)
        let year = now.getFullYear()
        let month = now.getMonth() + 1
        let date = now.getDate()
        let hour = now.getHours()
        let minute = now.getMinutes()
        let sec = now.getSeconds()
        month = month < 10 ? '0' + month : month
        date = date < 10 ? '0' + date : date
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        sec = sec < 10 ? '0' + sec : sec
        return `${year}-${month}-${date} ${hour}:${minute}:${sec}`
      }
    },
    fix2 (val) {
      if (val) {
        return val.toFixed(2)
      } else {
        return '0.00'
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.statistic-detail {
  margin-left: 60px;
}

.nav-back-btn {
  position: absolute;
  top: 36px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #CED3DC center no-repeat url('~@/assets/back.svg');
  background-size: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
}

.flex {
  display: flex;
  align-items: center;
}

.date-type-box {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;

  .date-type {
    width: 78px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    background: #d9d9d9;
    color: #9a9b9a;
    cursor: pointer;
  }

  .active-type {
    color: #121212 !important;
    background: #fff !important;
  }
}

.revenue {
  padding-top: 0;
  box-sizing: border-box;
  overflow: auto;
}

.income {
  background: #ffffff;
  flex-shrink: 0;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.statistics {
  text-align: left;
  padding-left: 20px;
  border-left: 1px solid #D9D9D9;
  box-sizing: border-box;

  &:first-child {
    border: none;
  }

  div:first-child {
    font-size: 16px !important;
    color: #999999 !important;
    font-weight: 500 !important;
  }

  div:last-child {
    margin-top: 10px;
    font-size: 20px;
    color: #404040;
    font-weight: 500;
  }
}

.w-140 {
  width: 140px;
}

.w-240 {
  width: 240px;
}

.w-100 {
  width: 100px;
}

.margin {
  margin: 0 8px;
  font-size: 14px;
}

.right-field {
  display: flex;
  flex: 1;
  justify-content: flex-end;
}

.simple-td {
  div {
    line-height: 20px;
  }

  .blue {
    color: #0a71a1;
    line-height: inherit;
    cursor: pointer;
  }
}
.width-250{
  width: 250px;
}
.table tbody tr td{
  verticle-align : middle;
}
.of-h{
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.m-w-300{
  max-width: 300px;
}
.m-w-400{
  max-width: 400px;
}
.p-r-10 td{
  padding-right: 10px;
}
.section-filter{
  padding: 14px 32px 56px 60px;
}
.content-wrapper{
  padding-bottom: 36px;
}
</style>
