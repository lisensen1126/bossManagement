<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.width-200
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="活动名称/活动ID/门店名称", @keyupEnter="applyFilter")
        .field
          label.label 状态
          custom-select(:list="statusList", v-model="filterData.get_status", :input="changeStatus")
        .field
          label.label 创建时间
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开始时间", v-model="filterData.start_time")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="filterData.end_time")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有活动")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width='120') 团购活动名称
              td(width='100') 团购活动ID
              td(width='100') 活动创建时间
              td(width='80') 活动时间
              td(width='70') 状态
              td(width='120') 门店名称
              td(width='80') 门店ID
              td(width='100') 团单数量
                a.icons-help(@mouseover="showCommentModal(1)", @mouseleave="hideCommentModal(1)", @mouseout="CommentModalOut(1)")
                  .modaltips(v-if="isVisible1")
                    transition(name="fade")
                      p 团单数量=团单核销数量/团单销售数量
                    .sanjiao
              td(width='100') 团单金额
                a.icons-help(@mouseover="showCommentModal(2)", @mouseleave="hideCommentModal(2)", @mouseout="CommentModalOut(2)")
                  .modaltips(v-if="isVisible2")
                    transition(name="fade")
                      p 团单金额=团单核销金额/团单销售金额
                    .sanjiao
              td(width='120') 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td(v-text="item.name")
              td
                .simple-td(v-text="item.id")
              td
                .simple-td(v-text='item.created_at')
              td
                .multi-content-td
                  .content-item {{item.sale_begin_date}}<br/>{{item.sale_end_date}}
              td
                .simple-td
                  .status-dot(:class="{'green': item.check_status == '2', 'grey': item.check_status == '4' || item.check_status == '5', 'red': item.check_status == '0' || item.check_status == '3'}")
                  span(v-if="item.check_status == '0'") 审核中
                  span(v-if="item.check_status == '1'") 待发布
                  span(v-if="item.check_status == '2'") 团购中
                  span(v-if="item.check_status == '3'") 已拒绝
                  span(v-if="item.check_status == '4'") 已完成
                  span(v-if="item.check_status == '5'") 已终止
              td
                .multi-content-td(v-text='item.store[0].store_name')
              td
                .simple-td(v-text='item.store_id')
              td
                .simple-td(v-text='item.use_write_count + "/" + item.write_count')
              td
                .simple-td(v-text='item.use_write_money/100 + "/" + item.pay_money/100')
              td
                .operation-td
                  span.operation-link(v-if="item.check_status == '1' || item.check_status == '2'", @click="stopActivityShow(item.id)") 下架
                  router-link.operation-link(v-if="item.check_status == '1' || item.check_status == '2'",:to="{name: 'groupPurchaseEdit', query: {id: item.id, type: 2}}") 编辑
                  router-link.operation-link(:to="{name: 'groupPurchaseEdit', query: {id: item.id}}",v-if='item.check_status == "3"') 重新提审
                  router-link.operation-link(:to="{name: 'groupPurchaseDetail', query: {id: item.id, type: 2}}") 详情
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
      stop-group(v-if="show_modal", @callback="selectedSuccess", @cacel='cacelModal')
</template>

<script>
import PriorConditions from '@/components/generics/PriorConditions'
import ServiceTab from '@/components/generics/ServiceTab'
import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/groupPurchase'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import DatePicker from '@/components/generics/form/DatePicker'
import DataPicker from '../../mixins/utilities/dataPicker'
import CustomSelect from '@/components/generics/form/CustomSelect'
import StopGroup from '@/components/groupPurchase/modal/StopGroup'

export default {
  name: 'GroupStorePurchaseList',
  mixins: [Api, imageScale],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
    CustomInput,
    Pagination,
    DataPicker,
    DatePicker,
    CustomSelect,
    StopGroup,
  },
  data () {
    return {
      isInitiated: false,
      isVisible1: false,
      isVisible2: false,
      is_true: true,
      filterData: {
        keyword: '',
        start_time: '',
        end_time: '',
        get_status: {
          name: '全部',
          status: '',
        },
      },
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 0,
      },
      // 活动的状态
      statusList: [{
        name: '全部',
        status: '',
      }, {
        name: '审核中',
        status: '0',
      },  {
        name: '待发布',
        status: '1',
      }, {
        name: '团购中',
        status: '2',
      }, {
        name: '已拒绝',
        status: '3',
      }, {
        name: '已完成',
        status: '4',
      }, {
        name: '已终止',
        status: '5',
      }],
      show_modal: false,
      reason: '',   // 下架原因
      activity_id: null,
    }
  },
  watch: {
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
  methods: {
    // 获取团单列表数据
    async fetchData () {
      try {
        const {response, result} = await this.getTuanDanListApi({
          keyword: this.filterData.keyword,
          status: this.filterData.get_status.status,
          start_time: this.filterData.start_time.length > 0 ? new Date(this.filterData.start_time + ' 00:00').getTime() / 1000 : '',
          end_time: this.filterData.end_time.length > 0 ? new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000 : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.sale_begin_date = this.changeDateTime(element.sale_begin_date,'data')
            element.sale_end_date = this.changeDateTime(element.sale_end_date,'data')
            element.created_at = this.changeDateTime(element.created_at)
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团单列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取团单列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    /* 下架
    *  @ id 活动id
    * */
    stopActivityShow (id) {
      this.show_modal = true
      this.activity_id = id
    },
    /**
     * 输入之后隐藏 modal
     * item为填入的值
    */
    selectedSuccess (item) {
      this.reason = item
      if (this.reason.length === 0) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '请输入下架原因',
        })
        return
      }
      this.show_modal = false
      this.stopActivity()
    },
    cacelModal () {
      this.show_modal = false
    },
    /* 下架
    *  @ id 活动id
    * */
    async stopActivity () {
      try {
        const {result, response} = await this.setTuanDanStopApi({
          id: this.activity_id,
          reason: this.reason,
        })
        if (response.status === 200) {
          if (result.message === 'success') {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '活动下架成功',
              resolve: () => {
                this.fetchData()
              },
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '活动下架失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '活动下架失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 鼠标在上面
    showCommentModal (type) {
      window.clearTimeout(this.hideTimeout)
      if (type === 1) {
        this.isVisible1 = true
      } else {
        this.isVisible2 = true
      }
    },
    // 鼠标离开
    hideCommentModal (type) {
      if (type === 1) {
        this.isVisible1 = false
      } else {
        this.isVisible2 = false
      }
    },
    // 鼠标进入
    CommentModalOut (type) {
      window.clearTimeout(this.hideTimeout)
      if (type === 1) {
        this.hideTimeout = setTimeout(() => {
          this.isVisible1 = false
        }, 200)
      } else {
        this.hideTimeout = setTimeout(() => {
          this.isVisible2 = false
        }, 200)
      }
    },
    /* 选择活动状态
      *  @ q 活动状态
      * */
    changeStatus (q) {
      this.filterData.get_status = q
    },
    // 搜索按钮
    applyFilter () {
      if (!this.is_true && this.filterData.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => this.$emit('failure'),
        })
        return
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.paginationData.current_page = 1
      this.filterData.keyword = ''
      this.filterData.start_time = ''
      this.filterData.end_time = ''
      this.filterData.get_status = {
        name: '全部',
        status: '',
      }
      this.is_true = true
      this.fetchData()
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val,type) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      if (type === 'data') {
        return Y + M + D
      } else if (type === 'datetime') {
        return Y + M + D + h + m
      } else {
        return Y + M + D + h + m
      }
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
    this.fetchData() // 获取订单列表数据
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';
td,.multi-content-td,.simple-td
 vertical-align middle
.width-200
  width 200px
.section-layout
  height calc(100% - 56px)
.word-break
  word-break break-all
  word-wrap break-word
.m-r-10
  margin-right 10px
.add-button
  position absolute
  top 30px
  right 53px
  z-index 9
.icons-help
  position relative
  background center no-repeat url('~@/assets/icons/icons_help.svg')
  background-size 100% 100%
  display inline-block
  width 14px
  height 14px
  margin-top -2px
  margin-left 5px
  vertical-align middle
.modaltips
  width 172px
  box-sizing border-box
  background rgba(0,0,0,0.8)
  border-radius 2px
  box-shadow 0 0 0 0 rgba(0, 0, 0, .05), 0 2px 12px -1px rgba(0, 0, 0, .10)
  padding 5px 8px
  font-size 12px
  line-height 18px
  color #fff
  position absolute
  z-index 11
  bottom -60px
  left calc(50% -6px)
  transform translateX(calc(-50% + 6px))
  .sanjiao
    width 8px
    position absolute
    left 0
    right 0
    margin auto
    top -8px
    border-width 0 8px 8px
    border-style solid
    border-color #f0f1f2 #f0f1f2 rgba(0,0,0,0.8)
.margin
  margin 0 8px
  font-size 14px
</style>
