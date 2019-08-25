<template lang="pug">
  .star-rating-wrapper(:title="scoreValue + '星好评'")
    .star-rating-bg
      .star-item(v-for="n in 5", :class="{'large': largeScale}", @click="score(n)")
    .star-rating
      .star-item(v-if="scoreValue", v-for="n in scoreValue", :class="{'large': largeScale}", @click="score(n)")
    span.star-number-label(v-if="hasLabel") {{scoreValue}} 星
</template>

<script>
export default {
  name: 'StarRating',
  props: {
    rating: {
      type: Number,
      default: 5,
    },
    largeScale: {
      type: Boolean,
      default: false,
    },
    hasLabel: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
    },
    isAllowedScore: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      scoreValue: 0,
    }
  },
  watch: {
    value () {
      this.caculateValue()
    },
    rating () {
      this.caculateValue()
    },
  },
  methods: {
    score (score) {
      if (!this.isAllowedScore) {
        return
      }
      this.scoreValue = score
      this.$emit('input', '' + this.scoreValue)
    },
    caculateValue () {
      this.scoreValue = this.isAllowedScore ? Math.round(this.value) : Math.round(this.rating) >= 5 ? 5 : Math.round(this.rating)
    },
  },
  mounted () {
    this.caculateValue()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins.styl'

.star-rating-wrapper
  position relative
  display inline-block

.star-rating
  position absolute
  top 0
  left 0

.star-item
  display inline-block
  width 10px
  height 10px
  margin-right 3px
  background center no-repeat
  background-size 100%
  cursor pointer
  .star-rating-bg &
    background-image url('~@/assets/stars/star-s-grey.svg')
  .star-rating &
    background-image url('~@/assets/stars/star-s-yellow.svg')

  &.large
    width 16px
    height 16px
    margin-right 7px
    .star-rating-bg &
      background-image url('~@/assets/stars/star-l-grey.svg')
    .star-rating &
      background-image url('~@/assets/stars/star-l-yellow.svg')

.star-number-label
  position absolute
  left 115px
  top 0
  width 100px
  display inline-block
  vertical-align middle
  height 16px
  line-height 16px
  font-size 13px
  color #353535
  text-indent 8px
  &::before
    display block
    content ""
    position absolute
    left 0
    top 0
    width 1px
    height 16px
    background rgba(0, 0, 0, .06)
</style>