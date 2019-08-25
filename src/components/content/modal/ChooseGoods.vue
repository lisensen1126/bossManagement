<!--选择平台内容弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 
          a.shop(@click='chooseTab(1)',:class='show_tab === 1 ? "active" : ""') 商品
          a.shop(@click='chooseTab(2)',:class='show_tab === 2 ? "active" : ""') 服务
        .close-button(@click="modalClose")
      .modal-body
        .section-filter.is-horizontal
          .field-group.is-horizontal
            .field.is-keyword
              label.label 名称
              custom-input(v-model="filter_data.keywords", placeholder="请输入名称关键词", @keyupEnter="searchFilter(1)")
            .field.is-narrow
              label.label 一级分类
              custom-select(v-model="first_state", :list="first_class_list", @input="changefirst_state", nameField="category_name")
            .field.is-narrow
              label.label 二级分类
              custom-select(v-model="second_state", :list="second_class_list", nameField="category_name")
            //- .field.is-narrow
            //-   label.label 品牌
            //-   custom-select(v-model="brand", :list="brand_list", nameField="brand_name", :show-search="true")
            .field
              a.button.primary(@click="searchFilter(1)") 搜索
            .field
              a.button(@click="resetFilter") 重置
        empty-page(v-if="!data_list.length && is_initiated", :tip="'暂无内容'")
        .table-wrapper(v-if="data_list && data_list.length !== 0 && show_tab === 1")
          table.table
            thead
              tr
                td(width="80")
                td(width="150") 商品图片
                td(width="150") 商品名称
            tbody
              tr(v-for="item in data_list")
                td
                  .simple-td
                    .checkbox
                      input(type="checkbox", :id="item.product_id", :value="item", name="modal", v-model="selected_item", :checked='item.selected')
                      label.sepcific-setting(:for="item.product_id")
                td
                  .simple-td
                    img.img(:src="item.product_pic")
                td
                  .simple-td(v-text="item.product_name")
        .table-wrapper(v-if="data_list && data_list.length !== 0 && show_tab === 2")
          table.table
            thead
              tr
                td(width="80")
                td(width="150") 服务图片
                td(width="150") 服务名称
            tbody
              tr(v-for="item in data_list")
                td
                  .simple-td
                    .checkbox
                      input(type="checkbox", :id="item.id", :value="item", name="modal" v-model="selected_item")
                      label.sepcific-setting(:for="item.id")
                td
                  .simple-td
                    img.img(:src="item.product_pic")
                td
                  .simple-td(v-text="item.product_name")
        .tfoot
          pagination(:pagination-data="pagination_data", @input="paging")
      .modal-footer.level
        .level-left
          div 注：商品/服务最多关联十个
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
  import Api from '@/mixins/modules/Content'
  import BossApi from '@/mixins/modules/boss'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api, BossApi, ImageScale, FilterTools],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        is_initiated: false,
        filter_data: { // 搜索条件
          brand_id: '',
          keywords: '',
        },
        first_state: null,
        first_class_list: [],
        second_state: null,
        second_class_list: [],
        show_tab: 1,
        brand: null,
        // brand_list: [],
        data_list: [],
        pagination_data: { // 分页
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        selected_item: [], // 选中的
      }
    },
    methods: {
      // 搜索按钮
      searchFilter (tag) {
        if (this.brand) {
          this.filter_data.brand_id = this.brand.brand_id
        }
        if (tag === 1) {
          this.pagination_data.current_page = 1
        }
        if (this.show_tab === 1) {
          this.getGoodsList(0)
          this.getGoodsData()
        } else {
          this.getServiceList(0)
          this.getServiceData()
        }
      },
      // 重置
      resetFilter () {
        this.brand = null
        this.pagination_data.current_page = 1
        this.data_list = []
        this.filter_data.keywords = ''
        this.filter_data.brand_id = ''
        this.first_state = null
        this.first_class_list = []
        this.second_state = null
        this.second_class_list = []
        if (this.show_tab === 1) {
          this.getGoodsList()
          this.getGoodsData()
        } else {
          this.getServiceList()
          this.getServiceData()
        }
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
      async getGoodsData () {
        let currentId = ''
        if (this.second_state && this.second_state.category_id) {
          currentId = this.second_state.category_id
        } else if (this.first_state && this.first_state.category_id) {
          currentId = this.first_state.category_id
        }
        try {
          const { response, result } = await this.commodityList({
            product_name: this.filter_data.keywords,
            category_id: currentId,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
            is_sale: 1,
          })
          if (response.status === 200 && result.code === 0) {
            this.data_list = result.data
            this.data_list.forEach(item => {
              item.type = 1
            })
            // 分页器数据更新
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品列表失败',
              content: '获取商品列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
            }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取服务列表
      async getServiceData () {
        let currentId = ''
        if (this.second_state && this.second_state.category_id) {
          currentId = this.second_state.category_id
        } else if (this.first_state && this.first_state.category_id) {
          currentId = this.first_state.category_id
        }
        try {
          const { response, result } = await this.serviceList({
            product_name: this.filter_data.keywords,
            category_id: currentId,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
            is_sale: 1,
          })
          if (response.status === 200 && result.code === 0) {
            this.data_list = result.data
            this.data_list.forEach(item => {
              item.type = 2
            })
            this.pagination_data = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.searchFilter(0)
      },
      // 完成
      complete () {
        if (this.selected_item.length > 10) {
          return
        }
        this.modalResolve(this.selected_item, this.show_tab)
      },
      chooseTab (type) {
        if (this.show_tab === type) {
          return
        }
        this.show_tab = type
        this.resetFilter()
      },
      // 获取一级服务分类
      async getServiceList (parentId) {
        let params = {
          type: 2,
          parent_id: parentId,
        }
        try {
          let { response, result } = await this.classifyList(params)
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
            if (result.data[0].level === 1) {
              this.first_class_list = result.data
            } else if (result.data[0].level === 2) {
              this.second_class_list = result.data
            } else if (result.data[0].level === 3) {
              this.thirdClassList = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: '获取商品分类发生错误，请稍后再试',
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      // 获取一级商品分类
      async getGoodsList (parentId) {
        let params = {
          type: 1,
          parent_id: parentId,
        }
        try {
          let { response, result } = await this.classifyList(params)
          if (response.status === 200 && result.code === 0) {
            // 根据返回的分类级别组装数据
            if (result.data[0].level === 1) {
              this.first_class_list = result.data
            } else if (result.data[0].level === 2) {
              this.second_class_list = result.data
            } else if (result.data[0].level === 3) {
              this.third_classList = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: '获取商品分类发生错误，请稍后再试',
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${
              result && result.code ? ' ' + result.code : ''
            }）`,
          })
        }
      },
        // 选择一级分类，赋值二级分类
      changefirst_state () {
        this.second_state = null
        this.second_class_list = []
        if (this.show_tab === 1) {
          this.getGoodsList(this.first_state.category_id)
        } else {
          this.getServiceList(this.first_state.category_id)
        }
      },
    },
    mounted () {
      // this.getBrandList() // 获取品牌列表
      this.getGoodsList(0)
      this.getGoodsData() // 获取内容列表
      this.selected_item = [...this.array]
      console.log(this.selected_item, 1111)
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card
    width 950px !important
  .modal-card-title
    overflow hidden
    .shop
      float left
      margin-right 20px
      color #353535
    .active
      border-bottom 2px solid #ffbb29
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
.level-left
  margin 12px 0
  font-size 13px
  color red 
</style>
