<template lang="pug">
  .prior-conditions(:class="isWhiteBg ? 'is-white-bg' : ''")
    .conditions.left(v-if="!isCenterOnly")
      slot(name="left")
    .conditions.center
      slot
    .conditions.right(v-if="!isCenterOnly")
      slot(name="right")
</template>

<script>
export default {
  name: 'PriorConditions',
  props: {
    isCenterOnly: {
      type: Boolean,
      default: false,
    },
    isWhiteBg: {
      type: Boolean,
      default: false,
    },
  },
}
</script>


<style lang="stylus" scoped>
  @import '../../stylus/mixins'

  .prior-conditions
    display flex
    flex 0 0 48px
    align-items center
    justify-content center
    position relative
    height 48px
    padding-left 64px
    padding-right 64px
    background-color #fcfcfc
    box-shadow 0 2px 8px 0 rgba(0,0,0,.08)
    z-index 8
    +media(maxWidth)
      padding-left 40px
      padding-right 40px
    +media(mediumWidth)
      padding-left 32px
      padding-right 32px
    +media(standWidth)
      padding-left 24px
      padding-right 24px
  &.is-white-bg
    background-color #fff    

  .conditions
    display flex
    align-items center
    &.left
    &.right
      flex 0 0 160px
    &.center
      flex-grow 1
      justify-content center
    &.right
      justify-content flex-end
</style>

