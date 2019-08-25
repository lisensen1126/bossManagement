<template lang="pug">
  .section-layout
    empty-page(v-if="!list.length", tip="暂无数据")
    // 列表
    .content-wrapper.list-wrapper(v-if="list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 订单内容/订单号
              td(width="100") 客户信息
              td(width="80") 商品总额
              td(width="80") 商品数量
              td(width="80") 分账状态
              td(width="100") 下单时间
              td(width="100") 下单门店
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, i) in list")
              td
                .multi-content-td
                  .content-item(v-text="item.trade_order_no")
                  //  (@click="clickImg(item.item)")
                  .content-item(v-if="item.order_type === 5")
                    span.bottom-image
                      img(:src="scaleImage('https://oss2.chedianai.com/images/assets/upkeep_bg.png', 1, 36, 36)")
                  .content-item(v-else)
                    span.bottom-image(v-for="(img,index) in item.item_pics" v-if="index < 4")
                      img(v-if="img", :src="scaleImage(img, 1, 36, 36)")
              td
                .multi-content-td
                  .content-item
                    span.left-image.inline
                      img(v-if="item.avatar", :src="scaleImage(item.avatar, 1, 16, 16)")
                      img(v-else, src="../../assets/user-avatar.png")
                    span(v-text="item.nick_name")
                  .content-item
                    span(v-text="item.mobile")
                    span.content-divider.inline(v-if="item.license_plate")
                    span(v-text="item.license_plate || ''")
              td
                .simple-td(v-text="'￥' + item.final_amount")
              td
                .simple-td(v-text="'共' + item.item_num + '种商品'")
              td
                .simple-td {{item.is_separate==2?'未分账':item.is_separate==1?'已分账':''}}
              td
                .simple-td {{item.created_at | formatDate}}
              td
                .simple-td.width-160 {{item.store_name}}
              td.operation-td
                router-link.operation-link(:to="{name: 'orderSplitDetail', query: {id: item .trade_order_id, shop: item.shop_id}}") 查看
      pagination(:pagination-data="page_data", @input="paging")

</template>
<script>
  import ReportFormApi from '@/mixins/modules/reportForm'
  import imageScale from '@/mixins/utilities/imageScale'
  import getYearMonth from '@/mixins/utilities/formateDate'
  import ServiceTab from '@/components/generics/ServiceTab'
  import CustomInput from '@/components/generics/form/CustomInput'
  import DatePicker from '@/components/generics/form/DatePicker'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Pagination from '@/components/generics/Pagination'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  export default {
    name: 'OrderBossList',
    components: { ServiceTab, CustomInput, DatePicker, EmptyPage, Pagination, CustomSelect },
    mixins: [ ReportFormApi, imageScale, getYearMonth ],
    data () {
      return {
        list: [], // 列表
        page_data: null,
        start_time: '',
        end_time: '',
        store: '',
      }
    },
    created () {
      this.resetPageData()
    },
    mounted () {
      let data = JSON.parse(sessionStorage.getItem('searchData'))
      this.start_time = data.start_time
      this.end_time = data.end_time
      this.store_name = data.store
      this.fetchDataList()
    },
    methods: {
      resetPageData () {
        this.page_data = {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        }
      },
      search () {
        this.formateDate()
        this.resetPageData()
        this.fetchDataList()
      },
      reset () {
        this.page_data = {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        }
        this.fetchDataList()
      },
      // 分页跳转
      paging (state) {
        this.page_data = state
        this.fetchDataList()
      },
      async fetchDataList () {
        try {
          const { response, result } = await this.OrderSplitListApi({
            is_separate: 1,
            page: this.page_data.current_page,
            per_page: this.page_data.per_page,
            start_time: this.start_time,
            end_time: this.end_time,
            store_name: this.store_name,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.page_data = result.meta
          } else {
            throw new Error(result.message)
          }
        } catch (e) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取订单列表失败',
            content: `服务异常，请稍后再试（${e}）`,
          })
        }
      },
      formateDate () {
        if (this.search_data.time) {
          let tr = this.search_data.time.split(' 至 ')
          this.search_data.start_time = new Date(`${tr[0]} 00:00:00`).getTime() / 1000
          this.search_data.end_time = new Date(`${tr[1]} 23:59:59`).getTime() / 1000
        } else {
          this.search_data.start_time = null
          this.search_data.end_time = null
        }
      },
    },
    filters: {
      formatDate (date) {
        if (date) {
          date = new Date(date *= 1000)
          return `${date.getFullYear()}-${
            date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
            }-${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
            } ${
            date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
            }:${
            date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
            }`
        }
        return ''
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  @import '~@/stylus/modules/table-sp';
  .width-160 {
    max-width 160px !important
  }
  .width-120 {
    max-width 120px !important
  }
  .srue-btn {
    margin-left:30px
    height: 24px !important
    line-height 24px !important
  }
  .revenue {
    background #e8e9eb
    box-sizing: border-box;
    overflow: auto;
  }
  .income {
    background: #ffffff;
    height: 100px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .statistics {
    width: 33%;
    text-align: left;
    padding-left: 30px;
    border-left: 1px solid #D9D9D9;
    box-sizing: border-box;
  }
  .statistics:first-child {
    border: none;
  }
  .statistics div:first-child {
    font-size: 16px;
    color: #999999;
    font-weight: 500;
  }
  .statistics div:last-child {
    margin-top: 10px;
    font-size: 30px;
    color: #404040;
    font-weight: 500;
  }
  .bottom-image {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 4px;

    img {
      height: 100%;
      width: 100%;
    }
  }
  .money{
    width: 82px;
    height:36px;
  }
  .fccc {
    width: 100px;
    height: 200px;
    background: red;
  }

  .bigImg {
    z-index: 9999;
  }
  .margin {
    margin: 0 8px;
    font-size: 14px;
  }

  .choose-content {
    overflow: hidden;
  }

  .batched-operations {
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 36px;
    background-color: #fff;
    box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.08);
  }
  .sliding-enter-active {
    transition: top ease-in 0.2s;
  }

  .sliding-leave-active {
    transition: top ease-out 0.2s;
  }

  .sliding-enter, .sliding-leave-to {
    top: 100%;
  }

  .batched-operation-segment, .batched-operation-divider {
    margin-left: 16px;
    cursor: default;
  }

  .batched-operation-segment {
    line-height: 16px;
    font-size: 13px;
    color: lightGrey;
  }

  .batched-operation-divider {
    height: 13px;
    border-left: 1px solid rgba(0, 0, 0, 0.08);
  }

  .selected-item-count {
    margin: 0 2px;
    color: standblack;
  }

  .batched-operation {
    color: #2fabdd;
    cursor: pointer;

    &.is-secondary {
      color: lightGrey;
    }

    &.is-danger {
      color: error;
    }
  }
  .top-total {
    overflow: unset !important;
    background: #e8e9eb !important;
    padding: 20px 30px 0 !important;
  }
  .section-layout
    height calc(100% - 56px)
    .top-nav
      display: flex
      flex: 0 0 48px
      align-items: center
      justify-content: center
      position: relative
      height: 48px
      padding-left: 64px
      padding-right: 64px
      background-color: #fcfcfc
      box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08)
      z-index: 8
    .w_236
      width 236px
    .tip
      font-size: 12px
      color: #f00
      line-height: 16px
</style>

