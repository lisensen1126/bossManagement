<template lang="pug">
  .control(:class="[{ 'is-error': validator && validator.$error, 'is-disabled': isDisabled}, scaleClass]")
    textarea.textarea(:value="value", @input="updateValue($event.target.value)", @blur="check($event.target.value)", :placeholder="placeholder", :disabled="isDisabled", :maxlength="maxlength", :type="type", :max="max", :min="min", :class="{'textarea-max': textareaMax}")
    .error-icon(v-show="validator && validator.$error")
    .error-info(v-show="validator && validator.$error", v-text="errorInfo",  :class="{'error-info-max': textareaMax}")
    .count-info
      slot(name="countInfo")
    .unit-info
      slot(name="unitName")
</template>

<script>
/**
 * @augments textareaType 默认为normal 根据需求传递hasUnit(带单位) hasCount(带计数)
 * @augments validator 传递vuelidate对象 判断对错 参考erp-center
 * @augments isDisabled 为true时 禁止输入
 * @description 根据需求传递slot countInfo为信息 unitName为单位
 */
export default {
  name: 'CustomInput',
  props: {
    value: [String, Number],
    type: {
      type: String,
      default () {
        return 'text'
      },
    },
    placeholder: {
      type: String,
      default () {
        return ''
      },
    },
    maxlength: {
      type: String,
    },
    max: {
      type: String,
    },
    min: {
      type: String,
    },
    textareaType: {
      type: String,
      default () {
        return 'normal'
      },
    },
    validator: {
      type: Object,
      default () {
        return null
      },
    },
    errorInfo: {
      type: String,
      default () {
        return ''
      },
    },
    isDisabled: {
      type: Boolean,
      default () {
        return false
      },
    },
    textareaMax: {
      type: Boolean,
      default () {
        return false
      },
    },
  },
  data () {
    return {
      // errorInfo: '',
    }
  },
  computed: {
    scaleClass () {
      return this.textareaType === 'hasCount' ? 'has-count'
      : this.textareaType === 'hasUnit' ? 'has-unit' : `is-${this.textareaType}`
    },
  },
  mounted () {
    // this.getUnitWidth()
  },
  methods: {
    updateValue (value) {
      this.$emit('input', value)
      this.validator && this.validator.$touch()
    },
    check (value) {
      this.$emit('blur', value)
    },
    // getUnitWidth () {
    //   let unitNameDom = this.$el.querySelector('.unitName')
    //   if (unitNameDom) {
    //     let domWidth = parseInt(window.getComputedStyle(unitNameDom).width)
    //     if (domWidth > 28) {
    //       this.$el.querySelector('.input').style.paddingRight = domWidth + 22 + 'px'
    //       this.$el.querySelector('.error-icon').style.right = domWidth + 9 + 'px'
    //     }
    //   }
    // },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.error-info
  z-index 30
  bottom 46px!important
.is-error
  textarea.textarea
    border-color error
.has-count.is-error
  .error-icon
    top 16px
    right 60px
.has-unit.is-error
  .error-icon
    top 16px
    right 50px
.change-rule-modal-body
  .has-unit.is-error
    .error-icon
      top 16px
      right 62px
.textarea
  min-height 70px
.textarea-max
  min-height 150px !important
.error-info-max
  z-index 30
  bottom 87px!important
</style>
