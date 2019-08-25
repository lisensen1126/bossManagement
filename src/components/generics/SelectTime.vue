<template lang="pug">
  .custom-select.select-time
    .custom-select-area(@click.stop="toggleDropdown", :class="{'is-error': validator && validator.$error}")
      input.custom-select-input.select-time-input(:placeholder="placeholder", readonly="readonly", type="text", :value="value")
      span.custom-select-arrow
      .error-icon(v-if="validator && validator.$error")
      .error-info.custom(v-if="validator && validator.$error", v-text="errorInfo")
    .custom-select-list.select-time-box(v-if="isExpanded")
      //- .custom-select-item(v-if="isNullable", :class="{'selected': value === candidateNull}", v-text="candidateNull", @click="selectCandidate(candidateNull)")
      .custom-select-item(v-for="candidate in list", v-text="candidate", @click="selectCandidate(candidate)")
</template>

<script>
export default {
  name: 'SelectTime',
  props: {
    value: {
      type: String,
    },
    validator: {
      type: Object,
      default: null,
    },
    errorInfo: {
      type: String,
      default: '',
    },
    isHours: {
      type: Boolean,
      default: true,
    },
    start: {
      type: Object,
      default: () => ({hour: '0', minutes: '23'}),
    },
    end: {
      type: Object,
      default: () => ({hour: '0', minutes: '23'}),
    },
    isSame: {
      type: Boolean,
      default: false,
    },
    limit: {
      type: Object,
      default: () => ({hour: '', minutes: ''}),
    },
    isDisabled: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      isExpanded: false,
      minutes: ['00', '30'],
      placeholder: '',
      list: [],
    }
  },
  // computed: {
  //   list () {
  //     if (this.isHours) {
  //       const startHour = this.start && parseInt(this.start.hour) || 0
  //       const endHour = this.end && parseInt(this.end.hour) || 23
  //       let arr = []
  //       for (let val = startHour; val <= endHour; val++) {
  //         arr.push(val >= 10 ? val + '' : '0' + val)
  //       }
  //       return arr
  //     } else {
  //       return this.minutes
  //     }
  //   },
  // },
  watch: {
    isSame (val) {
      if (val) {
        const minutes = this.limit.minutes
        this.list = this.minutes.filter(val => parseInt(val) >= parseInt(minutes))
      } else {
        this.list = this.minutes
      }
    },
    isHours: {
      handler (val) {
        if (val) {
          const startHour = this.start && parseInt(this.start.hour) || 0
          const endHour = this.end && parseInt(this.end.hour) || 23
          let arr = []
          for (let val = startHour; val <= endHour; val++) {
            arr.push(val >= 10 ? val + '' : '0' + val)
          }
          this.list = arr
        } else {
          this.list = this.minutes
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectCandidate (candidate) {
      this.$emit('input', candidate)
    },
    expandDropdown () {
      this.$hub.$emit(this.$hub.events.collapseDataPickers, this)
      this.isExpanded = true
    },
    collapseDropdown () {
      this.isExpanded = false
    },
    toggleDropdown () {
      if (!this.isDisabled) {
        this.isExpanded ? this.collapseDropdown() : this.expandDropdown()
      }
    },
  },
  mounted () {
    // init default value
    this.placeholder = this.isHours ? '时' : '分'

    // collapse on body click
    this._onBodyClick = () => {
      this.collapseDropdown()
    }
    document.body.addEventListener('click', this._onBodyClick, false)
    // collapse on hub event
    this._onCollapseDataPickers = (source) => {
      if (this !== source) {
        this.collapseDropdown()
      }
    }
    this.$hub.$on(this.$hub.events.collapseDataPickers, this._onCollapseDataPickers)
  },
  unmounted () {
    document.body.removeEventListener('click', this._onBodyClick)
    this.$hub.$off(this.$hub.events.collapseDataPickers, this._onCollapseDataPickers)
  },
}
</script>

<style lang="stylus" scoped>
.select-time
  width 100px
  display inline-flex
.select-time + .select-time
  position relative
  margin-left 20px
  &::before
    display block
    content ":"
    position absolute
    left -20px
    top 0
    height 32px
    width 20px
    line-height 32px
    text-align center
.custom-select.select-time
  .custom-select-input
    padding 8px 20px 8px 12px
.select-time-box
  max-height 180px
  overflow-y scroll
  overflow-x hidden
.error-info.custom
  min-width 90px
  top auto
  bottom 25px
</style>
