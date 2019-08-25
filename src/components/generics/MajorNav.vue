<template lang="pug">
  .root(:class="{'is-show': isShow}", @click="toggleNav(false)")
    .logo-wrapper
      router-link.logo(:to="{name: 'enterpriseList'}")
    ul.major-nav(@click="clearGlobal")
      li
        router-link.nav-tab.complany(:to="{name: 'enterpriseList'}", :class="{'is-active': isCurrentPath('enterprise')}") 企业管理
      li
        router-link.nav-tab.client(:to="{name: 'customerList'}", :class="{'is-active': isCurrentPath('customer')}") 客户管理
      li
        router-link.nav-tab.store(:to="{name: 'storeList'}", :class="{'is-active': isCurrentPath('store')}") 门店管理
      li
        router-link.nav-tab.goods(:to="{name: 'brandManagement'}", :class="{'is-active': isCurrentPath('commodityServiceManagement')}") 商品服务管理
      li
        router-link.nav-tab.brandhouse(:to="{name: 'brandHouseList'}", :class="{'is-active': isCurrentPath('BrandHouse')}") 品牌馆
      li
        router-link.nav-tab.draw(:to="{name: 'drawList'}", :class="{'is-active': isCurrentPath('draw')}") 营销助手
      li
        router-link.nav-tab.order(:to="{name: 'orderList'}", :class="{'is-active': isCurrentPath('order')}") 订单管理
      li
        router-link.nav-tab.material(:to="{name: 'posterMaterialList'}", :class="{'is-active': isCurrentPath('material')}") 物料管理
      li
        router-link.nav-tab.content(:to="{name: 'contentList'}", :class="{'is-active': isCurrentPath('content')}") 内容管理
      li
        router-link.nav-tab.setting(:to="{name: 'adminList'}", :class="{'is-active': isCurrentPath('basics')}") 基础维护
      li
        router-link.nav-tab.brandseries(:to="{name: 'typeList', query: {name: '分类型', type: 'typeList', urlName: 'typeList',}}", :class="{'is-active': isCurrentPath('brandseries')}") 品牌系列管理
      li
        router-link.nav-tab.brandsupport(:to="{name: 'brandSupportList'}", :class="{'is-active': isCurrentPath('brandsupport')}") 品牌支持
      li
        router-link.nav-tab.functions(:to="{name: 'type', query: {name: '车检类型管理', type: 'type', urlName: 'type',}}", :class="{'is-active': isCurrentPath('functions')}") 功能设置
      li
        router-link.nav-tab.reportList(:to="{name: 'incomeSummary'}", :class="{'is-active': isCurrentPath('report')}") 统计管理
      li
        router-link.nav-tab.permission(:to="{name: 'operationLogList'}", :class="{'is-active': isCurrentPath('permission')}") 权限管理
</template>

<script>
import { mapGetters } from 'vuex'
import { hub } from '@/plugins/EventHub'

export default {
  name: 'MajorNav',
  data () {
    return {
      isShow: false,
    }
  },
  computed: {
    ...mapGetters({
      isSystemAdmin: 'isSystemAdmin',
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    isCurrentPath (name) {
      return this.$route.meta.module === name
    },
    toggleNav (state) {
      this.isShow = state
    },
    clearGlobal () {
      hub._data._global = null
    }
  },
  mounted () {
    this.$hub.$on(this.$hub.events.navChange, this.toggleNav)
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins';

major-width = 152px;
rootZIndex = 50;

.root {
  flex-grow: 0;
  flex-shrink: 0;
  width: major-width;
  background: #313942;
  box-shadow: 4px 0 12px 0 rgba(0, 0, 0, 0.1);
  height: 100%;

  +media(standWidth) {
    position: fixed;
    height: 100%;
    z-index: rootZIndex;
    width: 0;
    overflow: hidden;
    transition: width 0.2s;

    &:after {
      opacity: 0;
      transition: opacity 20s;
    }

    &.is-show {
      width: major-width;

      &:after {
        content: '';
        display: block;
        position: fixed;
        width: 100%;
        height: 100%;
        background: #303030;
        top: 0;
        left: 0;
        opacity: 0.16;
        z-index: rootZIndex;
      }
    }
  }
}

.logo-wrapper {
  width: major-width;
  height: 56px;
  background: #39424d;
  position: relative;
  z-index: rootZIndex + 1;
  padding-top: 12px;
  padding-left: 16px;

  .logo {
    display: block;
    width: 32px;
    height: 32px;
    position: relative;

    &:before {
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      position: absolute;
      top: 50%;
      margin-top: -8px;
      left: 50%;
      margin-left: -8px;
      background: center no-repeat url('~@/assets/navigation/nav-menu-grey.svg');
    }
  }
}

.major-nav {
  margin-top: 0;
  position: relative;
  z-index: rootZIndex + 1;
  overflow-y: scroll;
  height: calc(100% - 56px);
  padding-bottom: 50px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  li {
    margin-top: 12px;
  }

  .nav-tab {
    display: block;
    padding: 8px 0px 8px 56px;
    font-size: 14px;
    color: #ABB9C9;
    position: relative;

    &.is-active {
      background: #414850;
      color: #fff;
    }

    &::before {
      content: '';
      display: block;
      width: 0px;
      height: 16px;
      background: primary;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -8px;
      transition: width 0.2s;
    }

    &.is-active::before {
      width: 4px;
    }

    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 24px;
      top: 50%;
      margin-top: -8px;
      width: 16px;
      height: 16px;
      background: center no-repeat;
    }
    &.brandsupport::after {
      background-image: url('~@/assets/navigation/nav-support-gray.svg');
    }
    &.brandseries::after {
      background-image: url('~@/assets/navigation/nav-brandseries-gray.svg');
    }
    &.complany::after {
      background-image: url('~@/assets/navigation/nav-complany-grey.svg');
    }

    &.store::after {
      background-image: url('~@/assets/navigation/nav-store-grey.svg');
    }

    &.order::after {
      background-image: url('~@/assets/navigation/nav-order-grey.svg');
    }

    &.material::after {
      background-image: url('~@/assets/navigation/nav-material-grey.svg');
    }

    &.client::after {
      background-image: url('~@/assets/navigation/nav-client-grey.svg');
    }

    &.goods::after {
      background-image: url('~@/assets/navigation/nav-goods-grey.svg');
    }

    &.setting::after {
      background-image: url('~@/assets/navigation/nav-setting-grey.svg');
    }

    &.draw::after {
      background-image: url('~@/assets/navigation/nav-draw-grey.svg');
    }

    &.brandhouse::after {
      background-image: url('~@/assets/navigation/nav-brandhouse-grey.svg');
    }

    &.content::after {
      background-image: url('~@/assets/navigation/nav-content-grey.svg');
    }

    &.functions::after {
      background-image: url('~@/assets/navigation/nav-functions-grey.svg');
    }

    &.reportList::after {
      background-image: url('~@/assets/navigation/nav-reportList-grey.svg');
    }

    &.permission::after {
      background-image: url('~@/assets/navigation/nav-permission-grey.svg');
    }

    &.is-active {
      &.brandsupport::after {
        background-image: url('~@/assets/navigation/nav-support-white.svg');
      }
      &.brandseries::after {
        background-image: url('~@/assets/navigation/nav-brandseries-white.svg');
      }
      &.draw::after {
        background-image: url('~@/assets/navigation/nav-draw-white.svg');
      }

      &.brandhouse::after {
        background-image: url('~@/assets/navigation/nav-brandhouse-white.svg');
      }

      &.complany::after {
        background-image: url('~@/assets/navigation/nav-complany-white.svg');
      }

      &.store::after {
        background-image: url('~@/assets/navigation/nav-store-white.svg');
      }

      &.order::after {
        background-image: url('~@/assets/navigation/nav-order-white.svg');
      }

      &.material::after {
        background-image: url('~@/assets/navigation/nav-material-gray.svg');
      }

      &.client::after {
        background-image: url('~@/assets/navigation/nav-client-white.svg');
      }

      &.goods::after {
        background-image: url('~@/assets/navigation/nav-goods-white.svg');
      }

      &.setting::after {
        background-image: url('~@/assets/navigation/nav-setting-white.svg');
      }

      &.functions::after {
        background-image: url('~@/assets/navigation/nav-functions-white.svg');
      }

      &.reportList::after {
        background-image: url('~@/assets/navigation/nav-reportList-white.svg');
      }

      &.content::after {
        background-image: url('~@/assets/navigation/nav-content-white.svg');
      }

      &.permission::after {
        background-image: url('~@/assets/navigation/nav-permission-white.svg');
      }
    }
  }
}
.major-nav::-webkit-scrollbar {
  display: none;
}
</style>
