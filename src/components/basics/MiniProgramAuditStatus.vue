<template lang="pug">
  .authorization-wrapper
    .content-container
      .corp-icon-wrapper
        .corp-icon
        | 小程序审核状态查询
      ul.corp-info-list
        li
          .label 小程序名称
          .content(v-text="name")
        li(v-if="code_library_version")
          .label 正在审核的版本
          .content(v-text="code_library_version")
        li
          .label 审核状态
          .content(v-if="status == 'AUDITING'")
            .status-dot.primary
            span 审核中
          .content(v-if="status == 'AUDITED'")
            .status-dot.green
            span 审核通过
          .content(v-if="status == 'REFUSED'")
            .status-dot.red
            span 审核失败
        li(v-if="status == 'REFUSED'")
          .label 审核失败原因
          .content(v-text="reason")
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回
</template>

<script>
  import AdminApi from '@/mixins/modules/basics'
  export default {
    name: 'miniProgramAuditStatus',
    mixins: [AdminApi],
    components: {
    },
    data () {
      return {
        status: 999,
        name: '',
        app_id: '',
        code_library_version: '',
        reason: '',
      }
    },
    methods: {
      // 点击返回
      goBack () {
        this.$router.replace({
          name: 'smallEditionList',
          query: {
            save: 1,
          },
        })
      },
      // 获取小程序审核状态
      async getStatus () {
        let _this = this
        try {
          const {response, result} = await _this.miniCheckApi({
            app_id: this.app_id,
          })
          if (response.status === 200 && result.code === 0) {
            this.status = result.data.status
            this.reason = result.data.reason ? result.data.reason : ''
          } else {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取小程序审核状态失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小程序审核状态失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
    },
    mounted () {
      this.name = this.$route.query.name
      this.app_id = this.$route.query.app_id
      this.code_library_version = this.$route.query.code_library_version
      this.getStatus() // 获取小程序审核状态
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';
  .authorization-wrapper
    flex 1 1 auto
    display flex
    flex-direction column
    margin 16px 40px
    border-radius 3px
    background-color #fff
    align-items center
  .content-container
    position relative
    width 100%
    overflow-y auto

  .corp-icon-wrapper
    margin 0 auto
    width 640px
    padding 120px 0 24px
    text-align center
    font-size 18px
    line-height 24px
    border-bottom 1px solid rgba(0, 0, 0, .08)
    &.error-wrapper
      padding 200px 0 50px
    .error-info
      margin-top 7px
      font-size 14px
      line-height 20px
      color #999
  .corp-icon
    position absolute
    left 50%
    top 42px
    transform translateX(-50%)
    width 60px
    height 60px
    border-radius 60px
    background #e4e4e4 center no-repeat
    background-size contain
    background-image url('~@/assets/settings/entrance-mini.png')
    box-shadow 0 0 0 0 rgba(0,0,0,0.05), 0 6px 16px 0 rgba(0,0,0,0.05), 0 2px 20px 0 rgba(255,189,19,0.05)
    .error-icon
      position absolute
      right -2px
      bottom -2px
      width 24px
      height 24px
      border-radius 24px
      background #ff553d center no-repeat url('~@/assets/settings/auth-alert.svg')
      background-size 16px
      box-shadow 0 2px 8px 0 rgba(255, 0, 0, .10)
      z-index 2
    .error-wrapper &
      top 120px

  .corp-info-list
    margin 0 auto
    width 640px
    padding 48px 0
    border-bottom 1px solid rgba(0, 0, 0, .08)
    li
      display flex
      justify-content center
      font-size 13px
      line-height 16px
      + li
        margin-top 40px
    .content
    .label
      width 50%
    .label
      padding-left 146px

  .btn-wrapper
    text-align center
</style>
