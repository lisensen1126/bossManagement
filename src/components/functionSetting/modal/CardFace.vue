<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        //- .modal-card-title 卡面信息
        .close-button(@click="modalClose")
      .modal-body
        .field-group
          .field.is-horizontal
            label.label 购卡中心
            .card-detail
              .card-item(:style="{'background-image':' url(' + url + ')'}")
                img.image-url(src="../../../assets/functions/lijigouka.png")
          .field.is-horizontal
            label.label 购卡详情
            .card-detail
              .card-item(:style="{'background-image':' url(' + url + ')'}")
                img.image-url(src="../../../assets/functions/gouka.png")
          .field.is-horizontal
            label.label 卡包列表
            .card-detail
              .card-item(:style="{'background-image':' url(' + url + ')'}")
                img.image-url(src="../../../assets/functions/kabao.png")
          .field.is-horizontal
            label.label 已购卡详情
            .card-detail
              .card-item(:style="{'background-image':' url(' + url + ')'}")
                img.image-url(src="../../../assets/functions/yigouka.png")
              .card-item(:style="{'background-image':' url(' + url + ')'}")
                img.image-url(src="../../../assets/functions/yiguoqi.png")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import OpenImage from '@/components/generics/OpenImage'
  export default {
    name: 'CardFace',
    components: {
      ModalDialog,
      OpenImage,
    },
    props: {
      url: {
        type: String,
        default: () => '',
      },
    },
    data () {
      return {
      }
    },
    methods: {
      // modal 隐藏
      modalClose () {
        this.$emit('callback')
      },
    },
    async mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.modal-body{
  height 500px
  background #ffffff
  padding 15px
  overflow-y auto
}
.modal-card{
  width 630px !important
}
.card-detail{
  display flex
}
.card-item{
  width 230px
  height 133.33px
  position relative
  padding 10px
  background-size 100% 100%
  margin-right 10px
  .image-url{
    width 210px
    height 33.33px
    position absolute
    bottom 10px
    left 10px
  }
}
</style>
