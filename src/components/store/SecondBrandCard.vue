<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-text="store_name")
      .form-wrapper
        .field-group
          .field 第二步：银行卡号验证
          .field.is-horizontal
            // 因为门店简称在第一步门店信息完善时，如果多于30字，会被修改，所以这里不会和上面的标题展示一致
            label.label 门店简称
            custom-input(v-model="merchant_name", isDisabled="true")
          .field.is-horizontal
            label.label 结算账户类型
            div.type-item.di-1
              .radio
                input(type="radio",id="enterprise", name="type", value="enter", v-model="type")
                label.sepcific-setting(for="enterprise") 企业账户
            div.type-item.di
              .radio
                input(type="radio",id="personal", name="type", value="per", v-model="type")
                label.sepcific-setting(for="personal") 个人账户
          .field.is-horizontal
            label.label 结算账户名称
            custom-input(v-model="account.name", placeholder="请输入账户名称", :validator="$v.account.name", error-info="请输入账号名称", maxlength="32")
            p.red(v-if="type === 'enter'") 必须与企业名称一致
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人
          .field.is-horizontal
            label.label 结算账户联系人
            custom-input(v-model="account.contacts", placeholder="请输入账户联系人", :validator="$v.account.contacts", error-info="请输入账号联系人", maxlength="32")
            p.red(v-if="type === 'enter'") 必须与企业法定代表人一致
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人
          .field.is-horizontal
            label.label 结算账户联系电话
            custom-input(v-model="account.mobile_phone", placeholder="请输入账户联系电话", :validator="$v.account.mobile_phone", error-info="请输入联系电话",need-type='number', maxlength="11")
            p.red(v-if="type === 'enter'") 必须为企业法定代表人联系电话
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人的联系电话
          .field.is-horizontal
            label.label(v-if="type === 'enter'") 开户行账号
            label.label(v-if="type === 'per'") 银行卡号
            custom-input(v-model="account.cardno",placeholder="请输入账号", :validator="$v.account.cardno", error-info="请输入账号",need-type='number', maxlength="32")
            p.red(v-if="type === 'enter'") 必须为企业账户银行账号
            p.red(v-if="type === 'per'") 必须为结算银行账户所有人的银行卡号
          .field.is-horizontal
            label.label 开户总行
            custom-select.width-100(:list="total_list", v-model="total", @input="changeTotal", :validator="$v.total", error-info="请选择开户总行", :show-search="true")
          .field.is-horizontal
            label.label 开户城市
            custom-select(:list="province_list", v-model="province", @input="changeProvince", :validator="$v.province", error-info="请选择省", :show-search="true")
            custom-select.middle(:list="city_list", v-model="city", @input="changeCity", :validator="$v.city", error-info="请选择城市", :show-search="true")
          .field.is-horizontal
            label.label 开户支行
            custom-select.width-100(:list="branch_list", v-model="branch",nameField="branch", :validator="$v.branch", error-info="请选择开户支行", :show-search="true")
          .field.is-horizontal(v-if="type === 'per'")
            label.label 身份证号码
            custom-input(v-model="id", placeholder="请输入身份证号码", error-info="请输入身份证号码", :validator="$v.id",need-type='number_letter', maxlength="32")
            p.red 必须为结算银行账户所有人身份证号
          .field.is-horizontal.long-field(v-if="type === 'per'")
            label.label 身份证照片
            .control.image-wrapper
              .upload-pic.center 正面
              .upload-pic
                up-meituan(img-type="13", v-model="id_just", :hasSecondAction="is_del", img-id='1')
              .upload-pic.center 反面
              .upload-pic
                up-meituan(img-type="13", v-model="id_back", :hasSecondAction="is_del", img-id='2')
              p.red 上传图片需小于8M
          .field.is-horizontal.long-field(v-if="type === 'per'")
            label.label 银行卡照片
            .control.image-wrapper
              .upload-pic.center 正面
              .upload-pic
                up-meituan(img-type="12", v-model="card_just", :hasSecondAction="is_del", img-id='3')
              .upload-pic.center 反面
              .upload-pic
                up-meituan(img-type="12", v-model="card_back", :hasSecondAction="is_del", img-id='4')
              p.red 上传图片均需小于8M
          .field.is-horizontal(v-if="type === 'enter'")
            label.label 开户许可证
            .control.image-wrapper
              .upload-pic
                up-meituan(img-type="11", v-model="bank_photo", :hasSecondAction="is_del", img-id='5')
              p.red 上传图片均需小于8M
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import UpMeituan from '@/components/store/modal/UpMeituanImage'
/**
 * @vue
 */
export default {
  name: 'SecondBrandCard',
  mixins: [enterpriseApi, PayApi, validationMixin],
  components: {
    CustomInput,
    CustomSelect,
    AgreeModel,
    UpMeituan,
  },
  validations: {
    id: {
      validate (val) {
        if (this.type === 'enter' || this.id !== '') {
          return true
        } else {
          return false
        }
      },
    },
    account: {
      name: {
        required,
      },
      contacts: {
        required,
      },
      mobile_phone: {
        required,
        validate (val) {
          return /^1\d{10}$/.test(val)
        },
      },
      cardno: {
        required,
      },
    },
    total: {
      required,
    },
    province: {
      required,
    },
    city: {
      required,
    },
    branch: {
      required,
    },
  },
  data () {
    return {
      id: '', // 身份证号
      is_del: false,
      bank_photo: '', // 开户许可证
      account: { // 账户
        name: '', // 名称
        contacts: '', // 联系人
        mobile_phone: '', // 账户联系电话
        account: '', // 开户行账号
      },
      card_just: '', // 银行卡正面
      card_back: '', // 银行卡反面
      id_just: '', // 身份证正面
      id_back: '', // 身份证反面
      total_list: [], // 开户总行
      total: {},
      branch_list: [], // 开户支行
      branch: {},
      province_list: [], // 省列表
      province: {},
      city_list: [], // 城市列表
      city: {},
      merchant_name: '', // 门店简称
      type: 'enter', // 账户类型
      store_id: this.$route.query.storeId,
      store_name: this.$route.query.storeName,
    }
  },
  methods: {
    async goReset () {
      let params = {
        store_id: this.store_id,
      }
      try {
        const { response, result } = await this.resetMerchantApi(params)
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
    // 获取虚拟门店详情
    async merchantStore () {
      try {
        const { response, result } = await this.getMerchantApi({ store_id: this.store_id })
        if (response.status === 200) {
          if (result.code === 0) {
            this.merchant_name = result.data.merchantName
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
    saveData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      let params = {
        store_id: this.store_id,
        cardno: this.account.cardno,
        acctype: this.type === 'enter' ? 1 : 2,
        bankId: this.total.id,
        bankName: this.total.name,
        branchId: this.branch.id,
        branchName: this.branch.branch,
        bankProvinceId: this.province.id,
        bankCityId: this.city.id,
        contactPhone: this.account.mobile_phone,
        contactPerson: this.account.contacts,
        name: this.account.name,
      }
      if (this.type === 'enter') {
        if (!this.bank_photo) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传开户许可证',
          })
          return
        }
        params.bankCertificatePhoto = this.bank_photo
      }
      if (this.type === 'per') {
        if (!this.id_just || !this.id_back || !this.id_just || !this.id_back) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '提示',
            content: '请上传身份证/银行卡照片',
          })
          return
        }
        params.accountPersonIdCardPhotoFront = this.id_just
        params.accountPersonIdCardPhotoBack = this.id_back
        params.bankCardFront = this.card_just
        params.bankCardBack = this.card_back
        params.accountPersonIdCode = this.id
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认提交银行卡验证？',
        isRejectable: true,
        resolve: () => {
          this.goNext(params)
        },
      })
    },
    /*
    * 保存
    *  @params 提交参数
    * */
    async goNext (params) {
      try {
        const { response, result } = await this.brandCardApi(params)
        if (response.status === 200) {
          if (result.code === 0 || result.code === 40000) {
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
              title: '提交银行卡验证失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提交银行卡验证失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提交银行卡验证失败',
          content: `错误：${err}`,
        })
      }
    },
    /*
    *  改变总行
    *  q 总行对象
    * */
    changeTotal (q) {
      this.total = q
      this.branch = {}
      this.branch_list = []
      if (this.province.id && this.city.id) {
        this.getBranchList()
      }
    },
    /*
    *  改变城市
    *  q 省对象
    * */
    changeProvince (q) {
      this.province = q
      this.city = {}
      this.branch = {}
      this.branch_list = []
      this.getAdress(2)
    },
    /*
   *  改变区
   *  q 城市对象
   * */
    changeCity (q) {
      this.city = q
      if (this.province.id && this.total.id) {
        this.getBranchList()
      }
    },
    // 返回
    goBack () {
      this.$router.push({
        name: 'storeList',
      })
    },
    /*
    * 获取地址
    *  @level 省市区
    * */
    async getAdress (level) {
      let params = {
        level: level,
      }
      if (level === 2) {
        params.parentId = this.province.id
      }
      try {
        const { response, result } = await this.adressApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.province_list = result.data
            }
            if (level === 2) {
              this.city_list = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地址列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地址列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取地址列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取总行列表
    async getTotalList () {
      try {
        const { response, result } = await this.getTotalApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.total_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开户总行列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户总行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户总行列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取支行列表
    async getBranchList () {
      try {
        const { response, result } = await this.getBranchApi({
          cityId: this.city.id,
          branchId: this.total.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.branch_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开户支行列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户支行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户支行列表失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    this.merchantStore()
    this.getTotalList()
    this.getAdress(1)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
// @import '~@/stylus/modules/upload-pic'
.width-100
  width 100%
.red
  color red
  font-size 12px
  margin-left 10px
.field
  width 600px !important
.field.long-field
  width 720px !important
.image-wrapper
  display flex
  flex-direction row
  align-items center
.upload-banner + .upload-banner
  margin-left 8px
.center
  line-height 88px
  text-align center
.btn-wrapper
  padding-top 30px
.m-b-30
  padding-bottom 40px
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
  flex 0 0 120px !important
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
  input[type='file']
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
    margin-top -15px
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
