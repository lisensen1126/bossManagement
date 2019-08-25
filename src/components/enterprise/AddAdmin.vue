<template  lang="pug">
  .slide-layout
    .cus-box
      .slide-title 添加管理员
        .field-group.is-horizontal
        .field
          label.label 管理员类型
          custom-select(v-model="addInfo.type", :list="typeList", :validator="$v.addInfo.type", error-info="请选择管理员类型",)
        .field(v-if="addInfo.type.status === 'STORE_ADMIN'")
          label.label 选择门店
          custom-select(v-model="addInfo.store", :list="storeList", name-field="store_name", :validator="$v.addInfo.store", error-info="请选择管理员类型",)
        .field
          label.label 管理员名称
          custom-input(v-model="addInfo.name", placeholder="请输入管理员名称", :validator="$v.addInfo.name", error-info="请输入管理员名称",)
        .field
          label.label 账号(手机号码)
          custom-input(v-model="addInfo.mobile", need-type='number', autocomplete="new-password", maxlength=11, placeholder="请输入账号(手机号码)", :validator="$v.addInfo.mobile", error-info="账号为手机号码",)
        .field
          label.label 密码
          custom-input(v-if="!addInfo.id", autocomplete="new-password", type="password" v-model="addInfo.password", placeholder="请输入密码", :validator="$v.addInfo.password", error-info="密码为6-18个字符",)
          .gray(v-else) ******
        .field
          button.button.large.primary(@click="ensure") 确定
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import EnterApi from '@/mixins/modules/enterprise'
  export default {
    name: 'AddAdmin',
    mixins: [validationMixin, EnterApi],
    components: {
      CustomInput,
      CustomSelect,
    },
    props: {
      editItem: null,
    },
    validations: {
      addInfo: {
        type: {
          required,
        },
        mobile: {
          required,
          validate (val) {
            return /^1\d{10}$/.test(val)
          },
        },
        name: {
          required,
        },
        store: {
          validate (val) {
            if (this.addInfo.type.status === 'STORE_ADMIN') {
              return required(val)
            } else {
              return true
            }
          },
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
          enterpriseId: undefined,
          status: '',
          store_id: undefined,
          mobile: '',
          password: '',
          store: {},
          type: {},
          name: '',
          id: '',
        },
        storeList: [],
        roleName: '',
        typeList: [{
          status: 'SYSTEM_ADMIN',
          name: '系统管理员',
        }, {
          status: 'STORE_ADMIN',
          name: '门店管理员',
        }],
        enterpriseId: '',
      }
    },
    methods: {
      // 确认按钮
      async ensure () {
        this.$v.$touch()
        if (this.$v.$error) return
        try {
          const {response, result} = await this.adminAdd({
            enterprise_id: this.enterpriseId,
            role_name: this.roleName,
            store_id: this.addInfo.store.store_id,
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
      // 确认按钮
      async infoUpdate () {
        this.$v.$touch()
        if (this.$v.$error) return
        try {
          const {response, result} = await this.adminUpdate({
            enterprise_id: this.enterpriseId,
            role_name: this.roleName,
            store_id: this.addInfo.store.store_id,
            mobile: this.addInfo.mobile,
            password: this.addInfo.password,
            name: this.addInfo.name,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑成功',
              resolve: () => this.$emit('success'),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑失败',
            content: `错误：${err}`,
          })
        }
      },
      // 获取门店列表
      async getStoreList () {
      // fetchStoreList
        try {
          const {response, result} = await this.fetchStoreList({
            enterprise_id: this.enterpriseId,
          })
          if (response.status === 200) {
            this.storeList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    mounted () {
      let self = this
      this.enterpriseId = this.$route.query.enterpriseId
      if (this.editItem) {
        this.addInfo.id = this.editItem.id
        this.addInfo.name = this.editItem.name
        this.addInfo.mobile = this.editItem.mobile
        this.addInfo.status = this.editItem.status
        this.typeList.forEach(item => {
          if (item.status === self.editItem.role_name) {
            self.addInfo.type = item
          }
        })
        // this.addInfo.enterpriseId = this.editItem.enterprise_id
        // this.addInfo.id = this.editItem.id
        // this.addInfo.id = this.editItem.id
        // this.addInfo.id = this.editItem.id
        // this.addInfo.id = this.editItem.id
      }
      this.getStoreList()
    },

    watch: {
      // 选择一级分类，赋值二级分类
      'addInfo.type': function (val, oldval) {
        this.roleName = val.status
      },
    },

  }
</script>

<style lang="stylus" scoped>
  .gray{
    color: #888888
  }
</style>
