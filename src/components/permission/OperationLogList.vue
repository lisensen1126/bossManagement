<template lang="pug">
  .section-layout  
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 接口路由
          custom-input.fl.w-100(v-model="filter_data.api", placeholder="接口路由", @keyupEnter="search")
        .field
          label.label 路由名称
          custom-input.fl.w-100(v-model="filter_data.comment", placeholder="路由名称", @keyupEnter="search")
        .field
          label.label 操作人姓名
          custom-input.fl.w-100(v-model="filter_data.name", placeholder="操作人姓名", @keyupEnter="search")
        .field.is-narrow
          label.label 操作类型
          custom-select.w-100(v-model="filter_data.type", :list="operation_type" nameField="value")
        .field.is-narrow
          label.label 业务类型
          custom-select.w-100(v-model="filter_data.from", :list="business_type" nameField="value")
        .field.is-narrow
          label.label 操作平台
          custom-select.w-100(v-model="filter_data.platform", :list="operation_platform" nameField="value")
        .field
          label.label 操作时间
          .field.is-horizontal
            date-picker.w-140(type="single", placeholder="选择开始时间", v-model="filter_data.start_time") 
            span.margin 至 
            date-picker.w-140(type="single", placeholder="选择结束时间", v-model="filter_data.end_time")
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
    empty-page(v-if="!(list && list.length) && is_empty", :tip="empty_text")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.log_id")
              td
                .simple-td(v-text="item.api")
              td
                .simple-td(v-text="item.api_comment")
              td
                .simple-td(v-text="item.operator_name")
              td
                .simple-td(v-text="item.operation_type")
              td
                .simple-td(v-text="item.type")
              td
                .simple-td(v-text="item.operation_platform")
              td
                .simple-td(v-text="item.created_at")
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>

import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import DatePicker from '@/components/generics/form/DatePicker'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Api from '@/mixins/modules/Permission'

export default {
  name: 'operationLogList',
  mixins: [Api],
  components: {
    EmptyPage,
    CustomInput,
    Pagination,
    DatePicker,
    CustomSelect,
  },
  data () {
    return {
      filter_data: {
        api: '', // 接口路由
        comment: '', // 路由名称
        name: '', // 操作人姓名
        type: { // 操作类型
          type: 0,
          value: '全部',
        },
        from: { // 业务类型
          type: 0,
          value: '全部',
        },
        platform: { // 操作平台
          type: 0,
          value: '全部',
        },
        start_time: '', // 开始时间
        end_time: '', // 结束时间
      },
      query_data: {},
      operation_type: [ // 操作类型
        {
          type: 0,
          value: '全部',
        },
        {
          type: 1,
          value: '创建',
        },
        {
          type: 2,
          value: '编辑',
        },
        {
          type: 3,
          value: '删除',
        },
        {
          type: 4,
          value: '其他',
        },
      ],
      business_type: [ // 业务类型
        {
          type: 0,
          value: '全部',
        },
        {
          type: 1,
          value: '基础',
        },
        {
          type: 2,
          value: '业务',
        },
      ],
      operation_platform: [ // 操作平台
        {
          type: 0,
          value: '全部',
        },
        {
          type: 1,
          value: 'BOSS',
        },
        {
          type: 2,
          value: '门店',
        },
      ],
      is_empty: false, // 是否空数据
      empty_text: '当前没有操作记录',
      theadConfig: [
        {
          name: '操作记录id',
          width: '100',
        }, {
          name: '接口路由',
          width: '200',
        }, {
          name: '路由名称',
          width: '200',
        }, {
          name: '操作人名称',
          width: '150',
        }, {
          name: '操作类型',
          width: '100',
        }, {
          name: '业务类型',
          width: '100',
        }, {
          name: '操作平台',
          width: '100',
        }, {
          name: '创建时间',
          width: '100',
        }],
      list: [],
      paginationData: { // 分页数据
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      is_first_enter: false, // 是否第一次进入
    }
  },
  methods: {
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
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
    // 获取客户列表
    async getList () {
      let startTime = this.query_data.start_time ? parseInt(new Date(this.query_data.start_time + ' 00:00').getTime() / 1000) : 0
      let endTime = this.query_data.end_time ? parseInt(new Date(this.query_data.end_time + ' 00:00').getTime() / 1000) : 0
      try {
        const { response, result } = await this.getOperationLogApi({
          api: this.query_data.api ? this.query_data.api : '',
          comment: this.query_data.comment ? this.query_data.comment : '',
          name: this.query_data.name ? this.query_data.name : '',
          type: this.query_data.type.type,
          from: this.query_data.from.type,
          platform: this.query_data.platform.type,
          start_time: startTime,
          end_time: endTime,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.created_at = this.changeDateTime(element.created_at)
            if (element.operation_type === 1) {
              element.operation_type = '创建'
            } else if (element.operation_type === 2) {
              element.operation_type = '编辑'
            } else if (element.operation_type === 3) {
              element.operation_type = '删除'
            } else {
              element.operation_type = '其他'
            }
            if (element.type === 1) {
              element.type = '基础'
            } else {
              element.type = '业务'
            }
            if (element.operation_platform === 1) {
              element.operation_platform = 'BOSS'
            } else {
              element.operation_platform = '门店'
            }
          })
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取操作日志列表失败',
            content: `${result.message ? result.message : '服务异常，请稍后再试'}（${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取操作日志列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.is_empty = true
    },
    // 搜索
    search () {
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      this.paginationData.current_page = 1
      this.getList()
    },
    // 重置
    reset () {
      this.filter_data = {
        api: '',
        comment: '',
        name: '',
        type: {
          type: 0,
          value: '全部',
        },
        from: {
          type: 0,
          value: '全部',
        },
        platform: {
          type: 0,
          value: '全部',
        },
        start_time: '', // 开始时间
        end_time: '', // 结束时间
      }
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.paginationData.current_page = 1
      this.getList()
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
  },
  mounted () {
    this.is_first_enter = true
  },
  // keep-alive 进入
  activated () {
    if (this.is_first_enter) this.reset()
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

.w-100
  width 100px
.w-140
  width 140px
.margin
  margin: 0 8px
  font-size: 14px
</style>
