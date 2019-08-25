<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-text="'企业名称： ' + enterpriseName")
      .form-wrapper
        .field-group.cs
          .field.is-horizontal
            label.label AppId
            custom-input(v-model="enterprise.app_id", placeholder="请输入AppId", :validator="$v.enterprise.app_id", error-info="AppId必填")
          .field.is-horizontal
            label.label AppSecret
            custom-input(v-model="enterprise.app_secret", placeholder="请输入AppSecret", error-info="AppSecret必填", :validator="$v.enterprise.app_secret")
          .field.is-horizontal
            label.label 开启状态
            .switch
              input(type="checkbox", id="displayState", @change="status" v-model="statusC")
              label(for="displayState")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData") 保存
          a.button.large(@click="goBack") 取消
</template>

<script>
import enterApi from '@/mixins/modules/enterprise'
import CustomInput from '@/components/generics/form/CustomInput'
import StarRating from '@/components/generics/StarRating'
import CustomSelect from '@/components/generics/form/CustomSelect'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'

/**
 * @vue
 */
export default {
  name: 'AppSetting',
  mixins: [validationMixin, enterApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    StarRating,
  },
  data () {
    return {
      flag: false,
      enterpriseId: this.$route.query.enterpriseId,
      enterpriseName: this.$route.query.enterpriseName,
      isLoading: false,
      isNeedCaculate: false,
      channel_id: '',
      statusC: true,
      enterprise: {
        app_id: '',
        app_secret: '',
        status: 0,
      },
      isUploading: false,
    }
  },
  methods: {
    goBack () {
      this.$router.push({
        name: 'enterpriseList',
      })
    },
    // 监听状态
    status () {
      if (this.statusC) {
        this.enterprise.status = 1
      } else {
        this.enterprise.status = 2
      }
    },
    inspectData () {
      this.$v.enterprise.$touch()
      if (this.$v.$error) {
        this.isNeedCaculate = false
        return
      }
      this.setAppInfo()
    },
    // 保存
    async setAppInfo () {
      try {
        const {response, result} = await this.setApp({
          enterprise_id: this.enterpriseId,
          app_id: this.enterprise.app_id,
          app_secret: this.enterprise.app_secret,
          status: this.enterprise.status,
        })
        if (response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: 'APP配置创建成功',
            resolve: () => {
              this.$router.push({
                name: 'enterpriseList',
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建APP配置失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '创建APP配置失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取APP配置
    async getAppInfo () {
      try {
        const {response, result} = await this.getApp({
          enterprise_id: this.enterpriseId,
        })
        if (response.status === 200 && result.code === 0) {
          this.enterprise.app_id = result.data.app_id || ''
          this.enterprise.app_secret = result.data.app_secret || ''
          this.enterprise.status = result.data.status
          this.enterprise.status - 0 === 1 ? this.statusC = true : this.statusC = false
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取APP配置失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取APP配置失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    // init province
    if (this.$route.params.enterpriseId) {
      this.enterpriseId = this.$route.params.enterpriseId
      this.enterpriseName = this.$route.query.enterpriseName
      this.channel_id = this.$route.query.channel_id
    }
    this.getAppInfo()
  },
  validations: {
    enterprise: {
      app_id: {
        required,
      },
      app_secret: {
        required,
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.content
  height 100%
.content-wrapper
  min-height 100%
.label
  flex: 0 0 120px !important
label.label
  font-size 13px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.form-wrapper .field
  width 520px
.form-wrapper .field.full-width
  width 100%
.upload-banner
  width 88px
  height 88px
  overflow hidden
  position relative
  img
    width 100%
    height 100%
  input[type="file"]
    position absolute
    left 0
    top 0
    width 100%
    height 100%
    opacity 0
.upload-button
  border 1px dashed #f1f1f1
  border-radius 2px
  background #fbfbfb
  cursor pointer
  &::before
    content ''
    display block
    position absolute
    width 40px
    height 30px
    background getImage('cloud-upload.svg') no-repeat center center
    top 50%
    margin-top: -15px
    left 50%
    margin-left -20px
.qualification-cacl
  margin-left 4px
  color #999
.cs
  padding 12px 0 !important
  border-bottom none !important
</style>
