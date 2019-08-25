<template lang="pug">
  .button
    span.left-arrow(@click="changeDate(-1)")
    span.date(v-text="value")
    span.right-arrow(@click="changeDate(1)")
</template>

<script>
export default {
  name: 'DateDay',
  props: {
    value: [String],
  },
  data () {
    return {
    }
  },
  methods: {
    changeDate (day) {
      const date = new Date(new Date(this.value).getTime() + day * 24 * 60 * 60 * 1000)
      const newDate = date.getFullYear() + '-' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
      this.$emit('input', newDate)
    },
  },
  mounted () {
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.date
  padding 0 16px
  color darker
.left-arrow
.right-arrow
  width 24px
  height 24px
  line-height 24px
  margin 3px 0
.left-arrow
  border-right 1px solid rgba(0,0,0,.06)
  background url('~@/assets/calendar/prev.svg') no-repeat left center
  &:hover
    background-image url('~@/assets/calendar/prev-hover.svg')
.right-arrow
  border-left 1px solid rgba(0,0,0,.06)
  background url('~@/assets/calendar/next.svg') no-repeat right center
  &:hover
    background-image url('~@/assets/calendar/next-hover.svg')
</style>
