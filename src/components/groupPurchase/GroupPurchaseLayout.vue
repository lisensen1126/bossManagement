<template lang="pug">
  div
    major-tab(moduleName="团购管理")
      router-link.tab-item(:to="{name: 'groupPurchaseList'}")  活动管理
      router-link.tab-item(:to="{name: 'reportCenter'}")  报表中心
    router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'GroupPurchaseLayout',
    components: {
      MajorTab,
    },
  }
</script>
