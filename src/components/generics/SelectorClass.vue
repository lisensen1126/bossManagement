<template lang="pug">
  modal-dialog(modal-scale="large" v-if="value")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title(v-text="isCommodity === 'true'?'添加到商品库':'添加到服务库'")
        .close-button(@click="modalClose")
      .modal-body
        .filter-wrapper(v-if="isCommodity === 'false'")
          .filter-wrapper 选择分类
          //- custom-select.custom-select(v-model="selectedItems", :list="itemCategoryList", name-field="category_name")
          custom-select.custom-select-commodity(v-model="selectedFirstItems", :list="itemCategoryList", name-field="category_name", @input="changeSecond(2)")
          custom-select.custom-select-commodity(v-model="selectedSecondItems", :list="itemCategorySecondList", name-field="category_name")
        .filter-wrapper(v-if="isCommodity === 'true'")
          .filter-wrapper 选择品牌
          custom-select.custom-select(v-model="selectedBrand", :list="itemBrandList", name-field="brand_name")
        .filter-wrapper(v-if="isCommodity === 'true'")
          .filter-wrapper 选择分类
          custom-select.custom-select-commodity(v-model="selectedFirstItems", :list="itemCategoryList", name-field="category_name", @input="changeSecond(1)")
          custom-select.custom-select-commodity(v-model="selectedSecondItems", :list="itemCategorySecondList", name-field="category_name")
          //- custom-select.custom-select-commodity(v-model="selectedThirdItems", :list="itemCategoryThirdList", name-field="category_name")
        a.button.sub-button.primary(@click="compelete") 确定
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import EmptyPage from '@/components/generics/EmptyPage'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import CustomSelect from '@/components/generics/form/CustomSelect'
import enterpriseApi from '@/mixins/modules/enterprise'

export default {
  name: 'ItemSelector',
  components: {
    ModalDialog,
    CustomSelect,
    EmptyPage,
  },
  mixins: [modalInteractions, enterpriseApi],
  props: {
    id: {type: Number},
    isCommodity: {
      type: String,
      default: 'false',
    },
    // both item list and id list are acceptable
  },
  data () {
    return {
      itemCategoryList: [],
      selectedItems: {},
      selectedFirstItems: {},
      itemCategorySecondList: [],
      selectedSecondItems: {},
      itemCategoryThirdList: [],
      selectedThirdItems: {},
      itemBrandList: [],
      selectedBrand: {},
      isLoading: true,
      selectedIds: [],
    }
  },
  methods: {
    compelete () {
      if (this.isCommodity === 'false') {
        // this.modalResolve(this.selectedItems)
        // if (this.selectedItems.category_id) {
        //   this.addServe(this.selectedItems.category_id)
        // } else {
        //   this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '分类必选',
        //   })
        // }
        if (!(this.selectedSecondItems && this.selectedSecondItems.category_name)) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '请选择二级分类',
          })
          return
        }
        this.addServe(this.selectedSecondItems.category_id)
      }
      if (this.isCommodity === 'true') {
        var selectArray = []
        selectArray.push({selectedBrand: this.selectedBrand})
        selectArray.push({firstClass: this.selectedFirstItems})
        selectArray.push({secondClass: this.selectedSecondItems})
        selectArray.push({thirdClass: this.selectedThirdItems})
        if (!(this.selectedBrand && this.selectedBrand.brand_name)) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '请选择品牌',
          })
          return
        }
        if (!(this.selectedSecondItems && this.selectedSecondItems.category_name)) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '请选择二级分类',
          })
          return
        }
        this.addGoods(this.selectedSecondItems.category_id)
      }
    },
    // 添加到商品库
    async addGoods (categoryid) {
      let arr = []
      arr.push(categoryid)
      var self = this
      try {
        const {response, result} = await this.AddGoods({
          product_id: self.id,
          category_ids: arr,
          brand_id: this.selectedBrand.brand_id,
        })
        if (response.status === 200) {
          if (result.data.message === 'success') {
            this.$store.dispatch('showMessage', {
              title: '添加商品库成功',
              isRejectable: 1,
              resolve: () => this.modalResolve('success'),
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加到商品库失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加到商品库失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 添加到服务库
    async addServe (serveId) {
      let arr = []
      arr.push(serveId)
      var self = this
      // 服务收集的添加接口
      try {
        const {response, result} = await this.AddServe({
          product_id: self.id,
          category_ids: arr,
        })
        if (response.status === 200) {
          if (result.data.message === 'success') {
            this.$store.dispatch('showMessage', {
              title: '添加到服务库成功',
              isRejectable: 1,
              resolve: () => this.modalResolve('success'),
            })
          }
          // this.modalResolve('success')
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加到服务库失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加到服务库失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 获取品牌列表
    async getBrandList () {
      try {
        const {response, result} = await this.getPai({is_page: 1})
        if (response.status === 200) {
          // result.data.forEach(candidate => (
          //   candidate.isSelected = false
          // ))
          this.itemBrandList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取牌列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 获取分类
    async getFirstList (parentId, type) {
      try {
        const {response, result} = await this.getCateList({
          type: type,
          parent_id: parentId,
          is_page: 2,
        })
        if (response.status === 200) {
          if (parentId === 0) {
            this.itemCategoryList = result.data
          } else {
            this.itemCategorySecondList = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取牌列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    changeSecond (type) {
      this.itemCategorySecondList = []
      this.selectedSecondItems = {}
      this.itemCategoryThirdList = []
      this.selectedThirdItems = {}
      this.getFirstList(this.selectedFirstItems.category_id, type)
    },
  },
  mounted () {
    if (this.isCommodity === 'true') {
      // 商品
      this.getBrandList()
      this.getFirstList(0, 1)
    } else {
      // 服务
      this.getFirstList(0, 2)
    }
  },
}
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card-title
    font-size 18px
  .modal-footer
    padding 12px 16px
  .modal-body
    min-height 120px
    display flex
    flex-direction column
  .filter-wrapper
    flex-shrink 0
    box-sizing border-box
    background #e8e9eb
    padding 12px 16px
    display flex
    flex-direction row
  .custom-select-commodity
    width 26% !important
    margin-right 8px
    flex-shrink 0
  .custom-select
    width 80%
    margin-right 8px
    flex-shrink 0
  .sub-button
    display block
    margin: 15px auto
</style>
