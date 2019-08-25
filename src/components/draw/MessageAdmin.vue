<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model.tirm="filter_data.keyword", placeholder="按发送内容和模板名称搜索", @keyupEnter="applyFilter")
        .field
          label.label 按时间筛选
          .field.is-horizontal
            date-picker(type="single", placeholder="选择开始时间", v-model="filter_data.start_time")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="filter_data.end_time")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="goSend")
            span.add-icon
            span 新建发送
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有发送记录'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 短信内容
              td(width="90") 模版分类
              td(width="100") 模板名称
              td(width="80") 发送时间
              td(width="80") 发送用户数
              td(width='80') 到达用户数
              td(width='120') 消耗短信条数
              td(width='120') 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.width-fixed(v-text="item.content")
              td
                .simple-td(v-text="item.module_category_name")
              td
                .simple-td.width-fixed(v-text='item.module_name')
              td
                .simple-td(v-text='item.created_at')
              td
                .simple-td(v-text='item.mobile_number')
              td
                .simple-td(v-text='item.success_of_bars')
              td
                .simple-td(v-text='item.consume_num')
              td
                .operation-td
                  a.operation-link(@click="goDetail(item.id)") 查看
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>


<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import drawApi from '@/mixins/modules/draw'
import { mapGetters } from 'vuex'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'MessageAdmin',
  mixins: [drawApi, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    DatePicker,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
        // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      // 搜索对象
      filter_data: {
        keyword: '',
        start_time: '',
        end_time: '',
      },
      // 活动列表
      list: [],
      is_true: true, // 开始是否大于结束
    }
    return schema
  },
  watch: {
    'filter_data.start_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        start = this.filter_data.start_time.replace(/-/g, '') - 0
        this.filter_data.end_time === '' ? end = 0 : end = this.filter_data.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && end !== 0) ? this.is_true = false : this.is_true = true
    },
    'filter_data.end_time': function (newVal, oldVal) {
      let start = 0
      let end = 0
      if (newVal === '') {
        newVal = 0
      } else {
        this.filter_data.start_time === '' ? start = 0 : start = this.filter_data.start_time.replace(/-/g, '') - 0
        end = this.filter_data.end_time.replace(/-/g, '') - 0
      }
      (start - end > 0 && start !== 0) ? this.is_true = false : this.is_true = true
    },
  },
  computed: {
    ...mapGetters({
      store_list: 'stores',
    }),
  },
  methods: {
    // 获取短信发送列表接口
    async fetchData () {
      let params = {
        keyword: this.filter_data.keyword,
        end_time: this.filter_data.end_time.length > 0 ? new Date(this.filter_data.end_time + ' 23:59:59').getTime() / 1000 : '',
        start_time: this.filter_data.start_time.length > 0 ? new Date(this.filter_data.start_time + ' 00:00:00').getTime() / 1000 : '',
      }
      try {
        const {response, result} = await this.getSmsSendList({
          search: JSON.stringify(params),
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信发送列表失败',
            content: `${result && result.code ? ' ' + result.code + result.message : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信发送列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
    applyFilter () {
      if (!this.is_true && this.filter_data.end_time !== '') {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'failure',
          title: '开始时间不能大于结束时间',
          resolve: () => {
            this.$emit('failure')
          },
        })
        return
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置按钮
    resetFilter () {
      this.filter_data.keyword = ''
      this.filter_data.end_time = ''
      this.filter_data.start_time = ''
      this.paginationData.current_page = 1
      this.is_true = true
      this.fetchData()
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    formatTime (date) {
      return date.slice(0, 10)
    },
    // 新建发送
    goSend () {
      this.$router.push({
        name: 'messageSend',
      })
    },
    /**
     * 查看详情
     * @id 发送id
     */
    goDetail (id) {
      let obj = {
        paginationData: this.paginationData,
        filter_data: this.filter_data,
      }
      sessionStorage.setItem('searchData', JSON.stringify(obj))
      this.$router.push({
        name: 'messageSendDetail',
        query: {
          id: id,
        },
      })
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val, type) {
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
    let obj = sessionStorage.getItem('searchData')
    if (obj) {
      obj = JSON.parse(obj)
      this.paginationData = obj.paginationData
      this.filter_data = obj.filter_data
      sessionStorage.getItem('searchData', '')
    }
    this.fetchData()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.section-layout {
  height calc(100% - 40px) !important
}
.section-filter {
    display: flex;
    justify-content: space-between;
}

.keyword-wrapper {
    width: 244px;
}

.staff-wrapper {
  width 120px
}

.button {
    align-items: center;
}
.content-wrapper {
  height: calc(100%-95px) !important
}
.add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
}

.td-with-tip {
    position: relative;
    display: flex;
    align-items: center;
}

.help-tip-icon {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url('~@/assets/icons/help.svg') no-repeat center center;
    background-size: cover;
    margin-left: 4px;

    &:hover {
        .help-tip {
            display: block;
        }
    }
}

.help-tip {
    display: none;
    z-index: 213;
    position: absolute;
    top: 22px;
    left: -76px;
    width: 160px;
    padding: 4px 6px;
    border-radius: 2px;
    background-color: #121212;
    color: #fff;
    font-size: 12px;
    line-height: 18px;

    &::after {
        content: '';
        position: absolute;
        width: 8px;
        height: 8px;
        left: 50%;
        top: -4px;
        margin-left: -2px;
        transform: rotate(45deg);
        background-color: #121212;
    }
}
.margin
  margin 0 8px
  font-size 14px
.p-b-0
  padding-bottom 0
.display-block
  display block
.height-auto
  height auto
.message-send
  display flex
  width 300px
  height 120px
  padding 15px 20px
  margin-top 20px
  flex-direction column
  justify-content space-between
  border 1px solid #eeeeee
.message-send-data
  text-align right
.height-100
  height calc(100% - 56px)
  display block
  overflow-y auto
.empty-page-wrapper
  margin-top 50px
.width-fixed
  max-width 400px !important
  overflow hidden
  text-overflow ellipsis
.store-list
  width 240px !important
.keywords
  width 180px !important
</style>
