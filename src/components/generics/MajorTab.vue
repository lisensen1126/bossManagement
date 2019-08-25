<template lang="pug">
  .root.major-tab-container
    .level.major-tab
      .level-left
        .major-title-wrapper
          .major-nav-btn(@click="showMajorNav")
          h2.major-tab-name(v-text="moduleName")
        .list-inline.major-tabs-wrapper
          slot
      .level-right
        user-info-tab
</template>

<script>
import UserInfoTab from '@/components/generics/UserInfoTab'
import { hub } from '@/plugins/EventHub'
/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description tab切换组件
   */
  name: 'MajorTab',
  components: {
    UserInfoTab,
  },
  props: {
    moduleName: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
    }
  },
  methods: {
    showMajorNav () {
      hub._data._global = null
      this.$hub.$emit(this.$hub.events.navChange, true)
    },
  },
  mounted () {
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
@import '../../stylus/mixins'

.major-nav-btn
  width 16px
  height 56px
  padding 22px 0 18px
  margin-right 24px
  cursor pointer
  display none
  position relative
  z-index 5
  &::before
    content ''
    display block
    width 16px
    height 16px
    position absolute
    top 50%
    margin-top -8px
    left 50%
    margin-left -8px
    background center no-repeat url('~@/assets/navigation/nav-menu-grey.svg')
+media(standWidth)
  .major-nav-btn
    display block

.major-tab-container
  background-color #fff
  z-index 10
.major-tab
  height 56px
  box-shadow 0 1px 5px 0 rgba(0, 0, 0, 0.05)
  .level-right
    +media(maxWidth)
      padding 0 40px
    +media(mediumWidth)
      padding 0 32px
    +media(standWidth)
      padding 0 24px
  .major-title-wrapper
    display flex
    flex-direction row
    position relative
    padding-left 40px
    &::after
      position absolute
      content ''
      display block
      width 120%
      height 53px
      top 0px
      left -22px
      box-shadow 2px 0 8px 0 rgba(0,0,0,0.05)
      transform skewY(-30deg) rotateZ(30deg)
    +media(maxWidth)
      padding-left 40px
    +media(mediumWidth)
      padding-left 32px
    +media(standWidth)
      padding-left 24px
  .major-tab-name
    height 56px
    font-size 20px
    line-height 24px
    padding 16px 0
    margin-right 37px
    user-select none
  
</style>
