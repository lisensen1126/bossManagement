<template lang="pug">
  .login-wrapper
    .login-form-wrapper
      .logo
      .login-input-group
        input(type="text", @input="updateValue($event.target.value)", placeholder="手机号" v-model="mobile", maxlength=11)
        .marker
        input(type="password", placeholder="密码" v-model="password", @keyup.enter="checkIn")
        .marker
      .login-button(@click="checkIn") 登录
    .copyright-wrapper © 2017 chedianai.com. All rights reserved.
</template>

<script>
import userMixin from '@/mixins/modules/user'

export default {
  name: 'Login',
  mixins: [userMixin],
  data () {
    return {
      mobile: '',
      password: '',
      sms_code: '3232',
    }
  },
  methods: {
    updateValue (value) {
      // 只能输入数字
      let data = value.replace(/\D/g, '')
      this.mobile = data
    },
    async checkIn () {
      if (!/^1\d{10}$/.test(this.mobile)) {
        this.$store.dispatch('showMessage', {
          title: '手机号填写不正确',
        })
        return
      }
      if (!this.password) {
        this.$store.dispatch('showMessage', {
          title: '密码不能为空',
        })
        return
      }
      try {
        const {response, result} = await this.login({
          mobile: this.mobile,
          password: this.password,
          sms_code: '3232',
        })
        if (response.status === 200) {
          // console.log(result)
          if (result.code === 0) {
            this.$store.dispatch('updateUser', result.data)
            this.$router.push({
              name: 'enterpriseList',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '登录失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '登录失败',
            content: `${result && result.message ? ' ' + result.message : ''}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '登录失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'

.login-wrapper
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%
  background-color #fff

.login-form-wrapper
  width 360px
.logo
  margin 20px 0 72px
  width 100%
  height 34px
  background center no-repeat url('~@/assets/cdai-logo.svg')

.login-input-group
  position relative
  margin-bottom 20px
  border 1px solid disableBorderColor
  box-shadow 0 2px 12px 0 rgba(255, 199, 35, .05), 0 2px 20px 0 rgba(0, 0, 0, .05)
  border-radius borderRadius
  input
    border none
    outline none
    display block
    width 310px
    padding 20px 24px
    height 23px
    font-size 16px
    line-height 23px
    color standblack
    caret-color primary
    // caret-color transparent
    &::placeholder
      color placeholder
    &:first-of-type
      border-bottom 1px solid line
    &:focus + .marker
      display block
.marker
  display none
  position absolute
  left -1px
  width 3px
  height 65px
  background-color primary
  box-shadow 2px 0 4px 0 rgba(primary, .3)
  &:first-of-type
    top -1px
  &:last-of-type
    bottom -1px

.login-button
  margin-bottom 120px
  height 48px
  text-align center
  color #fff
  font-size 18px
  line-height 48px
  background-color #FFBB29
  border-radius borderRadius
  box-shadow 0 1px 3px 0 rgba(0, 0, 0, .05)
  cursor pointer
  &:hover
    background-color #FFC723
    box-shadow 0 4px 6px 0 rgba(255, 199, 35, .3), 0 4px 24px 0 rgba(0, 0, 0, .05)

.copyright-wrapper
  position fixed
  bottom 48px
  left 50%
  transform translateX(-50%)
  font-size 12px
  line-height 16px
  color lightGrey
  letter-spacing 1.5px

</style>
