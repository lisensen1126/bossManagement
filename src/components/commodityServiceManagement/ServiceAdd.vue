<template lang="pug">
  .section-layout
    .content-wrapper
      h2 添加服务
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务名称
            custom-input(v-model="item.product_name", input-type="hasCount", placeholder="请输入服务名称", :validator="$v.item.product_name", error-info="服务名称必填并且小于二十位", :is-disabled="is_loading || is_disabled")
              span(slot="countInfo") {{wordLength(item.product_name)}}/20
          .field.is-horizontal
            label.label 服务图示
            .control.upLoad-image
              upload-pic(v-model="item.product_pic", img-type="item")
              .picture-description 服务图示，用于服务详情页顶部大图、所有列表页缩略图，建议尺寸不小于720*540px
          .field.toggle-group.is-horizontal
            label.label 品牌
            custom-select(v-model="brand_item", nameField="brand_name", :list="all_brand_list", :show-search="true")
          .field.toggle-group.is-horizontal
            label.label 服务分类
            //- custom-select(v-model="item.category", :list="category_list", :validator="$v.item.category", error-info="请选择服务分类", nameField="category_name", :is-disabled="is_loading || is_disabled")
            custom-select.custom-select-commodity(v-model="first_state", @input="first_stateChange", nameField="category_name", :list="first_class_list")
            custom-select.custom-select-commodity(v-model="item.category", nameField="category_name", :list="second_class_list", :validator="$v.item.category", error-info="请选择",)
          .field.is-horizontal
            label.label 建议价格
            .control
              custom-input.package-price(input-type="hasUnit",need-type='float', v-model="item.sell_price", :validator="$v.item.sell_price", error-info="请输入大于0小于99999的价格精确到小数点后2位")
                span(slot="unitName") 元
          .field.is-horizontal
            label.label 服务简述
            .control
              textarea.textarea(placeholder="请输入该服务的详细描述（50汉字以内）", maxlength=50, v-model="item.summary")
          .field.is-horizontal
            label.label 服务详情
            .control.image-wrapper
              .upload-pic(v-for="(cell, index) in item.content")
                upload-img-model(v-model="item.content[index]", img-type="item", :has-second-action="true", @other="deleteImage", need-move="2", @leftMove="leftPic('item', index)", @rightMove="rightPic('item',index)", :need-left="index !== 0", :need-right="index !== (item.content.length -1)")
              .upload-pic
                upload-img-model(v-model="item.content[item.content.length]", img-type="item", :has-second-action="true", @other="deleteImage")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData(1)", :class="{'disabled': is_disabled || is_loading}") 保存
          a.button.primary.large(@click="inspectData(2)", :class="{'disabled': is_disabled || is_loading}") 保存并上架
          a.button.large(@click="goBack") 返回

</template>

<script>
import {wordLength, priceFormat} from '@/mixins/custom-validators/custom-validators'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import {validationMixin} from 'vuelidate'
import {required, between} from 'vuelidate/lib/validators'
import UploadImgBox from '@/components/generics/form/UploadImgModel'
import bossApi from '@/mixins/modules/boss'
import uploadImgModel from '@/components/store/modal/uploadImgModel'


/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description 添加/修改服务
   */
  name: 'ServiceAdd',
  mixins: [validationMixin, bossApi, fileUploader],
  components: {
    CustomInput,
    UploadPic,
    RichEditor,
    CustomSelect,
    UploadImgBox,
    uploadImgModel,
  },
  data () {
    return {
      new_pic: '',
      is_disabled: false,
      is_loading: false,
      show_selector: false,
      // 默认图片
      default_img_src: '',
      category_list: [],
      // 选中一级分类
      first_state: null,
      // 一级分类列表
      first_class_list: [],
      // 选中的二级分类
      second_state: null,
      // 二级分类列表
      second_class_list: [],
      // 品牌列表
      all_brand_list: [],
      // 品牌项
      brand_item: {},
      item: {
        sell_price: '', // 建议价格
        product_name: '', // 名称
        category: {}, // 分类
        summary: '', // 服务描述
        product_pic: '', // 服务图示
        content: [], // 服务详情
      },
    }
  },
  methods: {
    wordLength,
    // 向左
    leftPic (type, index) {
      let list = this.item.content
      this.item.content = []
      let now = list[index]
      let left = list[index - 1]
      list[index] = left
      list[index - 1] = now
      this.item.content = list
    },
    // 向右
    rightPic (type, index) {
      let list = this.item.content
      this.item.content = []
      let now = list[index]
      let left = list[index + 1]
      list[index] = left
      list[index + 1] = now
      this.item.content = list
    },   
    // 删除图片
    deleteImage (url) {
      const index = this.item.content.findIndex(val => val === url)
      this.item.content.splice(index, 1)
    },

    // 返回操作
    goBack () {
      this.$router.go(-1)
    },

    // 创建服务
    inspectData (state) {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.item.product_name = this.item.product_name.replace(/(^\s*)|(\s*$)/g, '')
      if (this.$v.item.category.$error || this.$v.item.product_name.$error) {
        return false
      }
      if (this.item.product_pic === undefined) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '服务图片必填',
        })
        return false
      }
      // if (this.item.content === '') {
      //   this.$store.dispatch('showMessage', {
      //     type: 'warning',
      //     title: '警告',
      //     content: '服务简述必填',
      //   })
      //   return false
      // }
      this.saveData(state)
    },

    async saveData (state) {
      try {
        let params = {
          product_name: this.item.product_name,
          category_ids: [this.item.category.category_id],
          product_pics: [this.item.product_pic],
          content: this.item.content,
          summary: this.item.summary,
          sell_price: this.item.sell_price * 100,
          brand_id: this.brand_item.brand_id,
        }
        const {result, response} = await this.serviceAdd(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (state === 1) {
              this.$store.dispatch('showMessage', {
                autoClose: true,
                type: 'success',
                title: '添加成功',
                resolve: () => {
                  this.$router.go(-1)
                },
              })
            } else {
              this.setSelaState(result.data)
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建失败',
            content: '商品创建发生错误，请稍后再试',
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // 选择一级分类，赋值二级分类
    first_stateChange () {
      if (this.first_state.category_id) {
        // 一级分类更改，二级三级分类初始化
        this.second_class_list = []
        this.item.category = {}
        this.getClassifyList(this.first_state.category_id, 2)
      }
    },

    // 分类列表
    async getClassifyList (parentId, type) {
      try {
        let {response, result} = await this.classifyList({
          type: 2,
          parent_id: parentId,
        })
        if (response.status === 200 && result.code === 0) {
          if (result.data.length > 0) {
            if (result.data[0].level === 1) {
              this.first_class_list = result.data
            } else if (result.data[0].level === 2) {
              this.second_class_list = result.data
            } else {
              this.thirdClassList = result.data
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

    // 品牌列表
    async getBrandList () {
      let self = this
      try {
        let {response, result} = await this.brandList({
          is_page: 2,
          source_type: 1,
        })
        if (response.status === 200 && result.code === 0) {
          self.all_brand_list = result.data
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

    // 上下架操作
    async setSelaState (param) {
      try {
        const { response, result } = await this.serviceUpdateSale({
          product_ids: [param.product_id],
          is_sale: 1,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true,
              type: 'success',
              title: '保存并上架成功',
              resolve: () => {
                this.$router.replace({
                  name: 'serviceManagement',
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '上架失败',
              content: '上架服务，价格不能为0',
              resolve: () => {
                this.$router.replace({
                  name: 'serviceEdit',
                  query: {
                    id: param.product_id,
                    isEdit: true,
                  },
                })
              }
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.getClassifyList(0, 2)
    this.getBrandList()
  },
  validations: {
    item: {
      summary: {
        validate (val) {
          return wordLength(val) < 50
        },
      },
      category: {
        required,
      },
      product_name: {
        required,
        validate (val) {
          return this.wordLength(val.replace(/(^\s*)|(\s*$)/g, '')) <= 20
        },
      },
      sell_price: {
        between: between(0.01, 99999),
        priceFormat,
      },
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
.custom-select-commodity
  margin-right 20px
.picture-description
  font-size 12px
  line-height 16px
  color lightGrey
  white-space nowrap
  margin-top 8px

.rich-eidtor-description
  margin-bottom 8px

.service-categroy-picker
  width 100%
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.pic-block img
  width 88px
  height 88px
.pic-block:not(:first-child)
  margin-right 20px
.upload-pic
  display inline-block
  margin-top 4px
  width 88px
  height 88px
  margin-right 8px
.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}
</style>
