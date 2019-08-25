<template lang="pug">
  .upload-pic
    img(:src="scaleImage(imageUrl, 1, 88, 88)", v-if="!!imageUrl")
    .default-pic(v-if="!imageUrl")
    .tap-wrapper(v-if="!!imageUrl && !isDisabled")
      label(:for="imageUrlId", v-text="defaultTip", v-if="!isDisabled")
      .action(@click="lookBigPic", v-if="lookPic", v-text="thrActionTip")
      .action(@click="secondAction", v-if="hasSecondAction", v-text="secondActionTip")
    .tap-wrapper(v-if="isLoading") 加载中...
    input(type="file", :id="imageUrlId", @change="commitImage", class="input-file", v-if="!isDisabled")
    .look-pic(v-if="look_pic")
      img.close(src="../../../assets/openImage/open-image-close.png",@click="closeModal()")
      .pic-con
        img(:src="imageUrl")
</template>

<script>
  import fileUploader from '@/mixins/utilities/fileUploaderMT'
  import imageScale from '@/mixins/utilities/imageScale'
  export default {
    name: 'upMeituanImage',
    props: {
      value: String,
      imgId: [Number, String],
      hasDefaultImg: {
        type: Boolean,
        default: false,
      },
      defaultImg: String,
      defaultTip: {
        type: String,
        default: '修改图片',
      },
      lookPic: {
        type: Boolean,
        default: true,
      },
      hasSecondAction: {
        type: Boolean,
        default: true,
      },
      secondActionTip: {
        type: String,
        default: '移除图片',
      },
      hasThrAction: {
        type: Boolean,
        default: true,
      },
      thrActionTip: {
        type: String,
        default: '查看图片',
      },
      ImgType: String,
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [fileUploader, imageScale],
    data () {
      return {
        imageUrlId: '',
        isLoading: false,
        look_pic: false, // 查看大图
      }
    },
    computed: {
      imageUrl () {
        if (this.value) {
          return this.value
        } else {
          if (this.hasDefaultImg && !!this.defaultImg) {
            return this.defaultImg
          }
          return ''
        }
      },
    },
    methods: {
      secondAction () {
        this.$emit('other', this.value)
      },
      // 查看大图
      lookBigPic () {
        this.look_pic = true
      },
      // 关闭大图
      closeModal () {
        this.look_pic = false
      },
      // 提交图片
      commitImage (e) {
        if (this.isLoading) {
          this.$store.dispatch('showMessage', {
            title: '警告',
            content: '图片正在上传',
          })
          return
        }

        const files = e.target.files || e.dataTransfer.files
        if (!files.length) {
          return
        }
        const file = files[0]
        let maxSize = 0
        let max = 0
        if (this.ImgType - 0 === 10) {
          maxSize = 1024 * 1024 * 2
          max = 2
        } else {
          maxSize = 1024 * 1024 * 8
          max = 8
        }
        if (!/\/(?:jpeg|jpg|png)/i.test(file.type)) {
          this.$store.dispatch('showMessage', {
            title: '图片格式不正确',
            content: '允许的图片格式：jpg, jpeg, png',
          })
          e.target.value = null
          return
        }
        if (file.size > maxSize) {
          this.$store.dispatch('showMessage', {
            title: '图片尺寸太大',
            content: '允许的图片尺寸: 不超过' + max + 'M',
          })
          e.target.value = null
          return
        }
        this.isLoading = true
        this.uploadImage(file, this.ImgType).then(({result}) => {
          this.isLoading = false
          e.target.value = null
          if (result.code === 0) {
            if (this.ImgType - 0 === 10) {
              // this.$emit('input', result.data.url)
              this.$emit('id', result.data)
            } else {
              this.$emit('input', result.data.url)
            }
          } else {
            this.$store.dispatch('showMessage', {
              title: '上传失败',
              content: `${result.message}`,
            })
          }
        })
      },
    },
    mounted () {
      this.imageUrlId = this.imgId ? this.imgId + 'id' : new Date().getTime() + 'id'
    },
  }
</script>

<style lang="stylus" scoped>
  @import "~@/stylus/mixins"

  .upload-pic
    width 100%
    height 100%
    border-radius 2px
    position relative
    overflow hidden
    &:hover
      .tap-wrapper
        opacity 1
    img
      width 100%
      height 100%
  .default-pic
    width 100%
    height 100%
    box-sizing border-box
    border 1px dashed rgba(0, 0, 0, .1)
    background #fbfbfb
    position relative
    &::after
      display block
      content ""
      position absolute
      width 32px
      height 32px
      background getImage('cloud-upload.svg') no-repeat
      left 50%
      top 50%
      transform translate(-50%, -50%)
  .input-file
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    opacity 0
  .tap-wrapper
    opacity 0
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    z-index 3
    display flex
    flex-direction column
    align-items center
    justify-content center
    background rgba(18, 18, 18, .5)
    color #fff
    font-size 12px
    label,
    .action
      color #fff
      font-size 12px
      cursor pointer
    .action
      margin-top 10px
      position relative
      &::before
        display block
        content ""
        position absolute
        width 12px
        border 1px solid rgba(255,255,255,0.2)
        top -5px
        left 50%
        margin-left -6px
  .look-pic
    position: fixed
    z-index: 9999
    left: 0
    right: 0
    top: 0
    bottom: 0
    background: rgba(255,255,255,0.9)
    overflow: auto
    display flex
    justify-content: center
    align-items: center
    .close
      position: fixed
      width: 40px
      height: 40px
      right: 20px
      top: 12px
      text-align: center
      line-height: 40px
      color: #bbb
      cursor: pointer
      z-index: 99991
      .iconfont
        font-size: 40px
      &:hover
        color: #2976ea
    .pic-con
      img
        display block

</style>
