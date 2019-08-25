<template lang="pug">
  div
    major-tab(moduleName="品牌馆")
      router-link.tab-item(:to="{name: 'brandHouseList'}") 品牌馆管理
    keep-alive(include="BrandHouseList")
      router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'brandHouseLayout',
    components: {
      MajorTab,
    },
  }
</script>

