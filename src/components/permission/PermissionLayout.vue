<template lang="pug">
  div
    major-tab(moduleName="权限管理")
      router-link.tab-item(:to="{name: 'operationLogList'}") 操作日志
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'permissionLayout',
    components: {
      MajorTab,
    },
  }
</script>