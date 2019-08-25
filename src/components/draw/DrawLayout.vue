<template lang="pug">
  div
    major-tab(moduleName="营销活动")
      router-link.tab-item(:to="{name: 'drawList'}") 转盘抽奖
      router-link.tab-item(:to="{name: 'prizes'}") 奖品库
      //- router-link.tab-item(:to="{name: 'purchasePageSetting'}") 新美大团单
      router-link.tab-item(:to="{name: 'messageNav'}") 短信管理
      router-link.tab-item(:to="{name: 'posterTopNav'}") 裂变海报
      router-link.tab-item(:to="{name: 'PayReduceNav'}") 支付立减
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'DrawLayout',
    components: {
      MajorTab,
    },
  }
</script>
