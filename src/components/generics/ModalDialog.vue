<template lang="pug">
  .modal.is-active(:class="[scaleClass]", :style="{zIndex}")
    .modal-background(v-if="isTopmost")
    slot(name="slide")
    slot(name="card")
      .modal-card
        slot
</template>

<script>
import modalSupervisor from '@/mixins/utilities/modalSupervisor'

export default {
  name: 'ModalDialog',
  mixins: [modalSupervisor],
  props: {
    modalScale: {
      type: String,
    },
  },
  computed: {
    scaleClass () {
      return this.modalScale ? `is-${this.modalScale}` : ''
    },
  },
}
</script>

<style scoped lang="stylus">
@import '../../stylus/mixins'

.modal
  position fixed
  width 100%
  height 100%
  left 0
  top 0
.modal-card
  position relative
  width 400px
  background #ffffff
  top 50%
  left 50%
  transform translateY(-50%) translateX(-50%)
  border-radius borderRadius
.modal
  text-align left
  &.is-maximum
    .modal-card
      width 960px
  &.is-large
    .modal-card
      width 600px
  &.is-medium
    .modal-card
      width 400px
  &.is-small
    .modal-card
      width 360px
.modal-background
  position fixed
  width 100%
  height 100%
  background #303030
  opacity 0.32
</style>
