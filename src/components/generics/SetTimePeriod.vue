<template lang="pug">
  .control.is-horizontal.is-flex
    .period-box-wrapper
      .period-box
        .period-box-top
          .period-box-item.toggle-group
            .multiple-toggle-btns.is-small(v-for="(day, key) in weekdays")
              input(type="checkbox", :id="key", :value="key", v-model="weekdays_checkbox", :disabled="isDisabled")
              label(:for="key") {{day}}
          .period-select
            .radio(:class="{'checked': workday_reservation_period_type === '1'}")
              input(type="radio", id="weekday_supplied", v-model="workday_reservation_period_type", value="1", :disabled="isDisabled")
              label(for="weekday_supplied") 使用预设时段
            .radio(:class="{'checked': workday_reservation_period_type === '2'}")
              input(type="radio", id="weekday_custom", v-model="workday_reservation_period_type", value="2", :disabled="isDisabled")
              label(for="weekday_custom") 自定义时段
        .period-box-bottom
          .toggle-group(v-show="workday_reservation_period_type === '1'")
            .multiple-toggle-btns.is-small.fixed-width(v-for="(period, index) in recommendPeriod")
              input(type="checkbox", :id="'weekday_' + index", :value="period", v-model="weekdaysPeriod_checkbox", :disabled="isDisabled")
              label(:for="'weekday_' + index") {{period}}
          .toggle-group(v-show="workday_reservation_period_type === '2'")
            .multiple-toggle-btns.is-small.fixed-width(v-for="(period, index) in weekdaysPeriod_custom_checkbox")
              input(type="checkbox", :id="'weekday_' + index", :value="period", v-model="weekdaysPeriod_custom_checkbox", :disabled="isDisabled")
              label.disable(:for="'weekday_' + index") {{period}}
              .label-close(title="删除", @click="removePeriod('weekdays', index)")
            .multiple-toggle-btns.is-small.fixed-width(v-if="weekdaysPeriod_custom_checkbox.length <= 5")
              a.button(@click="addPeriod('weekdays')") 添加时段
      .period-box-tip(v-if="!weekdays_checkbox.length || (workday_reservation_period_type === '1' ? !weekdaysPeriod_checkbox.length : !weekdaysPeriod_custom_checkbox.length)")
        | 工作日未开启预约
      .period-box-tip(v-else)
        | {{weekdays_checkbox.length === Object.keys(weekdays).length ? '工作日' : getDays('weekdays', 'weekdays_checkbox')}}:
        span(v-for="period in weekdaysPeriod", v-text="period")
    .period-box-wrapper
      .period-box
        .period-box-top
          .period-box-item.toggle-group
            .multiple-toggle-btns.is-small(v-for="(day, key) in weekends")
              input(type="checkbox", :id="key", :value="key", v-model="weekends_checkbox", :disabled="isDisabled")
              label(:for="key") {{day}}
          .period-select
            .radio(:class="{'checked': weekend_reservation_period_type === '1'}")
              input(type="radio", id="weekend_supplied", v-model="weekend_reservation_period_type", value="1", :disabled="isDisabled")
              label(for="weekend_supplied") 使用预设时段
            .radio(:class="{'checked': weekend_reservation_period_type === '2'}")
              input(type="radio", id="weekend_custom", v-model="weekend_reservation_period_type", value="2", :disabled="isDisabled")
              label(for="weekend_custom") 自定义时段
        .period-box-bottom
          .toggle-group(v-show="weekend_reservation_period_type === '1'")
            .multiple-toggle-btns.is-small.fixed-width(v-for="(period, index) in recommendPeriod")
              input(type="checkbox", :id="'weekend_' + index", :value="period", v-model="weekendsPeriod_checkbox", :disabled="isDisabled")
              label(:for="'weekend_' + index") {{period}}
          .toggle-group(v-show="weekend_reservation_period_type === '2'")
            .multiple-toggle-btns.is-small.fixed-width(v-for="(period, index) in weekendsPeriod_custom_checkbox")
              input(type="checkbox", :id="'weekend_' + index", :value="period", v-model="weekendsPeriod_custom_checkbox", :disabled="isDisabled")
              label.disable(:for="'weekend_' + index") {{period}}
              .label-close(title="删除", @click="removePeriod('weekends', index)")
            .multiple-toggle-btns.is-small.fixed-width(v-if="weekendsPeriod_custom_checkbox.length <= 5")
              a.button(@click="addPeriod('weekends')") 添加时段
      .period-box-tip(v-if="!weekends_checkbox.length || (weekend_reservation_period_type === '1' ? !weekendsPeriod_checkbox.length : !weekendsPeriod_custom_checkbox.length)")
        | 周末未开启预约
      .period-box-tip(v-else)
        | {{weekends_checkbox.length === Object.keys(weekends).length ? '周末' : getDays('weekends', 'weekends_checkbox')}}:
        span(v-for="period in weekendsPeriod", v-text="period")
    custom-period-modal(v-if="isShowCustomPeriodModal", :curAddPeriodCate="curAddPeriodCate", v-model="isShowCustomPeriodModal", @add="addCustomPeriod", :endTime="end_time", :startTime="start_time")
</template>

<script>
  import CustomPeriodModal from '@/components/generics/CustomPeriodModal'

  export default {
    name: 'SetTimePeriod',
    components: {CustomPeriodModal},
    props: {
      reservationPeriod: {
        type: Object,
        default: () => { return {} },
      },
      // 工作日时间段类型
      weekdayPeriodType: {
        type: String,
        default: '1', // valid value: SYSTEM, CUSTOM
      },
      weekendPeriodType: {
        type: String,
        default: '1', // valid value: SYSTEM, CUSTOM
      },
      // is need to caculate the reservationPeriod,whe the save btn isClikced
      isNeedCaculate: {
        type: Boolean,
        default: false,
      },
      endTime: {
        type: Object,
        default: () => {
          return {
            hour: '',
            minutes: '',
          }
        },
      },
      startTime: {
        type: Object,
        default: () => {
          return {
            hour: '',
            minutes: '',
          }
        },
      },
      // 是否设置店铺营业时间
      hasSetOpentime: {
        type: Boolean,
        default: true,
      },
      // 是否允许操作
      isDisabled: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      const weekdays = {
        'monday': '周一',
        'tuesday': '周二',
        'wednesday': '周三',
        'thursday': '周四',
        'friday': '周五',
      }
      const weekends = {
        'saturday': '周六',
        'sunday': '周日',
      }
      const recommendPeriod = ['00:00 - 08:00', '08:00 - 11:00', '11:00 - 14:00', '14:00 - 17:00', '17:00 - 20:00', '20:00 - 23:30']
      return {
        weekdays_checkbox: [],
        weekends_checkbox: [],
        weekdaysPeriod_checkbox: [],
        weekdaysPeriod_custom_checkbox: [],
        weekendsPeriod_checkbox: [],
        weekendsPeriod_custom_checkbox: [],
        recommendPeriod,
        weekdaysPeriod: [],
        weekendsPeriod: [],
        weekdays,
        weekends,
        reservation_period: {},
        weekend_reservation_period_type: '',
        workday_reservation_period_type: '',
        isShowCustomPeriodModal: false,
      }
    },
    watch: {
      isDisabled: {
        handler (val) {
          if (val) {
            this.weekdays_checkbox = []
            this.weekends_checkbox = []
            this.weekendsPeriod_checkbox = []
            this.weekendsPeriod_custom_checkbox = []
            this.weekdaysPeriod_checkbox = []
            this.weekdaysPeriod_custom_checkbox = []
            this.weekend_reservation_period_type = this.weekendPeriodType
            this.workday_reservation_period_type = this.weekdayPeriodType
          }
        },
        immediate: true,
      },
      endTime: {
        handler (val) {
          this.end_time = {...val}
        },
        immediate: true,
        deep: true,
      },
      startTime: {
        handler (val) {
          this.start_time = {...val}
        },
        immediate: true,
        deep: true,
      },
      weekendPeriodType: {
        handler (val) {
          this.weekend_reservation_period_type = val
        },
        immediate: true,
      },
      weekdayPeriodType: {
        handler (val) {
          this.workday_reservation_period_type = val
        },
        immediate: true,
      },
      reservationPeriod: {
        handler (reservationPeriod) {
          this.reservation_period = {...reservationPeriod}
          Object.keys(reservationPeriod).map(key => {
            let target
            if (key === 'saturday' || key === 'sunday') {
              this.weekends_checkbox.push(key)
              target = this.weekend_reservation_period_type === '1' ? this.weekendsPeriod_checkbox : this.weekendsPeriod_custom_checkbox
            } else {
              this.weekdays_checkbox.push(key)
              target = this.workday_reservation_period_type === '1' ? this.weekdaysPeriod_checkbox : this.weekdaysPeriod_custom_checkbox
            }
            target.length === 0 && reservationPeriod[key].map(val => {
              let period = val.start + ' - ' + val.end
              target.push(period)
            })
          })
        },
        immediate: true,
        deep: true,
      },
      weekendsPeriod_checkbox: {
        handler (val) {
          this.weekendsPeriod = this.getFooterPeriod(val)
        },
        immediate: true,
        deep: true,
      },
      weekendsPeriod_custom_checkbox: {
        handler (val) {
          this.weekendsPeriod = this.getFooterPeriod(val)
        },
        immediate: true,
        deep: true,
      },
      weekdaysPeriod_checkbox: {
        handler (val) {
          this.weekdaysPeriod = this.getFooterPeriod(val)
        },
        immediate: true,
        deep: true,
      },
      weekdaysPeriod_custom_checkbox: {
        handler (val) {
          this.weekdaysPeriod = this.getFooterPeriod(val)
        },
        immediate: true,
        deep: true,
      },
      isNeedCaculate (val) {
        if (!val) {
          return
        }
        if (!this.workdayChooseDetect()) {
          this.$emit('change', {
            flag: false,
          })
          return
        }
        if (!this.validWorkdayChooseDetect()) {
          this.$emit('change', {
            flag: false,
          })
          return
        }
        this.getPeriod()
        this.$emit('change', {
          flag: true,
          reservationPeriod: this.reservation_period,
          weekendPeriodType: this.weekend_reservation_period_type,
          workdayPeriodType: this.workday_reservation_period_type,
        })
      },
    },
    methods: {
      formatePeriod (cate, target) {
        if (cate.length && target.length) {
          target.sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))
          for (let day of cate) {
            this.reservation_period[day] = [...target.map(val => {
              return {
                start: (val.split('-')[0]).trim(),
                end: (val.split('-')[1]).trim(),
              }
            })]
          }
        }
      },
      getDays (cate, target) {
        let arr = []
        Object.keys(this[cate]).forEach(val => {
          if (this[target].indexOf(val) !== -1) {
            arr.push(this[cate][val])
          }
        })
        return arr.join('、')
      },
      getFooterPeriod (val) {
        if (!val.length) {
          return
        }
        let obj = [...val]
        this.sortArr(obj)
        return this.recursion(obj)
      },
      recursion (obj, index = 0, arr = []) {
        if (index === 0) {
          arr.push(obj[0])
        } else {
          if (arr[arr.length - 1].split(' - ')[1] === obj[index].split(' - ')[0]) {
            arr[arr.length - 1] = [arr[arr.length - 1].split(' - ')[0], obj[index].split(' - ')[1]].join(' - ')
          } else {
            arr.push(obj[index])
          }
        }

        if (index === obj.length - 1) {
          return arr
        } else {
          return this.recursion(obj, index + 1, arr)
        }
      },
      sortArr (target) {
        const date = new Date()
        target.sort((a, b) => {
          let start = a.split(' - ')[0]
          let next = b.split(' - ')[0]
          return date.setHours(start.split(':')[0], start.split(':')[1]) > date.setHours(next.split(':')[0], next.split(':')[1])
        })
      },
      removePeriod (cate, index) {
        if (this.isDisabled) {
          return
        }
        this[cate + 'Period_custom_checkbox'].splice(index, 1)
      },
      // 获取预约时段
      getPeriod () {
        this.reservation_period = {}
        if (this.workday_reservation_period_type === '1') {
          this.formatePeriod(this.weekdays_checkbox, this.weekdaysPeriod_checkbox)
        } else {
          this.formatePeriod(this.weekdays_checkbox, this.weekdaysPeriod_custom_checkbox)
        }
        if (this.weekend_reservation_period_type === '1') {
          this.formatePeriod(this.weekends_checkbox, this.weekendsPeriod_checkbox)
        } else {
          this.formatePeriod(this.weekends_checkbox, this.weekendsPeriod_custom_checkbox)
        }
      },
      addPeriod (cate) {
        if (this.isDisabled) {
          return
        }
        this.curAddPeriodCate = cate
        this.isShowCustomPeriodModal = true
      },
      addCustomPeriod (params) {
        if (this.isDisabled) {
          return
        }
        let target = this[params.cate + 'Period_custom_checkbox']
        if (target.length) {
          const date = new Date()
          const startTime = date.setHours(params.open_time.split(':')[0], params.open_time.split(':')[1])
          let lastEndTime = target[target.length - 1].split(' - ')[1]
          const limit = date.setHours(lastEndTime.split(':')[0], lastEndTime.split(':')[1])
          if (limit > startTime) {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: `自定义开始时间不能小于 ${target[target.length - 1].split(' - ')[1]}`,
            })
            return
          }
        }
        target.push(params.open_time + ' - ' + params.close_time)
        this.isShowCustomPeriodModal = false
      },
      // 有效的预约时段检测
      validWorkdayChooseDetect () {
        if (!this.hasSetOpentime) {
          // 未设置营业时间
          return true
        }
        if (!this.weekdays_checkbox.length && !this.weekends_checkbox.length) {
          return true
        }
        let weekendsPeriod = this.weekend_reservation_period_type === '1' ? this.weekendsPeriod_checkbox : this.weekendsPeriod_custom_checkbox
        let weekdaysPeriod = this.workday_reservation_period_type === '1' ? this.weekdaysPeriod_checkbox : this.weekdaysPeriod_custom_checkbox
        weekendsPeriod.length && weekendsPeriod.sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))
        weekdaysPeriod.length && weekdaysPeriod.sort((a, b) => parseInt(a.split(':')[0]) - parseInt(b.split(':')[0]))

        let date = new Date()
        const openHours = date.setHours(this.start_time.hour, this.start_time.minutes)
        const closeHours = date.setHours(this.end_time.hour, this.end_time.minutes)

        const weekdaysStartHour = weekdaysPeriod.length && date.setHours(weekdaysPeriod[0].split(' - ')[0].split(':')[0], weekdaysPeriod[0].split(' - ')[0].split(':')[1])
        const weekdaysEndHour = weekdaysPeriod.length && date.setHours(weekdaysPeriod[weekdaysPeriod.length - 1].split(' - ')[1].split(':')[0], weekdaysPeriod[weekdaysPeriod.length - 1].split(' - ')[1].split(':')[1])

        const weekendsStartHour = weekendsPeriod.length && date.setHours(weekendsPeriod[0].split(' - ')[0].split(':')[0], weekendsPeriod[0].split(' - ')[0].split(':')[1])
        const weekendsEndHour = weekendsPeriod.length && date.setHours(weekendsPeriod[weekendsPeriod.length - 1].split(' - ')[1].split(':')[0], weekendsPeriod[weekendsPeriod.length - 1].split(' - ')[1].split(':')[1])

        if ((this.weekdays_checkbox.length && weekdaysPeriod.length && (weekdaysStartHour < openHours || weekdaysEndHour > closeHours)) || (this.weekends_checkbox.length && weekendsPeriod.length && (weekendsStartHour < openHours || weekendsPeriod.length && weekendsEndHour > closeHours))) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '设置的预约时间段请在门店的营业时间内',
          })
          return false
        }
        return true
      },
      // 预约时段没选检测
      workdayChooseDetect () {
        let tag = true
        let msg = ''
        const weekdaysDetect = this.workday_reservation_period_type === '1' && this.weekdaysPeriod_checkbox.length
        const weeksdayCustomDetect = this.workday_reservation_period_type === '2' && this.weekdaysPeriod_custom_checkbox.length

        const weekendsDetect = this.weekend_reservation_period_type === '1' && this.weekendsPeriod_checkbox.length
        const weekendsCustomDetect = this.weekend_reservation_period_type === '2' && this.weekendsPeriod_custom_checkbox.length

        if (this.weekdays_checkbox.length && !(weekdaysDetect || weeksdayCustomDetect)) {
          tag = false
          msg = '请设置工作日的具体时间段'
        } else if (this.weekends_checkbox.length && !(weekendsDetect || weekendsCustomDetect)) {
          tag = false
          msg = '请设置周末的具体时间段'
        }
        if (!tag) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: `${msg}`,
          })
          return false
        }
        return true
      },
    },
  }
</script>

<style lang="stylus" scoped>
  .is-horizontal
    flex-direction row
  .is-flex
    display: flex
  .period-box-wrapper
    width 360px
    margin-right 16px
    &:last-child
      margin-right 0
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
    padding 16px
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
          width 8px
          height 8px
          border 1px solid #ccc
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
    .disable
      pointer-events none
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
</style>
