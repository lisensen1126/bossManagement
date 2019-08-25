<template lang="pug">
  modal-dialog
    transition(name="slither", slot="slide")
      .slide-out-modal(:class="{'slim': isSlim, 'medium': isMedium, 'large': isLarge}")
        .close-btn(@click="modalClose", :class="{'colorful': isColorful}")
        slot
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import modalInteractions from '@/mixins/utilities/modalInteractions'

/**
 * @augments isColorful 为true 将关闭按钮变色
 * @description 为方便运用 将右侧得弹出方 进行了封装
 * @description demo-> slide-out-modal(v-model="isShow", v-if="isShow") isShow默认传递false
 * */
export default {
  name: 'SlideOutModal',
  components: {
    ModalDialog,
  },
  mixins: [modalInteractions],
  props: {
    isColorful: Boolean,
    isSlim: Boolean,
    isMedium: Boolean,
    isLarge: Boolean,
  },
}
</script>

<style scoped lang="stylus">
@import '../../stylus/mixins'

.slide-out-modal
  position fixed
  background #ffffff
  width 400px
  height 100%
  right 0
  &.slim
    width 320px
  &.medium
    width 480px
  &.large
    width 640px  
  .close-btn
    position absolute
    width 40px
    height 40px
    left -20px
    top 35px
    background #ced3dc
    box-shadow 0 4px 12px 0 rgba(0,0,0,0.08)
    border-radius 50%
    font-size 26px
    cursor pointer
    z-index 2
    &.colorful
      background primary
      box-shadow 0 2px 2px 0 rgba(255,199,35,0.30), 0 4px 12px 0 rgba(0,0,0,0.08)
      color #ffffff
    &::before
      content '+'
      position absolute
      color #ffffff
      display inline-block
      width 26px
      height 26px
      line-height 23px
      text-align center
      left 50%
      top 50%
      transform translateX(-50%) translateY(-50%) rotateZ(45deg)
.slither-enter-active, .slither-leave-active
  transition all .4s ease
.slither-enter-to, .slither-leave
  right 0px
.slither-enter, .slither-leave-to
  right -320px
</style>
