<template lang="pug">
  .section-layout
    .content-wrapper
      h2 新建活动
      .form-wrapper.cc
        .field-group
          .field.is-horizontal
            label.label 活动名称
            custom-input( maxlength=10, placeholder="请输入活动名称", v-model="createEvent.name", error-info="请输入活动名称", :validator="$v.createEvent.name")
        .field-group
          .field.is-horizontal
            label.label 活动开始时间
            .control
              date-picker(type="singleWithTime", v-model="createEvent.start_time", error-info="请选择活动开始时间", :validator="$v.createEvent.start_time", :options="endTimeOptions")
        .field-group
          .field.is-horizontal
            label.label 活动结束时间
            .control
              date-picker(type="singleWithTime", v-model="createEvent.end_time", :options="endTimeOptions")
        .filed-group.pad
          .field.is-horizontal
            label.label 抽奖机会
            .simple-td.checkbox-td
              .checkbox.page-selector.left
                input(type="checkbox", id="page-selection", :checked="true", v-model="createEvent.lottery_nums", disabled)
                label 赠送一次
              .checkbox.page-selector(@click="shareOne")
                input(type="checkbox", id="share", :checked="true", v-model="createEvent.share_nums")
                label 分享送一次
        .filed-group
          .field.is-horizontal
            label.label 活动简述
            textarea.textarea(placeholder="请输入活动简述", v-model="createEvent.description")
        <!--.filed-group.pad-->
        <!--.field.is-horizontal.tab-->
        <!--label.label 奖品信息-->
        <!--.table-wrapper-->
        <!--table.table-->
        <!--thead-->
        <!--tr-->
        <!--td(width="30%") 名称-->
        <!--td.p-l-20(width="10%") 库存-->
        <!--td(width="25%") 活动用量-->
        <!--td(width="10%")-->
        <!--td(width="25%") 中奖率-->
        <!--tbody-->
        <!--tr(v-for="(item, index) in prizeList")-->
        <!--td-->
        <!--.simple-td(v-text="item.name")-->
        <!--td-->
        <!--.simple-td(v-text="item.nums")-->
        <!--td-->
        <!--custom-input(type="number")-->
        <!--td-->
        <!--td-->
        <!--custom-input(type="number")-->
        <!--.tip (中奖率为每百次抽奖中奖率。如填写1，中奖率即为1%)-->
      h2 商户信息
      .form-wrapper
        .filed-group.pad
          .field.is-horizontal
            label.label 省
            .control.select-box-wrapper
              .select-box
                custom-select(v-model="province", :list="provinceList", @input="changePrive")
        .filed-group.pad
          .field.is-horizontal
            label.label 市
            .control.select-box-wrapper
              .select-boxs(v-if="!all")
                .item-select(v-if="nowCityList.length === 0", @click="getCity")
                  .add-icon
                  | 选择城市
              .select-boxs(v-else)
                textarea.textarea(disabled)
              .select-boxs(v-if="nowCityList.length !== 0", @click="getCity")
                span(v-for="(item, index) in nowCityList")
                  span(v-if="index + 1 !== nowCityList.length") {{item.name + "、"}}
                  span(v-if="index + 1 === nowCityList.length") {{item.name}}
        .filed-group.pad
          .field.is-horizontal
            label.label 门店
            .control.select-box-wrapper
              .select-boxs(v-if="nowStoreList.length === 0", @click="getStore")
                .item-select(@click="getStore")
                  .add-icon
                  | 选择门店
              .select-boxs(v-if="nowStoreList.length !== 0", @click="getStore")
                span(v-for="(item, index) in nowStoreList")
                  span(v-if="index + 1 !== nowStoreList.length") {{item.store_name + "、"}}
                  span(v-if="index + 1 === nowStoreList.length") {{item.store_name}}
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="addEvent") 创建活动
          a.button.large(@click="goBack") 返回
    choose-city(v-model="itemCity" ,v-if="itemCity", @resolve="addCity", :provinceId="provinceId", :nowCityList="nowCityList")
    //- isChain=2  显示非连锁店
    choose-store(v-model="itemStore" ,v-if="itemStore", :isChain="'2'" @resolve="addStore", :cityIds="cityIds", :nowStoreList="nowStoreList")
</template>
<script>
  import drawApi from '@/mixins/modules/draw'
  import DatePicker from '@/components/generics/form/DatePicker'
  import upLoadApi from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import StarRating from '@/components/generics/StarRating'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import SelectTime from '@/components/generics/SelectTime'
  import LocationMap from '@/components/generics/LocationMap'
  import SetTimePeriod from '@/components/generics/SetTimePeriod'
  import StoreQualificationsModel from '@/components/store/modal/StoreQualificationsModel'
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import Utils from '@/mixins/utilities/utils'
  import ChooseCity from '@/components/generics/ChooseCity'
  import ChooseStore from '@/components/generics/ChooseStore'
  /**
   * @vue
   */
  export default {
    name: 'drawAdd',
    mixins: [validationMixin, drawApi, upLoadApi, Utils],
    components: {
      CustomInput,
      CustomSelect,
      SelectTime,
      StarRating,
      DatePicker,
      ChooseCity,
      ChooseStore,
      LocationMap,
      SetTimePeriod,
      StoreQualificationsModel,
      uploadImgModel,
    },
    data () {
      return {
        list: [{
          id: 1,
          name: '江苏1',
        }],
        createEvent: {
          name: '', //  活动名称
          start_time: '', // 开始时间
          end_time: '', // 结束时间
          lottery_nums: true, // 每日一次
          share_nums: true, // 分享送一次
          description: '', //  活动描述
          store_id: '', //  门店的id
        },
        // 选择时分默认
        endTimeOptions: {
          defaultHour: 23,
          defaultMinute: 59,
          minuteIncrement: 1,
        },
        nowCityList: [], // 当前选择的城市
        itemCity: false, // 是否展示城市组件
        itemStore: false, // 是否展示门店组件
        nowStoreList: [], // 当前选择的门店
        provinceId: null,
        cityIds: [], // 选择城市
        isUp: true,
        province: null, //  所有省
        all: false, // 判断是否选择所有省
        provinceList: [{
          id: -1,
          name: '全部',
        }],
        items: [],
      }
    },
    computed: {
    },
    methods: {
      /*
      * 接收组件选择的城市
      * @ q 组件所选择的城市
      * */
      addCity (q) {
        console.log(q, '市')
        this.nowCityList = q
        var arr = []
        q.forEach(item => {
          arr.push(item.id)
        })
        this.cityIds = arr
      },
      /*
      * 接收组件选择的门店
      * @ item 组件所选择的门店
      * */
      addStore (item) {
        var citys = this.cityIds
        var brr = []
        var arr = this.nowStoreList
        if (this.cityIds[0] === 'All') {
          arr = []
        } else {
          if (this.nowStoreList.length > 0) {
            arr.forEach((item, index) => {
              citys.forEach(cell => {
                if (item.city_id === cell) {
                  brr.push(index)
                }
              })
            })
          }
        }
        for (var i in brr) {
          arr[brr[i]].isClick = true
        }
        var res = []
        for (var j in arr) {
          if (!arr[j].isClick) {
            res.push(arr[j])
          }
        }
        var last = res.concat(item)
        this.nowStoreList = last
      },
      // 点击选择门店
      getStore () {
        // console.log(this.province)
        if (this.province === null) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            content: '请先选择省市',
          })
          return
        }
        if (this.province.id === -1) {
          this.cityIds = ['All']
          this.itemStore = true
          return
        }
        if (this.nowCityList.length === 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            content: '请先选择省市',
          })
          return
        }
        this.itemStore = true
      },
      // 点击每日3次
      changeThree () {
        this.createEvent.lottery_nums = !this.createEvent.lottery_nums
      },
      // 点击分享
      shareOne () {
        this.createEvent.share_nums = !this.createEvent.share_nums
      },
      // 选择省
      changePrive (q) {
        this.nowCityList = []
        this.province = q
        if (this.province.id === -1) {
          this.all = true
        } else {
          this.all = false
          this.provinceId = this.province.id
        }
        console.log(q, 'q')
      },
      // 选择城市
      getCity () {
        this.itemCity = true
      },
      goBack () {
        this.$router.push({
          name: 'drawList',
        })
      },
      // 添加活动提示
      addEvent () {
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: `确认提交‘${this.createEvent.name}’该活动？`,
          isRejectable: 1,
          resolve: () => {
            this.getV()
          },
        })
      },
      // 添加活动判断
      getV () {
        var time = this.createEvent.start_time
        var time2 = this.createEvent.end_time
        time = '' + (new Date(time.replace(/-/g, '/'))).getTime() / 1000
        if (time2 !== '') {
          time2 = '' + (new Date(time2.replace(/-/g, '/'))).getTime() / 1000
          if (time > time2) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加活动失败',
              content: '活动的结束时间有误',
            })
            return
          }
        } else {
          time2 = 0
        }
        if (this.nowStoreList.length === 0) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加活动失败',
            content: '活动的参与门店必选',
          })
          return
        }
        this.addEventApi(time, time2)
      },
      // 提交创建活动
      /*
      *  @time 开始时间
      *  @time2 结束时间
      * */
      async addEventApi (time, time2) {
        if (!this.isUp) {
          return
        }
        var cc = ''
        this.nowStoreList.forEach((item, index) => {
          if (index !== this.nowStoreList.length - 1) {
            cc += (item.store_id + ',')
          } else {
            cc += item.store_id
          }
        })
        console.log()
        try {
          this.isUploading = true
          const {response, result} = await this.createEvents({
            name: this.createEvent.name,
            start_time: Number(time),
            end_time: Number(time2),
            description: this.createEvent.description,
            store_id: cc,
            lottery_nums: this.createEvent.lottery_nums ? 1 : 0,
            share_nums: this.createEvent.share_nums ? 1 : 0,
          })
          if (response.status === 200) {
            if (result.code === 0 && result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '创建活动成功',
                resolve: () => {
                  this.$router.push({
                    name: 'drawList',
                  })
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '创建活动失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.isNeedCaculate = false
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建活动失败',
              content: `${response.status} ${result.message}`,
            })
            this.isUploading = false
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
        this.isUp = true
      },
      // 获取省份
      async getSheng () {
        // fetchRegions
        try {
          const {response, result} = await this.fetchRegions()
          if (response.status) {
            var arr = this.provinceList
            result.data.forEach(item => {
              arr.push(item)
            })
            this.provinceList = arr
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取省列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取省列表失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    mounted () {
      // 获取所有省
      this.getSheng()
    },
    // 正则
    validations: {
      createEvent: {
        name: {
          required,
        },
        start_time: {
          required,
        },
      },
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'

  .item-select
    width 100%
    height 64px
    box-sizing border-box
    border 1px solid #e5e5e5
    background #fff
    border-radius 2px
    display flex
    align-items center
    justify-content center
    font-size 13px
    color #353535
    cursor pointer
    padding 12px
    .add-icon
      background #ffbb29
      box-shadow 0 2px 5px 0 rgba(0, 0, 0, .08)
      width 24px
      height 24px
      position relative
      margin-right 11px
      border-radius 50%
      &::after
        display block
        content ""
        position absolute
        left 50%
        top 50%
        width 10px
        height 10px
        background url('~@/assets/plus-s.svg') no-repeat
        background-size cover
        transform translate(-50%, -50%)
    .item-pic
      width 40px
      height 40px
      border-radius 2px
      margin-right 12px
      flex-shrink 0
      overflow hidden
      .item-logo
        width 100%
        height 100%
  .field-group
    border none !important
  .left
    margin-right 50px
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
  .simple-td
  &.checkbox-td
    display flex
    height 36px
    align-items center
  .page-selector
    label
      z-index 5
  .pad
    padding: 24px 0 !important
  .tab
    position: relative;
  .table thead tr
    line-height 16px
    background white !important
  .table thead tr td
    line-height 16px
  .tip
    position absolute
    top 9px
    right -300px
    color: red
    font-size 12px
  .cc
    border-bottom none !important
</style>
