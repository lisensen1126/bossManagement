<template lang="pug">
  modal-dialog(modalScale="small")
    .period-box-header
      .title 添加自定义时段
      .close(@click="close()")
    .period-box-mid
      .period-box-bar
        label 开始时间
        select-time(v-model="time.open_time_hour", :validator="$v.time.open_time_hour", @input="detectOpenTime", :error-info="openErrorInfo", :start="caclStartTime", :end="caclEndTime")
        select-time(v-model="time.open_time_minutes", :isHours="false", :validator="$v.time.open_time_minutes",  @input="detectOpenTimeMinutes", :error-info="openErrorInfoMinutes", :isSame="isSameStart", :limit="caclStartTime")
      .period-box-bar
        label 结束时间
        select-time(v-model="time.close_time_hour", :validator="$v.time.close_time_hour", @input="detectCloseTime", :error-info="closeErrorInfo", :start="caclStartTime", :end="caclEndTime")
        select-time(v-model="time.close_time_minutes", :isHours="false", :validator="$v.time.close_time_minutes", @input="detectCloseTimeMinutes", :error-info="closeErrorInfoMinutes", :isSame="isSameEnd", :limit="caclEndTime")
    .period-box-footer
      a.cancel(@click="close()") 取消
      a.button.primary(@click="confirm") 确认
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import SelectTime from '@/components/generics/SelectTime'
  import {validationMixin} from 'vuelidate'
  // import {required} from 'vuelidate/lib/validators'
  export default {
    name: 'CustomPeriodModal',
    props: {
      value: {
        type: Boolean,
      },
      curAddPeriodCate: {
        type: String,
      },
      startTime: {
        type: Object,
      },
      endTime: {
        type: Object,
      },
      // step: {
      //   type: Number,
      //   default: 120,
      // },
    },
    mixins: [validationMixin],
    components: {
      ModalDialog,
      SelectTime,
    },
    data () {
      return {
        closeErrorInfo: '请选择时间',
        openErrorInfo: '请选择时间',
        openErrorInfoMinutes: '请选择时间',
        closeErrorInfoMinutes: '请选择时间',
        isSameStart: false,
        isSameEnd: false,
        isShow: this.value,
        time: {
          open_time_hour: '',
          open_time_minutes: '',
          close_time_hour: '',
          close_time_minutes: '',
        },
        caclStartTime: null,
        caclEndTime: null,
      }
    },
    watch: {
      startTime: {
        handler (val) {
          this.caclStartTime = val
          // this.time.open_time_hour = val.hour
          // this.time.open_time_minutes = val.minutes
          // this.caclNextTime()
        },
        deep: true,
        immediate: true,
      },
      endTime: {
        handler (val) {
          this.caclEndTime = val
          // this.time.close_time_hour = val.hour
          // this.time.close_time_minutes = val.minutes
        },
        deep: true,
        immediate: true,
      },
    },
    methods: {
      close () {
        this.isShow = false
        this.open_time_hour = ''
        this.open_time_minutes = ''
        this.close_time_hour = ''
        this.close_time_minutes = ''
        this.$emit('input', this.isShow)
      },
      confirm () {
        this.$v.time.$touch()
        if (this.$v.time.open_time_hour.$error || this.$v.time.open_time_minutes.$error || this.$v.time.close_time_hour.$error || this.$v.time.close_time_minutes.$error) {
          return
        }
        this.$emit('add', {cate: this.curAddPeriodCate, open_time: this.time.open_time_hour + ':' + this.time.open_time_minutes, close_time: this.time.close_time_hour + ':' + this.time.close_time_minutes})
      },
      compareTime (compareTarget, curTarget, cate, errorInfo) {
        if (!this.time[curTarget]) {
          this[errorInfo] = '请选择时间'
          return false
        } else {
          if (!this.time[compareTarget]) {
            return true
          } else {
            if (cate === 'startHour' || cate === 'startMinutes') {
              if ((cate === 'startHour' && parseInt(this.time[curTarget]) > parseInt(this.time[compareTarget])) || (cate === 'startMinutes' && this.time.open_time_hour === this.time.close_time_hour && parseInt(this.time[curTarget]) >= parseInt(this.time[compareTarget]))) {
                this[errorInfo] = '开始时间必须小于结束时间'
                return false
              }
            } else {
              if ((cate === 'endHour' && parseInt(this.time[curTarget]) < parseInt(this.time[compareTarget])) || (cate === 'endMinutes') && this.time.open_time_hour === this.time.close_time_hour && parseInt(this.time[curTarget]) <= parseInt(this.time[compareTarget])) {
                this[errorInfo] = '结束时间必须大于开始时间'
                return false
              }
            }
            return true
          }
        }
      },
      detectOpenTime (val) {
        this.$v.time.open_time_hour.$touch()
      },
      detectOpenTimeMinutes () {
        this.$v.time.open_time_minutes.$touch()
      },
      detectCloseTime () {
        this.$v.time.close_time_hour.$touch()
      },
      detectCloseTimeMinutes () {
        this.$v.time.close_time_minutes.$touch()
      },
      // caclNextTime (start) {
      //   let add = this.step / 60
      //   let hour = Math.floor(add)
      //   let minutes = this.step - hour * 60
      //   if (minutes + parseInt(this.time.open_time_hour) >= 60) {
      //     this.time.close_time_hour = (parseInt(this.time.open_time_hour) + hour + 1) >= 10 ? '' + (parseInt(this.time.open_time_hour) + hour + 1) : '0' + (parseInt(this.time.open_time_hour) + hour + 1)
      //     this.time.close_time_minutes = (minutes + parseInt(this.time.open_time_minutes) - 60) >= 10 ? '' + (minutes + parseInt(this.time.open_time_minutes) - 60) : '0' + (minutes + parseInt(this.time.open_time_minutes) - 60)
      //   } else {
      //     this.time.close_time_minutes = (minutes + parseInt(this.time.open_time_minutes)) >= 10 ? '' + (minutes + parseInt(this.time.open_time_minutes)) : '0' + (minutes + parseInt(this.time.open_time_minutes))
      //     this.time.close_time_hour = parseInt(this.time.open_time_hour) + hour >= 10 ? '' + (parseInt(this.time.open_time_hour) + hour) : '0' + (parseInt(this.time.open_time_hour) + hour)
      //   }
      // },
    },
    mounted () {
      this.$watch('time.open_time_hour', function (val) {
        if (val === this.startTime.hour) {
          this.isSameStart = true
          this.time.open_time_minutes = this.caclStartTime.minutes
        } else {
          this.isSameStart = false
        }
      }, {
        deep: true,
        immediate: true,
      })
      this.$watch('time.close_time_hour', function (val) {
        if (val === this.startTime.hour) {
          this.isSameEnd = true
          this.time.close_time_minutes = this.caclEndTime.minutes
        } else {
          this.isSameEnd = false
        }
      }, {
        deep: true,
        immediate: true,
      })
    },
    validations: {
      time: {
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
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .period-box-header
    width 100%
    height 72px
    border-bottom 1px solid rgba(0, 0, 0, .06)
    display flex
    align-items center
    justify-content space-between
    box-sizing border-box
    padding 24px
    .title
      font-size 20px
      line-height 24px
      color #121212
    .close
      width 16px
      height 16px
      background url('~@/assets/modal/close.svg')
      background-size cover
      cursor pointer
  .period-box-mid
    width 100%
    height 175px
    box-sizing border-box
    padding 32px
    border-bottom 1px solid rgba(0, 0, 0, .06)
  .period-box-bar
    display flex
    align-items center
    justify-content space-between
    height 32px
    margin-bottom 16px
    label
      color #353535
      font-size 13px
      width 160px
  .period-box-footer
    width 100%
    height 72px
    padding 16px 24px
    display flex
    align-items center
    justify-content flex-end
    .button
      width 104px
      height 40px
      font-size 14px
      line-height 40px
      margin-left 16px
    .cancel
      width 88px
      height 24px
      background #ffffff
      text-align center
      color #999
      font-size 14px
      line-height 24px
</style>