<!--美团支付、服务号、小程序模块-->
<template lang="pug">
  .section-layout  
    empty-page(v-if="!(list && list.length) && is_empty", :tip="empty_text",  :class="{'default_height': !(list && list.length)}")
    .content-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.operation_api_desc")
              td
                .simple-td(v-text="formatOperationType(item.operation_type)")
              td
                .simple-td(v-text="formatOperationStatus(item.operation_status)")
              td
                .simple-td.textzh(v-text="item.operation_code", v-if="item.operation_code")
                .simple-td(v-else) --
              td
                .simple-td.multi-content-td.textzh(v-text="item.operation_fail_reason", v-if="item.operation_fail_reason")
                .simple-td(v-else) --
              td
                .simple-td(v-text="item.operator_name", v-if="item.operator_name")
                .simple-td(v-else) --
              td
                .simple-td(v-text="changeDateTime(item.created_at)")
</template>

<script>
  import EmptyPage from '@/components/generics/EmptyPage'
  import storePayApi from '@/mixins/modules/StorePay'
  export default {
    name: 'storeMeituanPay',
    props: {
      tabType: {
        tyep: String,
        required: true,
      },
    },
    mixins: [storePayApi],
    components: {
      EmptyPage,
    },
    data () {
      return {
        store_id: null, // 门店id
        list: [],
        is_empty: false, // 是否空数据
        empty_text: '当前没有记录',
        theadConfig: [
          {
            name: '操作接口描述',
            width: '150',
          }, {
            name: '操作类型',
            width: '150',
          },
          {
            name: '操作状态',
            width: '150',
          }, {
            name: '操作返回码',
            width: '150',
          }, {
            name: '操作失败原因',
            width: '150',
          }, {
            name: '操作人名称',
            width: '150',
          }, {
            name: '操作时间',
            width: '150',
          }],
      }
    },
    watch: {
      tabType () {
        this.tabTypeChange()
        this.getList()
      },
    },
    methods: {
      async getList () {
        this.tabTypeChange()
        let text = ''
        if (this.type === 1) {
          text = ''
        } else if (this.type === 2) {
          text = ''
        } else {
          text = ''
        }
        try {
          const { response, result } = await this.getOperationLogApi({
            type: this.type,
            store_id: this.store_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `获取${text}列表失败`,
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: `获取${text}列表失败`,
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_empty = true
      },
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
      // tab切换
      tabTypeChange () {
        if (this.tabType === 'miniProgram') {
          this.type = 1
        } else if (this.tabType === 'serviceNumber') {
          this.type = 2
        } else {
          this.type = 3
        }
      },
      /**
       * 格式化操作类型
       * @value 操作类型
       */
      formatOperationType (value) {
        let data = ''
        if (value === 1) {
          data = '主动'
        } else {
          data = '第三方回调'
        }
        return data
      },
      /**
       * 格式化操作状态
       * @value 操作状态
       */
      formatOperationStatus (value) {
        let data = ''
        if (value === 1) {
          data = '待确认'
        } else if (value === 2) {
          data = '成功'
        } else {
          data = '失败'
        }
        return data
      },
    },
    mounted () {
      if (this.$route.params.storeId) {
        this.store_id = this.$route.params.storeId
      }
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

.section-layout  
  height calc(100% - 56px)
  display block
  overflow-y auto

.default_height 
  min-height 100% 

.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 20px
</style>
