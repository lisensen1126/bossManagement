<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span(v-if="is_edit") 编辑
          span(v-else) 添加
          span SPU
        .close-button(@click="modalClose")
      .modal-body
        .form-content
          span 名称
          custom-input(v-model="name", placeholder="请输入spu名称", :validator="$v.name", error-info="名称不能为空", maxLength="15")
        .form-content
          span 图片
          upload-pic(v-model="img", img-type="img", :img-id="1")
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
        default: {
          name: '',
          img: '',
        },
      },
    },
    validations: {
      name: {
        required,
      },
    },
    data () {
      return {
        name: '',
        img: '',
        is_edit: false,
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
    height 230px
    display flex
    justify-content space-between
    flex-direction column
    padding 30px 30px
  .form-content
    display flex
    justify-content start
    span
      line-height 32px
      padding-right 40px
    input
      width 200px
</style>


