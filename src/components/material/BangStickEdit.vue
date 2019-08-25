<template lang="pug">
  .section-layout
    .content-wrapper
      h2 编辑爆炸贴
      .form-wrapper
        .field-group
          .field.toggle-group.is-horizontal
            label.label 爆炸贴类型
            custom-select(v-model="poster_type", :list="type_list", :validator="$v.poster_type.name", error-info="爆炸贴类型必选")
          .field.is-horizontal.width-318
            label.label 爆炸贴名称
            custom-input(v-model="item.name", placeholder="请输入爆炸贴名称", :validator="$v.item.name", error-info="爆炸贴名称必填并且小于十位", maxLength="10")
          .field.is-horizontal
            label.label 爆炸贴图片
            .control.upLoad-image
              upload-pic(v-model="item.poster_pic.thumbnail_image_url", img-type="item", :need-default="false", :max-size="20", :is-large="true", @input="resultData")
              .picture-description 建议上传尺寸为812px*542px的jpg/png格式文件，文件不能超过20M。
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
    name: 'BangStickEdit',
    mixins: [validationMixin, materialApi, fileUploader],
    components: {
      CustomInput,
      UploadPic,
      CustomSelect,
    },
    data () {
      return {
        id: this.$route.query.id - 0,
        poster_type: null,
        type_list: [{
          name: '爆款推荐爆炸贴背景',
          status: 3,
        }],
        item: {
          name: '', // 名称
          poster_pic: {
            image_url: '',
            thumbnail_image_url: '',
          }, // 服务图示
        },
        info: {},
      }
    },
    methods: {
      // 图片赋值
      resultData (params) {
        if (params) {
          this.item.poster_pic = JSON.parse(params)
        }
      },

      // 返回操作
      goBack () {
        this.$router.go(-1)
      },

      // 编辑爆炸贴
      inspectData () {
        this.item.name = this.item.name.replace(/(^\s*)|(\s*$)/g, '')
        this.$v.$touch()
        if (this.$v.$error) return
        if (!this.item.poster_pic.thumbnail_image_url) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '爆炸贴图片必填',
          })
          return false
        }
        this.saveData()
      },
      // 获取爆炸贴详情
      async getDetail () {
        try {
          let params = {
            id: this.$route.query.id,
          }
          const {result, response} = await this.fetchBangStickDetailApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.item.poster_pic = {...result.data.img_info}
              this.item.name = result.data.name
              this.poster_type = {
                name: '爆款推荐爆炸贴背景',
                status: result.data.type,
              }
              this.info = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取详情失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '详情')
        }
      },
      // 保存数据
      async saveData () {
        try {
          let params = {
            id: this.$route.query.id,
            name: this.item.name,
            type: this.poster_type.status,
            img_info: {
              id: this.info.img_info.id,
              type: 6,
              image_url: this.item.poster_pic.image_url,
              thumbnail_image_url: this.item.poster_pic.thumbnail_image_url,
            },
          }
          const {result, response} = await this.updateBangStickApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true,
                type: 'success',
                title: '编辑成功',
                resolve: () => {
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '编辑失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '编辑爆炸贴')
        }
      },
    },
    mounted () {
      this.getDetail()
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
