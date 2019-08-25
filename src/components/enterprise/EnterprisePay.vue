<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-text="enterpriseName")
      form.form-wrapper
        .field-group.cs
          .field.is-horizontal
            label.label 商户Id
            custom-input(v-model="payInfo.merchant_id", placeholder="请输入商户Id", need-type='number', :validator="$v.payInfo.merchant_id", error-info="商户Id必填")
          .field.is-horizontal
            label.label 微信支付 API Key
            custom-input(v-model="payInfo.merchant_key", maxlength='32', placeholder="请输入微信支付 API Key", :validator="$v.payInfo.merchant_key", error-info="微信支付 API Key必填, 32位字符",)
          .field.is-horizontal.choose-file
            label.label 微信支付证书私钥
            .button 选择文件
               input.file-input(type="file", name="file", @change="getPrivate($event)")
            .con(v-if="payInfo.has_private_key") 已上传过证书密钥
            .c(v-else)
              .con(v-if="payInfo.private_key") {{payInfo.private_key.name}}
              .con(v-else) 请选择证书密钥 apiclient_key.pem
          .field.is-horizontal.choose-file
            label.label 微信支付证书
            .button 选择文件
                input.file-input(type="file", name="file", @change="getPublic($event)")
            .con(v-if="payInfo.has_public_key") 已上传过证书文件
            .c(v-else)
              .con(v-if="payInfo.public_key") {{payInfo.public_key.name}}
              .con(v-else) 请选择证书文件 apiclient_cert.pem
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
  name: 'EnterprisePay',
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
      channel_id: this.$route.query.channel_id,
      isLoading: false,
      isNeedCaculate: false,
      isUploading: false,
      payInfo: {
        merchant_id: undefined,
        merchant_key: '',
        has_private_key: 0,
        has_public_key: 1,
        private_key: undefined,
        public_key: undefined,
      },
    }
  },
  methods: {
    /*
    * 上传私密文件
    * @event 文件对象
    * */
    getPrivate (event) {
      let privateFile = event.target.files[0]
      event.target.value = ''
      this.payInfo.private_key = privateFile
      this.payInfo.has_private_key = 0
    },
    /*
    * 上传公共文件
    * @event 文件对象
    * */
    getPublic (event) {
      let publicFile = event.target.files[0]
      event.target.value = ''
      this.payInfo.public_key = publicFile
      this.payInfo.has_public_key = 0
    },
    // 返回
    goBack () {
      this.$router.push({
        name: 'enterpriseList',
      })
    },
    inspectData () {
      if (this.isLoading) {
        return
      }
      this.$v.payInfo.$touch()
      if (this.$v.$error) {
        this.isNeedCaculate = false
        return
      }
      if (this.payInfo.private_key === undefined) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请重新选择证书密钥',
        })
        return
      }
      if (this.payInfo.public_key === undefined) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '请重新选择证书文件',
        })
        return
      }
      this.setPayApi()
    },
    // 提交创建
    async setPayApi () {
      let _this = this
      try {
        await this.setPay({
          enterprise_id: this.enterpriseId,
          channel_id: this.channel_id,
          merchant_id: this.payInfo.merchant_id,
          merchant_key: this.payInfo.merchant_key,
          private_key: this.payInfo.private_key,
          public_key: this.payInfo.public_key,
        }).then(function (result) {
          if (result.data.code !== 0) {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '支付配置失败',
              content: `出错啦!${result.data.message}`,
            })
            return
          }
          _this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '支付设置成功',
            resolve: () => {
              _this.goBack(-1)
            },
          })
        }, function (err) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '支付配置失败',
            content: `出错啦!${err.message}`,
          })
        })

        // const {response, result} = await this.setPay({
        //   enterprise_id: this.enterpriseId,
        //   channel_id: this.channel_id,
        //   merchant_id: this.payInfo.merchant_id,
        //   merchant_key: this.payInfo.merchant_key,
        //   private_key: this.payInfo.private_key,
        //   public_key: this.payInfo.public_key,
        // })
        // console.log('response', response)
        // console.log('result', result)
        // if (response.status !== 200) {
        //   _this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '支付配置失败1',
        //     content: `出错啦!${response.message}`,
        //   })
        //   return
        // }
        // if (result.code !== 0) {
        //   _this.$store.dispatch('showMessage', {
        //     type: 'failure',
        //     title: '支付配置失败2',
        //     content: `出错啦!${result.message}`,
        //   })
        //   return
        // }
        // _this.$store.dispatch('showMessage', {
        //   type: 'success',
        //   title: '成功',
        //   content: '支付设置成功',
        //   resolve: () => {
        //     self.goBack(-1)
        //   },
        // })
      } catch (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '支付配置失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取支付配置
    async getPayInfo () {
      try {
        const {response, result} = await this.getPay({
          channel_id: this.channel_id,
        })
        if (response.status === 200) {
          this.payInfo.merchant_id = result.data.merchant_id
          this.payInfo.merchant_key = result.data.merchant_key
          this.payInfo.has_private_key = result.data.has_private_key
          this.payInfo.has_public_key = result.data.has_public_key
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取支付配置失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取支付配置失败1',
          content: `错误：${err}`,
        })
      }
    },
  },
  watch: {
    'payInfo.merchant_key': function (val, oldval) {
      this.payInfo.merchant_key = this.payInfo.merchant_key.trim()
    },
  },
  validations: {
    payInfo: {
      merchant_id: {
        required,
      },
      merchant_key: {
        required,
        validate (val) {
          return val.length === 32
        },
      },
    },
  },
  mounted () {
    this.getPayInfo()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
// @import '~@/stylus/modules/upload-pic'
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
.file-input
  width 100%
  height 100%
  position absolute
  top 0
  left 0
  opacity 0
.con
  font-size 14px
  color #ddd
  vertical-align bottom
  margin-left 10px
</style>
