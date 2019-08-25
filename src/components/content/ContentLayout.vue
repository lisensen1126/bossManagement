<template lang="pug">
  div
    major-tab(moduleName="内容管理")
      router-link.tab-item(:to="{name: 'contentList'}") 活动内容
      router-link.tab-item(:to="{name: 'noticeClassifyList'}") 公告分类
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'contentLayout',
    components: {
      MajorTab,
    },
  }
</script>

