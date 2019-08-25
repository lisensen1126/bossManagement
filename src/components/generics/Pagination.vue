<!--列表分页组件-->
<template lang="pug">
  .pagination
    .pagination-info {{paginationData.total}} 条数据，每页显示 {{paginationData.per_page}} 条，共 {{paginationData.last_page}} 页
    .pagination-state
      .page-operator.prev(:class="{'is-disabled': prevDisable}", @click="prev")
      .page-info-current {{paginationData.current_page}} / {{paginationData.last_page}}
      .page-operator.next(:class="{'is-disabled': nextDisable}", @click="next")
      .pagination-input
        input.input(v-model="go_page", type="number"  @keyup.enter="go")
        .go-btn(@click="go") go
</template>

<script>

export default {
  name: 'CommonPagination',
  props: {
    paginationData: Object,
  },
  data () {
    return {
      go_page: '',
    }
  },
  computed: {
    prevDisable () {
      return this.paginationData.current_page === 1
    },
    nextDisable () {
      return this.paginationData.last_page ? this.paginationData.current_page === this.paginationData.last_page : true
    },
  },
  methods: {
    prev () {
      if (this.prevDisable) {
        return false
      }
      if (document.getElementsByClassName('table-wrapper')[0]) {
        document.getElementsByClassName('table-wrapper')[0].scrollTop = 0
      }
      this.$emit('input', {
        ...this.paginationData,
        current_page: this.paginationData.current_page - 1,
      }, {
        name: 'prev',
        from: this.paginationData,
      })
    },
    next () {
      if (this.nextDisable) {
        return false
      }
      if (document.getElementsByClassName('table-wrapper')[0]) {
        document.getElementsByClassName('table-wrapper')[0].scrollTop = 0
      }
      this.$emit('input', {
        ...this.paginationData,
        current_page: this.paginationData.current_page + 1,
      }, {
        name: 'next',
        from: this.paginationData,
      })
    },
    go () {
      let page = parseInt(this.go_page)
      if (!page || page < 1 || page > this.paginationData.last_page || page === this.paginationData.current_page) {
        return
      }
      if (document.getElementsByClassName('table-wrapper')[0]) {
        document.getElementsByClassName('table-wrapper')[0].scrollTop = 0
      }
      this.$emit('input', {
        ...this.paginationData,
        current_page: page,
      })
    },
  },
  mounted () {},
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.pagination
  display flex
  justify-content space-between
  flex-shrink 0
  background #ffffff
  height 36px
  color lightGrey
  font-size 12px
  line-height 36px
  box-shadow 0 -1px 12px 0 rgba(0, 0, 0, .08)
.pagination-info
  padding 0 16px
.page-info-current
  display inline-block
  vertical-align top
  padding 0 11px
.page-operator
  display inline-block
  vertical-align top
  width 36px
  height 36px
  background center no-repeat
  background-size 14px
  cursor pointer
  &.next
    background-image url('~@/assets/next.svg')
    &:hover
      background-image url('~@/assets/next-hover.svg')
  &.prev
    background-image url('~@/assets/prev.svg')
    &:hover
      background-image url('~@/assets/prev-hover.svg')
  &.is-disabled
    opacity .2
    pointer-events none
.pagination-input
  display inline-block
  input
    display inline-block
    width: 25px
    height: 20px
    padding: 0
    text-align center
    line-height 20px
    font-size 12px
    border: 1px solid #eee
    box-shadow none
  input::-webkit-outer-spin-button
    -webkit-appearance: none
  input::-webkit-inner-spin-button
    -webkit-appearance: none
  input[type="number"]
    -moz-appearance: textfield
  .go-btn
    display inline-block
    margin 0 15px 0 5px
    border 1px solid  #f5f5f5
    background #eee
    width 25px
    height 20px
    line-height 16px
    text-align center
    cursor pointer
</style>

