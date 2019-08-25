<template lang="pug">
  .section-layout
    .content-wrapper
      h2 添加背景
      .form-wrapper
        .field-group
          .field.toggle-group.is-horizontal
            label.label 背景类型
            custom-select(v-model="poster_type", :list="type_list", :validator="$v.poster_type.name", error-info="背景类型必选")
          .field.is-horizontal.width-318
            label.label 背景名称
            custom-input(v-model="item.name", placeholder="请输入服务名称", :validator="$v.item.name", error-info="服务名称必填并且小于十位", maxlength="10")
          .field.is-horizontal
            label.label 海报背景图
            .control.upLoad-image
              upload-pic(v-model="item.poster_pic", img-type="item")
              .picture-description 建议上传尺寸为690x980的jpg/png格式文件，文件不能超过2M。
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
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import drawApi from '@/mixins/modules/draw'

  /**
   * @vue
   */
  export default {
    /**
     * @author zhangxiang
     * @description 添加海报
     */
    name: 'ServiceAdd',
    mixins: [validationMixin, fileUploader, drawApi],
    components: {
      CustomInput,
      UploadPic,
      CustomSelect,
      uploadImgModel,
    },
    data () {
      return {
        poster_type: null,
        type_list: [{
          name: '秒杀海报背景',
          status: 1,
        }, {
          name: '拼团海报背景',
          status: 2,
        }, {
          name: '门店海报背景',
          status: 3,
        }, {
          name: '活动海报背景',
          status: 4,
        }, {
          name: '养护卡海报背景',
          status: 5,
        }, {
          name: '节日海报背景',
          status: 6,
        }],
        item: {
          name: '', // 名称
          poster_pic: '', // 服务图示
        },
      }
    },
    methods: {
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
      inspectData () {
        this.item.name = this.item.name.replace(/(^\s*)|(\s*$)/g, '')
        this.$v.$touch()
        if (this.item.poster_pic === undefined) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '背景图片必填',
          })
          return false
        }
        this.saveData()
      },

      async saveData () {
        try {
          let params = {
            name: this.item.name,
            cover: this.item.poster_pic,
            type: this.poster_type.status,
          }
          const {result, response} = await this.getPosterAddApi(params)
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
                title: '创建失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '创建')
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
</style>
