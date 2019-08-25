<!--上传图片弹窗，用于商品sku详情上传-->
<template lang="pug">
  .slide-layout
    img(v-for="item in currentImageArray",:src="item")
</template>

<script>

export default {
  name: 'ImageDetail',
  props: {
    currentImageArray: {
      type: Array,
    },
  },
  data () {
    return {
      detail: {},
      modalShow: false,
    }
  },
  methods: {
  },
  mounted () {
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.slide-layout
  padding 0
  img
    display block
    width 100%
</style>

