<!--添加小程序体验者模态框-->
<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 添加权限
      .field-group.is-horizontal
        .field
          label.label 微信号
          custom-input(placeholder="请输入微信号", v-model="info.wechat_id", error-info="请输入微信号", :validator="$v.info.wechat_id")
      .field-group.is-horizontal
        .field
          label.label 姓名
          custom-input(placeholder="请输入姓名(10字之内)", v-model="info.name", error-info="请输入模板名称(10字之内)", :validator="$v.info.name", maxlength=10)
      .field-group.is-horizontal
        .field
          label.label 备注
          custom-textarea.textarea(placeholder="请输入备注(30字之内)", v-model="info.remark", :validator="$v.info.remark", error-info="请输入备注", maxlength=30)
    .field
      button.button.large.primary(@click="addRight") 添加
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomTextarea from '@/components/generics/form/CustomTextarea'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import EnterpriseApi from '@/mixins/modules/enterprise'
  export default {
    name: 'storeTesterAdd',
    mixins: [EnterpriseApi, validationMixin],
    components: {
      CustomInput,
      CustomTextarea,
    },
    validations: {
      info: {
        wechat_id: {
          required,
        },
        name: {
          required,
        },
        remark: {
          required,
        },
      },
    },
    data () {
      return {
        info: {
          wechat_id: '', // 微信号
          name: '',   // 姓名
          remark: '', // 备注
        },
      }
    },
    props: {
      shopId: {
        type: [Number, String],
        default: 0,
      },
    },
    methods: {
      // 添加权限操作
      addRight () {
        this.info.remark = this.info.remark.replace(/\n/g, '')
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        this.addTester() // 添加权限接口
      },
      // 添加体验权限接口
      async addTester () {
        try {
          const {response, result} = await this.createTesterAPi({
            shop_id: this.shopId,
            wechat_id: this.info.wechat_id.trim(),
            name: this.info.name.trim(),
            remark: this.info.remark,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '添加成功',
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            if (result.code === 100241 && result.message.indexOf(85004) > -1) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加体验权限失败',
                content: '该用户已是体验成员',
              })
            } else if (result.code === 100241 && result.message.indexOf(85001) > -1) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加体验权限失败',
                content: '该用户不存在,请检查微信号填写是否正确',
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加体验权限失败',
                content: result.message,
              })
            }
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加体验权限失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  .slide-layout .cus-box .field-group .field
    width 100% !important
  .tip
    font-size 12px
    line-height 18px
    color #ff0000
  .textarea-num
    font-size 12px
    color #888
    text-align right
    line-height 18px
  .box
    min-height 70px
    border 1px solid #c2c2c2
    border-radius 2px
    padding 7px 13px
    font-size 13px
    color #353535
</style>
