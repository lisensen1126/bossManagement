<template lang="pug">
  modal-dialog
    .modal-card.is-message-modal(slot="card")
      header.message-modal-sign
        span.message-modal-icon(:class="`is-${message.type}`")
        h4.message-modal-heading(v-text="message.title")
      section.modal-card-body
        .content(v-html="message.content")
      footer.message-modal-buttons(v-if="!message.autoClose")
        button.message-modal-button(type="button", v-if="message.isRejectable", v-text="message.secondary", @click="onReject")
        button.message-modal-button.is-primary(type="button", v-text="message.primary", @click="onResolve")
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'

export default {
  name: 'MessageModal',
  components: {ModalDialog},
  props: {
    message: {
      type: Object,
      default: {},
    },
  },
  methods: {
    onResolve () {
      window.Promise.resolve(this.message.resolve && this.message.resolve()).then(() => this.$store.dispatch('hideMessage', this.message))
    },
    onReject () {
      window.Promise.resolve(this.message.reject && this.message.reject()).then(() => this.$store.dispatch('hideMessage', this.message))
    },
  },
  watch: {
    'message.autoClose': {
      handler (val) {
        if (val) {
          setTimeout(() => {
            this.onResolve()
          }, this.message.duration)
        }
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins.styl'

.modal-card.is-message-modal
  overflow hidden
  width 320px
  text-align center
  background #fff
  border-radius borderRadiusLarge
  .modal-card-body
    min-height 48px
    padding 8px 28px 18px
    color lightGrey
    font-size 13px
    line-height 18px

.message-modal-sign
  padding 31px 28px 0

.message-modal-icon
  display block
  width 64px
  height 64px
  margin 0 auto
  background-position center
  background-repeat no-repeat
  &.is-success
    background-image url('~@/assets/modal/success.svg')
  &.is-warning,
  &.is-failure
    background-image url('~@/assets/modal/warning.svg')

.message-modal-heading
  margin-top 21px
  line-height 28px
  font-size 18px
  color standblack

.message-modal-buttons
  display flex
  height 56px
  box-shadow 0 -1px 0 0 rgba(0, 0, 0, .08)
  .message-modal-button
    +clickable()
      height 100%
      flex 1 0 auto
      color lightGrey
      background-color #fff
      border 0
      outline 0
      font-size 16px
      &:not(:first-child)
        border-left 1px solid rgba(0, 0, 0, .06)
      &.is-primary
        color primary

</style>
