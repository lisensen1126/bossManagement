<template lang="pug">
  div
    major-tab(moduleName="品牌系列配置")
      router-link.tab-item(:to="{name: 'series'}") 系列分类
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
