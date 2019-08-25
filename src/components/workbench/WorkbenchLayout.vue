<template lang="pug">
  div
    major-tab(moduleName="工作台")
      a(v-if="currentEnterprise && currentEnterprise.third_id.length>0")
        router-link.tab-item(:to="{name: 'workbenchOverview'}") 预约核销
    router-view
</template>

<script>
import {mapGetters} from 'vuex'
import MajorTab from '@/components/generics/MajorTab'
/**
 * @vue
 */
export default {
  /**
   * @author caihaotian
   * @description 工作台
   */
  name: 'WorkBenchLayout',
  components: {
    MajorTab,
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.outlink-icon
  display inline-block
  vertical-align middle
  margin-left 3px
  margin-top -4px
  width 16px
  height 16px
  background center no-repeat url('~@/assets/menu/outlink.svg')
</style>

