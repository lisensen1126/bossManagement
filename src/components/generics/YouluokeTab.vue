<template lang="pug">
  .status-tab-child.status-box(:class="{'is-tighten': isTighten, 'is-slim': isSlim}")
    ul.level.status-list
      li.tab-item(v-for="(tab, index) in tabs", :class="{'is-report-detail': isReportQuantity, 'have-line' : index === lineIndex, 'large-fontsize' : isLargeFontsize}")
        router-link.tab-item(:to="{name: tab.name, query:{enterpriseName: enterpriseName,enterpriseId: enterpriseId}}")
          span.line
          span(v-text="tab.type")
</template>

<script>

/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description tab切换组件
   */
  name: 'YouluokeTab',
  data () {
    return {
      tabs: [{
        name: 'appSetting',
        type: 'APP 配置',
      }, {
        name: 'cheBang',
        type: '车流视频设备绑定',
      }],
    }
  },
  props: {
    enterpriseName: String,
    enterpriseId: '',
    isLargeFontsize: {
      type: Boolean,
      default: false,
    },
    isTighten: {
      type: Boolean,
      default: false,
    },
    isSlim: {
      type: Boolean,
      default: false,
    },
    lineIndex: {
      type: Number,
      default: 4,
    },
    haveIcon: {
      type: Boolean,
      default: true,
    },
    haveQuantity: {
      type: Boolean,
      default: true,
    },
    isReportQuantity: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
  },
  mounted () {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../../stylus/mixins'
.is-active
  font-size 16px !important
.status-tab-child
  &.is-tighten
    .tab-item:not(:last-child)
      margin-right 24px
    .quantity
      height 14px
      line-height 14px
      font-size 12px
      padding 0 2px
.status-list
  justify-content center
.tab-item
  margin-right 38px
  display flex
  align-items center
  font-size 14px
  line-height 24px
  padding 12px 0
  color lightGrey
  position relative
  cursor pointer
  &:last-child
    margin-right 0
  .icon
    padding-left 16px
    margin-right 8px
    background-position center center
    background-repeat no-repeat
  .quantity
    display block
    padding 0 6px
    margin-left 4px
    min-width 18px
    height 19px
    text-align center
    line-height 19px
    background #c7c7c7
    border-radius 2px
    color #ffffff
    &.report-quantity
      margin-left 0
      margin-right 5px
      padding 0 5px
      height 14px
      line-height 14px
      font-weight bold
      font-size 12px
      &.is-attention
        background-color #ff4a4a
      &.is-caution
        background-color mediumYellow
      &.is-satisfaction
        background-color #c7c7c7
  &::after
    height 0px
    transition height .2s
  &.have-line
    margin-right 0 !important
    position relative
    margin-left 11px
    &::before
      content ''
      display block
      height 14px
      width 1px
      position absolute
      left -23px
      top 50%
      margin-top -7px
      background-color line
  &.large-fontsize
    font-size 16px
    &.is-active
      font-size 18px
  &.is-report-detail
    font-size 14px
    &.is-active
      font-size 14px
  &.is-active
    color standblack
    .quantity
      background primary
    &::after
      content ''
      display block
      width 100%
      height 2px
      position absolute
      bottom 0
      left 50%
      transform translateX(-50%)
      background primary

.status-tab-child.is-slim
  flex 1 1 auto
  .status-list
    justify-content normal
    +media(1500px)
      justify-content space-around
  .tab-item
    display inline-block
    padding 8px 0
    line-height 16px
  .tab-item:not(:last-child)
    margin-right 30px
    +media(1500px)
      margin-right 16px
    +media(1366px)
      margin-right 8px
  .quantity
    display inline-block
    height 14px
    line-height 14px
    font-size 12px
    padding 0 2px
</style>
