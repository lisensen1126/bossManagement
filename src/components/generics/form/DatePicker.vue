<template lang="pug">
  .date-picker
    .control(:class="{'is-error': validator && validator.$error, 'has-icon-label': hasIconLabel}")
      span.icon-label.icon-calendar
      input.input.date-picker-input(type="text", :placeholder="placeholder", :value="value", @input="pickDate", :class="{'is-disabled': isDisabled, 'has-none-border': !hasBorder}", :disabled="isDisabled")
      .error-icon(v-show="validator && validator.$error")
      .error-info(v-text="errorInfo", v-show="validator && validator.$error")
      span.clear-btn(v-if="hasClearBtn && clearBtnVisible && !isDisabled", @click="dateClear")
</template>

<script>
import Flatpickr from 'flatpickr'
import {zh} from '@/constants/custom-zh.js'

export default {
  name: 'DatePicker',
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '请选择日期',
    },
    hasIconLabel: {
      type: Boolean,
      default: true,
    },
    hasDateLabel: {
      type: Boolean,
      default: false,
    },
    hasClearBtn: {
      type: Boolean,
      default: true,
    },
    hasBorder: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'singleWithTime',
    },
    options: {
      type: Object,
      default: () => { return {} },
    },
    hasShortcuts: {
      type: Boolean,
      default: false,
    },
    validator: {
      type: Object,
      default: null,
    },
    errorInfo: {
      type: String,
      default: '',
    },
    shortcuts: {
      type: Array,
      default: () => {
        return [{
          title: '上周',
          id: 'lastWeek',
        }, {
          title: '本周',
          id: 'thisWeek',
        }, {
          title: '上月',
          id: 'lastMonth',
        }, {
          title: '本月',
          id: 'thisMonth',
        }]
      },
    },
    isDisabled: {
      type: Boolean,
      default () {
        return false
      },
    },
    label: {
      type: String,
    },
  },
  data () {
    return {
      flatpickr: null,
      currentRange: '',
      currentStart: null,
      currentEnd: null,
      currentRangeStr: '',
    }
  },
  computed: {
    labelContent () {
      if (this.label) {
        return this.label
      } else {
        switch (this.type) {
          case 'range':
            return '起止时间'
          case 'single':
            return '日期'
        }
      }
    },
    clearBtnVisible () {
      return !!this.value
    },
    defaultOptions () {
      switch (this.type) {
        case 'range' :
          return {
            locale: zh,
            mode: 'range',
            dateFormat: 'Y-m-d',
            onChange: (function (vm) {
              return (selectedDates, dateStr, instance) => {
                if (selectedDates.length === 2) {
                  instance.close()
                }
                if (selectedDates.length === 2 && ((vm.currentStart && selectedDates[0].toString() !== vm.currentStart.toString()) || (vm.currentEnd && selectedDates[1].toString() !== vm.currentEnd.toString()))) {
                  vm.currentRange = ''
                }
              }
            })(this),
            onClose: (function (vm) {
              return (selectedDates, dateStr, instance) => {
                if (selectedDates.length < 2) {
                  vm.currentRange = ''
                }
              }
            })(this),
          }
        case 'single' :
          return {
            locale: zh,
          }
        case 'rangeAllowSingle' :
          return {
            locale: zh,
            mode: 'range',
            dateFormat: 'Y-m-d',
            onChange: (function (vm) {
              return (selectedDates, dateStr, instance) => {
                if (selectedDates.length === 2) {
                  instance.close()
                }
                if (selectedDates.length === 2 && ((vm.currentStart && selectedDates[0].toString() !== vm.currentStart.toString()) || (vm.currentEnd && selectedDates[1].toString() !== vm.currentEnd.toString()))) {
                  vm.currentRange = ''
                }
              }
            })(this),
            onClose: (function (vm) {
              return (selectedDates, dateStr, instance) => {
                if (selectedDates.length < 2) {
                  vm.currentRange = ''
                }
              }
            })(this),
          }
        case 'singleWithTime' :
          return {
            locale: zh,
            dateFormat: 'Y-m-d H:i',
            enableTime: true,
            time_24hr: true,
            defaultHour: 0,
            hourIncrement: 1,
            minuteIncrement: 30,
          }
      }
    },
  },
  watch: {
    value (newValue) {
      if (!newValue) {
        this.dateClear()
      }
    },
  },
  methods: {
    // pickDate (dateString) {
    //   typeof dateString === 'string' ? this.$emit('input', dateString) : this.$emit('input', dateString.target.value)
    // },
    pickDate (dateString) {
      if (this.type === 'range') {
        let str = typeof dateString === 'string' ? dateString : dateString.target.value
        const date = str.split(' 至 ')
        if (date.length < 2) {
          str = ''
        }
        this.$emit('input', str)
      } else if (this.type === 'rangeAllowSingle') {
        let str = typeof dateString === 'string' ? dateString : dateString.target.value
        this.$emit('input', str)
      } else {
        typeof dateString === 'string' ? this.$emit('input', dateString) : this.$emit('input', dateString.target.value)
      }
    },
    dateClear () {
      if (this.isDisabled) {
        return
      }
      this.currentRange = ''
      this.flatpickr.clear()
    },
    // range interaction
    setRange (range) {
      if (this.isDisabled) {
        return
      }
      this.currentRange = range.id
      let now = new Date()
      let start, end, temp
      switch (range.id) {
        case 'lastWeek' :
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() > 0 ? now.getDay() + 6 : 7 + 6))
          end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6)
          this.getCurrentRangeStr(start, end)
          this.flatpickr.setDate([start, end])
          break
        case 'thisWeek' :
          start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() > 0 ? now.getDay() - 1 : 6))
          end = new Date(now.getFullYear(), now.getMonth(), start.getDate() + 6)
          this.getCurrentRangeStr(start, end)
          this.flatpickr.setDate([start, end])
          break
        case 'lastMonth' :
          start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          temp = new Date(start.getFullYear(), start.getMonth() + 1, 1)
          temp.setDate(temp.getDate() - 1)
          end = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
          this.getCurrentRangeStr(start, end)
          this.flatpickr.setDate([start, end])
          break
        case 'thisMonth' :
          start = new Date(now.getFullYear(), now.getMonth(), 1)
          temp = new Date(start.getFullYear(), start.getMonth() + 1, 1)
          temp.setDate(temp.getDate() - 1)
          end = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate())
          this.getCurrentRangeStr(start, end)
          this.flatpickr.setDate([start, end])
          break
      }
    },
    getCurrentRangeStr (start, end) {
      this.currentStart = start
      this.currentEnd = end
      let currentRangeStart = [start.getFullYear(), (start.getMonth() + 101 + '').slice(1), (start.getDate() + 100 + '').slice(1)].join('-')
      let currentRangeEnd = [end.getFullYear(), (end.getMonth() + 101 + '').slice(1), (end.getDate() + 100 + '').slice(1)].join('-')
      this.currentRangeStr = `${currentRangeStart} - ${currentRangeEnd}`
    },
  },
  mounted () {
    const valueUpdateCallback = this.options.onValueUpdate
    const element = this.$el.querySelector('.date-picker-input')
    this.flatpickr = new Flatpickr(element, {
      ...this.defaultOptions,
      ...this.options,
      onValueUpdate: () => {
        this.pickDate(element.value)
        if (typeof ValueUpdateCallback === 'function') {
          valueUpdateCallback()
        }
      },
    })
    this.$emit('FlatpickrRef', this.flatpickr)
  },
  destroyed () {
    this.flatpickr.destroy()
    this.flatpickr = null
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'

.control.has-icon-label
  .icon-label.icon-calendar
    background-image url('~@/assets/calendar/input-calendar.svg')
.clear-btn
  position: absolute
  top: 50%
  transform: translateY(-50%)
  width: 16px
  height: 16px
  background-size: 16px
  background-position: center
  right: 12px
  background-image: url('~@/assets/calendar/input-clear.svg')
  cursor: pointer
  opacity: .6
  &:hover
    opacity: 1
.input
  &.has-none-border
    border none
    box-shadow none
    padding 0
    border-radius none
</style>
