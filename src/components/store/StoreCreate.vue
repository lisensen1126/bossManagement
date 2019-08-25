<!--新建门店、编辑门店、门店详情页面-->
<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack", v-if="edit != 3")
    .content-wrapper
      h2(v-if="edit===1") 创建门店
      h2(v-if="edit===2") 修改门店
      h2(v-if="edit===3") 门店详情
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 门店名称
            custom-input(v-model="store.store_name", maxlength=30, placeholder="请输入门店名称", :validator="$v.store.store_name", error-info="门店名称必填并且小于三十位", :isDisabled="edit==3")
          .field.is-horizontal(v-if="edit==2 || edit==3")
            label.label 经销商编码
            .field-content(v-text="store.dealer_code?store.dealer_code:'暂无编码'")
          .field.is-horizontal(v-if="edit==2 || edit==3")
            label.label 门店编码
            .field-content(v-text="store.store_code?store.store_code:'暂无编码'")
          .field.is-horizontal
            label.label 企业名称
            .select-box
              custom-select(v-model="store.enterprise", :list="enterList", :validator="$v.store.enterprise_id", error-info="企业必选", nameField="enterprise_name", :input="changeEnter(store.enterprise)", v-if="edit==1", :show-search="true")
              custom-input(v-model="store.enterprise_name", isDisabled="true", v-else)
          .field.is-horizontal
            label.label 小程序类型
            .period-select(v-if="is_chain")
              .field-content(v-if="is_chain == 1") 一个小程序
              .field-content(v-if="is_chain == 2") 多小程序
            .period-select(v-else)
              .field-content --
          .field.is-horizontal
            label.label 门店类型
            .select-box
              custom-select(v-if="edit == 1", v-model="store_type", :list="type_list")
              custom-select(v-else, isDisabled="true", v-model="store_type", :list="type_list")
          .field.is-horizontal
            label.label 联系人
            custom-input(placeholder="请输入联系人名称，最多5个字符", maxlength=5, v-model="store.contacts", :isDisabled="edit==3", :validator="$v.store.contacts", error-info="请输入联系人，最多5个字符",)
          .field.is-horizontal
            label.label 联系电话
            custom-input(placeholder="联系电话(座机号/手机号)",need-type='specialTel', :maxlength="is_phone", v-model="store.business_phone", :validator="$v.store.business_phone", error-info="请填写正确的联系电话", :isDisabled="edit==3")
          .field.is-horizontal
            label.label
            span.example 例: xxx-xxxxxxxx （座机号格式）
          .field.is-horizontal
            label.label 营业开始时间
            .control.select-box-wrapper
              select-time(v-model="store.open_time_hour", :validator="$v.store.open_time_hour", error-info="请选择时间", @input="detectOpenTime", :error-info="openErrorInfo", :isDisabled="edit==3")
              select-time(v-model="store.open_time_minutes", :isHours="false", :validator="$v.store.open_time_minutes", @input="detectOpenTimeMinutes", :error-info="openErrorInfoMinutes", :isDisabled="edit==3")
          .field.is-horizontal
            label.label 营业结束时间
            .control.select-box-wrapper
              select-time(v-model="store.close_time_hour", :validator="$v.store.close_time_hour", @input="detectCloseTime", :error-info="closeErrorInfo", :isDisabled="edit==3")
              select-time(v-model="store.close_time_minutes", :isHours="false", :validator="$v.store.close_time_minutes", @input="detectCloseTimeMinutes", :error-info="closeErrorInfoMinutes", :isDisabled="edit==3")
        .field-group
          .field.is-horizontal
            label.label 门店地址
            .control.select-box-wrapper
              .select-box
                select(v-model="store.province_id", id="province", @change="getRegions('citylist', store.province_id, false)", :validator="$v.store.province_id", :disabled="edit==3")
                  option(value="") 请选择
                  option(v-for="list in provincelist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.city_id", id="city", @change="getRegions('districtlist', store.city_id, false)", :validator="$v.store.city_id", :disabled="edit==3")
                  option(value="") 请选择
                  option(v-for="list in citylist", :value="list.id") {{list.name}}
              .select-box
                select(v-model="store.district_id", id="district", :validator="$v.store.district_id", @change="getAddress", :disabled="edit==3")
                  option(value="") 请选择
                  option(v-for="list in districtlist", :value="list.id") {{list.name}}
          .field.is-horizontal
            label.label 详细地址
            custom-input(v-model="store.address", maxlength=50, placeholder="请输入详细地址", :validator="$v.store.address", error-info="请填写详细地址最多50个字符", @blur="getAddress", :isDisabled="edit==3")
          .field.is-horizontal
            label.label 预约电话
            custom-input(placeholder="预约电话", maxlength=11, need-type='number', v-model="store.reservation_phone", :validator="$v.store.reservation_phone", error-info="请填写正确的联系电话", :isDisabled="edit==3")
          .field.is-horizontal
            label.label 地图位置
            location-map(@change="getCoordinate", :address="fulladdress", :lng="+store.lng", :lat="+store.lat" ref="locmap")
        .field-group
          .field.is-horizontal.full-width
            label.label 可预约时段
            set-time-period(:reservationPeriod="store.reservation_period", :weekdayPeriodType="store.workday_reservation_period_type", :weekendPeriodType="store.weekend_reservation_period_type", :endTime="endTime", :startTime="startTime", :isNeedCaculate="isNeedCaculate", @change="getSelectedPeriod")
          .field.is-horizontal.full-width
            label.label 开放预约天数
            .control
              .toggle-group
                .toggle-btns.custom-size(v-for="n in 14")
                  input(type="radio", :id="'reservation_' + n", :value="n", v-model="store.reservation_days", :disabled="edit==3")
                  label(:for="'reservation_' + n") {{n}}天
        .field-group
          .field.is-horizontal
            label.label 门店认证
            custom-select(v-model="nowRen", :list="renList",  nameField="title", error-info="门店认证必选", @input="changeRen", :isDisabled="edit==3")
            <!--.control.select-box-wrapper-->
              <!--.select-box(v-if="nowRen.length === 0", @click="getRen")-->
                <!--.item-select-->
                  <!--.add-icon-->
                  <!--| 选择认证-->
              <!--.select-box(v-if="nowRen.length !== 0", @click="getRen")-->
                <!--span(v-for="(item, index) in nowRen")-->
                  <!--span(v-if="index + 1 !== nowRen.length") {{item.title + "、"}}-->
                  <!--span(v-if="index + 1 === nowRen.length") {{item.title}}-->
        .field-group
          .field.is-horizontal
            label.label 门店服务
            .control.select-box-wrapper
              .select-box.chooses(@mouseover="over()", @mouseout="enter()", @mouseleave="leave()")
                .item-select.pl(@click="getFuwu", v-if="isVisible || nowFuwu.length === 0")
                  .add-icon
                  | 选择服务
                .item-select.show-content
                  span(v-for="(item, index) in nowFuwu")
                    span(v-if="index + 1 !== nowFuwu.length") {{item.title + "、"}}
                    span(v-if="index + 1 === nowFuwu.length") {{item.title}}
        .field-group.video-wrapper-box
          .field.is-horizontal.video-wrapper-box
            label.label 门店视频
            .control.video-wrapper
              .video-add-btn
                span.add-button(@click="addVideo()")
                span.video-length {{store.videos.length}} / 10
                span.biaozhu 注：只支持后缀为.mp4视频地址
              .upload-pic-video(v-if='store.videos && store.videos.length>0',v-for='(item,index) in store.videos')
                upload-pic.upload-pic-style(v-model="item.picture", img-type="item.pic",:img-id="index", is-original=true)
                .upload-text-video
                  label.label 视频地址
                  custom-input(v-model="item.url",placeholder="请输入视频地址")
                .video-delete(@click='deleteVideo(index)') 删除
        .field-group
          .field.is-horizontal
            label.label 门店环境
            .control.image-wrapper
              .image-tip
                span.add-button(@click="addImage('environment')")
                span.image-length {{store.environment.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic(v-for="(item, index) in store.environment")
                  upload-img-model(v-model="store.environment[index].image_url", img-type="store", :has-second-action="true", @other="deleteImage('environment', index)")
                  .upload-name
                    custom-input(v-model="store.environment[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('environment', index)") 删除
          .field.is-horizontal
            label.label 门店资质
            .control.image-wrapper
              .image-tip
                span.add-button(@click="addImage('aptitude')")
                span.image-length {{store.aptitude.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic(v-for="(item, index) in store.aptitude")
                  upload-img-model(v-model="store.aptitude[index].image_url", img-type="store", :has-second-action="true", @other="deleteImage('aptitude', index)")
                  .upload-name
                    custom-input(v-model="store.aptitude[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('aptitude', index)") 删除
          .field.is-horizontal
            label.label 门店设备
            .control.image-wrapper
              .image-tip
                span.add-button(@click="addImage('device')")
                span.image-length {{store.device.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic(v-for="(item, index) in store.device")
                  upload-img-model(v-model="store.device[index].image_url", img-type="store", :has-second-action="true", @other="deleteImage('device', index)")
                  .upload-name
                    custom-input(v-model="store.device[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('device', index)") 删除
          .field.is-horizontal
            label.label 门店项目
            .control.image-wrapper
              .image-tip
                span.add-button(@click="addImage('item')")
                span.image-length {{store.item.length}} / 10
                span.biaozhu 注：只能上传jpg/jpeg/png后缀格式图片，且不超过5M
              .upload-pic-box
                .upload-pic(v-for="(item, index) in store.item")
                  upload-img-model(v-model="store.item[index].image_url", img-type="store", :has-second-action="true", @other="deleteImage('item', index)")
                  .upload-name
                    custom-input(v-model="store.item[index].image_name",placeholder="请输入名称",maxlength=10)
                  .image-delete(@click="deleteImage('item', index)") 删除
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData", v-if="edit === 1") 创建门店
          a.button.primary.large.isDisabled(@click="inspectData", v-if="edit === 2") 修改门店
          a.button.large(@click="goBack") 返回
    choose-fuwu(v-model="itemfuwu" ,v-if="itemfuwu", @resolve="addFuwu", :nowFuwu="nowFuwu", :allFuwu="fuwuList")
    choose-ren(v-model="itemren" ,v-if="itemren", @resolve="addRen", :nowRen="nowRen", :allRen="renList")
</template>

<script>
import enterpriseApi from '@/mixins/modules/enterprise'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import StarRating from '@/components/generics/StarRating'
import CustomSelect from '@/components/generics/form/CustomSelect'
import SelectTime from '@/components/generics/SelectTime'
import LocationMap from '@/components/generics/LocationMap'
import SetTimePeriod from '@/components/generics/SetTimePeriod'
import StoreQualificationsModel from '@/components/store/modal/StoreQualificationsModel'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import ChooseFuwu from '@/components/store/modal/ChooseFuwu'
import ChooseRen from '@/components/store/modal/ChooseRen'
import UploadPic from '@/components/generics/form/UploadPic'

/**
 * @vue
 */
export default {
  name: 'StoreCreate',
  mixins: [validationMixin, enterpriseApi, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    SelectTime,
    StarRating,
    // CustomPeriodModal,
    LocationMap,
    SetTimePeriod,
    StoreQualificationsModel,
    uploadImgModel,
    ChooseFuwu,
    ChooseRen,
    UploadPic,
  },
  data () {
    return {
      is_phone: 11, // 是否为手机号
      is_chain: 0, // 小程序类型的初始化
      isDisabled: false, // 是否选中
      chain_type: 1, //  企业类型
      temp: {},
      itemfuwu: false, // 选择服务组件
      nowFuwu: [], // 此次所选服务
      fuwuList: [], // 服务列表
      itemren: false, // 选择认证组件
      nowRen: [], // 此次所选认证
      renList: [], // 服务认证
      flag: false,
      storeId: '',
      isLoading: false,
      provincelist: [],
      districtlist: [],
      citylist: [],
      closeErrorInfo: '请选择时间',
      openErrorInfo: '请选择时间',
      openErrorInfoMinutes: '请选择时间',
      closeErrorInfoMinutes: '请选择时间',
      fulladdress: '',     // 地理位置定位变量
      isNeedCaculate: false,
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
        videos: [],  // 视频列表
        propaganda: [], // 店招图
        environment: [], // 环境
        aptitude: [], // 资质
        device: [], // 设备
        item: [], // 项目
        business_phone: '', // 联系电话
        open_time_hour: '', // 开始营业时间
        open_time_minutes: '', // 开始营业时间
        close_time_hour: '', // 结束营业时间
        close_time_minutes: '', // 结束营业时间
        reservation_phone: '', // 预约电话
        address: '', // 地址
        lng: '',
        lat: '',
        province_id: '', // 省
        city_id: '', // 市
        district_id: '', // 区
        average_rating_type: 1, // 评价类型
        custom_average_rating: '0', // 评分
        reservation_days: undefined, // 开放预约天数
        reservation_period: {}, // 可预约时段
        workday_reservation_period_type: '1',
        weekend_reservation_period_type: '1',
        aptitudes: [],
        enterprise_id: '',
        contacts: '',
        enterprise: {}, // 企业信息
        service: [],
        authentication: [],
        mini_type: 1,
        store_type: 1,
        is_chain: 1,
      },
      maxAptitudes: 4,
      isUploading: false,
      enterList: [],
      isVisible: false,
      // 门店类型列表
      type_list: [
        {
          id: 1,
          name: '智慧门店',
        },
        {
          id: 2,
          name: '超凡门店',
        },
      ],
      // 门店类型
      store_type: {
        id: 1,
        name: '智慧门店',
      },
    }
  },
  watch: {
    // 监听用户输入手机号 判断是为手机还是座机
    'store.business_phone': function (val) {
      if (val.indexOf('-') !== -1) {
        this.is_phone = 13
      } else {
        this.is_phone = 11
      }
    },
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
      this.nowFuwu.forEach(item => {
        arr.push(item.setting_id)
      })
      var brr = [this.nowRen.setting_id]
      // temp.images = JSON.stringify(temp.images)
      return {
        ...temp,
        open_time: this.store.open_time_hour + ':' + this.store.open_time_minutes,
        close_time: this.store.close_time_hour + ':' + this.store.close_time_minutes,
        average_rating_type: this.store.average_rating_type,
        average_rating: this.store.average_rating_type === 1 ? undefined : this.store.custom_average_rating,
        enterprise_id: this.store.enterprise.enterprise_id,
        authentication: brr,
        service: arr,
        mini_type: this.store_version.mini_type,
        store_name: this.store.store_name.trim(),
        contacts: this.store.contacts.trim(),
        address: this.store.address.trim(),
        store_type: this.store_type.id,
      }
    },
    // 结束时间
    endTime () {
      return {
        hour: this.store.close_time_hour,
        minutes: this.store.close_time_minutes,
      }
    },
    // 开始时间
    startTime () {
      return {
        hour: this.store.open_time_hour,
        minutes: this.store.open_time_minutes,
      }
    },
  },
  methods: {
    // 鼠标进入
    enter () {
      window.clearTimeout(this.hideTimeout)
      this.hideTimeout = setTimeout(() => {
        this.isVisible = false
      }, 200)
    },
    // 鼠标离开
    leave () {
      this.isVisible = false
    },
    over () {
      window.clearTimeout(this.hideTimeout)
      this.isVisible = true
    },
    /**
     * index 对应的视频的下标
     */
    deleteVideo (index) {
      this.store.videos.splice(index, 1)
    },
    // 添加视频
    addVideo () {
      if (this.store.videos.length >= 10) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '视频最多添加十个',
        })
        return
      }
      this.store.videos.unshift({
        picture: '',     // 封面图片地址
        url: '',         // 视频地址
      })
    },
    /*
    * 所选服务
    * arr 所选服务
    * */
    addFuwu (arr) {
      this.nowFuwu = arr
    },
    // 控制服务组件
    getFuwu () {
      this.itemfuwu = true
    },
    detectOpenTime (val) {
      this.$v.store.open_time_hour.$touch()
    },

    detectOpenTimeMinutes (val) {
      this.$v.store.open_time_minutes.$touch()
    },

    detectCloseTime (val) {
      this.$v.store.close_time_hour.$touch()
    },

    detectCloseTimeMinutes (val) {
      this.$v.store.close_time_minutes.$touch()
    },
    // 获取地址并地图定位
    getAddress () {
      if (!this.store.district_id || !this.store.province_id || !this.store.city_id) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '门店地址必选',
        })
        return
      }
      if (!this.store.address) {
        return
      }
      const province = this.provincelist[document.getElementById('province').selectedIndex - 1].name
      const city = this.citylist[document.getElementById('city').selectedIndex - 1].name
      const district = this.districtlist[document.getElementById('district').selectedIndex - 1].name
      this.fulladdress = province + city + district + this.store.address
      this.$refs.locmap.getLocation({address: this.fulladdress})
    },
    // 获取经纬度
    getCoordinate (params) {
      console.log('params', params)
      this.store.lng = params.lng
      this.store.lat = params.lat
    },

    getSelectedPeriod ({ flag, reservationPeriod, weekendPeriodType, workdayPeriodType }) {
      this.flag = flag
      if (flag) {
        this.store.reservation_period = { ...reservationPeriod }
        this.store.weekend_reservation_period_type = weekendPeriodType
        this.store.workday_reservation_period_type = workdayPeriodType
      }
    },
    // 返回到门店列表
    goBack () {
      this.$router.replace({
        name: 'storeList',
      })
    },

    // 监听企业选择   不知道有什么用  暂时保留
    changeEnter (item) {
      if (item.enterprise_id) {
        this.store.enterprise_id = item.enterprise_id
      }
      this.is_chain = item.is_chain
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
      if (this.$v.store.address.$error || this.$v.store.store_name.$error || this.$v.store.business_phone.$error || this.$v.store.close_time_hour.$error || this.$v.store.close_time_minutes.$error || this.$v.store.open_time_hour.$error || this.$v.store.open_time_minutes.$error || this.$v.store.contacts.$error || this.$v.store.enterprise_id.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return
      } else if (this.$v.store.district_id.$error || this.$v.store.city_id.$error || this.$v.store.province_id.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '门店地址必选',
        })
        return
      } else if (this.$v.store.reservation_days.$error) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请设置开放预约天数',
        })
        return
      }
      if (this.$v.$error) {
        this.isNeedCaculate = false
        return false
      }
      if (this.nowFuwu.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择服务选项',
        })
        return
      }
      let isVideo = false
      this.store.videos.forEach(item => {
        if (!item.url || !item.picture) {
          isVideo = true
        }
      })
      if (isVideo) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店视频的封面和视频地址必填',
        })
        return
      }
      // 校验门店环境图片
      let isEnvironment = false
      this.store.environment.forEach(item => {
        if (!item.image_url) {
          isEnvironment = true
        }
      })
      if (isEnvironment) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店环境的图片地址必填',
        })
        return
      }
      // 校验门店资质图片
      let isAptitude = false
      this.store.aptitude.forEach(item => {
        if (!item.image_url) {
          isAptitude = true
        }
      })
      if (isAptitude) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店资质的图片地址必填',
        })
        return
      }
      // 校验门店设备图片
      let isDevice = false
      this.store.device.forEach(item => {
        if (!item.image_url) {
          isDevice = true
        }
      })
      if (isDevice) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店设备的图片地址必填',
        })
        return
      }
      // 校验门店项目图片
      let isItem = false
      this.store.item.forEach(item => {
        if (!item.image_url) {
          isItem = true
        }
      })
      if (isItem) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '门店项目的图片地址必填',
        })
        return
      }
      this.isNeedCaculate = true
      setTimeout(() => {
        if (!this.flag) {
          this.isNeedCaculate = false
        } else {
          if (Object.keys(this.store.reservation_period).length) {
            setTimeout(() => {
              if (this.storeId) {
                // 修改
                this.editStore()
              } else {
                // 创建
                this.commitStore()
              }
            }, 0)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '请添加可预约时段',
            })
            this.isNeedCaculate = false
          }
        }
      }, 0)
    },

    // 提交修改Fn
    async editStore () {
      this.store.enterprise_id = this.store.enterprise.enterprise_id
      try {
        if (this.isUploading) {
          return
        }
        this.isUploading = true
        const { response, result } = await this.updateStore(this.storeId, this.getParams)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '门店修改成功',
              resolve: () => {
                this.$router.replace({
                  name: 'storeList',
                  query: {
                    save: 1,
                  },
                })
              },
            })
          } else {
            this.isUploading = false
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } else {
          this.isUploading = false
          this.isNeedCaculate = false
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '网络出错',
            content: '网络出小差了，请稍后再试',
          })
        }
      } catch (err) {
        this.isNeedCaculate = false
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改门店失败',
          content: `错误：${err}`,
        })
        this.isUploading = false
      }
    },

    // 提交创建Fn
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
              content: '门店创建成功',
              resolve: () => {
                this.$router.replace({
                  name: 'storeList',
                })
              },
            })
          } else {
            this.isUploading = false
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } else {
          this.isUploading = false
          this.isNeedCaculate = false
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建门店失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.isNeedCaculate = false
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '创建门店失败',
          content: `错误：${err}`,
        })
        this.isUploading = false
      }
    },

    // 删除图片
    deleteImage (type, index) {
      this.store[type].splice(index, 1)
    },
    // 添加图片
    addImage (type) {
      if (this.store[type].length >= 10) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '图片最多添加十个',
        })
        return
      }
      this.store[type].push({
        image_name: '',     // 图片名称
        image_url: '',      // 图片地址
      })
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

    // 获取门店详情
    async getStoreDetail () {
      let self = this
      try {
        const { response, result } = await this.storeDetail({ store_id: this.storeId })
        if (response.status === 200 && result.code === 0) {
          this.is_chain = result.data.is_chain
          this.getFuwuList(result.data.service)
          this.getRenList(result.data.authentication)
          let imgArray = []
          if (result.data.images.length > 0) {
            for (let i = 0; i < result.data.images.length; i++) {
              imgArray.push(result.data.images[i].image_url)
            }
            result.data.images = imgArray
          }
          if (result.data.mini_type === 1) {
            this.store_version.name = '综合版(B版)'
            this.store_version.mini_type = 1
          } else {
            this.store_version.name = '保养版(C版)'
            this.store_version.mini_type = 2
          }
          result.data.workday_reservation_period_type = result.data.workday_reservation_period_type.toString()
          result.data.weekend_reservation_period_type = result.data.weekend_reservation_period_type.toString()
          this.store.aptitudes.splice(this.store.aptitudes.length, 0, ...result.data.aptitudes)
          this.store = {
            ...this.store,
            ...result.data,
            open_time_hour: result.data.open_time && result.data.open_time.split(':')[0],
            open_time_minutes: result.data.open_time && result.data.open_time.split(':')[1],
            close_time_hour: result.data.close_time && result.data.close_time.split(':')[0],
            close_time_minutes: result.data.close_time && result.data.close_time.split(':')[1],
            aptitudes: this.store.aptitudes,
            enterprise_id: result.data.enterprise.enterprise_id,
            enterprise_name: result.data.enterprise.name, // 解决企业名称偶尔不渲染的问题
          }
          this.fulladdress = result.data.province_name + result.data.city_name + result.data.district_name + result.data.address
          this.$refs.locmap.lngLatLocation({lng: result.data.lng, lat: result.data.lat})
          await this.getRegions('citylist', result.data.province_id)
          await this.getRegions('districtlist', result.data.city_id)
          self.enterList.forEach(function (classItem) {
            if (classItem.enterprise_id === self.store.enterprise.enterprise_id) {
              self.store.enterprise = classItem
            }
          })
          // 门店类型数据格式化
          this.store.store_type === 1 ? this.store_type = {id: 1, name: '智慧门店'} : this.store_type = {id: 2, name: '超凡门店'}
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

    // 页面部分验证Fn
    compareTime (compareTarget, curTarget, cate, errorInfo) {
      if (!this.store[curTarget]) {
        this[errorInfo] = '请选择时间'
        return false
      } else {
        if (!this.store[compareTarget]) {
          return true
        } else {
          if (cate === 'startHour' || cate === 'startMinutes') {
            if ((cate === 'startHour' && parseInt(this.store[curTarget]) > parseInt(this.store[compareTarget])) || (cate === 'startMinutes' && this.store.open_time_hour === this.store.close_time_hour && parseInt(this.store[curTarget]) >= parseInt(this.store[compareTarget]))) {
              this[errorInfo] = '开始时间必须小于结束时间'
              return false
            }
          } else {
            if ((cate === 'endHour' && parseInt(this.store[curTarget]) < parseInt(this.store[compareTarget])) || (cate === 'endMinutes') && this.store.open_time_hour === this.store.close_time_hour && parseInt(this.store[curTarget]) <= parseInt(this.store[compareTarget])) {
              this[errorInfo] = '结束时间必须大于开始时间'
              return false
            }
          }
          return true
        }
      }
    },
    /*
    *  服务列表
    * */
    async getFuwuList (service) {
      try {
        const { response, result } = await this.getFWList({
          setting_type: 2,
        })
        if (response.status === 200) {
          this.fuwuList = result.data
          if (this.storeId) {
            service.forEach(item => {
              this.fuwuList.forEach(cell => {
                if (Number(cell.setting_id) === Number(item)) {
                  this.nowFuwu.push(cell)
                }
              })
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务列表失败',
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
          let no_authent = {
            icon_img: '',
            setting_id: 0,
            setting_type: 0,
            title: '无认证',
          }
          result.data.unshift(no_authent)
          this.renList = result.data
          this.nowRen = no_authent
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
  },
  mounted () {
    this.edit = Number(this.$route.query.edit)
    this.getRegions('provincelist', 0) // 获取省市区列表
    if (this.edit === 1) {
      this.getEnter() // 获取企业列表
    }
    if (this.$route.params.storeId) {
      this.storeId = this.$route.params.storeId
      this.getStoreDetail() // 获取门店详情
    } else {
      this.getRenList() // 获取认证列表
      this.getFuwuList() // 获取服务列表
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
      reservation_phone: {
        required,
        validate (val) {
          return /^1\d{10}$/.test(val)
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
      open_time_hour: {
        validate () {
          return this.compareTime('close_time_hour', 'open_time_hour', 'startHour', 'openErrorInfo')
        },
      },
      open_time_minutes: {
        validate () {
          return this.compareTime('close_time_minutes', 'open_time_minutes', 'startMinutes', 'openErrorInfoMinutes')
        },
      },
      close_time_hour: {
        validate () {
          return this.compareTime('open_time_hour', 'close_time_hour', 'endHour', 'closeErrorInfo')
        },
      },
      close_time_minutes: {
        validate () {
          return this.compareTime('open_time_minutes', 'close_time_minutes', 'endMinutes', 'closeErrorInfoMinutes')
        },
      },
      reservation_days: {
        required,
      },

      enterprise_id: {
        required,
      },

      aptitudes: {
        $each: {
          title: {
            required,
          },
          image_url: {
            required,
          },
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.section-layout {
  height calc(100% - 56px)
}
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
</style>
