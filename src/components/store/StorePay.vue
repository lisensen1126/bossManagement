<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-text="store_name")
      form.form-wrapper
        .field-group.cs
          .field.is-horizontal
            label.label 支付渠道
            span 美团支付
          .field.is-horizontal.long-field
            label.label 状态
            span {{status}}
            span.red(v-if='reason.length > 0') {{reason}}
            a.operation-link(@click="goPage", v-if="is_click === 1") 申请银行卡验证
            a.operation-link(@click="goPage", v-if="is_click === 2") 重新申请银行卡号验证
            a.operation-link(@click="goPage", v-if="is_click === 3") 申请支付
            a.operation-link(@click="goPage", v-if="is_click === 4") 重新申请支付
          .field.is-horizontal
            label.label 商户ID
            span {{merchant_id}}
          .field.is-horizontal(v-if="currentUser.is_system_admin && currentUser.is_system_admin == 1 && is_pay === 3")
            label.label 支付费率
            span {{wx_rate / 100}}%
            a.change(@click="changeRate", v-if="change_verify_status !== 2") 切换支付费率
            a.change.gray(v-else) 切换支付费率
          .field.is-horizontal(v-if="currentUser.is_system_admin && currentUser.is_system_admin == 1 && is_pay === 3")
            label.label 费率审核进度
            span {{formatState(change_verify_status)}}
      change-rate(v-if="is_show", :wxRate="wx_rate", :rateData="rate_data", @resolve="confirm", @input="close")
</template>

<script>
import storePayApi from '@/mixins/modules/StorePay'
import ChangeRate from '@/components/store/modal/ChangeRate'
import { mapGetters } from 'vuex'
/**
 * @vue
 */
export default {
  name: 'StorePay',
  mixins: [storePayApi],
  components: {
    ChangeRate,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    return {
      flag: false,
      store_id: this.$route.query.storeId, // 门店ID
      store_name: this.$route.query.storeName, // ，门店名字
      merchant_id: '', // 商户ID
      status: '', // 状态
      reason: '',   // 失败原因
      is_click: 0, // 是否点击
      type: 1, // 账户类型
      wx_rate: null, // 支付费率
      change_verify_status: null, // 审核进度
      is_show: false,
      rate_data: [
        {
          label: '0.3%',
          value: 30,
        },
        {
          label: '0.31%',
          value: 31,
        },
        {
          label: '0.32%',
          value: 32,
        },
        {
          label: '0.33%',
          value: 33,
        },
        {
          label: '0.34%',
          value: 34,
        },
        {
          label: '0.35%',
          value: 35,
        },
        {
          label: '0.36%',
          value: 36,
        },
        {
          label: '0.37%',
          value: 37,
        },
        {
          label: '0.38%',
          value: 38,
        },
      ],
      is_pay: null, // 是否开通支付：1 等待提交支付审核，2 支付审核中，3 审核完成/已开通支付，4 支付审核失败
    }
  },
  methods: {
    // 切换美团支付费率
    async setChangeMerchant (data) {
      let params = {
        store_id: this.store_id,
        rate: data.value,
      }
      try {
        const { response, result } = await this.setChangeMerchantApi(params)
        if (response.status === 200 && result.code === 0) {
          this.is_show = false
          this.getStoreMei()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '切换美团支付费率失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '切换美团支付费率失败',
          content: `错误：${err}`,
        })
      }
    },
    // 切换费率
    changeRate () {
      this.is_show = true
    },
    // 切换费率确定
    confirm (data) {
      this.setChangeMerchant(data)
    },
    // 关闭弹框
    close () {
      this.is_show = false
    },
    formatState (type) {
      let text = ''
      switch (type) {
        case 1:
          text = '无'
          break
        case 2:
          text = '审核中'
          break
        case 3:
          text = '审核失败'
          break
      }
      return text
    },
    // 跳转页面
    goPage () {
      if (this.is_click === 1 || this.is_click === 2) {
        this.$router.push({
          name: 'secondBrandCard',
          query: {
            storeId: this.store_id,
            storeName: this.store_name,
          },
        })
      }
      if (this.is_click === 3) {
        this.$router.push({
          name: 'thirdEnterPay',
          query: {
            storeId: this.store_id,
            storeName: this.store_name,
          },
        })
      }
      if (this.is_click === 4) {
        this.goReset()
      }
    },
    //  重新开户
    async goReset () {
      let params = {
        store_id: this.store_id,
      }
      try {
        const { response, result } = await this.resetMerchantApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
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
    // 返回
    goBack () {
      this.$router.push({
        name: 'enterpriseList',
      })
    },
    /*
    *  获取状态
    *  @ pay 门店支付的状态
    * */
    showStatus (pay) {
      switch (pay) {
        case 1:
          this.status = '待提交支付审核'
          this.is_click = 3
          break
        case 2:
          this.status = '支付审核中'
          this.is_click = 0
          break
        case 4:
          this.status = '支付审核失败'
          this.is_click = 4
          break
        case 3:
          this.status = '已开通'
          this.is_click = 0
          break
      }
    },
    // 获取门店美团支付状态
    async getStoreMei () {
      try {
        const { response, result } = await this.getMerchantApi({ store_id: this.store_id })
        if (response.status === 200) {
          if (result.code === 0) {
            // console.log(result.data)
            this.merchant_id = result.data.merchantId
            this.wx_rate = result.data.wxRate
            this.change_verify_status = result.data.change_verify_status
            switch (result.data.is_verify_card) {
              case 1:
                this.status = '待提交卡号验证'
                this.is_click = 1
                break
              case 2:
                this.status = '卡号验证中'
                this.is_click = 0
                break
              case 4:
                this.status = '卡号验证失败'
                this.is_click = 2
                if (result.data.last_bank_card && result.data.last_bank_card.reason.length !== 0) {
                  this.reason = result.data.last_bank_card.reason
                }
                break
              case 3:
                this.type = result.data.bank_card.acctype
                this.showStatus(result.data.is_pay)
                this.is_pay = result.data.is_pay
                if (result.data.is_pay === 4 && result.data.reason.length !== 0) {
                  this.reason = result.data.reason
                }
                break
            }
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
    // this.goBrandCard()
    this.getStoreMei()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
// @import '~@/stylus/modules/upload-pic'
.long-field
  width 90% !important
  .red
    width auto
    max-width 50%
.change
  margin-left 50px
  font-size 14px
  &.gray
    color #aaa
.red
  color red
  font-size 12px
  margin-left 10px
  line-height 14px
.operation-link
  margin-left 30px
  font-size 14px
span
  font-size 14px
.content
  height 100%
.content-wrapper
  min-height 100%
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
