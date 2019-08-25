<template lang="pug">
  // 单个项
  .checkbox(:class="{'disabled': value.isDisabled}", v-if="checkoutType === 'unit'")
    input(type="checkbox", :id="value.product_id", :checked="value.is_select", @change="toggleItem")
    label(:for="value.product_id")
  //  全选
  .checkbox(:class="{'disabled': is_all_disabled}", v-else-if="checkoutType === 'all'")
    input(type="checkbox", :checked="is_all_select", @change="toggleItem")
    label
</template>

<script>
  /**
   * @augments value 根据传递的参数
   */
  export default {
    name: 'Checkbox',
    props: {
      // 列表数据
      list: {
        type: Array,
        default () {
          return null
        },
      },
      value: {
        type: Object,
        default () {
          return null
        },
      },
      // 当前选中类型，默认'unit'各项   'all'标识全选
      checkoutType: {
        type: String,
        default () {
          return 'unit'
        },
      },
      // 是否全选
      is_all_select: {
        type: Boolean,
        default () {
          return false
        },
      },
      // 禁用全选按钮
      is_all_disabled: {
        type: Boolean,
        default () {
          return false
        },
      },
    },
    methods: {
      toggleItem () {
        let _this = this
        // 单项选择状态
        if (this.checkoutType === 'unit') {
          // 更新选中状态
          this.value.is_select = !this.value.is_select
          // 判断是否勾选全选
          let all = true
          // 更新列表数据
          this.list.forEach(function (item) {
            // 更新列表当前项的数据
            if (_this.value.product_id === item.product_id) {
              item = _this.value
            }
            // 如果某一项未选中，则不选择全选按钮
            if (!item.is_select) {
              all = false
            }
          })
          this.$emit('isCheckboxFun', {
            type: _this.checkoutType,
            value: _this.value,
            is_all_select: all,
          })
        } else {
          // 全部选择状态
          this.$emit('isCheckboxFun', {
            type: _this.checkoutType,
            is_all_select: !_this.is_all_select,
          })
        }
      },
    },
  }
</script>

<style scoped lang="stylus">
  @import '~@/stylus/mixins'
  .checkbox
    flex-shrink 0
    margin-right 16px
</style>
