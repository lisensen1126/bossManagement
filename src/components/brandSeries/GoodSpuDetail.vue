<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 商品详情
      .form-wrapper(v-if="pageShow")
        .field-group
          .field.is-horizontal
            label.label 商品名称
            span(v-text="item.product_name")
          .field.is-horizontal
            label.label 商品品牌
            span(v-text="item.brand_name")
          .field.is-horizontal
            label.label 商品主图
            .control.upLoad-image.pic-block(v-if="item.product_pics.length>0")
              open-image(img-type="2",:img-url="item.product_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            span(v-text="classfiy")
        .field-group
          .field.is-horizontal
            label.label 属性
            .control(v-for="propertyItem in item.attribute_data", v-if="propertyItem.is_optional")
              .radio.service-status(v-text="propertyItem.attribute_name")
        .field-group
          .field.is-horizontal
            label.label 参数
            .control
              .field.is-horizontal(v-for="propertyItem in item.attribute_data", v-if="propertyItem.is_optional")
                label.label(v-text="propertyItem.attribute_name")
                .contentcc
                  .control.cc(v-for="attributeItem in propertyItem.attribute_items", v-if="attributeItem.is_optional",)
                    .radio.service-status(v-text="attributeItem.attribute_item_value")
        .field-group(v-if="item.sku_data.length>0")
          .field.is-horizontal.p-r
            label.label SKU设置
            .red-tip (sku价格为0时，将无法进行上架)
        .table-wrapper
          table.table.table-content
            thead
              tr
                td(width="100") SKU名称
                td(width="80") SKU图
                td(width="80") SKU价格（建议）
                td(width="50") 详情图
            tbody
              tr(v-for="(sku, index) in item.sku_data", v-if="sku.is_enabled === 1")
                td
                  .simple-td(v-text="sku.value")
                td
                  .simple-td
                    open-image(img-type="1",:img-url="sku.sku_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="2")
                td
                  .simple-td
                    span(v-if="sku.sell_price === 0") —
                    span(v-else) ￥ {{sku.sell_price / 100}}
                td
                  .simple-td(:class="{'a-text': sku.content && sku.content.length > 0}", @click="toggleSidePannel(sku.content)", v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
      <!--.btn-wrapper-->
        <!--.button-group-->
          <!--a.button.primary.large(@click="batch(1)") 批量上架-->
          <!--a.button.primary.large(@click="batch(2)") 批量下架-->
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
</template>

<script>
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import UploadImgBox from '@/components/generics/form/UploadImgModel'
  import UploadPic from '@/components/generics/form/UploadPic'
  import RichEditor from '@/components/generics/form/RichEditor'
  import {validationMixin} from 'vuelidate'
  import imageScale from '@/mixins/utilities/imageScale'
  import bossApi from '@/mixins/modules/boss'
  import ImageDetail from '@/components/commodityServiceManagement/ImageDetail'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import OpenImage from '@/components/generics/OpenImage'
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'GoodSpuDetail',
    mixins: [validationMixin, fileUploader, imageScale, bossApi, SeriesApi],
    components: {
      CustomInput,
      CustomSelect,
      RichEditor,
      UploadImgBox,
      UploadPic,
      ImageDetail,
      SlideOutModal,
      OpenImage,
    },
    data () {
      return {
        checkedAll: false,
        selected_item: [],
        // 商品ID
        product_id: '',
        // 新增的产品主图
        new_pic: '',
        // 莫明奇妙数组
        classfiy: '',
        // 控制页面渲染
        pageShow: false,
        // 控制是否可用
        isDisabled: false,
        // 是否加载中
        isLoading: false,
        // sku列表
        skuList: [],
        // 默认图片
        defaultImgSrc: '',
        // 选中一级分类
        firstState: null,
        // 一级分类列表
        firstClassList: [],
        // 选中的二级分类
        secondState: null,
        // 二级分类列表
        secondClassList: [],
        // 详情返回的一级分类
        commodityFirstClass: {},
        // 详情返回的二级分类
        commoditySecondClass: {},
        // 详情返回的三级分类
        commodityThirdClass: {},
        // 品牌列表
        allBrandList: [],
        // 品牌项
        brandItem: {},
        // 创建、编辑提交参数
        item: {
          product_name: '',
          brand_id: '',
          product_pics: [],
          category_id: '',
          sku_data: [],
          content: '',
        },
        slideVisible: false,
      }
    },
    watch: {
      'selected_item' () {
        this.checkedAll = false
        let length = 0
        let src = JSON.stringify(this.item.sku_data)
        this.selected_item.forEach(item => {
          if (src.indexOf(JSON.stringify(item)) !== -1) {
            length += 1
          }
        })
        if (length === this.item.sku_data.length) this.checkedAll = true
      },
    },
    async mounted () {
      // 商品ID
      this.product_id = this.$route.query.id
      // 获取商品详情
      this.getData()
      // 控制页面渲染字段
      this.pageShow = true
    },
    methods: {
      /*
      * 批量上下架
      * value 1 上架 2 下架
      * */
      batch (value) {
        if (this.selected_item.length === 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请勾选sku',
          })
          return
        }
        let params = {
          type: value,
        }
        let data = []
        this.selected_item.forEach(sku => {
          data.push({
            spu_id: this.product_id,
            sku_id: sku.sku_id,
            sku_name: this.item.product_name + ' ' + sku.value,
            suggested_price: sku.sell_price,
            sku_pic: sku.sku_pics,
          })
        })
        params.data = data
        this.changeSkuArr(params)
      },
      /*
      * 改变sku状态
      * sku {object} sku对象
      * */
      changeEnable (sku) {
        let params = {
          type: sku.status === 1 ? 2 : 1,
        }
        let data = [{
          spu_id: this.product_id,
          sku_id: sku.sku_id,
          sku_name: this.item.product_name + ' ' + sku.value,
          suggested_price: sku.sell_price,
          sku_pic: sku.sku_pics,
        }]
        params.data = data
        this.changeSkuArr(params)
      },
      /*
      * 上下架接口
      * params {object} 提交参数
      * */
      async changeSkuArr (params) {
        let text = '上架'
        if (params.type === 2) text = '下架'
        try {
          const {response, result} = await this.setSkuStatusApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: text + '成功',
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: text + '出错',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: text + '出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: text + '出错',
            content: `出错啦！错误码：${err}`,
          })
        }
        this.getData()
      },
      // 全选 or 取消
      checkedAllFnc () {
        let _this = this
        if (!this.checkedAll) {
          // 多选
          this.item.sku_data.forEach(item => {
            if (item.sell_price === 0) return
            let has = _this.selected_item.some(obj => obj.sku_id === item.sku_id)
            if (!has) {
              _this.selected_item.push(item)
            }
          })
        } else {
          // 取消
          this.item.sku_data.forEach(item => {
            let index = 0
            let has = _this.selected_item.some((obj, i) => {
              index = i
              return obj.sku_id === item.sku_id
            })
            if (has) {
              _this.selected_item.splice(index, 1)
            }
          })
        }
      },
      // 获取商品详情
      async getData () {
        try {
          let {response, result} = await this.goodDetailApi({spu_id: this.product_id})
          if (response.status === 200 && result.code === 0) {
            this.selected_item = []
            // 格式参数、属性
            result.data.attribute_data.forEach(function (adttributeItem) {
              adttributeItem.is_check = true
              adttributeItem.attribute_items.forEach(function (items) {
                items.is_check = true
              })
            })
            // 格式化详情返回的sku数据
            result.data.sku_data.forEach(function (item) {
              item.value = ''
              item.attribute_item_ids = []
              item.sku_pics = item.sku_pics[0]    //  图片上传地方是字符串，返回是数组，需要转换一下
              item.attribute_items.forEach(function (v) {
                item.value = item.value + (item.value.length === 0 ? '' : '-') + v.attribute_item_value
                item.attribute_item_ids.push(v.attribute_item_id)
              })
              if (item.status === 1) {
                item.is_status = true
              } else {
                item.is_status = false
              }
            })
            // 默认品牌
            this.brandItem = {
              brand_id: result.data.brand_id,
              brand_name: result.data.brand_name,
            }
            // 页面展示数据
            let self = this
            result.data.category_data.forEach(function (item) {
              self.classfiy = item
            })
            this.item = result.data
            this.item.category_data.forEach(function (v) {
              if (v.level === 1) {
                self.commodityFirstClass = v
              }
              if (v.level === 2) {
                self.commoditySecondClass = v
              }
              if (v.level === 3) {
                self.commodityThirdClass = v
              }
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品详情失败',
              content: '获取商品详情发生错误，请稍后再试',
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品详情失败',
            content: `服务异常，请稍后再试（${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      wordLength,
      // 返回按钮
      goBack () {
        this.$router.go(-1)
      },
      // 查看sku详情
      toggleSidePannel (imgs) {
        if (imgs && imgs.length <= 0) {
          return false
        }
        this.slideVisible = !this.slideVisible
        this.currentArray = imgs
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .p-r
    position: relative
    .red-tip
      color red
      font-size 12px
      position absolute
      top: 9px
      left: 64px
  .not-allow
    cursor not-allowed !important
  .a-text
    color #3a8ee6 !important
    cursor pointer
  .nav-back-btn
    position absolute
    top 36px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 44
  .table-content
    width 96% !important
  .service-status
    padding-left 7px
    font-size 13px
    color darker
  .radio + .radio
    margin-left 28px
  .custom-select
    width 600px !important
  .custom-select-commodity
    margin-right 20px
  .service-status
    margin-right 20px
  .sku-img:not(:first-child)
    margin-top 10px
  .sku-img
    display flex
    align-items center
  .sku-img>.upload-pic
    width 60px !important
    height 60px !important
  .picture-description
    font-size 12px
    line-height 16px
    color lightGrey
    white-space nowrap
    margin-top 8px
  .rich-eidtor-description
    margin-bottom 8px
  .pic-block img
    width 88px
    height 88px
  .pic-block:not(:first-child)
    margin-right 20px
  .contentcc
    width 100%
    .cc
      float left
      margin-bottom 10px
      margin-left 10px
  .sts
    color gray
    font-size 12px
    padding-left 30px
  .fl
    float left
  .clearfix:after
    display block
    content ''
    clear both
    height 0
  .sku-title
    padding-top 8px
    width 900px
    .title
      float left
      width 150px
      font-size 12px
      line-height 16px
      color #666
</style>

