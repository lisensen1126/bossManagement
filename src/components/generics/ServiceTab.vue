<template lang="pug">
  .status-tab-child.status-box(:class="{'is-tighten': isTighten, 'is-slim': isSlim}")
    ul.level.status-list
      li.tab-item(v-for="(tab, index) in tabs", :class="{'is-report-detail': isReportQuantity, 'is-active': tab.type === value.type, 'have-line' : index === lineIndex, 'large-fontsize' : isLargeFontsize}", @click="switchTab(tab)", v-if="!disabledTab.find(_tab => _tab === tab.type)")
        span.line
        span.quantity.report-quantity(:class="{'is-attention': tab.type === 'ATTENTION', 'is-caution':  tab.type === 'CAUTION', 'is-satisfaction':  tab.type === 'SATISFACTION',}", v-if="isReportQuantity", v-text="tab.count")
        span.icon(v-if="haveIcon", :class="getIconClass(tab.type)")
        span(v-text="tab.name || getName(tab.type)")
        span.quantity(v-if="haveQuantity && !isReportQuantity", v-text="tab.count")
</template>

<script>
import * as TYPES from '@/constants/service-types'
import * as NAMES from '@/constants/terms/service-types'

/**
 * @author caihaotian
 * @description tab切换组件
 */
export default {
  name: 'ServiceTab',
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          type: TYPES.WASHING,
          count: 0,
        }
      },
    },
    tabs: {
      type: Array,
      default: () => {
        return [{
          type: TYPES.WASHING,
          count: 0,
        }, {
          type: TYPES.MAINTENANCE,
          count: 0,
        }, {
          type: TYPES.BEAUTY,
          count: 0,
        }, {
          type: TYPES.REPAIR,
          count: 0,
        }, {
          type: TYPES.SERVICE_PACKAGE,
          count: 0,
        }]
      },
    },
    disabledTab: {
      type: Array,
      default: () => [],
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
    lineIndex: {
      type: Number,
      default: 10,
    },
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
  },
  methods: {
    switchTab (tab) {
      this.$emit('input', tab)
    },
    getIconClass (type) {
      return `icon-${type.toLocaleLowerCase()}`
    },
    getName (type) {
      switch (type) {
        case TYPES.WASHING:
          return NAMES.WASHING
        case TYPES.MAINTENANCE:
          return NAMES.MAINTENANCE
        case TYPES.BEAUTY:
          return NAMES.BEAUTY
        case TYPES.REPAIR:
          return NAMES.REPAIR
        case TYPES.SERVICE_PACKAGE:
          return NAMES.SERVICE_PACKAGE
      }
    },
  },
  mounted () {
    // console.log('this.tabs')
    // console.log('this.tabs', this.tabs)
  },
}
</script>

<style scoped lang="stylus">
@import '../../stylus/mixins'
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
