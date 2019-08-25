<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    router-view.view-content
</template>

<script>
import ServiceTab from '@/components/generics/ServiceTab'
export default {
  name: 'PageSetting',
  components: {
    ServiceTab,
  },
  data () {
    return {
      tabList: [
        {
          name: '开机大屏',
          type: 'openScreen',
          urlName: 'openScreen',
        },
        {
          name: '金刚区',
          type: 'indexGuide',
          urlName: 'indexGuide',
        },
        {
          name: '轮播图',
          type: 'bannersPage',
          urlName: 'bannersPage',
        },
        {
          name: '爆品推荐',
          type: 'hotBannerPage',
          urlName: 'hotBannersPage',
        },
        {
          name: '平台开屏', // RecommendOil
          type: 'superBannersPage',
          urlName: 'superBannersPage',
        },
        {
          name: '推荐换油',
          type: 'recommendOil',
          urlName: 'recommendOil',
        },
        {
          name: '品牌专区',
          type: 'brandArea',
          urlName: 'brandArea',
        },
        {
          name: '小贴士',
          type: 'tips',
          urlName: 'tips',
        },
      ],
      tab: {
        name: '开机大屏',
        type: 'openScreen',
        urlName: 'openScreen',
      },
      enterpriseName: '',
      enterpriseId: '',
    }
  },
  methods: {
    changePage (params) {
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

.content {
  height: calc(100% - 56px);
}

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


