<template lang="pug">
  .section-layout
    .content-wrapper
      h2 创建商品
      .form-wrapper(v-if="pageShow")
        .field-group
          .field.is-horizontal
            label.label 商品名称
            custom-input(v-model="item.product_name", input-type="hasCount",
            :validator="$v.item.product_name", error-info="商品名称必填并且小于二十位", placeholder="请输入商品名称")
              span(slot="countInfo") {{wordLength(item.product_name)}}/20
          .field.is-horizontal
            label.label 商品品牌
            custom-select(v-model="brandItem", :validator="$v.brandItem", error-info="商品品牌必选", nameField="brand_name", :list="allBrandList", :show-search="true", @input="changeBrand")
          .field.is-horizontal
            label.label 商品主图
            .control.image-wrapper
              .upload-pic(v-for="(picItem, index) in item.product_pics", v-if="item.product_pics.length>0")
                upload-img-box(v-model="item.product_pics[index]", img-type="item", :has-second-action="true", @other="deleteImage")
              .upload-pic
                upload-pic(v-if="item.product_pics.length<5", v-model="new_pic", :default-img="defaultImgSrc", img-type="item")
          .field.is-horizontal
            label.label
            .picture-description.rich-eidtor-description 商品图示，用于商品详情页顶部大图、所有列表页缩略图，建议尺寸不小于720*540px
          .field.toggle-group.is-horizontal.custom-select
            label.label 商品分类
            custom-select.custom-select-commodity(v-model="firstState", @input="firstStateChange", nameField="category_name", :list="firstClassList", :validator="$v.firstState", error-info="请选择商品分类",)
            custom-select.custom-select-commodity(v-model="secondState", @input="secondStateChange", nameField="category_name", :list="secondClassList", :validator="$v.secondState", error-info="请选择商品分类",)
            //- custom-select.custom-select-commodity(v-model="thirdState", @input="thirdStateChange", nameField="category_name", :list="thirdClassList", :validator="$v.thirdState", error-info="请选择商品分类",)
        .field-group(v-show="item.category_id")
          .field.is-horizontal
            label.label 属性
            .control-box
              .control.controlcc(v-for="propertyItem in item.dattribute_data")
                .switch
                  input(type="checkbox", :id="propertyItem.attribute_name", v-model="propertyItem.is_check", @change="dattributeItem(propertyItem)")
                  label(:for="propertyItem.attribute_name")
                .radio.service-status(v-text="propertyItem.attribute_name")
        .field-group(v-if="item.category_id")
          .field.is-horizontal
            label.label 参数
            .control
              .field.is-horizontal(v-for="propertyItem in item.dattribute_data", v-if="propertyItem.is_check")
                label.label(v-text="propertyItem.attribute_name")
                .contentcc
                  .control.cc(v-for="attributeItem in propertyItem.attribute_items")
                    .switch
                      input(type="checkbox", :id="attributeItem.attribute_item_id", v-model="attributeItem.is_check", @change="dattributeChang(item.dattribute_data)")
                      label(:for="attributeItem.attribute_item_id")
                    .radio.service-status(v-text="attributeItem.attribute_item_value")
        .field-group(v-if="item.category_id && item.sku_data.length>0")
          .field.is-horizontal.width-100
            label.label SKU设置
            .control
              .sku-title.clearfix
                .title.fl SKU名称
                .title.fl SKU图
                .title.fl.width-160 SKU价格(建议)
                .title.fl.width-200.p-l-40 详情图
                .title.fl.width-80 启用/禁用
              .sku-box(v-for="(sku, index) in item.sku_data")
                .sku-txt(v-text="sku.value")
                .sku-img.width-150.m-r-0
                  upload-pic(v-model="sku.sku_pics", :img-id="index", :default-img="defaultImgSrc", img-type="sku")
                .sku-price
                  custom-input(input-type="hasUnit", need-type='float', placeholder="请输入建议价格", v-model="sku.sell_price",)
                    span(slot="unitName") 元
                .sku-txt.width-200.p-l-40
                  .a-text.fl.m-r-20(v-show="!sku.isFlag", @click="openImage(index)") 上传
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="toggleSidePannel(sku.content)") 查看
                  .a-text.fl.m-r-20(v-show="sku.isFlag", @click="delcontent(index)") 删除
                  <!--.a-text.fl.m-r-20 编辑-->
                .switch
                  input(type="checkbox", :id="index", v-model="sku.isEnabled", @change="changeEnable(sku)")
                  label(:for="index")
                <!--.sku-txt.a-text 启用/禁用-->
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData(1)", :class="{'disabled': isLoading}") 保存
          a.button.primary.large(@click="inspectData(2)", :class="{'disabled': isLoading}") 保存并上架
          a.button.large(@click="goBack") 返回
    select-image(v-model="openFlag", v-if="openFlag", @resolve="getImageArray", :index="currentIndex")
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      image-detail(v-if="true", :current-image-array="currentArray")
</template>

<script>
import {wordLength} from '@/mixins/custom-validators/custom-validators'
import fileUploader from '@/mixins/utilities/fileUploader'
import bossApi from '@/mixins/modules/boss'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import UploadImgBox from '@/components/generics/form/UploadImgModel'
import UploadPic from '@/components/generics/form/UploadPic'
import RichEditor from '@/components/generics/form/RichEditor'
import {validationMixin} from 'vuelidate'
import imageScale from '@/mixins/utilities/imageScale'
import {required} from 'vuelidate/lib/validators'
import SelectImage from '@/components/generics/SelectImage'
import ImageDetail from '@/components/commodityServiceManagement/ImageDetail'
import SlideOutModal from '@/components/generics/SlideOutModal'


export default {
  /**
   * @author caihaotian
   * @description 创建/编辑商品
   */
  name: 'commodityAdd',
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
      // 品牌列表
      allBrandList: [],
      // 品牌项
      brandItem: {},
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
      // thirdClassList: [],
      // 详情返回的一级分类
      commodityFirstClass: {},
      // 详情返回的二级分类
      commoditySecondClass: {},
      // 详情返回的三级分类
      commodityThirdClass: {},
      // 创建、编辑提交参数
      item: {
        product_name: '',
        brand_name: '',
        brand_id: '',
        product_pics: [],
        category_id: '',
        dattribute_data: [],
        sku_data: [],
        content: '',
      },
      openFlag: false,
      currentArray: [],
      slideVisible: false,
    }
  },
  mounted () {
    // 请求一级分类列表
    this.getClassifyList(0, 1)

    // 获取品牌列表
    this.getBrandList()
    this.pageShow = true
  },
  methods: {

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
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: '获取品牌列表发生错误，请稍后再试',
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

    // 分类列表
    async getClassifyList (parentId, type) {
      try {
        let {response, result} = await this.classifyList({
          type: 1,
          parent_id: parentId,
        })
        if (response.status === 200 && result.code === 0) {
          if (result.data.length > 0) {
            if (result.data[0].level === 1) {
              this.firstClassList = result.data
            } else if (result.data[0].level === 2) {
              this.secondClassList = result.data
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类失败',
            content: '获取商品分类发生错误，请稍后再试',
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },

    // 分类属性列表
    async getClassifyAttrList (categoryId) {
      let self = this
      try {
        const {response, result} = await this.getBrandAttrApi({
          category_id: categoryId,
          brand_id: this.brandItem.brand_id,
          is_all: 1,
        })
        if (response.status === 200 && result.code === 0) {
          self.item.dattribute_data = []
          self.item.dattribute_data = result.data
          if (result.data.length === 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '警告',
              content: '此分类底下暂时没有属性配置，快去商品分类列表添加吧。无属性会导致商品添加失败哦！',
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类属性失败',
            content: '获取分类属性发生错误，请稍后再试',
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类属性列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },

    // 修改属性
    dattributeItem (propertyItem) {
      this.item.dattribute_data.forEach(function (v) {
        if (v.is_check) {
          v.at_items = v.attribute_items
        } else {
          if (v.at_items) {
            v.at_items.forEach(function (m) {
              m.is_check = false
            })
            v.at_items = []
          }
        }
      })
      this.dattributeChang(this.item.dattribute_data)
    },

    // 修改参数
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
      if (arrA.length === 1) {
        this.item.sku_data = this.outputOnlySKU(...arrA)
      } else {
        this.item.sku_data = this.outputSKU(...arrA)
      }
    },

    // 商品属性格式化 大于1
    outputSKU (...props) {
      if (props.length > 1) {
        let [one, two, tempArr] = [props[0], props[1], []]
        for (let i = 0; i < one.length; i++) {
          for (let j = 0; j < two.length; j++) {
            let obj = {
              value: one[i].value + '-' + two[j].value,
              sku_pics: '',
              sell_price: '',
              attribute_item_ids: [],
              isEnabled: true,
              is_enabled: 1,
              isFlag: false,
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

    // sku数量等于1时，格式化
    outputOnlySKU (...props) {
      let prp = props[0]
      let tempArr2 = []
      for (let k = 0; k < prp.length; k++) {
        let obj2 = {
          value: prp[k].value,
          sell_price: '',
          attribute_item_ids: [],
          sku_pics: '',
          isEnabled: true,
          is_enabled: 1,
          isFlag: false,
        }
        obj2.attribute_item_ids.push(prp[k])
        tempArr2.push(obj2)
      }
      return tempArr2
    },

    // 新增商品
    async inspectData (state) {
      this.item.product_name = this.item.product_name.replace(/(^\s*)|(\s*$)/g, '')
      this.$v.$touch()
      if (this.$v.item.product_name.$error || this.$v.brandItem.$error || this.$v.firstState.$error || this.$v.secondState.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
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
      if (this.item.sku_data.length <= 0) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 200)
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择属性或参数',
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
      let array = []
      array = this.item.sku_data
      array.forEach(function (skuItem) {
        var item = {
          sku_pics: skuItem.sku_pics === '' ? [] : [skuItem.sku_pics],
          attribute_item_ids: [],
          sell_price: skuItem.sell_price === '' ? 0 : Number(skuItem.sell_price) * 100,
          content: skuItem.content,
          is_enabled: skuItem.is_enabled,
        }
        let attrArr = []
        attrArr = skuItem.attribute_item_ids
        attrArr.forEach(function (idItem) {
          item.attribute_item_ids.push(idItem.key)
        })
        skuList.push(item)
      })
      let {response, result} = await this.commoditycreate({
        product_name: this.item.product_name,
        brand_id: this.brandItem.brand_id,
        product_pics: this.item.product_pics,
        category_ids: [this.item.category_id],
        sku_data: skuList,
      })
      if (response.status === 200) {
        if (result.code === 0) {
          if (state === 1) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '添加成功',
              resolve: () => this.$router.go(-1),
            })
          } else {
            this.setShopStatus(result.data)
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: '错误' + result.message,
          })
        }
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '网络错误',
          content: '网络出小差了，请稍后再试',
        })
      }
    },

    // 返回按钮
    goBack () {
      this.$router.replace({
        name: 'commodityManagement',
      })
    },

    // 选择一级分类，赋值二级分类
    firstStateChange () {
      if (this.firstState.category_id) {
        // 一级分类更改，二级三级分类初始化
        this.secondClassList = []
        this.secondState = {}
        this.item.category_id = null
        this.item.sku_data = []
        this.getClassifyList(this.firstState.category_id, 2)
      }
    },

    // 选择二级分类，赋值三级分类
    secondStateChange () {
      this.$v.brandItem.$touch()
      if (this.$v.brandItem.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return false
      }
      if (this.secondState.category_id) {
        // 二级分类更改，三级分类初始化
        this.item.sku_data = []
        this.item.category_id = this.secondState.category_id
        this.getClassifyAttrList(this.item.category_id)
      }
    },

    // 打开上传详情弹窗
    openImage (index) {
      this.openFlag = true
      this.currentIndex = index
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

    // 改变品牌的时候将分类, 属性, 参数, SKU设置清空清空
    changeBrand () {
      this.firstState = {}
      this.secondState = {}
      this.item.category_id = null
    },

    // 保存并上架
    async setShopStatus (param) {
      try {
        let { response, result } = await this.commodityUpdateSale({
          product_ids: [param.product_id],
          is_sale: 1,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.product_ids.length > 0) {
              this.$store.dispatch('showMessage', {
                type: 'success',
                title: '上架失败',
                content: '失败原因：商品sku信息不完整，请完善信息',
                resolve: () => {
                  this.$router.replace({
                    name: 'commodityEdit',
                    query: {
                      id: param.product_id,
                    },
                  })
                },
              })
            } else {
              this.$router.replace({
                name: 'commodityManagement',
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
    firstState: {
      required,
    },
    secondState: {
      required,
    },
  },
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
    width: 150px
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
.control-box
  display flex
  flex-wrap wrap
.controlcc
  margin-top 5px

</style>
