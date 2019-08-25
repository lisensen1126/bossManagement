<template lang="pug">
  .section-layout
    .content-wrapper
      h2 修改密码
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 原密码
            custom-input(v-model="old_pw", type="password", :validator="$v.old_pw", placeholder="请输入原密码", error-info="密码是6-18位数字、字母组合")
          .field.is-horizontal
            label.label 新密码
            custom-input(v-model="new_pw", type="password", :validator="$v.new_pw", placeholder="请输入新密码", error-info="密码是6-18位数字、字母组合")
          .field.is-horizontal
            label.label 确认密码
            custom-input(v-model="new_pwa", type="password", :validator="$v.new_pwa", placeholder="请输入确认密码", error-info="与新密码不一致")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData") 保存
</template>

<script>
  import BasicsApi from '@/mixins/modules/basics'
  import UserMixin from '@/mixins/modules/user'
  import CustomInput from '@/components/generics/form/CustomInput'
  import { validationMixin } from 'vuelidate'
  import { required } from 'vuelidate/lib/validators'

  export default {
    name: 'PassWordSetting',
    mixins: [validationMixin, BasicsApi, UserMixin],
    components: {
      CustomInput,
    },
    data () {
      return {
        old_pw: '', // 原密码
        new_pw: '', // 新密码
        new_pwa: '', // 二次新密码
        is_loading: false, // 是否加载
      }
    },
    validations: {
      old_pw: {
        required,
        validate (val) {
          return /^[a-zA-Z\d+]{6,18}$/.test(val)
        },
      },
      new_pw: {
        required,
        validate (val) {
          return /^[a-zA-Z\d+]{6,18}$/.test(val)
        },
      },
      new_pwa: {
        required,
        validate (val) {
          if (this.new_pw === this.new_pwa) {
            return true
          } else {
            return false
          }
        },
      },
    },
    methods: {
      // 点击保存操作
      inspectData () {
        if (this.is_loading) {
          return false
        }
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        // 保存
        this.commitData()
      },
      // 保存修改密码
      async commitData () {
        try {
          this.is_loading = true
          const {response, result} = await this.updatePswd({
            password: this.new_pw,
            old_password: this.old_pw,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '修改密码成功',
              resolve: () => this.logOut(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改密码失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改密码失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_loading = false
      },
      // 登出用户
      async logOut () {
        try {
          const {response, result} = await this.logout()
          if (response.status === 200) {
            this.$store.dispatch('clearUser')
            this.$router.push({
              name: 'login',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '登出失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({err}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '登出失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .picture-description
    font-size 12px
    line-height 16px
    color lightGrey
    white-space nowrap
    margin-top 8px
  .rich-eidtor-description
    margin-bottom 8px
  .field-content
    font-size: 13px
    line-height: 16px
    color: #353535
</style>
