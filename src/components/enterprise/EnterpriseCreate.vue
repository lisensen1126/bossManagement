<template lang="pug">
  .section-layout.content
    .content-wrapper
      h2(v-if="enterpriseOption==3") 查看企业信息
      h2(v-if="enterpriseOption==1") 新增企业
      h2(v-if="enterpriseOption==2") 编辑企业信息
      .form-wrapper
        .field-group.cs
          .field.is-horizontal
            label.label 企业名称
            custom-input(v-model="enterprise.enterprise_name", maxlength=30, placeholder="请输入企业名称", :validator="$v.enterprise.enterprise_name", error-info="企业名称必填并且小于三十位", :isDisabled="enterpriseOption==3")
          .field.is-horizontal
            label.label 联系人
            custom-input(v-model="enterprise.contact", maxlength=5, placeholder="联系人", :isDisabled="enterpriseOption==3" :validator="$v.enterprise.contact", error-info="请填写联系人")
          .field.is-horizontal
            label.label 联系人电话
            custom-input(placeholder="联系电话", maxlength=11,need-type='number',v-model="enterprise.mobile", :isDisabled="enterpriseOption==3", :validator="$v.enterprise.mobile", error-info="请填写正确的联系电话")
        .field-group.cs
          .field.is-horizontal
            label.label 企业地址
            .control.select-box-wrapper
              .select-box
                select(v-model="enterprise.province_id", :disabled="enterpriseOption==3", id="province", @change="getRegions('citylist', enterprise.province_id, false)", :validator="$v.enterprise.province_id")
                  option(value="") 请选择
                  option(v-for="list in provincelist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="enterprise.city_id", id="city", :disabled="enterpriseOption==3", @change="getRegions('districtlist', enterprise.city_id, false)", :validator="$v.enterprise.city_id")
                  option(value="") 请选择
                  option(v-for="list in citylist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="enterprise.district_id", id="district", :disabled="enterpriseOption==3", :validator="$v.enterprise.district_id", @change="getAddress")
                  option(value="") 请选择
                  option(v-for="list in districtlist", :value="list.id") {{list.name}}
                //- custom-select
          .field.is-horizontal
            label.label 详细地址
            custom-input(v-model="enterprise.address", :isDisabled="enterpriseOption==3", maxlength=40, placeholder="请输入详细地址", :validator="$v.enterprise.address", error-info="请填写详细地址,且不能超过40个字符")
          .field.is-horizontal
            label.label 企业类型
            .period-select(v-if="enterpriseOption==1")
              .radio(:class="{'checked': chain_type === '1'}")
                input(type="radio", id="chain_multiple", v-model="chain_type", value="1", :disabled="isDisabled")
                label(for="chain_multiple") 一个小程序
              .radio(:class="{'checked': chain_type === '2'}")
                input(type="radio", id="chain_single", v-model="chain_type", value="2", :disabled="isDisabled")
                label(for="chain_single") 多小程序
            .period-select(v-if="enterpriseOption!==1")
              .field-content(v-if="enterprise.is_chain == 1") 一个小程序
              .field-content(v-if="enterprise.is_chain == 2") 多小程序
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData", v-if="enterpriseOption==1") 创建企业
          a.button.primary.large.isDisabled(@click="inspectData", v-if="enterpriseOption==2") 修改企业
          a.button.large(@click="goBack") 返回
</template>

<script>
import enterApi from '@/mixins/modules/enterprise'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import StarRating from '@/components/generics/StarRating'
import CustomSelect from '@/components/generics/form/CustomSelect'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'

export default {
  name: 'EnterpriseCreate',
  mixins: [validationMixin, enterApi, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    StarRating,
  },
  data () {
    return {
      isDisabled: false, // 是否选中
      chain_type: 1, // 企业类型
      flag: false,
      enterpriseOption: this.$route.query.edit,
      enterpriseId: this.$route.query.enterpriseId,
      isLoading: false,
      provincelist: [],
      districtlist: [],
      citylist: [],
      fulladdress: '',
      isNeedCaculate: false,
      edit: false,
      is_chain: false,
      enterprise: {
        enterprise_id: '',
        hash: '',
        enterprise_name: '',
        contact: '',
        mobile: '',
        province_id: '',
        province_name: '',
        city_id: '',
        city_name: '',
        district_id: '',
        district_name: '',
        address: '',
      },
      maxAptitudes: 4,
      isUploading: false,
    }
  },
  methods: {
    getAddress () {
      if (!this.enterprise.address) {
        return
      }
      const province = this.provincelist[document.getElementById('province').selectedIndex - 1].name
      const city = this.citylist[document.getElementById('city').selectedIndex - 1].name
      const district = this.districtlist[document.getElementById('district').selectedIndex - 1].name
      this.fulladdress = province + city + district + this.enterprise.address
    },

    goBack () {
      this.$router.push({
        name: 'enterpriseList',
      })
    },
    async getRegions (cate, parentId, flag = true) {
      const {response, result} = await this.fetchRegions({parent_id: parentId})
      if (response.status === 200 && result.code === 0) {
        switch (cate) {
          case 'citylist':
            this.enterprise.district_id = this.enterpriseId && flag ? this.enterprise.district_id : ''
            this.enterprise.city_id = this.enterpriseId && flag ? this.enterprise.city_id : ''
            this.citylist = []
            this.districtlist = []
            break
          case 'districtlist':
            this.enterprise.district_id = this.enterpriseId && flag ? this.enterprise.district_id : ''
            this.districtlist = []
            break
        }
        this[cate] = result.data
      }
    },
    // 修改企业 正则
    inspectData () {
      this.enterprise.is_chain = parseInt(this.chain_type)
      this.$v.enterprise.$touch()
      if (this.$v.enterprise.address.$error || this.$v.enterprise.enterprise_name.$error || this.$v.enterprise.mobile.$error || this.$v.enterprise.contact.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      } else if (this.$v.enterprise.district_id.$error || this.$v.enterprise.city_id.$error || this.$v.enterprise.province_id.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '企业地址必选',
        })
        return
      }
      if (this.enterpriseOption === 2) {
        // 修改
        this.editenterprise()
      } else {
        // 创建
        this.commitenterprise()
      }
    },
    // 提交修改
    async editenterprise () {
      try {
        const {response, result} = await this.updateEnter(this.enterprise)
        if (response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '企业修改成功',
            resolve: () => {
              this.$router.push({
                name: 'enterpriseList',
                query: {
                  save: 1,
                },
              })
            },
          })
        } else {
          this.isNeedCaculate = false
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改企业失败1',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改企业失败2',
          content: `错误：${err}`,
        })
      }
    },
    // 提交创建
    async commitenterprise () {
      try {
        const {response, result} = await this.addEnter(this.enterprise)
        if (response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '企业创建成功',
            resolve: () => {
              this.$router.push({
                name: 'enterpriseList',
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建企业失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '创建企业失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取企业详情(改变此处)
    async getenterpriseDetail (params) {
      try {
        const {response, result} = await this.enterDetail({
          enterprise_id: params,
        })
        if (response.status === 200 && result.code === 0) {
          let self = this
          this.enterprise = result.data
          this.getRegions('citylist', result.data.province_id).then(function () {
            self.getRegions('districtlist', result.data.city_id)
          })
          // 此处判断选中哪类小程序
          this.chain_type = result.data.is_chain
          // this.enterprise.is_chain === 1 ? this.is_chain = 1 : this.is_chain = 2
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取企业详情失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取企业详情失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    this.getRegions('provincelist', 0)
    if ((this.$route.query.edit - 0) === 2 || (this.$route.query.edit - 0) === 3) {
      this.getenterpriseDetail(this.$route.query.enterpriseId)
    }
  },
  validations: {
    enterprise: {
      enterprise_name: {
        required,
      },
      contact: {
        required,
      },
      mobile: {
        required,
        validate (val) {
          return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
        },
      },
      province_id: {
        required,
      },
      city_id: {
        required,
      },
      district_id: {
        required,
      },
      address: {
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
.period-box
  width 100%
  border 1px solid #ccc
  background #fcfcfc
  border-radius 2px
.period-box-top
  width 100%
  background #fff
  height 105px
  position relative
  border-bottom 1px solid #ccc
.period-box-item
  width 100%
  height 56px
  box-sizing border-box
  border-bottom 1px solid rgba(0, 0, 0, .06)
  display flex
  flex-direction row
  padding 16px
  .multiple-toggle-btns + .multiple-toggle-btns
    margin-left 12px
  label
    width 56px
.period-select
  display flex
  box-sizing border-box
  .radio + .radio
    margin-left 79px
  .radio
    &.checked
      &::after
        display block
        content ""
        position absolute
        bottom -21px
        left 4px
        width 0
        height 0
        border none
        border-right none
        border-bottom none
        transform rotate(45deg)
        background #fff
.period-box-bottom
  background #fcfcfc
  padding 16px 0 0 16px
  box-sizing border-box
  height 96px
  .multiple-toggle-btns
    margin-right 16px
    margin-left 0
    margin-bottom 16px
  .multiple-toggle-btns + .multiple-toggle-btns
    margin-left 0
  label
    width 98px
    padding 0
    text-align center
    font-size 12px
  .button
    width 98px
    height 24px
    font-size 12px
    line-height 24px
.period-box-tip
  width 100%
  padding 16px 16px 0
  color #999
  font-size 12px
  line-height 16px
  display flex
  flex-wrap wrap
  span
    display inline-flex
    margin-left 5px
    position relative
    padding-right 6px
    &::after
      display block
      content ""
      width 1px
      height 12px
      background #999
      position absolute
      top 50%
      right 0
      transform translateY(-50%)
    &:last-child
      &::after
        display none
.toggle-btns.custom-size
  label
    padding 0
    width 40px
.select-box-wrapper
  display flex
.select-box
  flex 1
  select
    width 100%
    border 1px solid #ccc
    height 32px
    box-sizing border-box
    border-radius 2px
    box-sizing border-box
    padding 0 12px
.select-box + .select-box
  margin-left 8px
.is-flex
  display flex
.evaluate-bar
  margin-top 8px
  margin-bottom 6px
  display flex
.star-rate-area
  margin-left 17px
.label-close
  position absolute
  top -8px
  right -8px
  width 15px
  height 15px
  background #fe5942
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05)
  border-radius 50%
  cursor pointer
  &::after
    display block
    content ""
    position absolute
    width 15px
    height 15px
    background url('~@/assets/remove-time.svg')
    left 50%
    top 50%
    transform translate(-50%, -50%)
.image-wrapper
  display flex
  flex-direction row
  .upload-banner + .upload-banner
    margin-left 8px
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
