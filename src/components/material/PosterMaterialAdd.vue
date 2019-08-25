<template lang="pug">
  .section-layout
    .content-wrapper
      h2 添加海报物料
      .form-wrapper
        .group-title 海报基本信息
        .field-group
          .field.toggle-group.is-horizontal
            label.label 海报类型
            custom-select(v-model="poster_type", :list="type_list", :validator="$v.poster_type.name", error-info="海报类型必选")
          .field.is-horizontal.width-318
            label.label 海报名称
            custom-input(v-model="item.name", placeholder="请输入海报名称", :validator="$v.item.name", error-info="海报名称必填并且小于十位", maxlength="10")
        .group-title 线下海报图片
        .field-group
          .field.is-horizontal
            label.label 海报预览图片
              font(color="red",style="margin-left:5px;line-height: 16px;") *
            .control.upLoad-image
              upload-pic(v-model="item.poster_preview", img-type="item-preview",img-id="item-preview", :max-size="10", :need-default="false")
              .picture-description 建议上传尺寸为2267px*5101px的jpg/png格式文件，文件不能超过10M。
          .field.is-horizontal
            label.label 易拉宝海报图片
            .control.upLoad-image
              upload-pic(v-model="item.poster_rollup.thumbnail_image_url", img-type="item-rollup", img-id="item-rollup", :max-size="60", :is-large="true", :need-default="false", @input="resultData")
              .picture-description 建议上传尺寸为2267px*5101px的jpg/png格式文件，文件不能超过60M。
          .field.is-horizontal
            label.label 常规海报图片
            .control.upLoad-image
              upload-pic(v-model="item.poster_regular.thumbnail_image_url", img-type="item-regular",img-id="item-regular", :max-size="60", :need-default="false", :is-large="true", @input="resultData1")
              .picture-description 建议上传尺寸为1417px*1984px的jpg/png格式文件，文件不能超过60M。
          .field.is-horizontal
            label.label A4海报图片
            .control.upLoad-image
              upload-pic(v-model="item.poster_a4.thumbnail_image_url", img-type="item-a4", img-id="item-a4", :max-size="60", :is-large="true", :need-default="false", @input="resultData2")
              .picture-description 建议上传尺寸为813px*1151px的jpg/png格式文件，文件不能超过60M。
        .group-title 线上海报图片
        .field-group
          .field.is-horizontal
            label.label.label-long 线上宣传海报图片
            .control.upLoad-image
              upload-pic(v-model="item.poster_master.thumbnail_image_url", img-type="item-master", img-id="item-master", :max-size="2", :is-large="true", :need-default="false", @input="resultData3")
              .picture-description 建议上传尺寸为690px*980px的jpg/png格式文件，文件不能超过2M。
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData()") 保存
          a.button.large(@click="goBack") 返回

</template>

<script>
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import materialApi from '@/mixins/modules/material'

  /**
   * @vue
   */
  export default {
    /**
     * @description 添加海报
     */
    name: 'PosterMaterialAdd',
    mixins: [validationMixin, fileUploader, materialApi],
    components: {
      CustomInput,
      UploadPic,
      CustomSelect,
    },
    data () {
      return {
        poster_type: null,
        type_list: [{
          name: '爆款推荐海报',
          status: 1,
        }, {
          name: '活动宣传海报',
          status: 2,
        }],
        item: {
          name: '', // 名称
          poster_preview: '',
          poster_rollup: {
            image_url: '',
            thumbnail_image_url: '',
          },
          poster_regular: {
            image_url: '',
            thumbnail_image_url: '',
          },
          poster_a4: {
            image_url: '',
            thumbnail_image_url: '',
          },
          poster_master: {
            image_url: '',
            thumbnail_image_url: '',
          },
        },
      }
    },
    methods: {
      // 图片赋值
      resultData (params) {
        if (params) {
          this.item.poster_rollup = JSON.parse(params)
        }
        console.log(this.item.poster_rollup)
      },
      // 图片赋值
      resultData1 (params) {
        if (params) {
          this.item.poster_regular = JSON.parse(params)
        }
      },
      // 图片赋值
      resultData2 (params) {
        if (params) {
          this.item.poster_a4 = JSON.parse(params)
        }
      },
      // 图片赋值
      resultData3 (params) {
        if (params) {
          this.item.poster_master = JSON.parse(params)
        }
      },
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },

      // 创建宣传海报
      inspectData () {
        this.item.name = this.item.name.replace(/(^\s*)|(\s*$)/g, '')
        this.$v.$touch()
        if (this.$v.$error) return
        if (!this.item.poster_preview) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '海报预览图片必填',
          })
          return false
        }
        if (!this.item.poster_rollup.thumbnail_image_url && !this.item.poster_regular.thumbnail_image_url && !this.item.poster_a4.thumbnail_image_url) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '海报图片最少需上传一种规格才可保存',
          })
          return false
        }
        this.saveData()
      },

      async saveData () {
        let arr = [
          {
            type: 1,
            image_url: '',
            thumbnail_image_url: this.item.poster_preview,
          },
          {
            type: 2,
            image_url: this.item.poster_rollup.image_url,
            thumbnail_image_url: this.item.poster_rollup.thumbnail_image_url,
          },
          {
            type: 3,
            image_url: this.item.poster_regular.image_url,
            thumbnail_image_url: this.item.poster_regular.thumbnail_image_url,
          },
          {
            type: 4,
            image_url: this.item.poster_a4.image_url,
            thumbnail_image_url: this.item.poster_a4.thumbnail_image_url,
          },
          {
            type: 5,
            image_url: this.item.poster_master.image_url,
            thumbnail_image_url: this.item.poster_master.thumbnail_image_url,
          },
        ]
        try {
          let params = {
            name: this.item.name,
            type: this.poster_type ? this.poster_type.status : '',
            img_info: [...arr],
          }
          const {result, response} = await this.addPosterApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true,
                type: 'success',
                title: '添加成功',
                resolve: () => {
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '宣传海报创建')
        }
      },
    },
    mounted () {
    },
    validations: {
      item: {
        name: {
          required,
        },
      },
      poster_type: {
        name: {
          required,
        },
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .width-318
    width 318px !important
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
  .group-title{
    font-size: 12px;
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    padding-right: 40px;
    // align-items: center;
  }
  .field.is-horizontal .label{
    flex: 0 0 100px;
  }
</style>
