<template lang="pug">
  .bg-box
    img.bg(v-for="v in imgUrl", :src="v")
</template>

<script>
  export default {
    name: 'MaterialPreviewModal',
    components: {
    },
    props: {
      imgUrl: {
        type: Array,
        default: () => [],
      },
      type: {
        type: [String, Number],
        default: () => 1,
      },
    },
    data () {
      return {
        bg_top: '',
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
  .bg
    width 320px
    height auto
</style>

