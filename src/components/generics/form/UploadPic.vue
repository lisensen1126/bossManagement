<template lang="pug">
  .upload-pic.is-normal
    img(:src="scaleImage(value, 1, 108, 108)", v-if="value && !isOriginal")
    img(:src="value", v-if="value && isOriginal")
    .default-pic(v-if="!value && !defaultImg")
    .tap-wrapper(v-if="!isDisabled && !isLoading")
      label(:class="{'without-default': !needDefault}", :for="componentId") 上传图片
      .back-default(v-if="needDefault", @click="returnDefault") 恢复默认
    .tap-wrapper(v-if="isLoading") 加载中...
    input(type="file", :id="componentId", @change="commitImage")
</template>

<script>
  import fileUploader from '@/mixins/utilities/fileUploader'
  import imageScale from '@/mixins/utilities/imageScale'
  export default {
    name: 'UploadPic',
    props: {
      value: String,
      imgId: [Number, String],
      needDefault: {
        type: Boolean,
        default () {
          return true
        },
      },
      defaultImg: String,
      isDisabled: {
        type: Boolean,
        default () {
          return false
        },
      },
      ImgType: String,
      isOriginal: {
        type: Boolean,
        default () {
          return false
        },
      },
      maxSize: {
        type: [Number, String],
        default: 5 * 1024 * 1024,
      },
      isLarge: {
        type: Boolean,
        default: false,
      },
    },
    mixins: [fileUploader, imageScale],
    data () {
      return {
        componentId: '',
        isLoading: false,
      }
    },
    watch: {
      defaultImg () {
        this.$emit('input', this.defaultImg)
      },
    },
    computed: {
      scaleClass () {
        return this.inputType === 'hasCount' ? 'has-count'
            : this.inputType === 'hasUnit' ? 'has-unit' : `is-${this.inputType}`
      },
    },
    methods: {
      returnDefault () {
        this.$emit('input', this.defaultImg)
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
        const maxSize = (this.maxSize - 0) * 1024 * 1024
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
            content: `允许的图片尺寸: 不超过${this.maxSize}M`,
          })
          e.target.value = null
          return
        }

        this.isLoading = true
        if (this.isLarge) {
          this.uploadLargeImage(file, this.ImgType).then(({result}) => {
            if (result.code && result.code === 120002) {
              this.isLoading = true
            } else if (!result.code) {
              this.isLoading = false
            }
            e.target.value = null
            this.$emit('input', JSON.stringify(result))
            e.target.value = null
          })
        } else {
          this.uploadImage(file, this.ImgType).then(({result}) => {
            this.isLoading = false
            e.target.value = null
            this.$emit('input', result.data.image_url)
            e.target.value = null
          })
        }
      },
    },
    mounted () {
      if (!this.value) {
        this.$emit('input', this.defaultImg)
      }
      this.componentId = this.imgId ? this.imgId + 'id' : new Date().getTime() + 'id'
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins'
  @import '~@/stylus/modules/upload-pic'

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
</style>
