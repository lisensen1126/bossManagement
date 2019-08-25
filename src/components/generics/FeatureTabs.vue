<!--tab切换组件，示例可看消费记录列表的tab-->
<template lang="pug">
  .level.record-tab
    .record-tab-child
      ul.level.record-list
        li(v-for="tab in tabs")
          a.tab-item(:class="{'is-active': value.title === tab.title,'font-12': fontSize}", v-text="tab.title", @click="switchTo(tab)")
</template>

<script>
export default {
  name: 'FeatureTabs',
  props: {
    value: Object,
    tabs: Array,
    fontSize: {
      type: Boolean,
      default () {
        return false
      },
    },
  },
  methods: {
    switchTo (tab) {
      this.$emit('input', tab)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'

.record-tab
  flex 0 0 55px
  // height 55px
  border-bottom 1px solid rgba(0, 0, 0, .06)
  .record-tab-child
    flex-grow 1
    height 55px
.record-list
  justify-content center
.tab-item
  margin 0 16px
  display block
  font-size 15px
  line-height 24px
  padding 15px 0 16px 0
  color lightGrey
  position relative
  cursor pointer
  &.font-12
    font-size 12px
  &:hover
    color standblack
  &:after
    height 0px
    transition height .2s
  &.is-active
    color standblack
    &:after
      content ''
      display block
      width 100%
      height 2px
      position absolute
      bottom 0
      left 50%
      transform translateX(-50%)
      background #303030
</style>
