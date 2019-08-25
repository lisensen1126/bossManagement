<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter
      span.fl.m-t-20.l-h-36 交易详情
      a.button.primary.fr.m-t-20(@click="exportExcel") 导出
    empty-page(v-if="list.length === 0 && isInitiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="16%") 订单时间
              td(width="8%") 订单编号
              td(width="17%") 订单项目
              td(width="9%") 交易金额
              td(width="8%") 手续费
              td(width="8%") 结算金额
              td(width="7%") 分类
              td(width="12%") 客户信息
              td(width="8%") 支付状态
              td(width="7%") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.textzh {{item.trade_time}}
              td
                .multi-content-td.textzh {{item.order_no}}
              td
                .multi-content-td.textzh {{item.items.length>11?(item.items).slice(0, 11)+'...':item.items}}
              td
                .multi-content-td.textzh ￥{{item.order_fee}}
              td
                .simple-td ￥{{item.poundage_fee}}
              td
                .simple-td ￥{{item.settle_fee}}
              td
                .simple-td(v-if="item.order_type===0") 全部
                .simple-td(v-if="item.order_type===1") 普通订单
                .simple-td(v-if="item.order_type===2") 智能保养
                .simple-td(v-if="item.order_type===3") 拼团订单
                .simple-td(v-if="item.order_type===4") 秒杀订单
                .simple-td(v-if="item.order_type===5") 养护卡订单
                .simple-td(v-if="item.order_type===6") 线下买单订单
              td
                .simple-td {{item.nick_name}}/{{item.mobile}}
              td
                .simple-td(v-if="item.pay_status===0") 未知
                .simple-td(v-if="item.pay_status===1") 待付款
                .simple-td(v-if="item.pay_status===2") 已成功
                .simple-td(v-if="item.pay_status===3") 已成功
                .simple-td(v-if="item.pay_status===4") 已失败
              td
                .operation-td(@click="goOrderDetail(item)")
                  a.operation-link.left 订单详情
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import reportFormApi from '@/mixins/modules/reportForm'
import EmptyPage from '@/components/generics/EmptyPage'
import {root} from '@/plugins/Fetch'
export default {
  name: 'incomeTransaction',
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
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      isInitiated: false,    // 页面初始状态
      sendData: {
        payment_id: '',
        merchant_id: '',
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
    goOrderDetail (params) {
      this.$router.push({
        name: 'incomeOrderDetail',
        query: {
          id: params.shop_id,
          trade_order_id: params.order_id,
        },
      })
    },

    // 获取交易详情
    async fetchList () {
      try {
        const {response, result} = await this.GetMeiTuanDetailApi({
          payment_id: this.sendData.payment_id,
          merchant_id: this.sendData.merchant_id,
          page: this.paginationData.current_page,
          size: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(e => {
            e.order_fee = (e.order_fee / 100).toFixed(2)
            e.settle_fee = (e.settle_fee / 100).toFixed(2)
            e.poundage_fee = (e.poundage_fee / 100).toFixed(2)
            e.items = e.items.join(',')
          })
          console.log(result.data, 'result.data')
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取交易详情失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取交易详情失败',
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
      let url = `${root}/meituan_finance/payment_detail_export?payment_id=${this.sendData.payment_id}&merchant_id=${this.sendData.merchant_id}`
      window.open(url)
    },
  },
  mounted () {
    this.sendData.payment_id = this.$route.query.payment_id
    this.sendData.merchant_id = this.$route.query.merchant_id
    console.log(this.sendData)
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
