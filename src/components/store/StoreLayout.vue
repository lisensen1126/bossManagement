<template lang="pug">
  div
    major-tab(moduleName="门店管理")
      router-link.tab-item(:to="{name: 'storeList'}") 门店管理
      router-link.tab-item(:to="{name: 'checkStoreList'}") 新店同步
      router-link.tab-item(:to="{name: 'checkManagement'}") 平台门店
      router-link.tab-item(:to="{name: 'checkComment'}") 平台评论
      router-link.tab-item(:to="{name: 'checkManagementRange'}") 平台门店范围
      //- router-link.tab-item(:to="{name: 'whiteStoreList'}") 白名单门店
      router-link.tab-item(:to="{name: 'storeInvalid'}") 授权失效门店
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'StoreLayout',
    components: {
      MajorTab,
    },
  }
</script>
