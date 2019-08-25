<template lang="pug">
  .section-layout
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    keep-alive
      router-view(v-if="$route.meta.keepAlive")
    router-view(v-if="!$route.meta.keepAlive")
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
export default {
  name: 'payReduceNav',
  components: {
    ServiceTab,
  },
  data () {
    return {
      tabList: [
        {
          name: '报名门店',
          type: 'storeLsit',
          urlName: 'PayReduceList',
        },
        {
          name: '统计数据',
          type: 'PayReduceStatistics',
          urlName: 'PayReduceStatistics',
        },
      ],
      tab: {
        name: '报名门店',
        type: 'storeLsit',
        urlName: 'PayReduceList',
      },
    }
  },
  methods: {
    changePage (params) {
      console.log(params)
      this.$router.push({
        name: params.urlName,
        query: {
          name: params.name,
          type: params.type,
          urlName: params.urlName,
        },
      })
    },
  },
  watch: {
    '$route' () {
      let tabs = this.$route.query
      if (tabs.urlName) {
        this.tab = tabs
      } else {
        this.changePage(this.tabList[0])
      }
    },
  },
  mounted () {
    let tabs = this.$route.query
    console.log(tabs)
    if (tabs.urlName) {
      this.tab = tabs
    } else {
      this.changePage(this.tabList[0])
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
@import '~@/stylus/mixins';
@import '~@/stylus/modules/table-sp';

.top-nav {
  display: flex;
  flex: 0 0 48px;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 48px;
  padding-left: 64px;
  padding-right: 64px;
  background-color: #fcfcfc;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  z-index: 8;
}
</style>


