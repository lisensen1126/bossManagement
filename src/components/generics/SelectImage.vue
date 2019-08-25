<template lang="pug">
  modal-dialog(modal-scale="large" v-if="value")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title(v-text="'上传详情'")
        .close-button(@click="modalClose")
      .modal-body
        .filter-wrapper
          .upload-pic(v-for="(item, index) in imageArray")
            upload-img-model(v-model="imageArray[index]", img-type="imageArray", :has-second-action="true", @other="deleteImage",:secondActionTip = 'imageArray.length === 1 ? "" : "移除图片"', need-move="2", @leftMove="leftPic('item', index)", @rightMove="rightPic('item',index)", :need-left="index !== 0", :need-right="index !== (imageArray.length -1)")
          .upload-pic(v-if="imageArray.length <= 99")
            upload-img-model(v-model="imageArray[imageArray.length]", img-type="imageArray", :has-second-action="true", @other="deleteImage")
        a.button.sub-button.primary(@click="compelete") 确定
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'
import uploadImgModel from '@/components/store/modal/uploadImgModel'

export default {
  name: 'SelectImage',
  components: {
    ModalDialog,
    uploadImgModel,
  },
  mixins: [modalInteractions],
  props: {
    index: {
      type: [String, Number],
    },
    currentImageArray: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      imageArray: this.currentImageArray,
    }
  },
  methods: {
    // 向左
    leftPic (type, index) {
      let list = this.imageArray
      this.imageArray = []
      let now = list[index]
      let left = list[index - 1]
      list[index] = left
      list[index - 1] = now
      this.imageArray = list
    },
    // 向右
    rightPic (type, index) {
      let list = this.imageArray
      this.imageArray = []
      let now = list[index]
      let left = list[index + 1]
      list[index] = left
      list[index + 1] = now
      this.imageArray = list
    },
    // 删除图片
    deleteImage (url) {
      const index = this.imageArray.findIndex(val => val === url)
      this.imageArray.splice(index, 1)
    },
    compelete () {
      this.modalResolve(this.index, this.imageArray)
    },
  },
  mounted () {
  },
}
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card-title
    font-size 18px
  .modal-footer
    padding 12px 16px
  .modal-body
    min-height 120px
    display flex
    flex-direction column
  .filter-wrapper
    flex-shrink 0
    box-sizing border-box
    background #e8e9eb
    padding 12px 12px
    display flex
    flex-direction row
    flex-wrap wrap
    height 250px
    overflow-y auto
    .upload-pic
      width 88px
      height 88px
      margin-right 8px
  .sub-button
    display block
    margin: 15px auto
</style>
