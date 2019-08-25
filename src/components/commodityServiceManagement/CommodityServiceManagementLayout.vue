<template lang="pug">
  div
    major-tab(moduleName="商品服务管理")
      router-link.tab-item(:to="{name: 'brandManagement'}") 品牌管理
      router-link.tab-item(:to="{name: 'goodsClassificationManagement'}") 商品分类管理
      router-link.tab-item(:to="{name: 'serviceClassificationManagement'}") 服务分类管理
      router-link.tab-item(:to="{name: 'commodityManagement'}") 商品管理
      router-link.tab-item(:to="{name: 'serviceManagement'}") 服务管理
      router-link.tab-item(:to="{name: 'commodityCollection'}") 商品收集
      router-link.tab-item(:to="{name: 'serviceCollection'}") 服务收集
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
  import MajorTab from '@/components/generics/MajorTab'
  export default {
    name: 'CommodityServiceManagement',
    components: {
      MajorTab,
    },
  }
</script>
