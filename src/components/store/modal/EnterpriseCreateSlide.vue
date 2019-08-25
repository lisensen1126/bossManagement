<!--新增企业侧边弹出框组件-->
<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 新增企业
      .field-group.is-horizontal
        .field
          label.label 企业名称
          custom-input(v-model="enterprise.enterprise_name", maxlength=30, placeholder="请输入企业名称", :validator="$v.enterprise.enterprise_name", error-info="企业名称必填并且小于三十位")
      .field-group.is-horizontal
        .field
          label.label 联系人
          custom-input(v-model="enterprise.contact", maxlength=5, placeholder="联系人", :validator="$v.enterprise.contact", error-info="请填写联系人")
      .field-group.is-horizontal
        .field
          label.label 联系人电话
          custom-input(placeholder="联系电话", maxlength=11, need-type='number', v-model="enterprise.mobile", :validator="$v.enterprise.mobile", error-info="请填写正确的联系电话")
      .field-group.is-horizontal
        .field
          label.label 企业地址
          .control.select-box-wrapper
            .select-box
              select(v-model="enterprise.province_id", id="province", @change="getRegions('citylist', enterprise.province_id, false)", :validator="$v.enterprise.province_id")
                option(value="") 请选择
                option(v-for="list in provincelist", :value="list.id") {{list.name}}
            .select-box
              select(v-model="enterprise.city_id", id="city", @change="getRegions('districtlist', enterprise.city_id, false)", :validator="$v.enterprise.city_id")
                option(value="") 请选择
                option(v-for="list in citylist", :value="list.id") {{list.name}}
            .select-box
              select(v-model="enterprise.district_id", id="district", :validator="$v.enterprise.district_id", @change="getAddress")
                option(value="") 请选择
                option(v-for="list in districtlist", :value="list.id") {{list.name}}
      .field-group.is-horizontal
        .field
          label.label 详细地址
          custom-input(v-model="enterprise.address", maxlength=40, placeholder="请输入详细地址", :validator="$v.enterprise.address", error-info="请填写详细地址,且不能超过40个字符")
      .field-group.is-horizontal
        .field
          label.label 企业类型
          .period-select
            .radio(:class="{'checked': chain_type === '1'}")
              input(type="radio", id="chain_multiple_slide", v-model="chain_type", value="1", :disabled="isDisabled")
              label(for="chain_multiple_slide") 一个小程序
            .radio(:class="{'checked': chain_type === '2'}")
              input(type="radio", id="chain_single_slide", v-model="chain_type", value="2", :disabled="isDisabled")
              label(for="chain_single_slide") 多小程序
          //- .switch
          //-   input(type="checkbox", id="nb", v-model="is_chain")
          //-   label(for="nb")
    .field
      button.button.large.primary(@click="inspectData") 创建企业
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
    // 获取省市区接口
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
    // 新增企业操作
    inspectData () {
      this.enterprise.is_chain = parseInt(this.chain_type)
      this.$v.enterprise.$touch()
      if (this.$v.enterprise.address.$error || this.$v.enterprise.enterprise_name.$error || this.$v.enterprise.mobile.$error || this.$v.enterprise.contact.$error) {
        return
      } else if (this.$v.enterprise.district_id.$error || this.$v.enterprise.city_id.$error || this.$v.enterprise.province_id.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '企业地址必选',
        })
        return
      }
      // 创建企业接口调用
      this.commitenterprise()
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
              this.$emit('success')
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
  },
  mounted () {
    this.getRegions('provincelist', 0) // 获取省市区接口
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
.slide-layout .cus-box .field-group .field
  width 100% !important
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
.period-select
  display flex
  padding 16px 0
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
</style>
