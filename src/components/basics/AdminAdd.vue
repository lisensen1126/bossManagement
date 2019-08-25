<template  lang="pug">
  .slide-layout
    .cus-box
      .slide-title 添加管理员
        .field-group.is-horizontal
        .field
          label.label 管理员名称
          custom-input(v-model="addInfo.name", placeholder="请输入管理员名称", :validator="$v.addInfo.name", error-info="请输入管理员名称",)
        .field
          label.label 账号(手机号码)
          custom-input(v-model="addInfo.mobile", need-type='number', autocomplete="new-password", maxlength=11, placeholder="请输入账号(手机号码)", :validator="$v.addInfo.mobile", error-info="账号为手机号码",)
        .field
          label.label 密码
          custom-input(v-model="addInfo.password", autocomplete="new-password", id="password1", type="password", placeholder="请输入密码", :validator="$v.addInfo.password", error-info="密码为6-18个字符",)
        .field
          button.button.large.primary(@click="ensure") 确定
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import basicsAdminApi from '@/mixins/modules/basics'
  export default {
    name: 'AdminAdd',
    mixins: [validationMixin, basicsAdminApi],
    components: {
      CustomInput,
      CustomSelect,
    },
    validations: {
      addInfo: {
        mobile: {
          required,
          validate (val) {
            return /^1\d{10}$/.test(val)
          },
        },
        name: {
          required,
        },
        password: {
          required,
          validate (val) {
            return /^.{6,18}$/.test(val)
          },
        },
      },
    },
    data () {
      return {
        addInfo: {
          name: '',
          mobile: '',
          password: '',
        },
      }
    },
    methods: {
      // 确认按钮
      async ensure () {
        this.$v.$touch()
        if (this.$v.$error) return
        try {
          const {response, result} = await this.basicsAdminAdd({
            mobile: this.addInfo.mobile,
            password: this.addInfo.password,
            name: this.addInfo.name,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '添加成功',
              resolve: () => this.$emit('success'),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    mounted () {
    },
    watch: {
    },
  }
</script>

<style scoped>

</style>
