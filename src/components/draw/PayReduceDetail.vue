<template lang="pug">
  .section-layout
    .content-wrapper
      h2.border-bottom  门店报名详情
      h3.title-name 一、门店信息
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 门店名称
            custom-input(:isDisabled="true", v-model="apply_info.store_name")
          .field.is-horizontal
            label.label 经销商编码
            custom-input(:isDisabled="true", v-model="apply_info.dealer_code")
          .field.is-horizontal
            label.label 门店编码
            custom-input(:isDisabled="true", v-model="apply_info.store_code")
          .field.is-horizontal
            label.label 收货人名称
            custom-input(v-model="apply_info.contacts", maxlength='10', :validator="$v.apply_info.contacts", error-info="收货人名称必填",)
          .field.is-horizontal
            label.label 联系电话
            custom-input(v-model="apply_info.mobile", maxlength='11', :validator="$v.apply_info.mobile", error-info="请填写正确的联系电话",)
          .field.is-horizontal
            label.label 联系地址
            custom-input(:isDisabled="true", v-model="apply_info.addr")
          .field.is-horizontal
            label.label
            textarea.address(v-model="apply_info.address", maxlength="50")
          .field.is-horizontal
            label.label
            .right-op
                button.button.primary.margin-between(@click="saveAddr()")  保存
                button.button.primary(@click="copyAddr()")  复制地址
      h3.title-name 
        span  二、门店物料照片
        span(v-if="apply_info.upload_status===1")  已确认
      .not-done-tip.border-bottom-1(v-if="apply_info.upload_status===2") 门店还未上传物料照片
      .material-pic(v-show="apply_info.applyInfoPic.length>0")
        img(v-for="item in apply_info.applyInfoPic", :src="item")
      h3.title-name.paddingb20
        span  三、支付有礼券、评价有礼券
        span(v-if="apply_info.coupon_status===1")  已确认
      .not-done-tip(v-if="apply_info.coupon_status===2") 门店还未配置有礼券
      .foot-btn
        button.button.large(@click="goBack()") 返回
        button.button.primary.large(@click="updateState") {{apply_info.status!==3?"暂停参与活动":"参与活动"}}
        button.button.primary.large(@click="downloadMaterial", :class="{'disabled':apply_info.materiel_status!==3}") {{apply_info.materiel_status===3?"打包下载物料":"物料尚未生成"}}
      input.hidden-input(v-model="copy_content", id="hidden-input")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import drawApi from '@/mixins/modules/draw'
import { root } from '@/plugins/Fetch'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
export default {
  components: {
    CustomInput,
  },
  name: 'PayReduceDetail',
  mixins: [drawApi, validationMixin],
  data () {
    return {
      apply_info: {applyInfoPic: {}}, // 报名详情信息
      copy_content: '', // 复制的内容
    }
  },
  validations: {
    apply_info: {
      contacts: {
        required,
      },
      mobile: {
        required,
        validate (val) {
          return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
        },
      },
    },
  },
  mounted () {
    this.getDetailInfo()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    async getDetailInfo () {
      try {
        const {result, response} = await this.getPayStoreDetail({id: this.$route.query.id})
        if (response.status === 200 && result.code === 0) {
          this.apply_info = result.data
          this.apply_info.addr = `${result.data.province_name} ${result.data.city_name} ${result.data.area_name}`
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取报名详情失败',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取报名详情失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    copyAddr () {
      this.copy_content = `${this.apply_info.addr} ${this.apply_info.address}`
      let input = document.getElementById('hidden-input')
      setTimeout(() => {
        input.select()
        let status = document.execCommand('Copy')
        if (status) {
          this.$store.dispatch('showMessage', {
            title: '复制成功！',
            autoClose: true,
          })
        }
      }, 100)
    },
    saveAddr () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.updateInfo({
        id: this.$route.query.id,
        address: this.apply_info.address,
        mobile: this.apply_info.mobile,
        contacts: this.apply_info.contacts,
      }, '保存地址成功！')
    },
    async updateState () {
      let status = this.apply_info.status === 3 ? this.apply_info.coupon_status === 1 ? 2 : 1 : 3
      let msg = this.apply_info.status !== 3 ? '暂停此门店参与活动成功' : '开启此门店参与活动成功'
      await this.updateInfo({
        id: this.$route.query.id,
        status: status,
      }, msg)
      this.getDetailInfo()
    },
    async updateInfo (params, msg) {
      try {
        const {result, response} = await this.editPayStoreStatus(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            title: msg,
            autoClose: true,
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    downloadMaterial () {
      if (this.apply_info.materiel_status === 3) {
        window.open(`${root}/random_coupon/download_zip?id=${this.apply_info.id}`)
      }
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/creation-modal'
.hidden-input
  position absolute
  top -999px
  opacity 0
.border-bottom
  border-bottom 2px solid #f0f0f0
.border-bottom-1
  border-bottom 1px solid #f0f0f0
.paddingb20
  padding-bottom 20px
.title-name
  margin  20px 0 0 30px
.not-done-tip
  padding 20px 60px
.form-wrapper
  border-top none
  .field-group
    border-bottom none
.margin-between
  margin 0 15px
.material-pic
  padding 30px
  border-bottom 1px solid #f1f1f1
  img
    width 180px
    height 120px
    margin 0 20px
.download-box    
  border-bottom 1px solid #f1f1f1
  padding 30px
  text-align center
  button
    margin-top 20px
  .material-download
    display flex  
    .material-item
      text-align center
      margin 0 20px
      img 
        width 180px
        height 220px      
      .text
        margin-top 10px
        font-size 14px
.foot-btn
  text-align center
  padding-top 30px
  border-top 1px solid #f0f0f0
  button 
    margin 0 20px
.address
  width 100%
  height 100px
  text-indent 10px  
</style>
