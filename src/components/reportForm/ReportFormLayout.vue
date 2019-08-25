<template lang="pug">
  div
    major-tab(moduleName="统计管理")
      router-link.tab-item(:to="{name: 'incomeSummary'}") 财务管理
      router-link.tab-item(:to="{name: 'reportList'}") 运营报表
      router-link.tab-item(:to="{name: 'orderSplitList'}") 订单分账
      router-link.tab-item(v-if="currentUser.is_system_admin == 1",:to="{name: 'echarReport'}") 走势图
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  import { mapGetters } from 'vuex'
  export default {
    name: 'reportFormLayout',
    components: {
      MajorTab,
    },
    computed: {
      ...mapGetters({
        currentUser: 'currentUser',
      }),
    },
  }
</script>
