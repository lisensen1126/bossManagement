<template lang="pug">
  div
    major-tab(moduleName="测试")
      router-link.tab-item(:to="{name: 'richTextFormat'}") 富文本
      router-link.tab-item(:to="{name: 'uEditor'}") 百度秀米
    router-view
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'testLayout',
    components: {
      MajorTab,
    },
  }
</script>

