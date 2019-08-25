<template lang="pug">
  .section-layout
    .content-wrapper
      h2(v-if="this.product_id") 编辑商品
      h2(v-if="!this.product_id") 创建商品
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 商品名称
            custom-input(v-model="item.product_name", input-type="hasCount",
            :validator="$v.item.product_name", error-info="商品名称必填并且小于二十位", placeholder="请输入商品名称")
              span(slot="countInfo") {{wordLength(item.product_name)}}/20
          .field.is-horizontal
            label.label 商品品牌
            custom-select(v-model="brandItem", nameField="brand_name", :list="allBrandList", :show-search="true")
          .field.is-horizontal
            label.label 商品主图
            .image-wrapper
              .upload-pic(v-for="(picItem, index) in item.product_pics", v-if="item.product_pics.length>0")
                upload-img-box(v-model="item.product_pics[index]", :img-id="index + 1", img-type="item", :has-second-action="true", @other="deleteImage")
              .upload-pic
                upload-pic(v-if="item.product_pics.length<5", v-model="new_pic", :default-img="defaultImgSrc", img-type="item")
          .field.is-horizontal
            label.label
            .picture-description.rich-eidtor-description 商品图示，用于商品详情页顶部大图、所有列表页缩略图，建议尺寸不小于720*540px
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            span(v-text="item.category_data && item.category_data[0]")
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
        .field-group
          .field.is-horizontal
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格(建议)
                .title.fl.width-200.p-l-40 详情图
                .title.fl.width-80 启用/禁用
              .sku-box(v-for="(sku, indexItem) in item.sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-model="sku.sku_pics", :img-id="indexItem + 1", :default-img="defaultImgSrc", img-type="sku",:need-default='need_default')
                .sku-price
                  custom-input(input-type="hasUnit", need-type='float', placeholder="请输入建议价格", v-model="sku.sell_price",)
                    span(slot="unitName") 元
                .sku-txt.width-200.p-l-40
                  .a-text.fl.m-r-20(v-show="!sku.isFlag", @click="openImage(indexItem)") 上传
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="editImage(indexItem,sku.content)") 编辑
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="toggleSidePannel(sku.content)") 查看
                  //- .a-text.fl.m-r-20(v-show="sku.isFlag", @click="delcontent(indexItem)") 删除
                  <!--.a-text.fl.m-r-20 编辑-->
                .switch
                  input(type="checkbox", :id="indexItem", v-model="sku.isEnabled", @change="changeEnable(sku)")
                  label(:for="indexItem")
        <!--.field-group-->
          <!--.field.is-horizontal-->
            <!--label.label 图文详情-->
            <!--.control-->
              <!--.picture-description.rich-eidtor-description 商文详情页下拉显示的商品描述图文，建议图片宽度不小于720px-->
              <!--rich-editor(v-model="item.content", :is-disabled="isLoading")-->
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData(1)", :class="{'disabled': isLoading}") 保存
          a.button.primary.large(@click="saveData(2)", :class="{'disabled': isLoading}") 保存并上架
          a.button.large(@click="goBack") 返回
    select-image(v-model="openFlag", v-if="openFlag", @resolve="getImageArray", :index="currentIndex", :current-image-array="openImages")
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
import {required} from 'vuelidate/lib/validators'
import SelectImage from '@/components/generics/SelectImage'
import ImageDetail from '@/components/commodityServiceManagement/ImageDetail'
import SlideOutModal from '@/components/generics/SlideOutModal'


/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description 创建/编辑商品
   */
  name: 'commodityEdit',
  mixins: [validationMixin, fileUploader, imageScale, bossApi],
  components: {
    CustomInput,
    CustomSelect,
    RichEditor,
    UploadImgBox,
    UploadPic,
    SelectImage,
    ImageDetail,
    SlideOutModal,
  },
  data () {
    return {
      // 商品ID
      product_id: '',
      // 新增的产品主图
      new_pic: '',
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
      need_default: true,
      openFlag: false,
      currentArray: [],
      slideVisible: false,
      openImages: [],
    }
  },
  async mounted () {
    // 商品ID
    this.product_id = this.$route.query.id
    // 获取商品详情
    this.getData()
    // 请求一级分类列表
    // this.getClassifyList(0, 1)
    // 获取商品品牌列表
    this.getBrandList()
  },
  methods: {
    // 获取商品详情
    async getData () {
      this.isLoading = true
      try {
        let {response, result} = await this.commodityDetail({product_id: this.product_id})
        if (response.status === 200 && result.code === 0) {
          // 格式化详情返回的sku数据
          result.data.sku_data.forEach(function (item) {
            item.value = ''
            item.attribute_item_ids = []
            item.sku_pics = item.sku_pics[0]    //  图片上传地方是字符串，返回是数组，需要转换一下
            item.sell_price = item.sell_price / 100
            item.is_enabled === 1 ? item.isEnabled = true : item.isEnabled = false
            item.content && item.content.length === 0 ? item.isFlag = false : item.isFlag = true
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
          this.need_default = false
          // 页面展示数据
          this.item = result.data
          this.isLoading = false
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
            content: result.message,
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
    // 删除图片
    deleteImage (url) {
      const index = this.item.product_pics.findIndex(val => val === url)
      this.item.product_pics.splice(index, 1)
    },
    wordLength,
    // 品牌列表
    async getBrandList () {
      let self = this
      try {
        let {response, result} = await this.brandList({
          is_page: 2,
          source_type: 1,
        })
        if (response.status === 200 && result.code === 0) {
          self.allBrandList = result.data
          self.allBrandList.forEach(function (brand) {
            if (brand.brand_id === self.item.brand_id) {
              self.brandItem = brand
            }
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: result.message,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    goBack () {
      this.$router.replace({
        name: 'commodityManagement',
      })
    },
    // 保存编辑内容
    async saveData (state) {
      this.item.product_name = this.item.product_name.replace(/(^\s*)|(\s*$)/g, '')
      this.$v.item.$touch()
      if (this.$v.item.product_name.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return false
      }
      if (this.item.product_pics.length === 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '请上传商品主图',
        })
        return false
      }
      if (this.item.sku_data.length > 0) {
        var enabledArray = []
        for (let i = 0; i < this.item.sku_data.length; i++) {
          enabledArray.push(this.item.sku_data[i].is_enabled)
        }
        if (enabledArray.indexOf(1) === -1) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '至少启用一个SKU',
          })
          return
        }
      }
      let skuList = []
      this.item.sku_data.forEach(function (skuItem) {
        var item = {
          sku_pics: [skuItem.sku_pics],    // skuItem.sku_pics sku不传图片是个空字符，后端需要空数组
          attribute_item_ids: skuItem.attribute_item_ids,
          sell_price: skuItem.sell_price === '' ? 0 : Number(skuItem.sell_price) * 100,
          content: skuItem.content,
          is_enabled: skuItem.is_enabled,
          sku_id: skuItem.sku_id,
        }
        if (item.sku_pics[0] === '') item.sku_pics = []     // skuItem.sku_pics sku不传图片是个空字符，后端需要空数组 转换空数组
        skuList.push(item)
      })
      let params = {
        product_id: this.item.product_id,
        product_name: this.item.product_name,
        brand_id: this.brandItem.brand_id,
        product_pics: this.item.product_pics,
        category_ids: this.item.category_ids,
        sku_data: skuList,
        content: this.item.content,
      }
      let {response, result} = await this.commodityEdit(params)
      if (response.status === 200) {
        if (result.code === 0) {
          if (state === 1) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑成功',
              resolve: () => {
                this.$router.replace({
                  name: 'commodityManagement',
                  query: {
                    save: 1,
                  },
                })
              },
            })
          } else {
            this.setShopStatus(this.item.product_id)
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑失败',
            content: `${result.message}`,
          })
        }
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '编辑失败',
          content: '商品创建发生错误，请稍后再试',
        })
      }
    },
    // 修改属性
    dattributeChang (val) {
      let arrA = []
      val.forEach(item => {
        if (!item.is_check) {
          return false
        }
        let arrO = []
        item.attribute_items.forEach(prop => {
          if (!prop.is_check) {
            return false
          }
          let obj = {
            key: prop.attribute_item_id,
            value: prop.attribute_item_value,
          }
          arrO.push(obj)
        })
        arrA.push(arrO)
      })
      this.item.sku_data = this.outputSKU(...arrA)
    },
    // 格式化
    outputSKU (...props) {
      if (props.length > 1) {
        let [one, two, tempArr] = [props[0], props[1], []]
        for (let i = 0; i < one.length; i++) {
          for (let j = 0; j < two.length; j++) {
            let obj = {
              value: one[i].value + '-' + two[j].value,
              sku_pics: '',
              price: '',
              attribute_item_ids: [],
            }
            let ooo = one[i]
            if (one[i].attribute_item_ids && one[i].attribute_item_ids.length) {
              obj.attribute_item_ids = [...ooo.attribute_item_ids]
              obj.attribute_item_ids.push(two[j])
            } else {
              obj.attribute_item_ids.push(one[i])
              obj.attribute_item_ids.push(two[j])
            }
            tempArr.push(obj)
          }
        }
        props.splice(0, 2, tempArr)
        return this.outputSKU(...props)
      }
      return props[0]
    },
    // 打开上传详情弹窗
    openImage (index, imgs) {
      this.openFlag = true
      this.currentIndex = index
      this.openImages = []
    },
    // 编辑sku详情
    editImage (index, imgs) {
      this.openFlag = true
      this.currentIndex = index
      this.openImages = imgs
    },
    // 上传详情弹窗回调
    getImageArray (index, imageArray) {
      this.item.sku_data[index].content = imageArray
      this.item.sku_data[index].isFlag = true
    },
    // 删除sku图片详情
    delcontent (index) {
      this.item.sku_data[index].content = []
      this.item.sku_data[index].isFlag = false
    },
    // 查看sku详情
    toggleSidePannel (imgs) {
      this.slideVisible = !this.slideVisible
      this.currentArray = imgs
    },
    // 启用禁用状态改变
    changeEnable (flag) {
      flag.isEnabled ? flag.is_enabled = 1 : flag.is_enabled = 2
    },
    // 保存并上架
    async setShopStatus (param) {
      try {
        let { response, result } = await this.commodityUpdateSale({
          product_ids: [param],
          is_sale: 1,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.product_ids.length > 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `上架失败`,
                content: '失败原因：商品sku信息不完整，请完善信息',
              })
            } else {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存并上架成功',
                resolve: () => {
                  this.$router.replace({
                    name: 'commodityManagement',
                    query: {
                      save: 1,
                    },
                  })
                },
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改商品状态失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改商品状态失败',
            content: '修改商品状态错误，请稍后再试',
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
  },
  // 表单验证
  validations: {
    item: {
      product_name: {
        required,
        validate (val) {
          return this.wordLength(val.replace(/(^\s*)|(\s*$)/g, '')) <= 20
        },
      },
    },
    brandItem: {
      required,
    },
  },

  // 一期暂时不需要编辑商品分类  此功能保留
  watch: {
    // 图片上传
    new_pic () {
      if (this.new_pic === '') {
        return
      }
      this.item.product_pics.push(this.new_pic)
      this.new_pic = ''
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.image-wrapper
  display flex
  flex-direction row
  .upload-banner + .upload-banner
    margin-left 8px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
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
.ccss
  color: gray
  font-size 12px
  width 60px
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
