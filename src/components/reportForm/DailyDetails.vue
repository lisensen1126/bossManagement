<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter
      span.fl.m-t-20.l-h-36 每日明细
      a.button.primary.fr.m-t-20(@click="exportExcel") 导出
    empty-page(v-if="list.length === 0 && isInitiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 时间
              td(width="80") 省
              td(width="80") 市
              td(width="80") 区
              //- td(width="80") 经销商
              //- td(width="80") 经销商ID
              //- td(width="80") 督导
              td(width="80") 经销商编码
              td(width="100") 门店名称
              td(width="80") 小程序
              td(width="80") ERP ID
              td(width="80", v-if="default_value == 1 || default_value == 2") 小程序访问数
              td(width="80", v-if="default_value == 1 || default_value == 3") 注册车主数
              td(width="80", v-if="default_value == 1 || default_value == 4") 订单数
              td(width="80", v-if="default_value == 1 || default_value == 5") 下单车主数
              td(width="80", v-if="default_value == 1 || default_value == 6") 订单金额
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.textzh(v-text="item.days")
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
                .operation-td
                  a.operation-link.left(@click="goDetail(item, 1)" v-if="default_value == 1 || default_value == 4 || default_value == 5 ||default_value == 6") 订单详情
                  a.operation-link.left(@click="goDetail(item, 2)" v-if="default_value == 2") 访问详情
                  a.operation-link.left(@click="goDetail(item, 3)" v-if="default_value == 3") 注册详情
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import reportFormApi from '@/mixins/modules/reportForm'
import EmptyPage from '@/components/generics/EmptyPage'
import {root} from '@/plugins/Fetch'
export default {
  name: 'DailyDetails',
  mixins: [reportFormApi],
  components: {
    Pagination,
    EmptyPage,
  },
  data () {
    return {
      root,
      paginationData: {
        current_page: 1,
        per_page: 50,
        last_page: 2,
        total: 0,
      },
      isInitiated: false,    // 页面初始状态
      default_value: 1,
      sendData: {
        date: '',
        store_id: '',
      },
      list: [],
    }
  },

  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    },

    // 去订单详情
    goDetail (params, type) {
      if (type === 1) {
        this.$router.push({
          name: 'operateOrderDetail',
          query: {
            id: params.store_id,
            time: params.days,
          },
        })
      }
      if (type === 2) {
        this.$router.push({
          name: 'operateClickDetail',
          query: {
            id: params.store_id,
            time: params.days,
          },
        })
      }
      if (type === 3) {
        this.$router.push({
          name: 'operateRegisterDetail',
          query: {
            id: params.store_id,
            time: params.days,
          },
        })
      }
    },

    // 获取每日明细
    async fetchList () {
      try {
        const {response, result} = await this.detailedApi({
          date: this.$route.query.time,
          store_id: this.$route.query.id,
          page: this.paginationData.current_page,
          size: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取每日明细数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取每日明细数据失败',
          content: `错误：${err}`,
        })
      }
    },

    paging (state) {
      this.paginationData = state
      this.fetchList()
    },

    // 导出按钮点击
    exportExcel () {
      if (this.default_value - 0 === 1) this.exportAll()
      if (this.default_value - 0 === 2) this.exportAppClick()
      if (this.default_value - 0 === 3) this.exportAppRegister()
      if (this.default_value - 0 === 4) this.exportAppOrder()
      if (this.default_value - 0 === 5) this.exportAppCustomer()
      if (this.default_value - 0 === 6) this.exportAppAmount()
    },

    // 导出总表数据 exportGeneralApi
    async exportAll () {
      try {
        const {response, result} = await this.exportAllDayApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
        const {response, result} = await this.appClickDayAPi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
        const {response, result} = await this.appRegisterDayApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
        const {response, result} = await this.appOrderDayAPi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
        const {response, result} = await this.appCustomerDayApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
        const {response, result} = await this.appAmountDayApi(this.sendData)
        if (response.status === 200 && result.code === 0) {
          window.open(root + '/' + result.data.download_url + '?file_name=' + result.data.file_name)
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
  },
  mounted () {
    this.default_value = this.$route.query.type
    this.sendData.date = this.$route.query.time
    this.sendData.store_id = this.$route.query.id
    this.fetchList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
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
  padding-right: 40px;
}
.fr
  float right
.fl
  float left
.l-h-36
  line-height 36px
  font-size 18px
  padding-left 30px
.m-t-20
  margin-top 20px
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
</style>
