<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title {{enterpriseName}}
      .field-group.is-horizontal
        .field
          label.label 门店
          custom-select(:list="storeList", name-field="store_name", v-model="equipment.store", :validator="$v.equipment.store.store_id", error-info="请选择门店", @input="changeStore")
        .field
          label.label 车流设备SN
          custom-input(placeholder="请输入车流设备SN", v-model="equipment.traffic_device_sn", :validator="$v.equipment.traffic_device_sn", error-info="请填写正确的车流设备SN")
        .field
          label.label 视频设备SN
          custom-input(type="text", v-model="equipment.video_device_sn", placeholder="请输入视频设备SN", :validator="$v.equipment.video_device_sn", error-info="请填写正确的视频设备SN")
        .field
          label.label 视频设备通道号
          custom-input(input-type="hasUnit", v-model="equipment.video_channel_id", placeholder="请输入视频设备通道号", :validator="$v.equipment.video_channel_id", error-info="请填写正确的视频设备通道号,0~10")
            span(slot="unitName") 号
    .field
      button.button.large.primary(@click="ensure") 确定
</template>

<script>
  import DatePicker from '@/components/generics/form/DatePicker'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import EnterApi from '@/mixins/modules/enterprise'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import imageScale from '@/mixins/utilities/imageScale'
  export default {
    name: 'AddsEmployeeModal',
    mixins: [EnterApi, validationMixin, imageScale],
    components: {
      CustomInput,
      CustomSelect,
      StaffPicker,
      DatePicker,
    },
    validations: {
      equipment: {
        video_device_sn: {
          required,
        },
        traffic_device_sn: {
          required,
        },
        store: {
          store_id: {
            required,
          },
        },
        video_channel_id: {
          required,
          validate (val) {
            if (val.length === 2 && val.split('')[0] === '0') {
              return false
            }
            if (val < 0) {
              return false
            }
            if (val > 10) {
              return false
            }
            return /^.{1,2}$/.test(val)
          },
        },
      },
    },
    props: {
      id: Number,
      enterpriseName: String,
      customer: Object,
      enterpriseId: [String, Number],
    },
    data () {
      return {
        storeList: [],
        equipment: {
          store: {},
          traffic_device_sn: '',
          video_device_sn: '',
          video_channel_id: '',
        },
        list: [],
        isadd: false,
        type: [],
        srore: {},
      }
    },
    watch: {
      id: {
        handler (id) {
        },
        immediate: true,
      },
    },
    methods: {
      // 监听设备所属门店
      changeStore (q) {
        let store = this.equipment
        store.store = q
        this.equipment = {}
        this.equipment = store
      },
      // 展示编辑设备的门店
      showStore () {
        for (var i in this.storeList) {
          if (Number(this.storeList[i].store_id) === Number(this.storeDetail.store_id)) {
            this.equipment.store = this.storeList[i]
          }
        }
      },
      // 获取门店列表
      async getStore () {
        try {
          const {response, result} = await this.fetchStoreList({
            enterprise_id: this.enterpriseId,
          })
          if (response.status === 200 && result.code === 0) {
            this.storeList = result.data
            if (this.customer !== undefined) {
              this.equipment.traffic_device_sn = this.storeDetail.traffic_device_sn
              this.equipment.video_device_sn = this.storeDetail.video_device_sn
              this.equipment.video_channel_id = this.storeDetail.video_channel_id
              this.showStore(this.storeDetail.store_id)
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `错误：${err}`,
          })
        }
      },
      // 编辑 和 添加 成功弹框提示
      successToast: function (cao) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'success',
          title: '成功',
          content: '设配' + cao + '成功',
          resolve: () => {
            this.$emit('success')
          },
        })
      },
      // 确认按钮
      ensure () {
        this.$v.$touch()
        if (this.$v.$error) {
          return
        }
        if (this.customer === undefined) {
          this.addApi()
        } else {
          this.editApi()
        }
      },
      // 添加设备
      async addApi () {
        try {
          const {response, result} = await this.addEquipment({
            enterprise_id: this.enterpriseId,
            store_id: this.equipment.store.store_id,
            traffic_device_sn: this.equipment.traffic_device_sn,
            video_device_sn: this.equipment.video_device_sn,
            video_channel_id: this.equipment.video_channel_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.successToast('添加')
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加设备失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '网络错误',
              content: '网络出小差了，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加设备失败',
            content: `错误：${err}`,
          })
        }
      },
      // 编辑设备
      async editApi () {
        try {
          const {response, result} = await this.updateEquipment({
            id: this.id,
            store_id: this.equipment.store.store_id,
            traffic_device_sn: this.equipment.traffic_device_sn,
            video_device_sn: this.equipment.video_device_sn,
            video_channel_id: this.equipment.video_channel_id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.successToast('编辑')
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加设备失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑设备失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑设备失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    mounted () {
      this.storeDetail = this.customer
      this.getStore()
    },
  }
</script>
<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .sex
    margin-right 28px
    margin-bottom 0
    line-height 19px
  .chosex
    display flex
    justify-content start
  .di
    width 100px
    display inline-block
  .error
    padding-top: 5px
    font-size: 13px
    color: #eb4e38
    line-height 15px
  .error-input
    border-color: #eb4e38
  .man
    width 122px
  .is-horizontal
    flex-direction: column !important
  .field
    align-self normal !important
    margin-top 40px
    margin-left 0 !important
    padding-top 20px
  .title
    display block
    font-size 16px
    margin-top 20px
</style>
