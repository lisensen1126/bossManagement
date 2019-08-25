<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 切换支付费率
        .close-button(@click="modalClose")
      .modal-body
        .form-wrapper
          .field-group
            .field.is-horizontal
              label.label 选择费率
              custom-select(:list="rate_data", nameField="label", v-model="rate", :validator="$v.rate", error-info="请选择支付费率")
            .field.is-horizontal
              .tips-text 系统将自动为门店重新申请新的美团支付账户，审核通过后，手续费切换为所选费率。是否确认操作？
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确认
</template>

<script>
import ModalDialog from '@/components/generics/ModalDialog'
import ModalInteractions from '@/mixins/utilities/modalInteractions'
import CustomSelect from '@/components/generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'changeRate',
  components: {
    ModalDialog,
    CustomSelect,
  },
  mixins: [ModalInteractions, validationMixin],
  props: {
    wxRate: Number,
    rateData: {
      type: Array,
    },
  },
  validations: {
    rate: {
      required,
    },
  },
  computed: {
    rate_data () {
      return this.rateData.filter(cell => {
        if (cell.value !== this.wxRate) {
          return cell
        }
      })
    },
  },
  data () {
    return {
      rate: {},
    }
  },
  methods: {
    complete () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.$emit('resolve', this.rate)
    },
  },
  mounted () { },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.text
  font-weight 700
  color #FE0000
.modal-header
  padding 20px 24px
.modal-footer
  padding 12px 16px
.modal-body
  padding 20px
  min-height 110px
  line-height 22px
  font-size 15px
  color #888
</style>

