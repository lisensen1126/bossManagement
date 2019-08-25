<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 创建优惠券
      .field-group.is-horizontal
        .field
          label.label 优惠券名称
          custom-input(placeholder="请输入优惠券名称", v-model="prize_info.name", error-info="请填写优惠券名称(15字之内)", :validator="$v.prize_info.name", maxlength=15)
      .field-group.is-horizontal
        .field
          label.label 优惠券类型
          custom-select(:list="type_list", v-model="prize_info.type", :input="getType", error-info="请选择优惠券类型", :validator="$v.prize_info.type.id")
      .field-group.is-horizontal
        .field
          label.label 优惠金额
          custom-input(input-type="hasUnit" ,placeholder="请输入优惠金额", need-type='number', v-model="prize_info.discount_money", error-info="请输入大于0且小于10000的整数", :validator="$v.prize_info.discount_money")
            span(slot="unitName") 元
      .field-group.is-horizontal(v-if="prize_info.type && prize_info.type.id === 2")
        .field
          label.label 发送数量
          custom-input(input-type="hasUnit" ,placeholder="请输入优惠券数量", need-type='number', v-model="prize_info.totals", error-info="请输入大于0且小于10000的整数", :validator="$v.prize_info.totals")
            span(slot="unitName") 张
      .field-group.is-horizontal.man(v-if="prize_info.type && prize_info.type.id === 3")
        .field
          label.label.shiyong 使用条件
          .radio
            input(type="radio", id="specific", name="settingType", checked , disabled)
            label.condition-setting(for="specific")
              span 满
              custom-input.condition-input(input-type="hasUnit", need-type='number', v-model="prize_info.full_money", error-info="请输入大于优惠金额的整数", :validator="$v.prize_info.full_money")
                span(slot="unitName") 元
              span 可用
      .field-group.is-horizontal
        .field
          label.label.shiyong 有效期
          custom-input(input-type="hasUnit" ,need-type='number', placeholder="请输入有效天数", v-model="prize_info.effective_days", error-info="请输入大于0且小于999的整数", :validator="$v.prize_info.effective_days")
            span(slot="unitName") 天
    .field
      button.button.large.primary(@click="addDraw") 确定
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import FilterTools from '@/mixins/utilities/filterTools'
  import DrawApi from '@/mixins/modules/draw'
  import {quantityFormat} from '@/mixins/custom-validators/custom-validators'
  export default {
    name: 'CreatePrize',
    mixins: [DrawApi, validationMixin, FilterTools],
    components: {
      CustomInput,
      CustomSelect,
    },
    validations: {
      prize_info: {
        name: {
          required,
        },
        type: {
          id: {
            required,
          },
        },
        discount_money: {
          validate (val, data) {
            if (val - 9999 > 0) {
              return false
            }
            if (data.type === 'DEDUCTION') {
              return true
            } else {
              return val && quantityFormat(val)
            }
          },
        },
        effective_days: {
          validate (val, data) {
            if (val - 999 > 0) {
              return false
            } else {
              return val && quantityFormat(val)
            }
          },
        },
        totals: {
          validate (val, data) {
            if (this.prize_info.type.id === 3) {
              return true
            } else {
              if (val - 9999 > 0) {
                return false
              }
              if (data.type === 'DEDUCTION') {
                return true
              } else {
                return val && quantityFormat(val)
              }
            }
          },
        },
      },
    },
    data () {
      return {
        type: {},
        // 优惠券类型
        type_list: [{
          name: '满减券',
          id: 3,
        }, {
          name: '兑换券',
          id: 2,
        }],
        prize_info: {
          name: '', // 优惠券名称
          type: {}, // 优惠券类型
          discount_money: '', // 优惠金额
          full_money: '', // 满减金额
          totals: '', // 数量
          effective_days: '', // 有效天数
        },
        is_uploading: true,
      }
    },
    computed: {
      /*
      * 切换优惠券类型
      * @ q 所选优惠券类型
      * */
      getType (q) {
        this.prize_info.type = q
      },
    },
    methods: {
      // 添加优惠券
      addDraw () {
        if (!this.is_uploading) {
          return
        }
        if (this.prize_info.type.id === 2) {
          this.prize_info.full_money = ''
        }
        if (this.prize_info.full_money !== '') {
          if (!(/(^[1-9]\d*$)/.test(this.prize_info.full_money))) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加奖品失败',
              content: '满减条件金额必须为整数',
            })
            return
          } else {
            // console.log(this.prize_info.full_money, '+++', this.prize_info.discount_money)
            if (Number(this.prize_info.full_money) < Number(this.prize_info.discount_money)) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加奖品失败',
                content: '满减条件金额必须大于优惠金额',
              })
              return
            }
          }
        }
        if (this.prize_info.totals !== '') {
          if (!(/(^[1-9]\d*$)/.test(this.prize_info.totals))) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加奖品失败',
              content: '优惠券发放数量必须为整数',
            })
            return
          }
        }
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        if (this.prize_info.type.id === 3 && this.prize_info.full_money === '') {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加奖品失败',
            content: '满减优惠券的使用条件必填',
          })
          return
        }
        if (this.prize_info.type.id === 2 && this.prize_info.totals === '') {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加奖品失败',
            content: '兑换券的数量必填',
          })
          return
        }
        // let time = this.prize_info.validity_start_time
        // let time2 = this.prize_info.validity_end_time
        // // 时间转为时间戳
        // time = '' + (new Date(time.replace(/-/g, '/'))).getTime() / 1000
        // time2 = '' + (new Date(time2.replace(/-/g, '/'))).getTime() / 1000
        // if (time > time2) {
        //   this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '添加奖品失败',
        //     content: '兑换券的失效时间有误',
        //   })
        //   return
        // }
        this.is_uploading = false
        this.addApi()
      },
      /*
      * 添加接口
      * @ start 开始时间
      * @ end 结束时间
      * */
      async addApi () {
        var self = this
        try {
          const {result, response} = await this.createPrize({
            name: self.prize_info.name,
            type: self.prize_info.type.id,
            discount_money: self.prize_info.discount_money,
            full_money: self.prize_info.full_money,
            totals: self.prize_info.totals,
            effective_days: self.prize_info.effective_days,
          })
          if (response.status === 200) {
            if (result.message === 'success' && result.code === 0) {
              this.successToast()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加失败',
                content: `出错啦！错误码：${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: `出错啦！错误码：${err}`,
          })
        }
        this.is_uploading = true
      },
      // 添加成功
      successToast: function () {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'success',
          title: '成功',
          content: '奖品添加成功',
          resolve: () => {
            this.$emit('success')
          },
        })
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .slide-layout .cus-box .field-group .field
    width 100% !important
  .condition-setting
    display inline-flex
    align-items center
  .condition-input
    margin 0 8px
    width 100px
  .man
    height 70px
  .choose
    width 100%
    .date
      display inline-block
      width 40%
    .haha
      display inline-block
      width 15%
      font-size 12px
  .select-box-wrapper
  display flex
  .select-box
    flex 1
    select
      width 100%
      border 1px solid #ccc
      height 32px
      box-sizing border-box
      border-radius 2px
      box-sizing border-box
      padding 0 12px
  .select-box + .select-box
    margin-left 8px
  .is-flex
    display flex
  .shiyong
    margin-bottom 12px
</style>
