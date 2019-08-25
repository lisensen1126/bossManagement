<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-text="store_name")
      .form-wrapper
        .field-group
          .field 第三步：美团支付申请
          .field.is-horizontal
            label.label 门店简称
            custom-input(v-model="merchant_name", isDisabled="true")
          .field.is-horizontal
            label.label 账户类型
            div.type-item.di(v-if="this.qual_type === 1")
              .radio
                input(type="radio",id="personal", name="type2", value="enter", v-model="type")
                label.sepcific-setting(for="personal") 企业账户
            div.type-item.di(v-if="this.qual_type === 2")
              .radio
                input(type="radio",id="enter", name="type2", value="enter", v-model="type")
                label.sepcific-setting(for="enter") 个人账户
          .field.is-horizontal
            label.label 支付费率
            span {{rate / 100}} %
          .field.is-horizontal
            label.label 开户支行
            span {{bank_card.branchName}}
          .field.is-horizontal
            label.label 银行卡号
            span {{bank_card.cardno}}
          .field.is-horizontal
            label.label 账户名称
            span {{bank_card.name}}
          .field.is-horizontal
            label.label 账户联系人
            span {{bank_card.contactPerson}}
          .field.is-horizontal
            label.label 账户联系电话
            span {{bank_card.contactPhone}}
          .field.is-horizontal
            label.label 营业执照类型
            div.type-item.di-1
              .radio
                input(type="radio",id="enterprise", name="type", value="enter", v-model="license_type")
                label.sepcific-setting(for="enterprise") 企业法人营业执照
            div.type-item.di
              .radio
                input(type="radio",id="per", name="type", value="per", v-model="license_type")
                label.sepcific-setting(for="per") 个体工商户营业执照
          .field.is-horizontal
            label.label 营业执照名称
            custom-input(v-model="license_name", placeholder="请输入营业执照名称", error-info="请输入营业执照名称", maxlength="32", :validator="$v.license_name")
          .field.is-horizontal
            label.label 营业执照注册号
            custom-input(v-model="license_register_num", placeholder="请输入营业执照注册号", error-info="请输入营业执照注册号",need-type='number_letter', maxlength="64", :validator="$v.license_register_num")
          .field.is-horizontal
            label.label 营业注册地址
            custom-input(v-model="license_register_adress", placeholder="请输入营业注册地址", error-info="请输入营业注册地址", maxlength="64", :validator="$v.license_register_adress")
          .field.is-horizontal
            label.label 法定代表人
            custom-input(v-model="legal_person", placeholder="请输入法定代表人", error-info="请输入法定代表人", maxlength="32", :validator="$v.legal_person")
          .field.is-horizontal.long-field
            label.label 营业执照有效期
            div.type-item.di-1
              .radio
                input(type="radio",id="lang", name="time", value="long", v-model="end_time")
                label.sepcific-setting(for="lang") 永久
            div.type-item.di
              .radio
                input(type="radio",id="end", name="time", value="end", v-model="end_time")
                label.sepcific-setting(for="end")
            div.type-item.di
              .radio.data-radio
                date-picker(type="single", placeholder="选择截止时间", v-model="license_end_time",:is-disabled="end_time === 'long'",)
            p.red 输入营业执照有效期的截止日期
            //- (v-if="this.qual_type === 1")   以前的老判断
          .field.is-horizontal
            label.label 法定代表人身份证号
            custom-input(v-model="id", placeholder="请输入法定代表人身份证号", error-info="请输入法定代表人身份证号", need-type='number_letter', maxlength="32", :validator="$v.id")
          .field.is-horizontal.long-field
            label.label 身份证照片
            .control.image-wrapper
              .upload-pic.center 正面
              .upload-pic
                up-meituan(img-type="13", v-model="id_just", :hasSecondAction="is_del", img-id='1')
              .upload-pic.center 反面
              .upload-pic
                up-meituan(img-type="13", v-model="id_back", :hasSecondAction="is_del", img-id='2')
              p.red 上传图片均需小于8M
          .field.is-horizontal
            label.label 营业执照
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="10", v-model="license_pic", :hasSecondAction="is_del", @id="success", v-if="license_pic === ''", img-id='7')
                span.tishi(v-else)
                  span 已上传
                  a.operation-link(@click="deletePic") 删除
              p.red 上传图片需小于2M
          .field.is-horizontal
            label.label 经营场所证明图
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="3", v-model="pro_pic", :hasSecondAction="is_del", img-id='3')
              p.red 上传图片需小于8M
          .field.is-horizontal
            label.label 门店头图
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="1", v-model="head_img", :hasSecondAction="is_del", img-id='4')
              p.red 上传图片需小于8M
          .field.is-horizontal
            label.label 门店内景图
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="3", v-model="interior", :hasSecondAction="is_del", img-id='5')
              p.red 上传图片需小于8M
          .field.is-horizontal
            label.label 清算授权书
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="11", v-model="businessSettlePhotos", :hasSecondAction="is_del", img-id='6')
              a.download-btn(target="_blank", :href="`${root}/meituan/settle`") 下载模板
              a.download-btn(target="_blank", :href="`https://oss1.chedianai.com/images/assets/qingsuan1.png`") 参考示例
          .field.is-horizontal
            label.label
            .control.image-wrapper
              p.red 注意事项：如个人账户信息填写为非企业法人账户时，必须上传清算授权书，上传格式必须为图片格式
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="goNext") 保存
          a.button.large(@click="goBack") 取消
          a.button.primary.large(@click="goReset") 重新开通
</template>

<script>
  // import enterApi from '@/mixins/modules/enterprise'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import enterpriseApi from '@/mixins/modules/enterprise'
  import PayApi from '@/mixins/modules/StorePay'
  import AgreeModel from '@/components/store/modal/AgreeMeituan'
  import UpMeituan from '@/components/store/modal/UpMeituanImage'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import {root} from '@/plugins/Fetch'
  import DatePicker from '@/components/generics/form/DatePicker'
  /**
   * @vue
   */
  export default {
    name: 'ThirdEnterPay',
    mixins: [enterpriseApi, PayApi, validationMixin],
    components: {
      CustomInput,
      CustomSelect,
      AgreeModel,
      UpMeituan,
      DatePicker,
    },
    validations: {
      license_register_adress: {
        required,
      },
      license_register_num: {
        required,
      },
      legal_person: {
        required,
      },
      license_name: {
        required,
      },
      id: {
        required,
      },
    },
    data () {
      return {
        root,
        rate: 0, // 支付费率
        bank_card: {},
        end_time: 'long', // 营业时间有效期类型
        prove_list: [], // 证明图
        license_pic: '', // 营业执照
        is_del: false,
        pro_pic: '', // 经营证明图
        encrypt_id: '', // 营业执照ID
        license_end_time: '', // 营业时间有效期
        license_register_num: '', // 营业注册号
        license_register_adress: '', // 营业注册地址
        legal_person: '', // 法定代表人
        interior: '', // 内景图
        businessSettlePhotos: '',  // 授权清算书
        id: '', // 身份证号
        id_just: '', // 身份证正面
        id_back: '', // 身份证反面
        license_name: '', // 营业执照名称
        head_img: '', // 门店头图
        merchant_name: this.$route.query.storeName, // 门店简称
        type: 'enter', // 账户类型
        license_type: 'enter', // 营业执照类型
        store_id: this.$route.query.storeId,
        store_name: this.$route.query.storeName,
        qual_type: '', // 类型
      }
    },
    methods: {
      deletePic () {
        this.license_pic = ''
      },
      success (q) {
        // // console.log(q, '++++')
        this.license_pic = q.url
        this.encrypt_id = q.encryptId
      },
      // 删除图片
      deleteImage (index) {
        this.prove_list.splice(index, 1)
      },
      // 保存
      async saveApi () {
        let params = {
          store_id: this.store_id,
          shopPhoto: this.head_img,
          shopInsidePhoto: this.interior,
          businessSettlePhotos: this.businessSettlePhotos,
          businessLicenceType: this.license_type === 'enter' ? 202 : 201,
          businessLicenceName: this.license_name,
          businessLicenceNumber: this.license_register_num,
          businessLicenceAddress: this.license_register_adress,
          businessLicencePhotoId: this.encrypt_id,
          qualType: this.qual_type,
          shopLocationPhotos: this.pro_pic,
          legalPersonIdNo: this.id,
          legalPerson: this.legal_person,
          legalPersonIdFront: this.id_just,
          legalPersonIdBack: this.id_back,
        }
        if (this.end_time === 'long') {
          params.businessLicenceExpiredType = 0
        } else {
          params.businessLicenceExpiredType = 1
          let time = this.license_end_time
          time = '' + (new Date(time.replace(/-/g, '/'))).getTime() / 1000
          params.businessLicenceExpiredTime = time
        }
        try {
          const {response, result} = await this.openPayApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$router.push({
                name: 'storePay',
                query: {
                  storeId: this.store_id,
                  storeName: this.store_name,
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '开通支付失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '开通支付失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '开通支付失败',
            content: `错误：${err}`,
          })
        }
      },
      //  重新开户
      async goReset () {
        let params = {
          store_id: this.store_id,
        }
        try {
          const {response, result} = await this.resetMerchantApi(params)
          if (response.status === 200 && result.code === 0) {
            this.$router.push({
              name: 'storePerfect',
              query: {
                storeId: this.store_id,
                storeName: this.store_name,
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '重新开户失败',
              content: `${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '重新开户失败',
            content: `错误：${err}`,
          })
        }
      },
      goNext () {
        this.$v.$touch()
        if (this.$v.$error) {
          return false
        }
        if (this.end_time !== 'long' && !this.license_end_time) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请选择截止时间',
          })
          return
        }
        if (!this.head_img) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传门店头图',
          })
          return
        }
        if (!this.pro_pic) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传经营场所证明图',
          })
          return
        }
        if (!this.interior) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传门店内景图',
          })
          return
        }
        if (!this.id_just || !this.id_back) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传身份证正反面照片',
          })
          return
        }
        if (!this.license_pic) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传营业执照',
          })
          return
        }
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认提交支付申请？',
          isRejectable: 1,
          resolve: () => {
            this.saveApi()
          },
        })
      },
      // 返回
      goBack () {
        this.$router.push({
          name: 'storeList',
        })
      },
      // 获取虚拟门店
      async merchantStore () {
        try {
          const {response, result} = await this.getMerchantApi({store_id: this.store_id})
          if (response.status === 200) {
            if (result.code === 0) {
              this.id = result.data.identificationNo
              this.qual_type = result.data.bank_card.acctype
              this.rate = result.data.wxRate
              if (this.qual_type === 2) {
                let obj = JSON.parse(result.data.bank_card.accountPersonIdCardPhotos)
                this.id_just = obj[0]
                this.id_back = obj[1]
                this.id = result.data.bank_card.accountPersonIdCode
              }
              this.bank_card = result.data.bank_card
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取虚拟门店失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取虚拟门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取虚拟门店失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    mounted () {
      this.merchantStore()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  // @import '~@/stylus/modules/upload-pic'
  .tishi
    font-size 14px
    line-height 88px
    display inline-block
    width 88px
  .operation-link
    margin-left 10px
  span
    font-size 14px
  .data-radio
    margin-top -18px
  .image-wrapper
    display flex
    flex-direction row
    align-items center
  .download-btn
    font-size 14px
    color #ffbb29
    margin-left 15px
  .upload-banner + .upload-banner
    margin-left 8px
  .center
    line-height 88px
    text-align center
  .red
    color: red
    font-size 12px
    margin-left 10px
  .long-field
    width 720px !important
  .btn-wrapper
    margin-top 30px
  .m-b-30
    margin-bottom 30px
  .di-1
    margin-right 30px
  .checkbox
    margin-left 150px
  .middle
    margin 0 10px
  .content
    height 100%
  .content-wrapper
    height calc(100% - 56px)
    overflow-y auto
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
