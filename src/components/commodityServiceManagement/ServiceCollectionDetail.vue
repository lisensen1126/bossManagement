<template lang="pug">
  .section-layout
    .content-wrapper
      h2 服务详情
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 服务名称
            span.content-txt(v-text="item.product_name")
          .field.is-horizontal
            label.label 服务图示
            open-image(v-if="item.product_pic",img-type="1",:img-url="item.product_pic",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="0", border-radius="5")
          .field.is-horizontal
            label.label 服务分类
            span.content-txt(v-text="category_data")
          .field.is-horizontal
            label.label 建议价格
            .content-txt(v-if="item.sell_price === 0") - -
            .content-txt(v-else) ￥{{item.sell_price / 100}}
          .field.is-horizontal
            label.label 服务简述
            .control
              span.content-txt(v-if="item.summary === ''") - -
              span.content-txt(v-else) {{item.summary}}
          .field.is-horizontal
            label.label 服务详情
            .content-txt(v-if="item.content.length === 0") - -
            .control.image-wrapper(v-else)
              img.img-detail(v-for="(cell, index) in item.content",:src="item.content[index]")
      .btn-wrapper
        .button-group
          a.button.large(@click="goBack") 返回

</template>

<script>
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import RichEditor from '@/components/generics/form/RichEditor'
  import UploadPic from '@/components/generics/form/UploadPic'
  import UploadImgBox from '@/components/generics/form/UploadImgModel'
  import bossApi from '@/mixins/modules/boss'
  import imageScale from '@/mixins/utilities/imageScale'
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import OpenImage from '@/components/generics/OpenImage'


  /**
   * @vue
   */
  export default {
    /**
     * @author caihaotian
     * @description 添加/修改服务
     */
    name: 'ServiceCollectionDetail',
    mixins: [bossApi, imageScale],
    components: {
      CustomInput,
      UploadPic,
      RichEditor,
      CustomSelect,
      UploadImgBox,
      uploadImgModel,
      OpenImage,
    },
    data () {
      return {
        service_id: this.$route.query.id,
        new_pic: '',
        isDisabled: false,
        isLoading: false,
        showSelector: false,
        category_data: '',      // 这个变量是页面分类字段 不要问我为什么这么做  F12
        // 默认图片
        defaultImgSrc: '',
        categoryList: [],
        item: {
          product_name: '', // 名称
          category: [], // 分类
          content: [], // 服务详情
          product_pic: '', // 服务图示
          summary: '',
          sell_price: '',
        },
      }
    },
    methods: {
      wordLength,
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      // 获取服务详情
      async getData () {
        try {
          const {response, result} = await this.serviceDetail({product_id: this.service_id})
          if (response.status === 200 && result.code === 0) {
            // result.data.content = []
            this.item = result.data
            this.category_data = result.data.category_merge[0]
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务详情失败',
              content: '获取服务详情发生错误，请稍后再试',
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务详情失败',
            content: `服务异常，请稍后再试（${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .service-status
    padding-left 7px
    font-size 13px
    color darker
  .radio + .radio
    margin-left 28px

  .picture-description
    font-size 12px
    line-height 16px
    color lightGrey
    white-space nowrap
    margin-top 8px

  .rich-eidtor-description
    margin-bottom 8px

  .service-categroy-picker
    width 100%
  .field-content
    font-size: 13px
    line-height: 16px
    color: #353535
  .content-txt
    font-size 12px
    line-height 16px
  .img-detail
    display block
    width 375px
    height auto
  .is-normal
    width 88px
    height 88px
    .imghead
      width 88px !important
      height 88px !important
      border-radius 4px !important
</style>
