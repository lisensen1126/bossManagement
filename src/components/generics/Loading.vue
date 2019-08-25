<template lang="pug">
  .loading-box
    .border-box
      .loading
        .car
        .picTab
</template>

<script>
export default {
  name: 'Loading',
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.loading-box
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  background-color rgba(255,255,255,.5)
  line-height 100%
  text-align center
  color #fff
  z-index 99999
  .border-box
    width 100%
    height 100%
    position relative
    .loading
      width 190px
      height 60px
      position absolute
      top 0
      left 0
      bottom 0
      right 0
      margin auto
      overflow hidden
      .car
        width 100%
        height 50px
        float left
        position relative
        background url('~@/assets/car.png') no-repeat center center
        animation car 0.8s steps(24) infinite
        background-size 160px
        @keyframes car
          0%   {left: 0px; top: 3px;}
          100% {left:0; top:0px}
      .picTab
        position relative
        float left
        height 2px
        width 200px
        margin-right -100px
        background url('~@/assets/line.png') no-repeat center center
        animation move 0.8s steps(24) infinite
        background-size cover
        @keyframes move{
          from{
            transform:translateX(100px);
          }
          to{
            transform:translateX(-100px);
          }
        }
</style>
