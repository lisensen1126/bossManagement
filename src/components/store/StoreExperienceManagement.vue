<template lang="pug">
  .section-layout(ref="scrolls")
    .content-wrapper(:class="{'default_height': show_default}")
      empty-page(v-if="show_default", :tip="'该门店尚未授权小程序'")
      .section-filter.height-auto.display-block(v-if="code_img")
        h2.level.header-wrapper
          .level-left
            .header-title 小程序体验二维码
        .field-group.is-horizontal
          .field.qrcode-box
            open-image(img-type="1",is-original=true, :img-url="code_img",mini-width="150",mini-height="150",margin-bottom="0", margin-right="5", border-radius="2")
    .content-wrapper(v-if="isInitiated",:class="{'default_height': !(list && list.length)}")
      .section-filter.height-auto.display-block
        h2.level.header-wrapper
          .level-left
            .header-title 已有体验权限成员列表
          .level-right
            a.button.small.primary(@click="addTester") 添加
      empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前无已有体验权限的成员数据'")
      .list-wrapper(v-if="list && list.length")
        .table-wrapper
          table.table
            thead
              tr
                td(width="150") 微信号
                td(width="90") 姓名
                td(width="100") 备注
                td(width="80") 添加时间
            tbody(v-if="list.length")
              tr(v-for="(item, index) in list")
                td
                  .simple-td(v-text="item.user_account_id ? item.user_account_id : '--'")
                td
                  .simple-td(v-text="item.name ? item.name : '--'")
                td
                  .simple-td(v-text="item.remark ? item.remark : '--' ")
                td
                  .simple-td(v-text="item.created_at ? item.created_at : '--' ")
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      store-tester-add(@success="additionHandler",:shop-id="shop_id")
</template>


<script>
  import enterpriseMixin from '@/mixins/modules/enterprise'
  import EmptyPage from '@/components/generics/EmptyPage'
  import OpenImage from '@/components/generics/OpenImage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import StoreTesterAdd from '@/components/store/StoreTesterAdd'
  export default {
    name: 'StoreExperienceManagement',
    mixins: [enterpriseMixin],
    components: {
      EmptyPage,
      OpenImage,
      SlideOutModal,
      StoreTesterAdd,
    },
    data () {
      return {
        code_img: '',
        list: [],
        show_default: '', // 判断展示未授权缺省图
        isInitiated: false,
        slideVisible: false, // 控制添加权限模态框显隐
      }
    },
    methods: {
      // 添加权限模态框展示/隐藏
      toggleSidePannel () {
        this.slideVisible = !this.slideVisible
      },
      // 点击添加操作
      addTester () {
        this.slideVisible = true
      },
      // 添加权限成功回调
      additionHandler () {
        this.fetchList()
        this.toggleSidePannel()
      },
      // 获取体验二维码
      async getCode () {
        try {
          const {response, result} = await this.testCodeAPi({
            shop_id: this.shop_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.code_img = result.data.tester_qrcode
            this.fetchList() // 获取已有体验权限成员列表
          } else {
            if (result.code === 4022) {
              this.show_default = true
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取体验二维码失败',
                content: result.message,
              })
            }
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取体验二维码失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      // 获取已有体验权限成员列表
      async fetchList () {
        try {
          const {response, result} = await this.testerListAPi({
            shop_id: this.shop_id,
          })
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.created_at = this.changeDateTime(item.created_at)
            })
            this.list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取已有体验权限成员列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取已有体验权限成员列表失败',
            content: `出错啦！错误码：${err}`,
          })
        }
        this.isInitiated = true
      },
      /**
       * 时间戳转年月日
       * @val  时间戳
       */
      changeDateTime (val, type) {
        if (!val) {
          return ''
        }
        let date = new Date(val * 1000)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = this.judgeTime(date.getDate()) + ' '
        let h = this.judgeTime(date.getHours()) + ':'
        let m = this.judgeTime(date.getMinutes())
        if (type === 'data') {
          return Y + M + D
        } else if (type === 'datetime') {
          return Y + M + D + h + m
        } else {
          return Y + M + D + h + m
        }
      },
      /**
       * 时 分 格式化
       * @t  时分
       */
      judgeTime (t) {
        if (t < 10) {
          return '0' + t
        } else {
          return t
        }
      },
    },
    mounted () {
      this.shop_id = this.$route.query.shop_id
      this.getCode() // 获取体验二维码
    },
  }
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.default_height
  min-height 100%
.section-layout
  height calc(100% - 56px)
  display block
  overflow-y auto
.section-filter
  display flex
  justify-content space-between
  background #fff
.header-title
  font-size 15px
  font-weight bold
  border-left: 3px solid #ffbb29;
  padding-left: 6px;
  position relative
  left -9px
  line-height 1
.header-wrapper
  align-items center
.display-block
  display block
.height-auto
  height auto
.qrcode-box
  text-align center
  width 100%
  img
    width 150px
    height 150px
.tfoot
  bottom initial
</style>
