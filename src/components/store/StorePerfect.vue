<template lang="pug">
  .section-layout.content
    agree-model(v-if="is_agree", @close="closeModal")
    .content-wrapper
      h2(v-text="page_title")
      .form-wrapper
        .field-group
          .field 第一步：门店信息完善
          .field.is-horizontal
            label.label 支付渠道
            custom-select(v-model="pay", :list="pay_list")
          .field.is-horizontal
            label.label 门店名称
            custom-input(input-type="hasCount",v-model="store_name",:validator="$v.store_name", error-info="门店名称必填且不多于20字",placeholder="请输入门店名称")
              span(slot="countInfo") {{store_name ? store_name.length : 0}}/20
          .field.is-horizontal(v-if="!cannot_edit_name")
            label.label
            .tip-description 应美团方要求，门店名称不能多于20字，请修改后再提交
          .field.is-horizontal
            label.label 门店地址
            custom-select(:list="province_list", nameField="chineseName", v-model="province", @input="changeprovince", :validator="$v.province", error-info="请选择省", :show-search="true")
            custom-select.middle(:list="city_list", nameField="chineseName", v-model="city", @input="changecity", :validator="$v.city", error-info="请选择城市", :show-search="true")
            custom-select(:list="country_list", nameField="chineseName", v-model="country", @input="changecountry", :validator="$v.country", error-info="请选择区县", :show-search="true")
          .field.is-horizontal
            label.label 详情地址
            custom-input(v-model="store.address", :validator="$v.store.address", error-info="请填写详细地址最多30个字符", maxlength=30)
          .field.is-horizontal
            label.label 商户手机号
            custom-input(v-model="store.business_phone", maxlength=11, need-type='number', :validator="$v.store.business_phone", error-info="请填写正确的联系电话")
          .field.is-horizontal
            .checkbox
              input(type="checkbox", :id="1", v-model="store_agree")
              label(@click="showModal") 我同意《美团智能支付合作协议》的相关服务条款和政策
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="goNext") 下一步
          a.button.large(@click="goBack") 返回
</template>

<script>
  // import enterApi from '@/mixins/modules/enterprise'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import enterpriseApi from '@/mixins/modules/enterprise'
  import PayApi from '@/mixins/modules/StorePay'
  import AgreeModel from '@/components/store/modal/AgreeMeituan'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  /**
   * @vue
   */
  export default {
    name: 'StorePerfect',
    mixins: [enterpriseApi, PayApi, validationMixin],
    components: {
      CustomInput,
      CustomSelect,
      AgreeModel,
    },
    validations: {
      store_name: {
        required,
        validate (val) {
          return val.length <= 20
        },
      },
      store: {
        business_phone: {
          required,
          validate (val) {
            return /^1\d{10}$/.test(val)
          },
        },
        address: {
          required,
        },
      },
      province: {
        required,
      },
      city: {
        required,
      },
      country: {
        required,
      },
    },
    data () {
      return {
        is_agree: false, // 控制同意弹窗
        store_agree: false, // 门店同意
        store: {
          address: '', // 门店地址
          business_phone: '', // 商户手机号
        },
        pay: { // 门店支付渠 道
          name: '美团支付',
        },
        pay_list: [{ // 支付渠道列表
          name: '美团支付',
        }],
        store_id: this.$route.query.storeId,
        store_name: this.$route.query.storeName,
        province_list: [], // 省列表
        province: {}, // 省
        city_list: [], // 城市列表
        city: {}, // 城市
        country_list: [], // 区列表
        country: {}, // 区
        cannot_edit_name: false, // 判断是否可以修改门店名称
        page_title: '', // 顶部标题为门店名称，防止门店名称输入框修改时影响，所以重新赋值给page_title
      }
    },
    methods: {
      // 下一步
      async goNext () {
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        if (!this.store_agree) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请同意协议',
          })
          return false
        }
        try {
          const {response, result} = await this.createMerchantApi({
            store_id: this.store_id,
            merchantName: this.store_name,
            provinceId: this.province.id,
            province: this.province.chineseName,
            cityId: this.city.id,
            city: this.city.chineseName,
            countryId: this.country.id,
            country: this.country.chineseName,
            address: this.store.address,
            merchantPhone: this.store.business_phone,
            longitude: this.store.lng,
            latitude: this.store.lat,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$router.push({
                name: 'secondBrandCard',
                query: {
                  storeId: this.store_id,
                  storeName: this.$route.query.storeName, // 用于下一步页面标题的展示，展示门店全称
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '创建虚拟门店失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建虚拟门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建虚拟门店失败',
            content: `错误：${err}`,
          })
        }
      },
      // 展示同意条款
      showModal () {
        this.is_agree = true
      },
      // 关闭同意条款
      closeModal () {
        this.is_agree = false
      },
      /*
      *  改变省
      *  q 省对象
      * */
      changeprovince (q) {
        this.province = q
        this.city_list = []
        this.country_list = []
        this.city = {}
        this.country = {}
        this.getAdress(2)
      },
      /*
      *  改变城市
      *  q 城市对象
      * */
      changecity (q) {
        this.country_list = []
        this.city = q
        this.getAdress(3)
        this.country = {}
      },
      /*
     *  改变区
     *  q 区对象
     * */
      changecountry (q) {
        this.country = q
      },
      // 返回
      goBack () {
        this.$router.push({
          name: 'storeList',
        })
      },
      // 获取门店详情
      async getStoreDetail () {
        // let self = this
        try {
          const {response, result} = await this.storeDetail({store_id: this.store_id})
          if (response.status === 200) {
            if (result.code === 0) {
              this.store = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取门店详情失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店详情失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店详情失败',
            content: `错误：${err}`,
          })
        }
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
        if (level === 3) {
          params.parentId = this.city.id
        }
        try {
          const {response, result} = await this.getAdressApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              if (level === 1) {
                this.province_list = result.data
              }
              if (level === 2) {
                this.city_list = result.data
              }
              if (level === 3) {
                this.country_list = result.data
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
      /*
      * 获取地址
      *  @level 省市区
      * */
    },
    mounted () {
      this.page_title = this.$route.query.storeName  // 页面标题，门店名称
      if (this.$route.query.storeName && this.$route.query.storeName.length > 20) {
        this.cannot_edit_name = false
      } else {
        this.cannot_edit_name = true
      }
      this.getStoreDetail()
      this.getAdress(1)
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  // @import '~@/stylus/modules/upload-pic'
  .checkbox
    margin-left 150px
  .middle
    margin 0 10px
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
  .tip-description
    font-size 14px
    line-height 16px
    color red
    white-space nowrap
    margin-top 0px
</style>
