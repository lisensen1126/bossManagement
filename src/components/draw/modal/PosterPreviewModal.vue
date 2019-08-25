<template lang="pug">
  .bg-box
    img.bg(:src="imgUrl")
    img.bg-top(v-if="status" :src="status.img_url")
</template>

<script>
  export default {
    name: 'PosterPreviewModal',
    components: {
    },
    props: {
      imgUrl: {
        type: String,
        default: () => '',
      },
      type: {
        type: [String, Number],
        default: () => 1,
      },
    },
    data () {
      return {
        bg_top: '',
        statusList: [{
          name: '秒杀海报背景',
          img_url: 'https://oss2.chedianai.com/spike-top.png',
          status: 1,
        }, {
          name: '拼团海报背景',
          img_url: 'https://oss2.chedianai.com/group-top.png',
          status: 2,
        }, {
          name: '门店海报背景',
          img_url: 'https://oss1.chedianai.com/store-top.png',
          status: 3,
        }, {
          name: '活动海报背景',
          img_url: 'https://oss1.chedianai.com/event-top.png',
          status: 4,
        }, {
          name: '养护卡海报背景',
          img_url: 'https://oss2.chedianai.com/card-top.png',
          status: 5,
        }, {
          name: '节日海报背景',
          img_url: 'https://oss1.chedianai.com/store-top.png',
          status: 6,
        }],
        status: null,
      }
    },
    methods: {
    },
    mounted () {
      this.status = this.statusList[this.type - 1]
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .bg
    width 320px
    height 455px
  .bg-box
    position relative
    .bg-top
      width 320px
      height 455px
      position absolute
      top 0
      left 0
</style>

