<template lang="pug">
  .section-layout
    .content-wrapper
      span 这里没有更多信息
</template>

<script>
import EmptyPage from '@/components/generics/EmptyPage'
import workbenchMixin from '@/mixins/modules/workbench'
import imageScale from '@/mixins/utilities/imageScale'
import { mapGetters } from 'vuex'

export default {
  name: 'WorkBenchOverview',
  mixins: [workbenchMixin, imageScale],
  components: {
    EmptyPage,
  },
  data () {
    const tabs = [{
      id: 'ALL',
      list: [],
      count: 0,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      hasMore: true,
    }, {
      id: 'WASHING',
      list: [],
      count: 0,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      hasMore: true,
    }, {
      id: 'MAINTENANCE',
      list: [],
      count: 0,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      hasMore: true,
    }, {
      id: 'SHOP',
      list: [],
      count: 0,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      hasMore: true,
    }, {
      id: 'INSPECTION',
      list: [],
      count: 0,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      hasMore: true,
    }]
    return {
      isInitiated: false,
      tabs: tabs,
      counts: {
        ALL: 0,
        WASHING: 0,
        MAINTENANCE: 0,
        SHOP: 0,
        INSPECTION: 0,
      },
      currentTab: tabs[0],
      isFetching: false,
    }
  },
  computed: {
    ...mapGetters({
      currentEnterprise: 'currentEnterprise',
    }),
  },
  methods: {
    async getCounts () {
      try {
        const {response, result} = await this.fetchReservationCounts()
        if (response.status === 200) {
          let all = 0
          for (let key in result.data) {
            if (key !== 'WASHING') {
              all += result.data[key]
            }
          }
          result.data['ALL'] = all
          this.counts = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类数量失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类数量失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    async getList (type) {
      try {
        const {response, result} = await this.fetchReservationList({
          type: type === 'ALL' ? undefined : type,
          page: this.currentTab.paginationData.current_page,
          per_page: this.currentTab.paginationData.per_page,
        })
        if (response.status === 200) {
          this.currentTab.list = result.data
          this.currentTab.paginationData = result.meta
          if (result.meta.last_page === result.meta.current_page) {
            this.currentTab.hasMore = false
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表信息失败',
            content: `${result.message}！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表信息失败',
          content: `出错啦！错误码：${err}`,
        })
      }
      this.isInitiated = true
    },
    loadMore () {
      this.currentTab.paginationData.per_page += 20
      this.getList(this.currentTab.id)
    },
    switchTab (type) {
      switch (type) {
        case 'ALL':
          this.currentTab = this.tabs[0]
          this.isInitiated = false
          this.getList(type)
          this.getCounts()
          break
        case 'WASHING':
          this.currentTab = this.tabs[1]
          this.isInitiated = false
          this.getList(type)
          this.getCounts()
          break
        case 'MAINTENANCE':
          this.currentTab = this.tabs[2]
          this.isInitiated = false
          this.getList(type)
          this.getCounts()
          break
        case 'SHOP':
          this.currentTab = this.tabs[3]
          this.isInitiated = false
          this.getList(type)
          this.getCounts()
          break
        case 'INSPECTION':
          this.currentTab = this.tabs[4]
          this.isInitiated = false
          this.getList(type)
          this.getCounts()
          break
      }
    },
    refreshList () {
      this.switchTab(this.currentTab.id)
    },
    // utilities
    getDate (date) {
      const now = new Date()
      const expireLine = now.getTime()
      const oneDay = new Date(this.dateString(new Date(now.setDate(now.getDate() + 1)))).getTime()
      const twoDay = new Date(this.dateString(new Date(now.setDate(now.getDate() + 1)))).getTime()
      const threeDay = new Date(this.dateString(new Date(now.setDate(now.getDate() + 1)))).getTime()
      const position = new Date(date).getTime()
      if (position < expireLine) {
        return this.formatTime(date)
      } else if (position < oneDay) {
        return '今天'
      } else if (position < twoDay) {
        return '明天'
      } else if (position < threeDay) {
        return '后天'
      } else {
        return this.formatTime(date)
      }
    },
    dateString (date) {
      const y = date.getFullYear()
      const m = (date.getMonth() + 101 + '').slice(1)
      const d = (date.getDate() + 100 + '').slice(1)
      const res = `${y}-${m}-${d} 00:00`
      return res
    },
    getTime (date) {
      return date.slice(11, 16)
    },
    formatTime (date) {
      return date.slice(0, 10).replace(/-/g, '/')
    },
    minutesTransformer (seconds) {
      return `${parseInt(seconds / 60)} 分钟`
    },
  },
  mounted () {
    this.getList(this.currentTab.id)
    this.getCounts()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
@import '~@/stylus/modules/table-sp'
.reserve-operation-wrapper
  display flex
  justify-content space-between
  align-items center
  flex-shrink 0
  margin-bottom 16px
  justify-content flex-start
  background-color #fff

.workbench-table
  padding 0
.list-header
  display flex
  align-items center
  justify-content space-between
  flex 0 0 64px
  height 64px
  padding 0 24px
  background-color #fff
  border-bottom 1px solid line
  border-radius 3px 3px 0 0
.tab-container
  position relative
  height 100%
.tab-item
  position relative
  display inline-block
  margin-right 30px
  font-size 18px
  line-height 64px
  color lightGrey
  cursor pointer
  &::after
    display none
    content ''
    position absolute
    bottom 0
    left 0
    height 0
    width 100%
    border 1px solid primary
  &.active
    color standblack
    .tag
      background-color primary
    &::after
      display block
      background-color primary
.load-more
  position relative
  height 50px
  padding 0 24px
  line-height 50px
  font-size 14px
  text-align center
  background-color #fff
  border-radius 0 0 3px 3px
  color placeholder
  &::before
    content ''
    position absolute
    top 0
    left 0
    width 100%
    border-top 1px solid line
.expired
  color error
</style>
