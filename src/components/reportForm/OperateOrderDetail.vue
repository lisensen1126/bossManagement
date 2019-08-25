<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .section-filter
      span.fl.m-t-20.l-h-36 订单详情
    empty-page(v-if="list.length === 0 && isInitiated", :tip="'暂无数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 下单时间
              td(width="180") 订单号
              td(width="80") 订单状态
              td(width="80") 类型
              td(width="180") 名称
              td(width="150") 核销时间
              td(width="90") 是否使用优惠券
              td(width="100") 优惠券名称
              td(width="100") 订单金额
              td(width="100") 优惠金额
              td(width="100") 实付金额
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="formateDate(item.created_at, true)")
              td
                .simple-td(v-text="item.trade_order_no")
              td
                .simple-td(v-if="item.order_type === 6 || item.order_type === 7 || item.goods_type === 2") 已完成
                .simple-td(v-else)
                  .simple-td(v-if="item.wf_status == 1") 待核销
                  .simple-td(v-if="item.wf_status == 2") 已核销
              td                
                .simple-td(v-if="item.goods_type === 1 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 商品服务订单
                .simple-td(v-if="item.goods_type === 2 && (item.order_type === 1 || item.order_type === 2 || item.order_type === 3 || item.order_type === 4)") 养护卡订单
                .simple-td(v-if="item.order_type === 6") 线下买单订单
                .simple-td(v-if="item.order_type === 7") 线下买单(快速开单)订单
              td
                .multi-content-td.textzh(v-if="item.order_type !== 6 && item.order_type !== 7", v-text="item.product_name")
                .multi-content-td.textzh(v-if="item.order_type === 6 || item.order_type === 7")  --
              td
                .simple-td(v-if="item.goods_type === 2 || item.order_type === 6 || item.order_type === 7") --
                .simple-td(v-else)
                  .simple-td(v-if="!Number(item.write_off_at)") --
                  .simple-td(v-else, v-text="formateDate(item.write_off_at, true)")
              td
                .simple-td(v-if="item.is_use_conpon == 1") 是
                .simple-td(v-if="item.is_use_conpon == 2") 否
              td
                .simple-td(v-if="item.is_use_conpon == 1", v-text="item.coupon_name")
                .simple-td(v-if="item.is_use_conpon == 2", v-text="'--'")
              td
                .simple-td(v-text="item.total_amount")
              td
                .simple-td(v-text="item.discount_amount")
              td
                .simple-td(v-text="item.final_amount")
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import reportFormApi from '@/mixins/modules/reportForm'
import EmptyPage from '@/components/generics/EmptyPage'
import formateDate from '@/mixins/utilities/formateDate'
export default {
  name: 'DailyDetails',
  mixins: [reportFormApi, formateDate],
  components: {
    Pagination,
    EmptyPage,
  },
  data () {
    return {
      paginationData: {
        current_page: 1,
        per_page: 50,
        last_page: 2,
        total: 0,
      },
      default_value: 1,
      list: [],
      isInitiated: false, // 页面初始状态
    }
  },

  methods: {
    // 返回
    goBack () {
      this.$router.go(-1)
    },

    // 分页操作
    paging (state) {
      this.paginationData = state
      this.fetchList()
    },

    // 获取每日明细
    async fetchList () {
      try {
        const { response, result } = await this.appOrderListDayApi({
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
            title: '获取订单数据失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取订单数据失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    // this.default_value = this.$route.query.type
    this.fetchList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

td {
  vertical-align: middle !important;
}

.multi-content-td {
  vertical-align: middle;
}

.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 40px;
}

.fr {
  float: right;
}

.fl {
  float: left;
}

.l-h-36 {
  line-height: 36px;
  font-size: 18px;
  padding-left: 30px;
}

.m-t-20 {
  margin-top: 20px;
}

.nav-back-btn {
  position: absolute;
  top: 36px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #CED3DC center no-repeat url('~@/assets/back.svg');
  background-size: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
}
.table {
  text-align: center;
  .textzh{
    padding: 0 10px;
  }
  tr,td {
    text-align: center;
  }
}
</style>
