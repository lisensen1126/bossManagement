<!--门店详情导航模块-->
<template lang="pug">
  div.content
    service-tab.top-nav( v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changeTab")
    .nav-back-btn(@click="goBack")
    // 门店详情
    store-create(v-if="tab.type == 'storeDetail'")
    // 体验二维码
    store-experience-management(v-if="tab.type == 'storeExperienceManagement'")
    // 美团、服务号、小程序
    store-meituan-pay(v-if="tab.type == 'storeMeituanPay' || tab.type == 'serviceNumber' || tab.type == 'miniProgram'", :tabType=" tab.type")
</template>

<script>
  import ServiceTab from '@/components/generics/ServiceTab'
  import StoreCreate from '@/components/store/StoreCreate'
  import StoreExperienceManagement from '@/components/store/StoreExperienceManagement'
  import StoreMeituanPay from '@/components/store/StoreMeituanPay'
  export default {
    name: 'storeDetailNav',
    components: {
      ServiceTab,
      StoreCreate,
      StoreExperienceManagement,
      StoreMeituanPay,
    },
    data () {
      return {
        tabList: [
          {
            name: '门店详情',
            type: 'storeDetail',
          },
          {
            name: '体验权限',
            type: 'storeExperienceManagement',
          },
          {
            name: '美团支付',
            type: 'storeMeituanPay',
          },
          {
            name: '服务号',
            type: 'serviceNumber',
          },
          {
            name: '小程序',
            type: 'miniProgram',
          },
        ],
        tab: {
          name: '门店详情',
          type: 'storeDetail',
        },
      }
    },
    methods: {
      // 切换顶部tab
      changeTab (params) {
        this.tab = params
      },
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
    },
    mounted () {
      this.changeTab(this.tabList[0])
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';
  .content {
    position: relative;
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
  .nav-back-btn {
    position: absolute;
    top: 10px;
    left: 16px;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background: #CED3DC center no-repeat url('~@/assets/back.svg');
    background-size: 16px;
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
    cursor: pointer;
    z-index: 9;
  }
</style>


