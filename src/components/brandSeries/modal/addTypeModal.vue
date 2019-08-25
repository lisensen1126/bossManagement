<!--选择品牌馆弹框-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title
          span(v-if="defaultValue") 编辑
          span(v-else) 添加
          span 分类
        .close-button(@click="modalClose")
      .modal-body
        .form-content
          span 分类名称
          custom-input(v-model="name", placeholder="请输入分类名称", :validator="$v.name", error-info="名称不能为空", maxLength="15")
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
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'addTypeModal',
    components: {
      ModalDialog,
      CustomInput,
    },
    mixins: [ModalInteractions, validationMixin, SeriesApi],
    props: {
      defaultValue: {
        type: String,
      },
      defaultId: {
        type: [String, Number],
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
      }
    },
    methods: {
      complete () {
        this.$v.$touch()
        if (this.$v.$error) return
        this.saveData(this.defaultValue ? 1 : 2)
      },
      /*
      * type 是否编辑 1 编辑 2 添加
      * */
      async saveData (type) {
        let params = {
          name: this.name.replace(/(^\s*)|(\s*$)/g, ''),
          type: 1,
        }
        let text = '添加'
        if (type === 1) {
          params.id = this.defaultId
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
      if (this.defaultValue) {
        this.name = this.defaultValue
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
    height 110px
    display flex
    flex-direction column
    padding 30px 30px
  .form-content
    display flex
    justify-content start
    padding 0px
    span
      line-height 32px
      padding-right 40px
    input
      width 200px
</style>

