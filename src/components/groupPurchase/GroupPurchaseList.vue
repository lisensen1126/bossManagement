<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="活动名称/活动ID", @keyupEnter="applyFilter")
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
      span.add-button(@click="addActivity")
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有活动")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in currentThead", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.id")
              td
                .simple-td(v-text="item.created_at")
              td
                .multi-content-td
                  .content-item {{item.sale_begin_date}}<br/>{{item.sale_end_date}}
              td
                .simple-td(v-text='item.pass_enterprise_count')
              td
                .operation-td
                  span.operation-link(v-if="true", @click="stopActivityShow(item.id)") 下架
                  router-link.operation-link(:to="{name: 'groupPurchaseEdit', query: {id: item.id, type: 1}}") 编辑
                  router-link.operation-link(:to="{name: 'groupPurchaseStoreList', query: {id: item.id}}") 门店管理
                  router-link.operation-link(:to="{name: 'groupPurchaseDetail', query: {id: item.id, type: 1}}") 详情
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
import StopGroup from '@/components/groupPurchase/modal/StopGroup'

export default {
  name: 'groupPurchaseList',
  mixins: [Api, imageScale],
  components: {
    PriorConditions,
    ServiceTab,
    EmptyPage,
    CustomInput,
    Pagination,
    DataPicker,
    DatePicker,
    StopGroup,
  },
  data () {
    var theadConfig1 = [
      {
        name: '团购活动名称',
        width: '200',
      },
      {
        name: '团购活动ID',
        width: '100',
      },
      {
        name: '活动创建时间',
        width: '100',
      },
      {
        name: '活动时间',
        width: '100',
      },
      {
        name: '参与商户',
        width: '100',
      },
      {
        name: '操作',
        width: '150',
      },
    ]
    return {
      isInitiated: false,
      filterData: {
        keyword: '',
        start_time: '',
        end_time: '',
      },
      is_true: true, // 开始是否大于结束
      currentThead: theadConfig1,
      list: [],
      show_modal: false,
      paginationData: {
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 0,
      },
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
    // 获取团购活动列表数据
    async fetchData () {
      try {
        const {response, result} = await this.getTuanGouListApi({
          keyword: this.filterData.keyword,
          start_time: this.filterData.start_time.length > 0 ? new Date(this.filterData.start_time + ' 00:00').getTime() / 1000 : '',
          end_time: this.filterData.end_time.length > 0 ? new Date(this.filterData.end_time + ' 23:59:59').getTime() / 1000 : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.created_at = this.changeDateTime(element.created_at)
            element.sale_begin_date = this.changeDateTime(element.sale_begin_date,'data')
            element.sale_end_date = this.changeDateTime(element.sale_end_date,'data')
          })
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团购列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取团购列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    // 新建活动
    addActivity () {
      this.$router.push({
        name: 'groupPurchaseCreate',
      })
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
        const {result, response} = await this.setTuanGouStopApi({
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
.margin
  margin 0 8px
  font-size 14px
</style>
