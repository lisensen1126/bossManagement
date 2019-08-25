<template lang="pug">
  modal-dialog(modal-scale="large", v-if="value")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 选择城市
        .close-button(@click="modalClose")
      .modal-body
        .table-wrapper(v-if="dataList.length")
          .items(v-for="item in dataList", @click="toggleItem(item)")
            .checkbox
              input(type="checkbox", :id="item.id", :checked="item.isSelected")
              label(:for="item.id")
            .item-content
              span(v-text="item.name")
      .modal-footer.level
        .level-left.limit-info(@click="toggleAll")
          .checkbox
            input(type="checkbox", :id="0", :checked="isSelectedAll")
            label(:for="0")
          .item-content
            span 全选
        .level-right
          span.cancel-button(@click="modalClose") 取消
          a.button.large.primary(@click="compelete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import modalInteractions from '@/mixins/utilities/modalInteractions'
  import enterApi from '@/mixins/modules/enterprise'
  import imageScale from '@/mixins/utilities/imageScale'
  import ShopCategoryPicker from '@/components/generics/form/ShopCategoryPicker'
  import filterTools from '@/mixins/utilities/filterTools'

  export default {
    name: 'ChooseCity',
    components: {
      ModalDialog,
      CustomInput,
      ShopCategoryPicker,
      EmptyPage,
    },
    mixins: [modalInteractions, enterApi, imageScale, filterTools],
    props: {
      provinceId: {type: Number},
      // both item list and id list are acceptable
      existedItems: {
        type: Array,
        default: () => [],
      },
      // 已经选择的城市
      nowCityList: {
        type: Array,
        default: () => [],
      },
      queries: {
        type: Object,
        default: () => ({}),
      },
      selectedBranchId: {
        type: [Number, Array],
      },
      disabledTab: {
        type: Array,
        default: () => [],
      },
    },
    data () {
      return {
        list: [],
        dataList: [],
        isAll: false,
        allCity: {
          id: 1,
          name: '全选',
          isDisabled: true,
          isSelected: false,
        },
        // results
        selectedItems: [],
        selectedIds: new Set(),
        isLoading: true,
        isSelectedAll: false,
        isSelectedAllDisable: false,
        isInitiated: false,
      }
    },
    computed: {
      allLength () {
        return parseInt(this.selectedItems.length) + parseInt(this.existedItems.length)
      },
      isMax () {
        return this.limit ? this.limit <= this.allLength : false
      },
      existedIds () {
        return new Set(this.nowCityList.map(candidate =>
          candidate instanceof Object
            ? candidate.id
            : candidate
        ))
      },
    },
    methods: {
      // 获取对应城市
      async getFullItems () {
        this.isLoading = true
        try {
          const {response, result} = await this.fetchRegions({
            parent_id: this.provinceId,
          })
          if (response.status === 200) {
            this.dataList = this.processItemOptions(result.data)
            if (this.dataList.length === this.nowCityList.length) {
              this.isSelectedAll = true
            }
            // this.processLimitItemOptions()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取城市列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取城市列表失败',
            content: `错误：${err}`,
          })
        }
        this.isInitiated = true
        this.isLoading = false
      },
      // 初始化数据
      processItemOptions (items) {
        items.forEach(item => {
          item.isSelected = false
          item.isDisabled = false
          if (this.existedIds.has(item.id)) {
            item.isSelected = true
            item.isDisabled = false
          }
        })
        return items
      },
      // 选中/取消 商品
      toggleItem (item) {
        item.isSelected = !item.isSelected
        var isAll = true
        this.dataList.forEach(item => {
          if (!item.isSelected) {
            isAll = false
          }
        })
        if (isAll) {
          this.isSelectedAll = true
        } else {
          this.isSelectedAll = false
        }
      },
      // 选中全部
      toggleAll () {
        const toBeSelected = this.dataList.filter(item => !item.isSelected)
        if (!toBeSelected || this.limit || this.isLoading || this.isSelectedAllDisable) {
          return
        }
        this.isSelectedAll = !this.isSelectedAll
        if (this.isSelectedAll) {
          toBeSelected.forEach(item => {
            this.toggleItem(item)
          })
        } else {
          this.dataList.forEach(item => {
            this.toggleItem(item)
          })
        }
      },
      compelete () {
        var arr = []
        this.dataList.forEach(item => {
          if (item.isSelected) {
            arr.push(item)
          }
        })
        if (arr.length === 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请选择城市',
          })
          return
        }
        this.modalResolve(arr)
      },
    },
    mounted () {
      if (this.provinceId !== null) {
        this.getFullItems()
      }
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
    height 511px
    display flex
    flex-direction column
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
</style>
