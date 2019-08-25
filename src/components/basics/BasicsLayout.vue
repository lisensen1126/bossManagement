<template lang="pug">
  div
    major-tab(moduleName="基础维护")
      router-link.tab-item(:to="{name: 'adminList'}") 系统管理员
      router-link.tab-item(:to="{name: 'pageSetting'}") 页面管理
      router-link.tab-item(:to="{name: 'settingAuthentication'}") 认证信息
      router-link.tab-item(:to="{name: 'settingService'}") 服务信息
      router-link.tab-item(:to="{name: 'smallEditionList'}") 小程序版本管理
      router-link.tab-item(:to="{name: 'passWordSetting'}") 修改密码
      router-link.tab-item(:to="{name: 'reportForm'}") 统计报表
      router-link.tab-item(:to="{name: 'maintenanceTools'}") 维护工具
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
