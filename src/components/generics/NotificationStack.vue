<template lang="pug">
  .notification-stack
    transition-group.notification-list(tag="ul", name="fade")
      li.notification-card(v-for="notification in notifications", :key="notification.id")
        .notification-body
          .notification-time(v-text="formatTime(notification.time)")
          .notification-content(v-text="notification.content")
        .notification-controls
          .remove-notification(@click="removeNotification(notification)") 已阅
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'NotificationStack',
    computed: {
      ...mapGetters({
        notifications: 'notificationStack',
      }),
    },
    methods: {
      ...mapActions([
        'removeNotification',
      ]),
      formatTime (date) {
        return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
      },
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.notification-stack
  position fixed
  right 16px
  bottom 0
  box-sizing border-box
  padding-bottom 24px
  width 320px
  height 100%
  pointer-events none
  overflow hidden
  z-index 9999

.notification-list
  position absolute
  bottom 24px
  right 0
  z-index 9999

.notification-card
  display flex
  align-items stretch
  width 320px
  background-color #fff
  border-radius 3px
  box-shadow 0 2px 6px -1px rgba(0,0,0,.1), 0 5px 28px -3px rgba(21,21,25,.1)
  opacity 1
  overflow hidden
  pointer-events auto
  &::before
    content ''
    display block
    flex 0 0 3px
    width 3px
    background linear-gradient(-135deg, #ffbd39 0%, #ffd762 100%)
  &:not(:first-child)
    margin-top 8px

.fade-enter-active
.fade-leave-active
  transition opacity .3s

.fade-enter
.fade-leave-to
  opacity 0

.notification-body
  flex 1 1 auto
  padding 12px
  word-break break-all

.notification-time
  line-height 16px
  font-size 12px
  color lightGrey

.notification-content
  margin-top 4px
  line-height 20px
  font-size 13px

.notification-controls
  flex 0 0 62px
  display flex
  justify-content center
  align-items center
  position relative
  &::before
    content ''
    display block
    position absolute
    left 0
    top 50%
    width 1px
    height 18px
    background-color rgba(0,0,0,.08)
    transform translateY(-50%)

.remove-notification
  display block
  padding 4px
  font-size 13px
  color #2fabdd
  cursor pointer
</style>
