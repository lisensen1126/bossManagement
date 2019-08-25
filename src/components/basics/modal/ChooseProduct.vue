<!--选择商品弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择商品
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-narrow
              label.label 品牌
              custom-select(v-model="brand", :list="brand_list", nameField="brand_name", :show-search="true")
            .field.is-keyword
              label.label 商品名称
              custom-input(v-model="filter_data.keywords", placeholder="请输入名称关键词", @keyupEnter="searchFilter(1)")
            .field
              a.button.primary(@click="searchFilter(1)") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无商品'")
        .table-wrapper(v-if="data_list && data_list.length")
          table.table
            thead
              tr
                td(width="80")
                td(width="100")
                td(width="200") 商品名称
                td(width="70") 品牌
            tbody
              tr(v-for="(item, index) in data_list")
                td
                  .simple-td
                    .radio
                      input(type="radio", :id="item.product_id", :value="item", name="modal" v-model="selected_item")
                      label.sepcific-setting(:for="item.product_id")
                td
                  .simple-td
                    img.img(:src="item.product_pic")
                td
                  .simple-td(v-text="item.product_name")
                td
                  .simple-td(v-text="item.brand_name")
        .tfoot
          pagination(:pagination-data="pagination_data", @input="paging")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(v-if="selected_item", @click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/boss'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'ChooseProduct',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api, ImageScale, FilterTools, SeriesApi],
    props: {
      id: {
        type: [String, Number],
      },
      chooseType: {
        type: [String, Number],
        default: () => 1,
      },
    },
    data () {
      return {
        is_initiated: false,
        filter_data: { // 搜索条件
          brand_id: '',
          keywords: '',
        },
        brand: null,
        brand_list: [],
        data_list: [],
        pagination_data: { // 分页
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        selected_item: null, // 选中的
      }
    },
    methods: {
      // 搜索按钮
      searchFilter (tag) {
        if (this.brand) {
          this.filter_data.brand_id = this.brand.brand_id
        }
        // 点击搜索按钮，
        if (tag === 1) {
          this.pagination_data.current_page = 1
        }
        this.selected_item = null
        this.getProductData()
      },
      // 重置
      resetFilter () {
        this.brand = null
        this.filter_data.keywords = ''
        this.filter_data.brand_id = ''
        this.getProductData()
      },
      // 获取品牌列表
      async getBrandList () {
        let _this = this
        try {
          const {response, result} = await this.brandList({
            is_page: 2,
            source_type: 1,
          })
          if (response.status === 200 && result.code === 0) {
            _this.brand_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌列表出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      // 获取商品列表
      async getProductData () {
        let params = {
          brand_id: this.filter_data.brand_id,
          product_name: this.filter_data.keywords,
          is_sale: 1,  // 只展示已上架的商品
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        if (this.chooseType - 0 > 2) params.is_up_all = 1
        try {
          const {response, result} = this.chooseType - 0 > 2 ? await this.goodListApi(params) : await this.commodityList(params)
          if (response.status === 200 && result.code === 0) {
            this.data_list = result.data
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取列表失败',
              content: '获取列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.searchFilter(0)
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item, this.id)
      },
    },
    mounted () {
      this.getBrandList() // 获取品牌列表
      this.getProductData() // 获取商品列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
    padding-bottom 36px
  .table-wrapper
    padding 8px 16px
    flex-grow 1
    background standBackground
    .items
      + .items
        margin-top 8px
      display flex
      height 48px
      align-items center
      background #ffffff
      padding 0 16px
    .checkbox
      flex-shrink 0
      margin-right 16px
    .image
      width 32px
      height 32px
      flex-shrink 0
      margin-right 16px
    .item-content
      max-width 343px
      margin-right 16px
      font-size 13px
      line-height 16px
      flex-grow 1
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
    .price-content
      font-weight bold
      width 100px
      flex-shrink 0
      font-size 13px
      line-height 16px
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
  .simple-td
    height 32px
    line-height 32px
    display flex
    align-items center
  .limit-info
    font-size 13px
    color darker
    align-items center
    .count
      color mediumYellow
      margin-left 10px
  .filter-wrapper
    flex-shrink 0
    box-sizing border-box
    background #e8e9eb
    padding 12px 16px
    display flex
    flex-direction row
  .custom-select
    width 128px
    margin-right 8px
    flex-shrink 0
  .custom-input
    flex-grow 1
    margin-right 8px
  .filter-wrapper
    .button + .button
      margin-left 8px
  .pagination
    flex-shrink 0
    height 36px
    display flex
    justify-content space-between
    align-items center
    padding 0 16px
    background #ffffff
    box-shadow 0 -1px 12px 0 rgba(0, 0, 0, 0.08)
  .pagination-info
    font-size 13px
    line-height 16px
    color lightGrey
  .page-turning
    font-size 13px
    line-height 16px
    color lightGrey
    height 100%
    display flex
    align-items center
    cursor pointer
    &.is-disabled
      opacity .2
      pointer-events none
    &:hover
      color mediumYellow
      .pre-icon
        background-image url('~@/assets/prev-hover.svg')
      .next-icon
        background-image url('~@/assets/next-hover.svg')
  .pre-icon
  .next-icon
    display inline-block
    width 16px
    height 16px
    background url('~@/assets/prev.svg') no-repeat center center
    background-size 14px
  .next-icon
    background-image url('~@/assets/next.svg')
  .img
    width 32px
    height 32px
  .tfoot
    z-index 3
  .radio
    width 16px
    height 16px
    label
      width 16px
      height 16px
      padding-left 14px
    input[type="radio"]
      width 16px
      height 16px
</style>
