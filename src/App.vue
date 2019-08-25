<template lang="pug">
  #app.sans
    loading(v-show="fetchLoading")
    router-view(v-if="isRouterAlive")
    message-stack
    notification-stack
    announcer
</template>

<script>
import store from './vuex/store'
import filters from './filters'
import router from './router'
import MessageStack from './components/generics/MessageStack'
import NotificationStack from '@/components/generics/NotificationStack'
import Announcer from '@/components/generics/Announcer'
import Loading from './components/generics/Loading'
import { mapGetters } from 'vuex'
export default {
  name: 'app',
  store,
  router,
  filters: filters,
  components: {
    MessageStack,
    NotificationStack,
    Announcer,
    Loading,
  },
  computed: {
    ...mapGetters([
      'fetchLoading',
    ]),
  },
  provide () { // 注册一个方法 刷新
    return {
      reload: this.reload,
    }
  },
  data () {
    return {
      isRouterAlive: true,
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
  },
}
</script>
