<!--门店同步页面-->
<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2(v-if="edit===1") 新店同步
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 门店名称
            custom-input(v-model="store.store_name", maxlength=30, placeholder="请输入门店名称", :validator="$v.store.store_name", error-info="门店名称必填并且小于三十位")
          .field.is-horizontal
            label.label 经销商编码
            .field-content(v-text="store.dealer_code?store.dealer_code:'暂无编码'")
          .field.is-horizontal
            label.label 门店编码
            .field-content(v-text="store.store_code?store.store_code:'暂无编码'")
          .field.is-horizontal
            label.label 企业名称
            .select-box
              custom-select(v-model="store.enterprise", :list="enterList", :validator="$v.store.enterprise_id", error-info="企业必选", nameField="enterprise_name", :input="changeEnter(store.enterprise)", v-if="edit==1", :show-search="true")
              custom-input(v-model="store.enterprise_name", isDisabled="true", v-else)
          .field.is-horizontal(v-if="edit===1")
            label.label
            a.button.primary(@click="toggleSidePannel") 新增企业
            span.reference 参考: {{store.reference.enterprise}}
          .field.is-horizontal
            label.label 门店类型
            .field-content(v-if="store.store_type == 1" ,v-text="'智慧门店'")
            .field-content(v-if="store.store_type == 2" ,v-text="'超凡门店'")
          .field.is-horizontal(v-if="chain_type")
            label.label 小程序类型
            .field-content(v-if="chain_type == 1" ,v-text="'一个小程序'")
            .field-content(v-if="chain_type == 2" ,v-text="'多小程序'")
            //- .period-select
            //-   .radio(:class="{'checked': chain_type == 1}", v-if="chain_type == 1")
            //-     input(type="radio", id="chain_multiple", v-model="chain_type", value="1", :disabled="isDisabled")
            //-     label(for="chain_multiple") 一个小程序
            //-   .radio(:class="{'checked': chain_type == 2}" v-if="chain_type == 2")
            //-     input(type="radio", id="chain_single", v-model="chain_type", value="2", :disabled="isDisabled")
            //-     label(for="chain_single") 多小程序
            //- .field-content(v-if="store.mini_type == 1" ,v-text="'综合版(B版)'")
            //- .field-content(v-if="store.mini_type == 2" ,v-text="'保养版(C版)'")
          .field.is-horizontal
            label.label 联系人
            custom-input(placeholder="请输入联系人名称，最多5个字符", maxlength=5, v-model="store.contacts", :validator="$v.store.contacts", error-info="请输入联系人，最多5个字符",)
          .field.is-horizontal
            label.label 联系电话
            custom-input(placeholder="联系电话(座机号/手机号)", v-model="store.business_phone", :validator="$v.store.business_phone", need-type='specialTel', error-info="请填写正确的联系电话")
          .field.is-horizontal
            label.label
            span.example 例: xxx-xxxxxxxx （座机号格式）
          .field.is-horizontal
            label.label 门店认证
            custom-select(v-model="nowRen", :list="renList",  nameField="title", error-info="门店认证必选", @input="changeRen")
          .field.is-horizontal
            label.label 门店地址
            .control.select-box-wrapper
              .select-box
                select(v-model="store.province_id", id="province", @change="getRegions('citylist', store.province_id, false)", :validator="$v.store.province_id")
                  option(value="") 请选择
                  option(v-for="list in provincelist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.city_id", id="city", @change="getRegions('districtlist', store.city_id, false)", :validator="$v.store.city_id")
                  option(value="") 请选择
                  option(v-for="list in citylist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.district_id", id="district", :validator="$v.store.district_id")
                  option(value="") 请选择
                  option(v-for="list in districtlist", :value="list.id") {{list.name}}
      .btn-wrapper
        .button-group
          a.button.primary.large.width-150(@click="inspectData", v-if="edit === 1") 同步并创建账号
          a.button.primary.large.width-150(@click="openStoreList", v-if="edit === 1") 同步到已有门店
          a.button.large(@click="goBack") 返回
    choose-ren(v-model="itemren" ,v-if="itemren", @resolve="addRen", :nowRen="nowRen", :allRen="renList")
    // 新建企业组件
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      enterprise-create-slide(@success="additionHandler",)
    // 选择编码为空的门店列表弹框
    choose-store(v-model="show_store", v-if="show_store", @resolve="getStore")
</template>

<script>
import enterpriseApi from '@/mixins/modules/enterprise'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import StarRating from '@/components/generics/StarRating'
import CustomSelect from '@/components/generics/form/CustomSelect'
import SelectTime from '@/components/generics/SelectTime'
import SetTimePeriod from '@/components/generics/SetTimePeriod'
import StoreQualificationsModel from '@/components/store/modal/StoreQualificationsModel'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import ChooseFuwu from '@/components/store/modal/ChooseFuwu'
import ChooseRen from '@/components/store/modal/ChooseRen'
import UploadPic from '@/components/generics/form/UploadPic'
import SlideOutModal from '@/components/generics/SlideOutModal'
import EnterpriseCreateSlide from '@/components/store/modal/EnterpriseCreateSlide'
import ChooseStore from '@/components/store/modal/ChooseStore'
/**
 * @vue
 */
export default {
  name: 'checkStoreEdit',
  mixins: [validationMixin, enterpriseApi, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    SelectTime,
    StarRating,
    SetTimePeriod,
    StoreQualificationsModel,
    uploadImgModel,
    ChooseFuwu,
    ChooseRen,
    UploadPic,
    SlideOutModal,
    EnterpriseCreateSlide,
    ChooseStore,
  },
  data () {
    return {
      isDisabled: false, // 是否选中
      chain_type: null, // 企业类型
      temp: {},
      itemfuwu: false, // 选择服务组件
      fuwuList: [], // 服务列表
      itemren: false, // 选择认证组件
      nowRen: [], // 此次所选认证
      renList: [], // 服务认证
      storeId: '',
      isLoading: false,
      provincelist: [],
      districtlist: [],
      citylist: [],
      edit: 1,
      version_list: [
        {
          name: '综合版(B版)',
          mini_type: 1,
        },
        {
          name: '保养版(C版)',
          mini_type: 2,
        },
      ],
      store_version: {
        name: '综合版(B版)',
        mini_type: 1,
      },
      store: {
        store_name: '', // 名称
        banner: '', // 图片地址
        dealer_code: '', // 经销商编码
        store_code: '', // 门店编码
        propaganda: [], // 店招图
        business_phone: '', // 联系电话
        lng: '',
        lat: '',
        province_id: '', // 省
        city_id: '', // 市
        district_id: '', // 区
        average_rating_type: 1, // 评价类型
        custom_average_rating: '0', // 评分
        enterprise_id: '',
        contacts: '',
        enterprise: {}, // 企业信息
        service: [],
        authentication: [],
        mini_type: 1,
        reference: {  //  同步数据时的参考字段
          address: '',
          authentication: [],
          city: '',
          district: '',
          enterprise: '',
          province: '',
          reservation_date: [],
          service: '',
        },
      },
      maxAptitudes: 4,
      isUploading: false,
      enterList: [],
      slideVisible: false, // 控制新建企业组件显隐
      show_store: false, // 控制选择门店弹窗显隐
    }
  },
  computed: {
    /*
    *  改变认证
    *  q 认证对象
    * */
    changeRen (q) {
      this.nowRen = q
    },
    // 请求参数
    getParams () {
      let temp = {
        ...this.store,
      }
      var arr = []
      var brr = [this.nowRen.setting_id]
      return {
        ...temp,
        average_rating_type: this.store.average_rating_type,
        average_rating: this.store.average_rating_type === 1 ? undefined : this.store.custom_average_rating,
        enterprise_id: this.store.enterprise.enterprise_id,
        authentication: brr,
        service: arr,
        mini_type: this.store_version.mini_type,
        store_name: this.store.store_name.trim(),
        contacts: this.store.contacts.trim(),
        sync_time: Date.parse(new Date()) / 1000,
      }
      console.log(temp, 'temp')
    },
  },
  methods: {
    // 控制添加企业组件的显隐
    toggleSidePannel () {
      this.slideVisible = !this.slideVisible
    },
    // 添加企业成功回调
    additionHandler () {
      this.toggleSidePannel() // 关闭添加企业组件
      this.getEnter() // 刷新企业列表
    },
    // 返回
    goBack () {
      this.$router.replace({
        name: 'checkStoreList',
      })
    },

    // 监听企业选择   不知道有什么用  暂时保留
    changeEnter (item) {
      if (item.enterprise_id) {
        this.store.enterprise_id = item.enterprise_id
      }
      this.chain_type = item.is_chain
    },

    // 获取省市区
    async getRegions (cate, parentId, flag = true) {
      const { response, result } = await this.fetchRegions({ parent_id: parentId })
      if (response.status === 200) {
        switch (cate) {
          case 'citylist':
            this.store.district_id = this.storeId && flag ? this.store.district_id : ''
            this.store.city_id = this.storeId && flag ? this.store.city_id : ''
            this.citylist = []
            this.districtlist = []
            break
          case 'districtlist':
            this.store.district_id = this.storeId && flag ? this.store.district_id : ''
            this.districtlist = []
            break
        }
        this[cate] = result.data
      }
    },

    // 创建门店操作
    inspectData () {
      this.$v.store.$touch()
      if (this.$v.store.store_name.$error || this.$v.store.business_phone.$error || this.$v.store.contacts.$error || this.$v.store.enterprise_id.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        // eslint-disable-next-line no-useless-return
        return
      } else if (this.$v.store.district_id.$error || this.$v.store.city_id.$error || this.$v.store.province_id.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '门店地址必选',
        })
        // eslint-disable-next-line no-useless-return
        return
      }
      if (!this.chain_type) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择小程序类型',
        })
        // eslint-disable-next-line no-useless-return
        return
      }
      this.commitStore()
    },

    // 同步门店接口
    async commitStore () {
      this.store.enterprise_id = this.store.enterprise.enterprise_id
      try {
        if (this.isUploading) {
          return
        }
        this.isUploading = true
        const { response, result } = await this.addStore(this.getParams)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '同步成功',
              resolve: () => {
                this.$router.replace({
                  name: 'checkStoreList',
                })
              },
            })
          } else {
            this.isUploading = false
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '同步失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } else {
          this.isUploading = false
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '同步失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '同步失败',
          content: `错误：${err}`,
        })
        this.isUploading = false
      }
    },

    // 获取企业
    async getEnter () {
      try {
        const { response, result } = await this.GetEnterList({
          current_page: 1,
          per_page: 10000,
          is_have_channel: 0,
        })
        if (response.status === 200) {
          this.enterList = result.data.map(function (item, index) {
            if (item.is_chain === 1) {
              item.enterprise_name = item.enterprise_name + '（连锁）'
            }
            return item
          })
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
    // 获取同步门店数据详情（只在同步门店时调用）
    async getXianFengDetail () {
      try {
        const { response, result } = await this.storeXianFengDetail({ store_code: this.storeCode })
        if (response.status === 200 && result.code === 0) {
          if (result.data.mini_type === 1) {
            this.store_version.name = '综合版(B版)'
            this.store_version.mini_type = 1
          } else {
            this.store_version.name = '保养版(C版)'
            this.store_version.mini_type = 2
          }
          await this.getRegions('citylist', result.data.region.pid)
          await this.getRegions('districtlist', result.data.region.cid)
          this.store = {
            ...this.store,
            ...result.data,
            province_id: result.data.region.pid,
            city_id: result.data.region.cid,
            district_id: result.data.region.did,
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取同步门店详情失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取同步门店详情失败',
          content: `错误：${err}`,
        })
      }
    },
    /*
    * 认证列表
    * */
    async getRenList (authentication) {
      try {
        const { response, result } = await this.getFWList({
          setting_type: 1,
        })
        if (response.status === 200) {
          this.renList = result.data
          if (this.storeId) {
            authentication.forEach(item => {
              this.renList.forEach(cell => {
                if (Number(cell.setting_id) === Number(item)) {
                  this.nowRen = cell
                }
              })
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取认证列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取认证列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 打开选择已有门店弹框
    openStoreList () {
      this.show_store = true
    },
    /**
     * 选择已有门店弹框的回调处理
     * @param {Object} 已选门店的数据
     */
    async getStore (params) {
      this.show_store = false // 关闭选择已有门店弹框
      try {
        const {response, result} = await this.fetchUpdateCode({
          store_id: params.store_id,
          store_code: this.store.store_code,
          dealer_code: this.store.dealer_code,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '同步到已有门店成功',
            resolve: () => {
              this.$router.replace({
                name: 'checkStoreList',
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '同步到已有门店失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '同步到已有门店失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.edit = Number(this.$route.query.edit)
    this.getRegions('provincelist', 0) // 获取省市区列表
    this.getEnter() // 获取企业列表
    if (this.edit == 1) {
      this.storeCode = this.$route.params.storeCode
      this.getXianFengDetail() // 获取同步门店数据详情
      this.getRenList() // 获取认证列表
    }
  },
  validations: {
    store: {
      store_name: {
        required,
      },
      contacts: {
        required,
      },
      business_phone: {
        required,
        validate (val) {
          return /^[0-9-]*$/.test(val)
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

      enterprise_id: {
        required,
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.field-content {
  font-size: 13px;
  line-height: 16px;
  color: #353535;
}
.example {
  font-size: 13px;
  color: #999999;
  line-height 18px;
}

.nav-back-btn {
  position: absolute;
  top: 36px;
  left: 16px;
  width: 32px;
  height: 32px;
  border-radius: 100%;
  background: #CED3DC center no-repeat url('~@/assets/back.svg');
  background-size: 16px;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.08);
  cursor: pointer;
  z-index: 2;
}

label.label {
  font-size: 13px;
}

.upload-pic {
  width: 88px;
  height: 88px;
  margin-right: 10px;
}

.form-wrapper .field {
  width: 520px;
}
.reference {
  font-size: 12px;
  line-height: 16px;
  margin-left: 8px;
  color: #999999;
}
.form-wrapper .field.full-width {
  width: 100%;
}

.upload-banner {
  width: 88px;
  height: 88px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  input[type='file'] {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.period-box-wrapper {
  width: 360px;
  margin-right: 18px;
}

.period-box {
  width: 100%;
  border: 1px solid #ccc;
  background: #fcfcfc;
  border-radius: 2px;
}

.period-box-top {
  width: 100%;
  background: #fff;
  height: 105px;
  position: relative;
  border-bottom: 1px solid #ccc;
}

.period-box-item {
  width: 100%;
  height: 56px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: row;
  padding: 16px;

  .multiple-toggle-btns + .multiple-toggle-btns {
    margin-left: 12px;
  }

  label {
    width: 56px;
  }
}

.period-select {
  display: flex;
  padding: 16px;
  box-sizing: border-box;

  .radio + .radio {
    margin-left: 79px;
  }

  .radio {
    &.checked {
      &::after {
        display: block;
        content: '';
        position: absolute;
        bottom: -21px;
        left: 4px;
        width: 8px;
        height: 8px;
        border: 1px solid #ccc;
        border-right: none;
        border-bottom: none;
        transform: rotate(45deg);
        background: #fff;
      }
    }
  }
}

.period-box-bottom {
  background: #fcfcfc;
  padding: 16px 0 0 16px;
  box-sizing: border-box;
  height: 96px;

  .multiple-toggle-btns {
    margin-right: 16px;
    margin-left: 0;
    margin-bottom: 16px;
  }

  .multiple-toggle-btns + .multiple-toggle-btns {
    margin-left: 0;
  }

  label {
    width: 98px;
    padding: 0;
    text-align: center;
    font-size: 12px;
  }

  .button {
    width: 98px;
    height: 24px;
    font-size: 12px;
    line-height: 24px;
  }
}

.period-box-tip {
  width: 100%;
  padding: 16px 16px 0;
  color: #999;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    margin-left: 5px;
    position: relative;
    padding-right: 6px;

    &::after {
      display: block;
      content: '';
      width: 1px;
      height: 12px;
      background: #999;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }

    &:last-child {
      &::after {
        display: none;
      }
    }
  }
}

.toggle-btns.custom-size {
  label {
    padding: 0;
    width: 40px;
  }
}

.select-box-wrapper {
  display: flex;
}

.select-box {
  flex: 1;

  select {
    width: 100%;
    border: 1px solid #ccc;
    height: 32px;
    box-sizing: border-box;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 0 12px;
  }
}

.select-box {
  margin-right: 8px;
}

.is-flex {
  display: flex;
}

.evaluate-bar {
  margin-top: 8px;
  margin-bottom: 6px;
  display: flex;
}

.star-rate-area {
  margin-left: 17px;
}

.label-close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 15px;
  height: 15px;
  background: #fe5942;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  border-radius: 50%;
  cursor: pointer;

  &::after {
    display: block;
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    background: url('~@/assets/remove-time.svg');
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.image-wrapper {
  .image-tip{
    display: flex;
    align-items: center;
    height: 30px;
    .add-button {
      width: 30px;
      height: 30px;
    }
    .image-length {
      font-size: 13px;
      color: #666;
      margin-left: 15px;
    }
    .biaozhu {
      margin-left: 10px;
      color: red;
      font-size: 11px;
    }
  }
  .upload-pic-box {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    margin-top: 15px;
    margin-bottom: 55px;
    .upload-name{
      margin-top 5px;
      margin-bottom 5px;
      width: 91px;
    }
    .upload-banner + .upload-banner {
      margin-left: 8px;
    }
    .image-delete{
      color: #2fabdd;
      font-size: 13px;
      text-align: center;
    }
  }
}

.upload-button {
  border: 1px dashed #f1f1f1;
  border-radius: 2px;
  background: #fbfbfb;
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 40px;
    height: 30px;
    background: getImage('cloud-upload.svg') no-repeat center center;
    top: 50%;
    margin-top: -15px;
    left: 50%;
    margin-left: -20px;
  }
}

.qualification-cacl {
  margin-left: 4px;
  color: #999;
}

.item-select {
  width: 100%;
  height: 64px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  background: #fff;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #353535;
  cursor: pointer;
  padding: 12px;

  .add-icon {
    background: #ffbb29;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.08);
    width: 24px;
    height: 24px;
    position: relative;
    margin-right: 11px;
    border-radius: 50%;

    &::after {
      display: block;
      content: '';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10px;
      height: 10px;
      background: url('~@/assets/plus-s.svg') no-repeat;
      background-size: cover;
      transform: translate(-50%, -50%);
    }
  }

  .item-pic {
    width: 40px;
    height: 40px;
    border-radius: 2px;
    margin-right: 12px;
    flex-shrink: 0;
    overflow: hidden;

    .item-logo {
      width: 100%;
      height: 100%;
    }
  }
}

.show-content {
  align-items: normal;
  padding: 5px !important;
  justify-content: normal;
}

.chooses {
  position: relative;
}

.pl {
  position: absolute;
}

.video-wrapper-box {
  width: 600px !important;
}

.video-add-btn {
  display: flex;
  align-items: center;

  .add-button {
    width: 30px;
    height: 30px;
  }

  .video-length {
    font-size: 13px;
    color: #666;
    margin-left: 15px;
  }
}

.video-wrapper {
  display: block;

  .biaozhu {
    margin-left: 10px;
    color: red;
    font-size: 11px;
  }

  .upload-pic-video {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    align-items: center;
    margin-top: 15px;
    justify-content: space-between;

    &:first-child {
      margin-top: 0;
    }
  }

  .upload-text-video {
    width: calc(100% - 150px);
    margin-bottom: 26px;
  }

  .video-delete {
    color: #2fabdd;
    font-size: 13px;
  }
}
.width-150{
  width: 150px !important;
}
.period-select
  display flex
  padding 0
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
