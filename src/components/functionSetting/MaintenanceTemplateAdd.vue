<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2(v-if="edit == '1'") 新建模板
      h2(v-if="edit == '2'") 编辑模板
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 名称
            custom-input(v-model.trim="item.name", input-type="hasCount", placeholder="请输入模板名称", :validator="$v.item.name", error-info="模板名称必填并且小于10位")
              span(slot="countInfo") {{wordLength(item.name)}}/10
          .field.is-horizontal
            label.label 卡面
            .control.upLoad-image
              upload-pic(v-model="item.image_url", img-type="item", is-original=true)
              .picture-description 建议：尺寸1035X642，图片大小不能高于1M
          .field.is-horizontal
            label.label 状态
            .control
              .switch
                input(type="checkbox", id="status", v-model="item.enabled")
                label(for="status")
              .radio.mini-type(v-if="item.enabled") 启用
              .radio.mini-type(v-if="!item.enabled") 禁用
          .field.is-horizontal
            label.label 使用范围
            custom-select(
              v-model="classify",
              :list="classify_list",
              nameField="name")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData") 保存
          a.button.large(@click="goBack") 返回

</template>

<script>
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import FunctionSettingApi from '@/mixins/modules/FunctionSetting'


  /**
   * @vue
   */
  export default {
    /**
     * @description 添加/修改模板
     */
    name: 'maintenanceTemplateAdd',
    mixins: [validationMixin, FunctionSettingApi, fileUploader],
    components: {
      CustomInput,
      UploadPic,
      CustomSelect,
    },
    data () {
      return {
        edit: 1, // 1:新建模板；2：编辑模板；
        is_disabled: false,
        is_loading: false,
        default_img_src: '', // 默认图片
        item: {
          name: '', // 模板名称
          image_url: '', // 卡面
          enabled: true, // 1：启用；2：禁用；
        },
        classify: {
          name: '通用',
          id: 1,
        },
        classify_list: [
          {
            name: '通用',
            id: 1,
          },
          {
            name: '仅BOSS',
            id: 2,
          },
        ],
      }
    },
    methods: {
      wordLength,
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      // 新建模板操作
      inspectData () {
        this.$v.$touch()
        if (this.$v.$error) {
          return false
        }
        if (this.item.image_url === undefined) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '卡面必填',
          })
          return false
        }
        if (this.edit === 1) {
          this.addData() // 新建模板接口
        } else {
          this.editData() // 编辑模板接口
        }
      },
      // 新建模板接口
      async addData () {
        try {
          let params = {
            name: this.item.name.trim(),
            image_url: this.item.image_url,
            status: this.item.enabled ? 1 : 2,
            type: this.classify.id,
          }
          let {result, response} = await this.cardTemplateCreateApi(params)
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '新建模板成功',
              resolve: () => {
                // 返回上一级
                this.$router.go(-1)
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '新建模板失败',
              content: result.message,
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '新建模板失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      // 编辑模板接口
      async editData () {
        try {
          let params = {
            name: this.item.name.trim(),
            image_url: this.item.image_url,
            status: this.item.enabled ? 1 : 2,
            id: this.id,
            type: this.classify.id,
          }
          let {result, response} = await this.cardTemplateUpdateApi(params)
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑模板成功',
              resolve: () => {
                // 返回上一级
                this.$router.go(-1)
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑模板失败',
              content: result.message,
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑模板失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      // 模板详情接口
      async templateDetail () {
        try {
          let params = {
            id: this.id,
          }
          let {result, response} = await this.cardTemplateDetailApi(params)
          if (response.status === 200 && result.code === 0) {
            if (result.data.status === 2) {
              result.data.enabled = false
            } else {
              result.data.enabled = true
            }
            this.classify = {
              name: result.data.type === 1 ? '通用' : '仅BOSS',
              id: result.data.type,
            }
            this.item = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取模板详情失败',
              content: result.message,
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板详情失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    validations: {
      item: {
        name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 10
          },
        },
      },
    },
    mounted () {
      let edit = this.$route.query.edit
      this.edit = edit
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.templateDetail() // 模板详情接口
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .nav-back-btn
    position absolute
    top 36px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 2
  .radio + .radio
    margin-left 28px
  .picture-description
    font-size 12px
    line-height 16px
    color lightGrey
    white-space nowrap
    margin-top 8px
  .upload-pic.is-normal
    width 300px !important
    height 166px !important
    background-color gray
    display block
  .mini-type
    padding-left 7px
    font-size 13px
    color darker
    margin-right: 20px
</style>
