<template lang="pug">
  div
    major-tab(moduleName="品牌支持")
      router-link.tab-item(:to="{name: 'brandSupportList'}") 品牌支持
      router-link.tab-item(:to="{name: 'contentClassify'}") 品牌支持分类
    router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'brandSupportLayout',
    components: {
      MajorTab,
    },
  }
</script>
