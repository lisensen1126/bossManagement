<template lang="pug">
  .section-layout
    h2.level.header-wrapper
      .level-left
        .nav-back-btn(@click="goBack")
        .header-title(style={'padding-left':'25px'}) 返回列表
    .section-filter.is-horizontal
        .field-group.is-horizontal
            .field
            .field.is-time
              date-picker(v-model="filterData.date", type="range", placeholder="选择日期区间")
            .field.name_keyword-wrapper
              label.label 关键字搜索
              custom-input(v-model="filterData.name_keyword", placeholder="")
            .field
                a.button.primary(@click="") 搜索
            .field
                a.button(@click="") 导出
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有订单")
    .content-wrapper.list-wrapper
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in detailConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.id")
              td
                .simple-td(v-text="item.personal")
              td
                .simple-td(v-text="item.phone")
              td
                .simple-td(v-text="item.saleNum")
              td
                .simple-td(v-text="item.verificationNum")
              td
                .simple-td(v-text="item.saleMoney")
              td
                .simple-td(v-text="item.verificationMoney")
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import PriorConditions from '@/components/generics/PriorConditions'
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import DatePicker from '@/components/generics/form/DatePicker'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/groupPurchase'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'

export default {
  name: 'WorkBenchOverview',
  mixins: [Api, imageScale],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
    CustomInput,
    DatePicker,
    CustomSelect,
    Pagination,
  },
  data () {
    return {
      isInitiated: false,
      currentOrderStatus: {
        type: '1',
        name: '团单报表详情',
      },
      orderStatusList: [
        {
          type: '1',
          name: '团单报表详情',
        },
      ],
      filterData: {             // 时间选择
        name_keyword: '',
        date: '',
      },
      queryData: {             // 时间选择
        name_keyword: '',
        date: '',
      },
      firstClassList: [],       // 关键词列表
      detailConfig: [
        {
          name: '时间',
          width: '240',
        },
        {
          name: '商户名称',
          width: '160',
        },
        {
          name: '团单名称',
          width: '160',
        },
        {
          name: '团单编号',
          width: '160',
        },
        {
          name: '团单金额',
          width: '160',
        },
        {
          name: '核销金额',
          width: '160',
        },
        {
          name: '订单编号',
          width: '160',
        },
        {
          name: '客户手机号',
          width: '160',
        }],
      list: [
        {
          id: '2',
          name: '团单消费记录',
          personal: '哈哈哈',
          phone: '17625262534',
          saleNum: '123',
          verificationNum: '2212',
          saleMoney: '123',
          verificationMoney: '123',
        },
      ],
      isExecutingBatchedOperation: false,
      isPageSelected: false,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      keyword: '',
    }
  },
  methods: {
    goBack () {
      if (this.isLoading) {
        return
      }
      this.$router.go(-1)
    },
    // 获取活动列表数据
    async getList () {
      try {
        const {response, result} = await this.regimentDetail({
          name_keyword: this.queryData.name_keyword,
          created_start_at: this.queryData.date ? this.queryData.date.split(' 至 ')[0] + ' 00:00' : undefined,
          created_end_at: this.queryData.date ? this.queryData.date.split(' 至 ')[1] + ' 23:59:59' : undefined,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团单详情失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取团单详情失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.getList()
    },
    // 搜索
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
    },
  },
  mounted () {
    // this.getList() // 获取订单列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
.bottom-image
  display inline-block
  margin-right: 4px
  img
    height 100%
    width 100%
.section-filter
    display flex
    justify-content space-between
.header-wrapper
  height 56px
  align-items center
  padding-left 32px
  border-bottom 1px solid line
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
</style>
