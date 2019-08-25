<template lang="pug">
  modal-dialog(modal-scale="small")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title 请输入下架原因
        .close-button(@click="modalClose")
      .modal-body
        custom-input(v-model="reason", placeholder="请输入下架原因")
      .modal-footer.level
        .level-left
        .level-right
          span.cancel-button(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 提交
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomInput from '@/components/generics/form/CustomInput'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'

  export default {
    name: 'ChooseStore',
    components: {
      ModalDialog,
      CustomInput,
    },
    mixins: [ModalInteractions],
    props: {
    },
    data () {
      return {
        reason: '',
      }
    },
    watch: {
    },
    methods: {
      // 完成
      complete () {
        this.$emit('callback', this.reason)
      },
      // modal 隐藏
      modalClose () {
        this.$emit('cacel')
      },
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
    text-align center
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height auto
    display flex
    flex-direction column
    padding-bottom 36px
  .custom-input
    flex-grow 1
    margin-right 8px
  .modal-body
    padding 20px 20px
</style>
