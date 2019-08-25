<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 品牌馆视频设置
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 标题名称
            custom-input(v-model="info.video_title", maxlength=15, placeholder="请输入标题名称", :validator="$v.info.video_title", error-info="标题名称必填且小于10字", input-type="hasCount")
              span(slot="countInfo") {{wordLength(info.video_title)}}/10
          .field.is-horizontal
            label.label 内容设置
            .br-content
              .field-group(v-for="(item, index) in info.data")
                .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                .down(v-if="index !== info.data.length-1", @click="sortItem(index, 'down')")
                .delete(@click="deleteItem(index)")
                .field.is-horizontal
                  label.label 视频地址
                  custom-input(v-model="item.video_address", placeholder="请输入视频地址", :validator="$v.info.data.$each[index].video_address", error-info="视频地址必填")
                .field.is-horizontal
                  label.label 视频名称
                  custom-input(v-model="item.video_name", input-type="hasCount", placeholder="请输入视频名称", :validator="$v.info.data.$each[index].video_name", error-info="视频名称必填且小于15字")
                    span(slot="countInfo") {{wordLength(item.video_name)}}/15
                .field.is-horizontal
                  label.label 视频封面
                  upload-pic(v-model="item.video_cover", img-type="item.video_cover",:img-id="index")
              .button(@click="addItem") 添加视频
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
</template>

<script>
  import enterpriseApi from '@/mixins/modules/enterprise'
  import upLoadApi from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  // import {required} from 'vuelidate/lib/validators'
  import Utils from '@/mixins/utilities/utils'
  import BrandApi from '@/mixins/modules/BrandHouse'

  /**
   * @vue
   */
  export default {
    name: 'brandVideo',
    mixins: [validationMixin, enterpriseApi, upLoadApi, Utils, BrandApi],
    components: {
      CustomInput,
      CustomSelect,
      uploadImgModel,
      UploadPic,
    },
    data () {
      return {
        info: {
          video_title: '品牌视频',
          brand_house_id: '',
          data: [],
        },
      }
    },
    computed: {
    },
    methods: {
      wordLength,
      // 返回
      goBack () {
        this.$router.push({
          name: 'brandHouseList',
        })
      },

      // 添加内容
      addItem () {
        if (this.info.data.length === 10) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加10个视频',
          })
          return
        }
        let obj = {
          video_address: '', // 视频地址
          video_name: '', // 视频名称
          video_cover: '', // 视频封面
        }
        this.info.data.push(obj)
      },
      /**
       * 删除 item
       * @index {int} 序列号
       */
      deleteItem (index) {
        this.info.data.splice(index, 1)
      },

      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        let arr = [...this.info.data]
        this.info.data = []
        let temp = arr[index]
        // 向上移动
        if (type === 'up') {
          arr[index] = arr[index - 1]
          arr[index - 1] = temp
        }
        // // 向下移动
        if (type === 'down') {
          arr[index] = arr[index + 1]
          arr[index + 1] = temp
        }
        this.info.data = [...arr]
      },
      // 删除图片
      deleteImage (type, index) {
        this.store[type].splice(index, 1)
      },

      // 保存数据
      saveData () {
        // if (this.info.data.length === 0) {
        //   this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '提示',
        //     content: '请添加视频',
        //   })
        //   return
        // }
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        let isImg = false
        this.info.data.forEach(item => {
          if (item.video_cover === 'undefined') {
            isImg = true
          }
        })
        if (isImg) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '视频的封面图片必填',
          })
          return
        }
        this.saveVideo()
      },
      // 保存接口
      async saveVideo () {
        let params = []
        this.info.data.forEach(item => {
          let obj = {}
          obj.video_address = item.video_address
          obj.video_name = item.video_name
          obj.video_cover = item.video_cover
          params.push(obj)
        })
        try {
          const {result, response} = await this.saveHouseVideo({
            video_title: this.info.video_title,
            brand_house_id: this.info.brand_house_id,
            data: params,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存成功',
                resolve: () => {
                  // 返回上一级
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '保存失败',
                content: `出错啦！错误码：${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
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
      // 获取视频详情
      async getVideo () {
        // getHouseVideo
        try {
          const {response, result} = await this.getHouseVideo({
            brand_house_id: this.info.brand_house_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.info.video_title = result.data.video_title
            this.info.data = result.data.list
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌馆视频详情失败',
              content: '获取品牌馆视频详情发生错误，请稍后再试',
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌馆视频详情失败',
            content: `服务异常，请稍后再试（${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.info.brand_house_id = Number(this.$route.query.brand_id)
      if (this.info.brand_house_id) {
        this.getVideo()
      }
    },
    validations: {
      info: {
        video_title: {
          required,
          validate (val) {
            return this.wordLength(val) <= 10
          },
        },
        data: {
          $each: {
            video_address: {
              required,
            },
            video_name: {
              required,
              validate (val) {
                return this.wordLength(val) <= 15
              },
            },
          },
        },
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
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
    z-index 2
  label.label
    font-size 13px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
  .form-wrapper .field
    width 520px
  .form-wrapper .field.full-width
    width 100%

  .br-content
    display flex
    flex-direction: column
    .field-group
      position relative
      margin-bottom 15px
      background #f6f6f6
      padding-left: 40px
      padding-right: 60px
    .button
      width 150px
  .up
  .down
    position absolute
    right -14px
    width 14px
    height 14px
    opacity .5
    cursor pointer
    &.is-disable
      opacity .2
      pointer-events none
    &:hover
      opacity 1
  .up
    top 0
    background center no-repeat url('~@/assets/icons/move-up.svg')
  .down
    top 14px
    background center no-repeat url('~@/assets/icons/move-down.svg')
  .delete
    position absolute
    top 8px
    right 8px
    width 16px
    height 16px
    background center no-repeat url('~@/assets/icons/trash.svg')
    cursor pointer
</style>
