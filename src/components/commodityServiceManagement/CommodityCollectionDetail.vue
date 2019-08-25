<template lang="pug">
  .section-layout
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
              .field.is-horizontal(v-for="propertyItem in item.attribute_data")
                label.label(v-text="propertyItem.attribute_name", v-if="propertyItem.is_optional")
                .contentcc
                  .control.cc(v-for="attributeItem in propertyItem.attribute_items", v-if="attributeItem.is_optional",)
                    .radio.service-status(v-text="attributeItem.attribute_item_value")
        .field-group(v-if="item.sku_data.length>0")
          .field.is-horizontal
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格(建议)
                .title.fl.width-200.p-l-40 详情图
                .title.fl.width-80 状态
              .sku-box(v-for="(sku, indexItem) in item.sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0(v-if="sku.sku_pics && sku.sku_pics.length>0")
                  open-image(img-type="1",:img-url="sku.sku_pics",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="2")
                .fl.sku-txt(v-else) 暂无内容
                .sku-price.sts
                  span(v-if="sku.sell_price === 0") —
                  span(v-else) ￥ {{sku.sell_price / 100}}
                .sku-txt.width-200.p-l-40
                  .fl.m-r-20(:class="{'a-text': sku.content && sku.content.length > 0}", @click="toggleSidePannel(sku.content)", v-text="sku.content && sku.content.length > 0 ? '查看':'暂无内容'")
                .sku-txt(v-text="sku.is_enabled === 1 ? '已启用':'已禁用'")
        <!--.field-group-->
          <!--.field.is-horizontal-->
            <!--label.label 图文详情-->
            <!--.control-->
              <!--.picture-description.rich-eidtor-description 商文详情页下拉显示的商品描述图文，建议图片宽度不小于720px-->
              <!--rich-editor(v-model="item.content", :is-disabled="true")-->
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
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

  /**
   * @vue
   */
  export default {
    /**
     * @author caihaotian
     * @description 创建/编辑商品
     */
    name: 'commodityCollectionDetail',
    mixins: [validationMixin, fileUploader, imageScale, bossApi],
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
        // 选中的三级分类
        thirdState: null,
        // 三级分类列表
        thirdClassList: [],
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
    async mounted () {
      // 商品ID
      this.product_id = this.$route.query.id
      // 获取商品详情
      this.getData()
      // 控制页面渲染字段
      this.pageShow = true
    },
    methods: {
      // 获取商品详情
      async getData () {
        try {
          let {response, result} = await this.commodityDetail({product_id: this.product_id})
          if (response.status === 200 && result.code === 0) {
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
  .sku-box {
    display: flex;
    align-items: center;
    margin-top: 20px;
    .sku-txt {
      width: 150px;
      font-size: 12px;
      color: #888;
      padding-right: 20px;
    }
    .sku-img {
      width: 60px;
      height: 60px;
      margin-right: 20px;
    }
    .sku-price {
      width: 160px;
    }
  }
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
  /*new*/
  .m-l-0
    margin-left 0 !important
  .m-r-0
    margin-right 0 !important
  .m-r-20
    margin-right 20px
  .p-l-40
    padding-left 40px
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
  .width-100
    width 100% !important
  .width-200
    width 200px !important
  .width-150
    width 150px !important
  .width-160
    width 160px !important
  .width-80
    width 80px !important
  .a-text
    color #3a8ee6 !important
    cursor pointer
</style>
