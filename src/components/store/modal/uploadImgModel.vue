<template lang="pug">
  .upload-pic
    img(:src="scaleImage(imageUrl, 1, 88, 88)", v-if="!!imageUrl")
    .default-pic(v-if="!imageUrl")
    .tap-wrapper(v-if="!!imageUrl && !isDisabled")
      label(:for="imageUrlId", v-text="defaultTip", v-if="!isDisabled")
      .action(@click="secondAction", v-if="hasSecondAction", v-text="secondActionTip")
      .action(v-if="needMove - 0 === 2")
        img.left(src="../../../assets/icons/left-icon.png" v-if="needLeft" @click="left")
        img.right(src="../../../assets/icons/right-icon.png" v-if="needRight" @click="right")
    .tap-wrapper(v-if="isLoading") 加载中...
    input(type="file", :id="imageUrlId", @change="commitImage", class="input-file", v-if="!isDisabled")
</template>

<script>
  import fileUploader from '@/mixins/utilities/fileUploader'
  import imageScale from '@/mixins/utilities/imageScale'
  export default {
    name: 'uploadImgModel',
    props: {
      value: String,
      hasDefaultImg: {
        type: Boolean,
        default: false,
      },
      needMove: [Number, String], // 移动
      index: [Number, String],
      needLeft: {       // 向左
        type: Boolean,
        default: true,
      },
      needRight: {     // 向右
        type: Boolean,
        default: true,
      },
      defaultImg: String,
      defaultTip: {
        type: String,
        default: '修改图片',
      },
      hasSecondAction: {
        type: Boolean,
        default: true,
      },
      secondActionTip: {
        type: String,
        default: '移除图片',
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
      left () {
        this.$emit('leftMove')
      },
      right () {
        this.$emit('rightMove')
      },
      secondAction () {
        this.$emit('other', this.value)
        // console.log(1111)
      },
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
        const maxSize = 5120 * 1024
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
            content: '允许的图片尺寸: 不超过5M',
          })
          e.target.value = null
          return
        }

        this.isLoading = true
        this.uploadImage(file, this.ImgType).then(({result}) => {
          this.isLoading = false
          e.target.value = null
          this.$emit('input', result.data.image_url)
        })
      },
    },
    mounted () {
      this.imageUrlId = this.imageUrl ? this.imageUrl : new Date().getTime() + 'id'
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
    position relative
    .left
      width 20px
      height 12px
      position absolute
      right 10px
      top -5px
    .right
      width 20px
      height 12px
      position absolute
      left 10px
      top -5px
    .right
      background center no-repeat url('~@/assets/icons/move-up.svg')
  .action
    margin-top 20px
    position relative
    &::before
      display block
      content ""
      position absolute
      width 12px
      border 1px solid rgba(255,255,255,0.2)
      top -10px
      left 33%
      margin-left -6px
</style>
