<!--退款弹框  此次迭代去掉 万一以后能用呢，不删了，还没切完-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span 退款
        .close-button(@click="modalClose")
      .modal-body
        .form-content
          span 商品总额
          .text {{}}
        .form-content
          span 名称
          custom-input(input-type="hasUnit", need-type='float', placeholder="请输入退款金额", v-model="refund_price",)
            span(slot="unitName") 元
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import CustomInput from '@/components/generics/form/CustomInput'
  import upLoadApi from '@/mixins/utilities/fileUploader'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'ChooseBrand',
    components: {
      ModalDialog,
      CustomInput,
      UploadPic,
    },
    mixins: [ModalInteractions, upLoadApi, validationMixin, SeriesApi],
    props: {
      defaultValue: {
        type: [Object, String],
      },
    },
    validations: {
      refund_price: {
        required,
      },
    },
    data () {
      return {
        refund_price: '',
      }
    },
    methods: {
      complete () {
        this.$v.$touch()
        if (this.$v.$error) return
        if (!this.img) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '图片不能为空',
          })
          return
        }
        this.saveData(this.is_edit ? 1 : 2)
      },
      /*
      * type 是否编辑 1 编辑 2 添加
      * */
      async saveData (type) {
        let params = {
          name: this.name.replace(/(^\s*)|(\s*$)/g, ''),
          type: 2,
          img: this.img,
        }
        let text = '添加'
        if (type === 1) {
          params.id = this.defaultValue.id
          text = '编辑'
        }
        try {
          const {response, result} = type === 1 ? await this.seriesEditApi(params) : await this.seriesAddApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: text + '成功',
                resolve: () => {
                  this.modalResolve()
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: text + '出错',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: text + '出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: text + '出错',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
    },
    mounted () {
      if (this.defaultValue && this.defaultValue.name) {
        this.name = this.defaultValue.name
        this.img = this.defaultValue.img
        this.is_edit = true
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 160px
    display flex
    flex-direction column
    padding-bottom 36px
  .form-content
    display flex
    justify-content start
    padding 10px 30px
    span
      line-height 32px
      padding-right 40px
    input
      width 200px
</style>
