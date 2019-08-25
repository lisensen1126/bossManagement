<template lang="pug">
  .section-layout
    .section-filter.field-group.is-horizontal
      .field.keyword-wrapper
        label.label 关键字搜索
        custom-input(v-model="keywords", placeholder="姓名/手机号/车牌号", @keyupEnter="search")
      .field
        a.button.primary(@click="search") 搜索
      .field
        a.button(@click="reset") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有客户档案")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(v-if="customer.avatar", :src="scaleImage(customer.avatar, 1, 36, 36)")
                    img(v-if="!customer.avatar", src="../../assets/user-avatar.png")
                  .content-item(v-text="customer.nick_name")
                  .content-item(v-text="customer.mobile")
              td
                .simple-td(v-if="customer.default_vehicle.license_plate", v-text="customer.default_vehicle.license_plate")
                .simple-td.null(v-else) 暂无数据
              td
                .simple-td.m-r-5.td-special(v-if="customer.brand_info", v-text="customer.brand_info")
                .simple-td.null(v-else) 暂无数据
              td
                .simple-td(v-text="customer.created_at ? customer.created_at : '—'")
              td
                .operation-td
                  a.operation-link(@click="viewDetail(customer.customer_id)") 查看
      .tfoot(v-if="list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>

import CustomInput from '@/components/generics/form/CustomInput'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/Customer'
import Pagination from '@/components/generics/Pagination'
import imageScale from '@/mixins/utilities/imageScale'
import { mapGetters } from 'vuex'

export default {
  name: 'CustomerList',
  mixins: [Api, imageScale],
  components: {
    EmptyPage,
    CustomInput,
    Pagination,
  },
  data () {
    return {
      isInitiated: false,
      theadConfig: [
        {
          name: '姓名/手机号',
          width: '200',
        }, {
          name: '车牌信息',
          width: '150',
        },
        {
          name: '品牌车系',
          width: '400',
        }, {
          name: '开通时间',
          width: '100',
        }, {
          name: '操作',
          width: '100',
        }],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      keywords: undefined,
      is_search: false, // 是否搜索(翻页时判断用)
    }
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
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
      try {
        const { response, result } = await this.fetchCustomerList({
          keywords: this.is_search ? this.keywords : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(element => {
            element.created_at = this.changeDateTime(element.created_at)
          })
          this.list = result.data.map(res => {
            let temp = ''
            temp += res.default_vehicle.brand_name ? res.default_vehicle.brand_name + ' ' : ''
            temp += res.default_vehicle.model_name ? res.default_vehicle.model_name + ' ' : ''
            temp += res.default_vehicle.series_name ? res.default_vehicle.series_name + ' ' : ''
            temp += res.default_vehicle.vehicle_name ? res.default_vehicle.vehicle_name + ' ' : ''
            temp += res.default_vehicle.product_year ? res.default_vehicle.product_year + ' ' : ''
            temp += res.default_vehicle.output_volume ? res.default_vehicle.output_volume + ' ' : ''
            return {
              ...res,
              brand_info: temp,
            }
          })
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取客户列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索
    search () {
      this.is_search = true
      this.paginationData.current_page = 1
      this.getList()
    },
    // 重置
    reset () {
      this.is_search = false
      this.keywords = ''
      this.paginationData.current_page = 1
      this.getList()
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.getList()
    },
    // 查看详情
    viewDetail (id) {
      this.$router.push({
        name: 'customerDetail',
        query: {
          customerId: id,
        },
      })
    },
  },
  mounted () {
    this.getList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

.carinfo {
  position: relative;
  padding-left: 8px;
  padding-right: 8px;

  &::after {
    position: absolute;
    left: 0;
    top: 50%;
    content: '';
    width: 1px;
    height: 20px;
    background: #f2f2f2;
    margin-top: -10px;
  }

  &:first-child {
    padding-left: 0;
  }

  &:first-child::after {
    width: 0;
  }
}

.carmore {
  font-size: 20px;
  line-height: 20px;
  padding: 0 10px;
  color: #999;
  display: inline-block;
}

.m-r-5 {
  margin-right: 5px;
}

tr td .td-special {
  max-width: 380px !important;
}
</style>
