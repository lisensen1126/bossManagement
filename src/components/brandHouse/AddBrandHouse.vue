<template lang="pug">
  .section-layout
    .content-wrapper
      h2(v-if="edit===1") 添加品牌馆
      h2(v-if="edit===2") 编辑品牌馆
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 品牌馆名称
            custom-input(v-model="item.name", input-type="hasCount", placeholder="请输入品牌馆名称", :validator="$v.item.name", error-info="服务名称必填并且小于十五字", :is-disabled="isLoading || isDisabled")
              span(slot="countInfo") {{wordLength(item.name)}}/15
          .field.is-horizontal
            label.label 品牌馆封面图
            .control.upLoad-image
              upload-pic(v-model="item.cover", img-type="item.cover",img-id="1")
          .field.is-horizontal
            label.label 品牌馆介绍封面图
            .control.upLoad-image
              upload-pic(v-model="item.description_cover", img-type="item.description_cover",img-id="2")
          .field.toggle-group.is-horizontal
            label.label 品牌
            custom-select(v-model="item.brand", :list="brand_list",  nameField="brand_name", :validator="$v.item.brand.brand_id", error-info="品牌必选", :is-disabled="isLoading || isDisabled", @input="changeBrand", :show-search="true")
            //:validator="$v.item.category", error-info="请选择品牌",
          .field.is-horizontal
            label.label 品牌简介
            .control
              custom-textarea.textarea(placeholder="请输入该服务的详细描述", v-model="item.brand.content", :is-disabled="true")
          .field.is-horizontal
            label.label 是否开启车型匹配
            .switch
              input(type="checkbox", id="s02", v-model="item.is_open_vehicle")
              label(for="s02")
          .field.is-horizontal
            label.label 广告图
            .control.upLoad-image
              upload-pic(v-model="item.ad", img-type="item.ad",img-id="3")
          .field.is-horizontal
            label.label 广告内容
            .control.image-wrapper
              .upload-pic(v-for="(cell, index) in item.ad_content")
                upload-img-model(v-model="item.ad_content[index]", img-type="item.ad_content", :has-second-action="true", @other="deleteImage")
              .upload-pic
                upload-img-model(v-model="item.ad_content[item.ad_content.length]", img-type="item.ad_content", :has-second-action="true", @other="deleteImage")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData", :class="{'disabled': isDisabled || isLoading}" v-if="edit === 1") 添加品牌库
          a.button.primary.large(@click="inspectData", :class="{'disabled': isDisabled || isLoading}" v-if="edit === 2") 保存
          a.button.large(@click="goBack") 返回

</template>

<script>
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import UploadImgBox from '@/components/generics/form/UploadImgModel'
import bossApi from '@/mixins/modules/boss'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import BrandApi from '@/mixins/modules/BrandHouse'
import CustomTextarea from '@/components/generics/form/CustomTextarea'

/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description 添加/修改服务
   */
  name: 'AddBrandHouse',
  mixins: [validationMixin, bossApi, fileUploader, BrandApi],
  components: {
    CustomInput,
    UploadPic,
    RichEditor,
    CustomSelect,
    UploadImgBox,
    uploadImgModel,
    CustomTextarea,
  },
  data () {
    return {
      edit: 0,
      id: '',
      isDisabled: false,
      isLoading: false,
      showSelector: false,
      // 默认图片
      defaultImgSrc: '',
      brand_list: [],
      item: {
        brand: {
          brand_id: '',
          content: '',
        }, // 品牌库品牌
        name: '', // 品牌馆名称
        cover: '', // 品牌馆封面图
        ad: '', // 广告图片
        description_cover: '', // 品牌馆介绍封面图
        ad_content: [], // 广告内容
        is_open_vehicle: true, // 是否开启匹配车型
      },
    }
  },
  methods: {
    wordLength,
    /*
    *  改变品牌
    *  @ q 选择的品牌
    * */
    changeBrand (q) {
      let obj = this.item
      obj.brand = q
      this.item = {}
      this.item = obj
    },
    // 删除图片
    deleteImage (url) {
      const index = this.item.ad_content.findIndex(val => val === url)
      this.item.ad_content.splice(index, 1)
    },
    // 返回操作
    goBack () {
      this.$router.go(-1)
    },
    // 创建服务
    inspectData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      if (this.item.cover === undefined || this.item.description_cover === undefined) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '品牌馆封面图和介绍封面图必填',
        })
        return
      }
      let params = {
        name: this.item.name,
        brand_id: this.item.brand.brand_id,
        cover: this.item.cover,
        description_cover: this.item.description_cover,
        brand_name: this.item.brand.brand_name,
        ad: this.item.ad === undefined ? '' : this.item.ad,
        ad_content: this.item.ad_content,
        brand_description: this.item.brand.content,
        is_open_vehicle: this.item.is_open_vehicle ? 1 : 0,
      }
      if (this.edit === 2) {
        params.id = this.id
      }
      this.saveData(params)
    },
    /*
    * 添加和编辑
    * @ params 提交参数
    * */
    async saveData (params) {
      try {
        const { result, response } = await this.addBrandHouse(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: this.edit === 1 ? '添加成功' : '编辑成功',
              resolve: () => {
                // 返回上一级
                this.$router.replace({
                  name: 'brandHouseList',
                  query: {
                    save: 1,
                  },
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: this.edit === 1 ? '添加失败' : '编辑失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: this.edit === 1 ? '添加失败' : '编辑失败',
            content: '创建发生错误，请稍后再试',
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
    // 获取详情
    async getDetail () {
      try {
        const { response, result } = await this.getHouseDetail({
          id: this.id,
        })
        if (response.status === 200 && result.code === 0) {
          this.item = result.data
          let cell = null
          this.brand_list.forEach(item => {
            if (item.brand_id === result.data.brand_id) {
              cell = item
            }
          })
          if (cell) {
            this.item.brand = cell
          } else {
            this.item.brand = {
              content: this.item.brand_brand_description,
              brand_name: this.item.brand_name,
              brand_id: this.item.brand_id,
            }
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌馆详情失败',
            content: '获取品牌馆详情发生错误，请稍后再试',
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌馆详情失败',
          content: `服务异常，请稍后再试（${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    // 获取品牌列表
    async getbrandList () {
      try {
        let { response, result } = await this.brandList({
          is_page: 2,
          source_type: 1,
        })
        if (response.status === 200 && result.code === 0) {
          this.brand_list = result.data
          if (this.edit === 2) {
            this.getDetail()
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: '获取品牌列表发生错误，请稍后再试',
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.getbrandList()
    this.edit = Number(this.$route.query.edit)
    if (this.edit === 2) {
      this.id = Number(this.$route.query.brand_id)
    }
  },
  validations: {
    item: {
      brand: {
        brand_id: {
          required,
        },
      },
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 15
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.service-status {
  padding-left: 7px;
  font-size: 13px;
  color: darker;
}

.radio + .radio {
  margin-left: 28px;
}

.custom-select-commodity {
  margin-right: 20px;
}

.picture-description {
  font-size: 12px;
  line-height: 16px;
  color: lightGrey;
  white-space: nowrap;
  margin-top: 8px;
}

.rich-eidtor-description {
  margin-bottom: 8px;
}

.service-categroy-picker {
  width: 100%;
}

.field-content {
  font-size: 13px;
  line-height: 16px;
  color: #353535;
}

.pic-block img {
  width: 88px;
  height: 88px;
}

.pic-block:not(:first-child) {
  margin-right: 20px;
}

.upload-pic {
  display: inline-block;
  margin-top: 4px;
  width: 88px;
  height: 88px;
  margin-right: 8px;
}

.cus_imgs {
  display: flex;

  .img {
    margin-right: 5px;
  }
}
</style>
