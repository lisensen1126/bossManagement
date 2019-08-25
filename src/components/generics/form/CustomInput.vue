<template lang="pug">
  .control(:class="[{ 'is-error': validator && validator.$error, 'is-disabled': isDisabled}, scaleClass]")
    input.input(:value="value", @input="updateValue($event.target.value)", @blur="check($event.target.value)", :placeholder="placeholder", :disabled="isDisabled", :autocomplete="autocomplete" :maxlength="maxlength", :type="type", :max="max", :min="min", :class="{'is-disabled': isDisabled, 'p-36': padding}", @keyup.enter="keyEnter", ref="input1", :title="value")
    .error-icon(v-show="validator && validator.$error")
    .error-info(v-show="validator && validator.$error", v-text="errorInfo")
    .count-info
      slot(name="countInfo")
    .unit-info
      slot(name="unitName")
</template>

<script>
/**
 * @augments inputType 默认为normal 根据需求传递hasUnit(带单位) hasCount(带计数)
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
    padding: {
      type: Number,
      default () {
        return 0
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
      type: [String, Number],
    },
    needType: {
      type: String,
      default () {
        return 'normal'
      },
    },
    min: {
      type: [String, Number],
    },
    inputType: {
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
      type: '',
      default () {
        return false
      },
    },
    autocomplete: {
      type: '',
      default () {
        return 'on'
      },
    },
  },
  computed: {
    scaleClass () {
      return this.inputType === 'hasCount' ? 'has-count'
      : this.inputType === 'hasUnit' ? 'has-unit' : `is-${this.inputType}`
    },
  },
  mounted () {
    this.getUnitWidth()
  },
  methods: {
    updateValue (value) {
      // 只能输入数字
      if (this.needType === 'number') {
        let data = value.replace(/\D/g, '')
        if (this.max !== undefined) {
          if (this.max < data) data = this.max
        }
        this.$refs.input1.value = data
      }
      // 只能输入数字和小数点
      if (this.needType === 'float') {
        // 先把非数字的都替换掉，除了数字和.
        let a = value.replace(/[^\d.]/g, '')
        // 保证只有出现一个.而没有多个.
        let b = a.replace(/\.{2,}/g, '.')
        // 必须保证第一个为数字而不是小数点
        let c = b.replace(/^\./g, '')
        // 保证.只出现一次小数点，而不能出现两次以上
        this.$refs.input1.value = c.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
        // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        if (c.indexOf('.') < 0 && c !== '') {
          if (c.substr(0, 1) === '0' && c.length === 2) {
            this.$refs.input1.value = c.substr(1, c.length)
          }
        }
      }
      // 只能输入数字字母
      if (this.needType === 'number_letter') {
        this.$refs.input1.value = value.replace(/[\W]/g, '')
      }
      // 只能输入数字和‘-’（主要判断数据为座机时）
      if (this.needType === 'specialTel') {
        let arr = value.split('-')
        let data = ''
        arr.forEach((item, index) => {
          if (index !== arr.length - 1) {
            data += (item.replace(/\D/g, '') + '-')
          } else {
            data += item.replace(/\D/g, '')
          }
        })
        // 必须保证第一个为数字而不是'-'
        let a = data.replace(/^-/g, '')
        // 保证.只出现一次'-'，而不能出现两次以上
        this.$refs.input1.value = a.replace('-', '$#$').replace(/-/g, '').replace('$#$', '-')
      }
      this.$emit('input', this.$refs.input1.value)
      this.validator && this.validator.$touch()
    },
    check (value) {
      this.$emit('blur', value)
    },
    getUnitWidth () {
      let unitNameDom = this.$el.querySelector('.unit-info')
      if (unitNameDom && unitNameDom.innerHTML) {
        let domWidth = parseInt(window.getComputedStyle(unitNameDom).width)
        if (domWidth > 28) {
          this.$el.querySelector('.input').style.paddingRight = domWidth + 22 + 'px'
          this.$el.querySelector('.error-icon').style.right = domWidth + 9 + 'px'
        }
      }
    },
    keyEnter () {
      this.$emit('keyupEnter')
    },
  },
}
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins'
  .error-info
    z-index 30
  .has-count.is-error
    .error-icon
      right 50px
  .has-unit.is-error
    .error-icon
      right 40px
  .change-rule-modal-body
    .has-unit.is-error
      .error-icon
        right 52px
  .p-36
    padding 7px 36px
    text-align center
  .is-disabled
    cursor not-allowed
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button
    -webkit-appearance: none !important
</style>
