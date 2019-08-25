<template lang="pug">
  div
    major-tab(moduleName="企业管理")
      router-link.tab-item(:to="{name: 'enterpriseList'}") 企业管理
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'EnterpriseLayout',
    components: {
      MajorTab,
    },
  }
</script>
