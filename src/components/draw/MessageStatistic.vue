<template lang="pug">
  .section-layout.height-100(ref="scrolls")
    .content-wrapper.p-b-0
      .section-filter.height-auto.display-block
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 门店使用情况
        .field-group.is-horizontal
          .field.message-send
            .message-send-title
              label.label 上月发送
            .message-send-data(v-text="(statistical.last_month_sent ? statistical.last_month_sent : 0) + '条'") 223451条
          .field.message-send
            .message-send-title
              label.label 本月发送
            .message-send-data(v-text="(statistical.month_sent ? statistical.month_sent : 0) + '条'") 223451条
          .field.message-send
            .message-send-title
              label.label 累计发送
            .message-send-data(v-text="(statistical.total_sent ? statistical.total_sent : 0) + '条'") 223451条
          .field.message-send
            .message-send-title
              label.label 累计购买
            .message-send-data(v-text="(statistical.total_buy ? statistical.total_buy : 0) + '条'") 223451条
    .content-wrapper
      .section-filter.height-auto
        h2.level.header-wrapper
          .level-left
            .icon.user-info-icon-wrapper
              .user-info-icon
            .header-title 门店购买记录
      .section-filter
        .field-group.is-horizontal
          .field.keyword-wrapper.keywords
            label.label 关键字搜索
            custom-input(v-model.trim="filter_data.keyword", placeholder="按门店名称搜索", @keyupEnter="applyFilter")
          .field
            label.label 区域
            custom-select.fl.w-100(:list="province_list", v-model="filter_data.province", @input="changeProvince", placeholder="请选择省")
          .field
            custom-select.fl.w-100(:is_disable="!filter_data.province.id",:list="city_list", v-model="filter_data.city", placeholder="请选择市")
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
      empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有购买记录'")
      .list-wrapper(v-if="list && list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="150") 购买时间
                td(width="150") 门店名称
                td(width="150") 购买数量
                td(width="150") 购买金额
                td(width="150") 当前剩余量
            tbody(v-if="list.length")
              tr(v-for="(item, index) in list")
                td
                  .simple-td(v-text="item.paid_at")
                td
                  .simple-td(v-text="item.store_name")
                td
                  .simple-td(v-text='item.buy_count')
                td
                  .simple-td(v-text='item.price/100')
                td
                  .simple-td(v-text='item.surplus')
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
import reportFormApi from '@/mixins/modules/reportForm'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'MessageStatistic',
  mixins: [drawApi, filterTools, imageScale, reportFormApi],
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
      province_list: [],
      city_list: [],
      // 搜索对象
      filter_data: {
        keyword: '',
        province: {},
        city: {},
        start_time: '',
        end_time: '',
      },
      // 活动列表
      list: [],
      statistical: {},
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
      try {
        const {response, result} = await this.getStatisticalApi({
          store_name: this.filter_data.keyword,
          province: this.filter_data.province.id ? this.filter_data.province.id : '',
          city: this.filter_data.city.id ? this.filter_data.city.id : '',
          paid_start: this.filter_data.start_time.length > 0 ? new Date(this.filter_data.start_time + ' 00:00').getTime() / 1000 : '',
          paid_end: this.filter_data.end_time.length > 0 ? new Date(this.filter_data.end_time + ' 23:59:59').getTime() / 1000 : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(ele => {
            ele.paid_at = this.changeDateTime(ele.paid_at, 'datetime')
          })
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
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信发送列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 获取短信统计
    async getStatistical () {
      try {
        const {response, result} = await this.getAllowanceApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.statistical = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信统计失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信统计失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
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
      this.filter_data.city = {}
      this.filter_data.province = {}
      this.city_list = []
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
    // 获取省份
    async getSheng () {
      try {
        const {response, result} = await this.fetchRegions()
        if (response.status === 200 && result.code === 0) {
          let arr = []
          result.data.forEach(item => {
            arr.push(item)
          })
          this.province_list = arr
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
    // 获取对应城市
    async getFullItems () {
      try {
        const {response, result} = await this.fetchRegions({
          parent_id: this.filter_data.province.id ? this.filter_data.province.id : '',
        })
        if (response.status === 200 && result.code === 0) {
          let arr = []
          result.data.forEach(item => {
            arr.push(item)
          })
          this.city_list = arr
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取城市列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取城市列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 选择省份
    changeProvince () {
      this.filter_data.city = {}
      this.city_list = []
      this.getFullItems()
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
    this.getSheng()
    this.fetchData()
    this.getStatistical()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';

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
.section-filter
  background #fff
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
.tfoot
  bottom initial
.empty-page-wrapper
  margin-top 50px
.width-fixed
  width 400px !important
.store-list
  width 240px !important
.keywords
  width 180px !important
</style>
