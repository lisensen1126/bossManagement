<template lang="pug">
  .empty-page-wrapper(:class="{'empty-page-wrapper-white': isWhite}")
    .empty-page-icon(:class="{'empty-page-icon-white': isWhite, 'empty-page-icon-add': isAdd}")
    .empty-page-tip(v-text="tip", :class="{'font-size-small': fontSize === 'small'}")
    slot
</template>

<script>
export default {
  name: 'emptyPage',
  props: {
    isWhite: {
      type: Boolean,
      default: false,
    },
    isAdd: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '没有相关数据',
    },
    fontSize: {
      type: String,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'

.empty-page-wrapper
  display flex
  justify-content center
  align-items center
  flex-grow 1
  flex-direction column
  user-select none
  &.empty-page-wrapper-white
    background #ffffff
  .empty-page-icon
    margin-top -10px
    width 177px
    height 118px
    background url('~@/assets/empty-state.svg') no-repeat center
    background-size cover
    &.empty-page-icon-white
      background-image url('~@/assets/empty-state-white-bg.svg')
    &.empty-page-icon-add
      width 46px
      height 46px
      margin-bottom 16px
      background-image url('~@/assets/add-item.svg')
  .empty-page-tip
    font-size 16px
    line-height 21px
    color lightGrey
    &.font-size-small
      font-size 14px
</style>
