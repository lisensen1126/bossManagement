<template lang="pug">
  .section-layout
    prior-conditions
      service-tab(v-model="currentOrderStatus", :tabs="orderStatusList", :have-icon="false", :have-quantity="false", @input="changeOrderStatus")
    .section-filter.is-horizontal
        .field-group.is-horizontal
            .field
            .field.is-time
              date-picker(v-model="filterData.date", type="range", placeholder="选择日期区间")
            .field.is-narrow
              custom-select(v-model="filterData.firstState", :list="firstClassList", nameField="category_name")
            .field.name_keyword-wrapper(v-if = "currentOrderStatus.type === '2'")
              label.label 关键字搜索
              custom-input(v-model="filterData.name_keyword", placeholder="手机号/团单名称/订单号/团单编号")
            .field
              a.button.primary(@click="") 搜索
            .field
              a.button(@click="", v-if = "currentOrderStatus.type === '1'") 全部导出
    //- 团单报表
    //- empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有订单")
    .content-wrapper.list-wrapper(v-if = "currentOrderStatus.type === '1'")
      .table-wrapper
        table.table
          thead
            tr
              td(width="40")
                .simple-td.checkbox-td
                  .checkbox.page-selector
                    input(type="checkbox", id="page-selection", :checked="isPageSelected")
                    label(@click.prevent="togglePageSelection")
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.checkbox-td
                  .checkbox
                    input(type="checkbox", :id="'selection-' + index", :disabled="isExecutingBatchedOperation", v-model="item.isSelected")
                    label(:for="'selection-' + index")
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
                .simple-td(v-text="'￥' + item.saleMoney")
              td
                .simple-td(v-text="'￥' + item.verificationMoney")
              td
                .operation-td
                  router-link.operation-link(:to="{name: 'reportDetail', params: {id: item.id}}") 详情
                  router-link.operation-link(:to="{name: 'reportDetail', params: {id: item.id}}") 导出
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
    //- 团单消费列表
    //- empty-page(v-if="!(salelist && salelist.length) && isSaleInitiated", tip="当前没有订单")
    .content-wrapper.list-wrapper(v-if = "currentOrderStatus.type === '2'")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in saleConfig", v-text="th.name", :width="th.width")
          tbody(v-if="salelist.length")
            tr(v-for="(item, index) in salelist")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.id")
              td
                .simple-td(v-text="item.personal")
              td
                .simple-td(v-text="item.phone")
              td
                .simple-td(v-text="'￥' + item.saleNum")
              td
                .simple-td(v-text="'￥' + item.verificationNum")
              td
                .simple-td(v-text="item.saleMoney")
              td
                .simple-td(v-text="item.saleMoney")
              td
                .simple-td(v-text="item.verificationMoney")
              td
                .operation-td
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationSaleData", @input="pagingSale")
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
import bossMixin from '@/mixins/modules/boss'

export default {
  name: 'ReportDetail',
  mixins: [Api, bossMixin],
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
      isSaleInitiated: false,
      currentOrderStatus: {
        type: '1',
        name: '团单报表',
      },
      orderStatusList: [
        {
          type: '1',
          name: '团单报表',
        },
        {
          type: '2',
          name: '团单消费记录',
        },
      ],
      filterData: {
        date: '',
        firstState: '',
        name_keyword: '',
      },
      queryData: {
        date: '',
        firstState: '',
        name_keyword: '',
      },
      firstClassList: [],                                   // 关键词列表
      theadConfig: [
        {
          name: '门店名称',
          width: '240',
        },
        {
          name: '门店ID',
          width: '160',
        },
        {
          name: '联系人',
          width: '120',
        },
        {
          name: '联系电话',
          width: '120',
        },
        {
          name: '团单销售量',
          width: '160',
        },
        {
          name: '团单核销量',
          width: '160',
        },
        {
          name: '销售金额',
          width: '160',
        },
        {
          name: '核销金额',
          width: '160',
        },
        {
          name: '操作',
          width: '100',
        }],
      saleConfig: [
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
        },
        {
          name: '状态',
          width: '160',
        },
        {
          name: '操作',
          width: '100',
        }],
      list: [                                               // 团单列表
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
      salelist: [                                       // 消费列表
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
      paginationSaleData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
    }
  },
  methods: {
    // 获取活动列表数据
    async getList () {
    //   try {
    //     const {response, result} = await this.regimentOrders({
    //       firstState: this.queryData.firstState.value,
    //       name_keyword: this.queryData.name_keyword,
    //       created_start_at: this.queryData.date ? this.queryData.date.split(' 至 ')[0] + ' 00:00' : undefined,
    //       created_end_at: this.queryData.date ? this.queryData.date.split(' 至 ')[1] + ' 23:59' : undefined,
    //       page: this.paginationData.current_page,
    //       per_page: this.paginationData.per_page,
    //     })
    //     if (response.status === 200) {
    //       this.list.splice(0, this.list.length, ...result.data)
    //       this.paginationData = result.meta
    //     } else {
    //       this.$store.dispatch('showMessage', {
    //         type: 'failure',
    //         title: '获取团单列表失败',
    //         content: `出错啦！${result.message}`,
    //       })
    //     }
    //   } catch ({response, result}) {
    //     this.$store.dispatch('showMessage', {
    //       type: 'failure',
    //       title: '获取团单列表失败',
    //       content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
    //     })
    //   }
    //   this.isInitiated = true
    },
    // 获取团单消费列表数据
    async getSaleList () {
    //   try {
    //     const {response, result} = await this.consumptionDetail({
    //       firstState: this.queryData.firstState.value,
    //       name_keyword: this.queryData.name_keyword,
    //       created_start_at: this.queryData.date ? this.queryData.date.split(' 至 ')[0] + ' 00:00' : undefined,
    //       created_end_at: this.queryData.date ? this.queryData.date.split(' 至 ')[1] + ' 23:59' : undefined,
    //       page: this.paginationSaleData.current_page,
    //       per_page: this.paginationSaleData.per_page,
    //     })
    //     if (response.status === 200) {
    //       this.salelist.splice(0, this.salelist.length, ...result.data)
    //       this.paginationSaleData = result.meta
    //     } else {
    //       this.$store.dispatch('showMessage', {
    //         type: 'failure',
    //         title: '获取团单消费记录失败',
    //         content: `出错啦！${result.message}`,
    //       })
    //     }
    //   } catch ({response, result}) {
    //     this.$store.dispatch('showMessage', {
    //       type: 'failure',
    //       title: '获取团单消费记录失败',
    //       content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
    //     })
    //   }
    //   this.isSaleInitiated = true
    },
    // 商户列表获取
    async getClassifyList (parentId) {
      // let params = {
      //   type: 1,
      //   parent_id: parentId,
      // }
      // try {
      //   let {response, result} = await this.commercialList(params)
      //   if (response.status === 200 && result.code === 0) {
      //     // 根据返回的分类级别组装数据
      //     this.firstClassList = result.data
      //   } else {
      //     this.$store.dispatch('showMessage', {
      //       type: 'failure',
      //       title: '获取商户列表失败',
      //       content: '获取商户列表发生错误，请稍后再试',
      //     })
      //   }
      // } catch ({response, result}) {
      //   this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '获取分类列表失败',
      //     content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
      //   })
      // }
    },
    // 选中商户状态
    changeFirstState () {
      // this.getClassifyList(this.firstState.category_id)
    },
    // 团单列表分页跳转
    paging (state) {
    //   this.paginationData = state
    //   this.recallFilter()
    //   this.getList()
    },
    // 团单消费列表分页跳转
    pagingSale (state) {
    //   this.paginationSaleData = state
    //   this.recallFilter()
    //   this.getSaleList()
    },
    // 搜索
    applyFilter () {
    //   if (this.currentOrderStatus.type === '1') {
    //     this.paginationData.current_page = 1
    //     this.switchFilterData(this.filterData, this.queryData)
    //     this.getList()
    //   } else {
    //     this.paginationData.current_page = 1
    //     this.switchFilterData(this.filterData, this.queryData)
    //     this.getSaleList()
    //   }
    },
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
    },
    selectedItems () {
      return this.list.filter(item => item.isSelected)
    },
    // isPageSelected () {
    //   return this.selectedItems.length === this.list.length
    // },
    // tabs 跳转
    changeOrderStatus () {
    //   if (this.currentOrderStatus.type === '1') {
    //     this.getList()
    //   } else {
    //     this.getSaleList()
    //   }
    },
    // 切换选中状态
    togglePageSelection () {
      // console.log(this.isPageSelected)
      this.setPageSelectionStatus(!this.isPageSelected)
    },
    setPageSelectionStatus (state) {
      if (!this.isExecutingBatchedOperation) {
        state = !!state
        this.list.forEach(item => (item.isSelected = state))
      }
    },
  },
  mounted () {
    // this.getClassifyList()  // 获取商户列表
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
.name_keyword-wrapper
  width 250px
</style>
