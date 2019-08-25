<!--选择平台内容弹框-->
<template lang="pug">
  modal-dialog(modal-scale="card")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 车检项目选择
        .close-button(@click="modalClose")
      .modal-body
        .main-left
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 项目名称
                custom-input(v-model="keywords", placeholder="请输入名称关键词", @keyupEnter="search()")
              .field
                a.button.primary(@click="search()") 搜索
              .field
                a.button(@click="reset()") 重置

          empty-page(v-if="list.length ==0 && is_initiated", :tip="'暂无内容'")

          .table-wrapper(v-if="list.length > 0 && is_initiated")
            table.table
              thead
                tr
                  td(width="30")
                    .checkbox
                      input(type="checkbox", id="all", v-model="checked_all", @click="checkedAllFn")
                      label.sepcific-setting(for="all", v-text="'全选'")
                  td(width="150") 项目名称
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.id", :value="item", name="modal", v-model="selected_item", :checked="item.selected")
                        label.sepcific-setting(:for="item.id")
                  td
                    label.sepcific-setting(:for="item.id")
                      .simple-td
                        .content-item(v-text="item.name")
          .tfoot
            pagination(:pagination-data="pagination_data", @input="paging")
        .main-right
          .right-title 选中内容
          .right-content
            .item-box(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="item.name")
              label.item-delete(:for="item.id")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Pagination from '@/components/generics/Pagination'
  import Api from '@/mixins/modules/FunctionSetting'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
      CustomInput,
      EmptyPage,
      Pagination,
    },
    mixins: [ModalInteractions, Api],
    props: {
      array: {
        type: Array,
        default: [],
      },
    },
    watch: {
      selected_item () {
        this.checked_all = false
        let length = 0
        let src = JSON.stringify(this.list)
        this.selected_item.forEach(item => {
          if (src.indexOf(JSON.stringify(item)) !== -1) {
            length += 1
          }
        })
        if (length === this.list.length) this.checked_all = true
      },
    },
    data () {
      return {        
        keywords: '',           // 搜索条件
        list: [],               // 数据列表
        pagination_data: {      // 分页
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        checked_all: false,      // 全选状态
        selected_item: [],       // 选中的
        is_initiated: false,     // 页面初始化
      }
    },
    methods: {
      // 项目列表
      async fetchProjectList () {
        let params = {
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
          simple: 1,
          name: this.keywords,
        }
        try {
          const { response, result } = await this.getArticleListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.pagination_data = result.meta
            this.is_initiated = true
            this.list.splice(0, this.list.length, ...result.data)
            this.checked_all = false
            let length = 0
            let src = JSON.stringify(this.list)
            this.selected_item.forEach(item => {
              if (src.indexOf(JSON.stringify(item)) !== -1) {
                length += 1
              }
            })
            if (length === this.list.length) this.checked_all = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取项目列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取项目列表失败',
            content: err,
          })
        }
      },

      // 搜索按钮
      search () {
        this.pagination_data.current_page = 1
        this.fetchProjectList()
      },

      // 重置
      reset () {
        this.keywords = ''
        this.search()
      },

      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.fetchProjectList()
      },

      // 全选 or 取消
      checkedAllFn () {
        let _this = this
        if (!this.checked_all) {
          // 多选
          this.list.forEach(item => {
            let has = _this.selected_item.some(obj => obj.id === item.id)
            if (!has) {
              _this.selected_item.push(item)
            }
          })
        } else {
          // 取消
          this.list.forEach(item => {
            let index = 0
            let has = _this.selected_item.some((obj, i) => {
              index = i
              return obj.id === item.id
            })
            if (has) {
              _this.selected_item.splice(index, 1)
            }
          })
        }
      },

      // 完成
      complete () {
        this.modalResolve(this.selected_item)
      },
    },
    mounted () {
      this.selected_item = [...this.array]
      this.fetchProjectList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card
    width 1150px !important
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
    display flex
    justify-content space-between
    .main-left
      position relative
      width 800px
      height 520px
      display flex
      flex-direction column
      padding-bottom 36px
    .main-right
      width 350px
      padding 0 15px
      .right-title
        font-size 14px
        line-height 40px
        border-bottom 1px solid #f0f1f2
      .right-content
        height 479px
        overflow-y auto
        .item-box
          display flex
          justify-content space-between
          align-items center
          height 40px
          padding 0 5px
          border-bottom 1px solid #f0f1f2
          // background #f0f1f2
          margin-bottom 5px
          font-size 12px
          .item-name
            width 300px
          .item-delete
            width 20px
            height 20px
            background center no-repeat url('~@/assets/modal/close.svg')
            cursor pointer
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
