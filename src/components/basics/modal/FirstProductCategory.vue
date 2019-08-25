<!--选择商品分类项-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 请选择商品分类项
        .close-button(@click="modalClose")
      .modal-body
        el-tree(:props="tree" :load="loadNode" lazy="" @node-click="changeTree" node-key="category_ischeck" :default-expanded-keys="[1]")
        empty-page(v-if="!(list && list.length) && is_initiated", :tip="'暂无分类'")
      .modal-footer.level
        .level-left
          span(v-if="!callback_data.category_name || callback_data.category_name ==='商品分类'", v-text="'未选'")
          span(v-if="callback_data.category_name && callback_data.category_name !=='商品分类'", v-text="'已选：' + callback_data.category_name")
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete" v-show="callback_data.category_name && callback_data.category_name !=='商品分类'") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import BossMixin from '@/mixins/modules/boss'

  export default {
    name: 'SecondProductCategory',
    components: {
      ModalDialog,
      EmptyPage,
    },
    mixins: [BossMixin, ModalInteractions],
    props: {
      id: {
        type: [Number, String],
      },
    },
    data () {
      return {
        is_initiated: false,
        list: [],
        tree: {          // 树状结构数据
          label: 'category_name',
          children: 'zones',
          isLeaf: 'leaf',
        },
        class_type: '2',            // 服务分类标识符
        parant_id: '0',             // 服务分类添加必须参数 默认父类分类id 0
        submit_data: { // 获取右边列表的数据
          type: '1',
          parent_id: 0,
          is_page: 2,
        },
        callback_data: {},   // 给父组件传递的回调数据
      }
    },
    methods: {
      // 动态获取分类
      loadNode (node, resolve) {
        let _this = this
        if (node.level === 0) {
          _this.submit_data.parent_id = 0
          _this.parant_id = 0
          return resolve([{ category_name: '商品分类', category_ischeck: 1 }])
        }
        if (node.level > 1) return resolve([])
        // 模拟异步数据加载
        _this.submit_data.parent_id = node.data.category_id
        _this.parant_id = node.data.category_id
        _this.fetchData().then(function (data) {
          resolve(_this.list)
        })
      },

      // 点击分类
      changeTree (node, resolve) {
        this.callback_data = node
      },

      // 获取分类列表
      async fetchData () {
        if (!this.submit_data.parent_id) {
          this.submit_data.parent_id = 0
        }
        try {
          const {response, result} = await this.classifyList(this.submit_data)
          if (response.status === 200) {
            result.data.forEach(v => {      // 控制小三角的显隐
              if (v.level === 1) v.leaf = true
            })
            this.list = result.data
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类列表出错',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类列表失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },

      // 完成
      complete () {
        this.modalResolve(this.callback_data, this.id)
      },
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
    overflow-y auto
  .level-left
    line-height 40px
    color #666
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
</style>
