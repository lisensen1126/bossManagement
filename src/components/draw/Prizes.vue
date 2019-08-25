<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addEvent")
            span.add-icon
            span 新建门店奖品
    empty-page(v-if="list.length === 0", :tip="'当前没有奖品'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 奖品名称
              td(width="100") 类型
              td(width="100") 优惠金额
              td(width="100") 使用条件
              td(width="100") 有效期
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.coupon_name")
              td
                .simple-td(v-if="item.coupon_type === 2") 兑换券
                .simple-td(v-if="item.coupon_type === 3") 满减券
              td
                .simple-td {{item.discount_amount / 100}}
              td
                .simple-td(v-if="item.coupon_type === 2") 无限制
                .simple-td(v-if="item.coupon_type === 3") 满 {{item.condition_value / 100}} 减 {{item.discount_amount / 100}}
              td
                .simple-td {{item.effective_days}} 天
              td
                .operation-td
                  a.operation-link.right(@click="remove(item)") 删除
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      create-prize(@success="additionHandler",)
</template>

<script>
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CreatePrize from '@/components/draw/CreatePrize'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import Pagination from '@/components/generics/Pagination'
  import drawApi from '@/mixins/modules/draw'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import {root} from '@/plugins/Fetch'

  export default {
    name: 'Prizes',
    mixins: [drawApi, filterTools, imageScale],
    components: {
      CustomInput,
      EmptyPage,
      Pagination,
      CustomSelect,
      SlideOutModal,
      CreatePrize,
    },
    data () {
      const schema = {
        root,
        slideVisible: false,
        isInitiated: true,
        filterData: {
          enterprise_name: '',
        },
        queryData: {
          enterprise_name: '',
        },
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        list: [],
      }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.enterprise_name = ''
      })
      return schema
    },
    methods: {
      // 添加组件的展示
      toggleSidePannel () {
        this.slideVisible = !this.slideVisible
      },
      // 添加成功
      additionHandler () {
        this.fetchData()
        this.toggleSidePannel()
      },
      /* 下架奖品提示
      *  @ item 奖品详情
      * */
      remove (item) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: `确认删除‘${item.coupon_name}’该奖品？`,
          isRejectable: 1,
          resolve: () => {
            this.removeApi(item.coupon_id)
          },
        })
      },
      /* 下架接口
      *  @ id 奖品id
      * */
      async removeApi (id) {
        try {
          const {result, response} = await this.delPrize({
            coupon_id: id,
          })
          if (response.status === 200) {
            if (result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '奖品删除成功',
                resolve: () => {
                  this.fetchData()
                },
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '奖品删除失败',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '奖品删除失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      // 添加奖品
      addEvent () {
        // 判断是否十个
        // console.log(this.list.length)
        if (this.list.length === 10) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '已经创建十个门店奖品不能继续添加',
          })
        } else {
          this.slideVisible = !this.slideVisible
        }
      },
      // 获取奖品列表
      async fetchData () {
        try {
          const {response, result} = await this.prizeList()
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取奖品列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取奖品列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      /* 时间格式改时间戳
     *  @ val 时间
     * */
      changeDate (val) {
        val = val.replace(/-/g, '/')
        let time = (new Date(val)).getTime() / 1000
        return time
      },
    },
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .textzh
    text-overflow ellipsis
    overflow hidden
    white-space normal
    line-height 22px
  .p-l-20
    padding-left 20px
  .p-r-20
    padding-right 20px
  .right
    margin-right 10px !important
  .section-filter
    display flex
    justify-content space-between
  .keyword-wrapper
    width 244px
  .button
    align-items center
  .give-icon
    display none
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
  .td-with-tip
    position relative
    display flex
    align-items center
  .help-tip-icon
    position relative
    display inline-block
    width 12px
    height 12px
    background url('~@/assets/icons/help.svg') no-repeat center center
    background-size cover
    margin-left 4px
    &:hover
      .help-tip
        display block
  .help-tip
    display none
    z-index 213
    position absolute
    top 22px
    left -76px
    width 160px
    padding 4px 6px
    border-radius 2px
    background-color #121212
    color #fff
    font-size 12px
    line-height 18px
    &::after
      content ''
      position absolute
      width 8px
      height 8px
      left 50%
      top -4px
      margin-left -2px
      transform rotate(45deg)
      background-color #121212
  .gray
    color #989ba1
  .text-center
    text-align center
  .justify-center
    justify-content center
  .operation-link
    margin-right 0
</style>
