<template lang="pug">
  div
    major-tab(moduleName="功能设置")
      router-link.tab-item(:to="{name: 'mange'}") 车检设置
      router-link.tab-item(:to="{name: 'maintenanceCardNav'}") 养护卡
    keep-alive(v-if="$route.meta.keepAlive")
      router-view
    router-view(v-if="!$route.meta.keepAlive")

</template>

<script>
import MajorTab from '@/components/generics/MajorTab'
export default {
  name: 'FunctionLayout',
  components: {
    MajorTab,
  },
}
</script>
