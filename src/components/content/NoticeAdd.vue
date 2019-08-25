<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2(v-if="edit == '1'") 新建公告
      h2(v-if="edit == '2'") 再次编辑公告
      h2(v-if="edit == '3'") 查看公告
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 公告标题
            custom-input(v-model="item.title", input-type="hasCount", maxlength=20, placeholder="请输入公告标题", :validator="$v.item.title", error-info="公告标题必填并且小于二十位", :is-disabled="edit == '3'")
              span(slot="countInfo") {{(item.title.length)}}/20
          .field.is-horizontal
            label.label 封面图片
            .control.upLoad-image
              upload-pic(v-model="item.image", img-type="item", :is-disabled="edit == '3'", is-original=true)
              .picture-description 建议尺寸900*500px，大小5M以内
          .field.is-horizontal
            label.label 摘要
            .control
              custom-textarea.textarea(placeholder="请输入公告摘要(50字以内)", maxlength=50, v-model="item.summary", :validator="$v.item.summary", error-info="请输入公告摘要", :is-disabled="edit == '3'")
          .field.is-horizontal
            label.label 内容类型
            div.type-item
              .radio(:class="{'disabled': edit == '3'}")
                input(type="radio", id="1", name="contentType", value="1", v-model="item.content_type")
                label.sepcific-setting(for="1") 公告内容
            div.type-item
              .radio(:class="{'disabled': edit == '3'}")
                input(type="radio", id="2", name="contentType", value="2", v-model="item.content_type")
                label(for="2") 外部链接
          .field.is-horizontal(v-if="item.content_type==1")
            label.label 公告内容
            .control
              .picture-description.rich-eidtor-description 建议图片宽度不小于720px
              rich-editor(v-model="item.content_first", ref="editor", :is-disabled="edit == '3'")
          .field.is-horizontal(v-if="item.content_type==2")
            label.label 外部链接
            custom-input(v-model="item.content_second", placeholder="请输入公告链接，且链接必须以http://或者https://开头", :validator="$v.item.content_second", error-info="请输入公告链接，且链接必须以http://或者https://开头", :is-disabled="edit == '3'")
          .field.is-horizontal
            label.label 版本选择
            .control
              .switch(:class="{'disabled': edit == '3'}")
                input(type="checkbox", id="m", value="1", v-model="checkedType")
                label(for="m")
              .radio.mini-type 综合版（B版）
              .switch(:class="{'disabled': edit == '3'}")
                input(type="checkbox", id="d", value="2", v-model="checkedType")
                label(for="d")
              .radio.mini-type 保养版（C版）
          .field.is-horizontal
            label.label 重要通知
            .control
              .switch(:class="{'disabled': edit == '3'}")
                input(type="checkbox", id="is_top", v-model="item.is_top")
                label(for="is_top")
              .radio.mini-type(v-if="item.is_top") 重要
              .radio.mini-type(v-if="!item.is_top") 正常
      .btn-wrapper
        .button-group
          a.button.primary.large(v-if="edit != '3'", @click="inspectData") {{edit==2?'重新发布':'发布'}}
          a.button.large(@click="goBack") 返回

</template>

<script>
import {wordLength} from '@/mixins/custom-validators/custom-validators'
import fileUploader from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import RichEditor from '@/components/generics/form/RichEditor'
import UploadPic from '@/components/generics/form/UploadPic'
import {validationMixin} from 'vuelidate'
import {required, between} from 'vuelidate/lib/validators'
import contentApi from '@/mixins/modules/Content'


/**
 * @vue
 */
export default {
  /**
   * @description 添加/修改公告
   */
  name: 'noticeAdd',
  mixins: [validationMixin, contentApi, fileUploader],
  components: {
    CustomInput,
    UploadPic,
    RichEditor,
    CustomTextarea,
  },
  data () {
    return {
      edit: 1, // 1:新建公告；2：再次编辑公告（复制加新建功能）；3：查看详情；
      is_disabled: false,
      is_loading: false,
      default_img_src: '', // 默认图片
      item: {
        title: '', // 公告标题
        image: '', // 封面图片
        summary: '', // 摘要
        content_type: 1, // 内容类型，1：公告详情；2：外链
        content: '', // 外部链接
        content_first: '', // 公告内容（content_type==1）
        content_second: '', // 外部链接（content_type==2）
        version_type: '', // 版本选择：1：综合版；2：保养版；3：二者都有
        is_top: 0, // 重要：1：正常；2：重要；
      },
      checkedType: [],
    }
  },
  methods: {
    wordLength,
    // 返回操作
    goBack () {
      this.$router.go(-1)
    },
    // 新建公告操作
    inspectData () {
      this.$v.$touch()
      if (this.$v.item.title.$error || this.$v.item.summary.$error) {
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return false
      }
      if (this.$v.$error) {
        return false
      }
      if (this.item.image === undefined) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '封面图片必填',
        })
        document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
        return false
      }
      if (this.item.content_type == 1 && !this.item.content_first) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请填写公告内容',
        })
        return false
      }
      if (this.checkedType.length <= 0) {
        this.$store.dispatch('showMessage', {
          type: 'warning',
          title: '警告',
          content: '请选择版本',
        })
        return false
      }
      if (this.checkedType.length == 2) {
        this.item.version_type = 3
      } else {
        this.item.version_type = this.checkedType[0]
      }
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认发布本次内容吗？',
        isRejectable: 1,
        resolve: () => {
          this.saveData() // 新建公告接口
        },
      })
    },
    // 新建公告接口
    async saveData () {
      try {
        let params = {
          title: this.item.title.trim(),
          image: this.item.image,
          category_id: this.classify_id,
          summary: this.item.summary.trim(),
          content_type: this.item.content_type,
          content: this.item.content_type == '1' ? this.item.content_first : this.item.content_second.trim(),
          version_type: this.item.version_type,
          is_top: this.item.is_top ? 2 : 1,
        }
        let {result, response} = await this.messageCreateApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '新建公告成功',
            resolve: () => {
              // 返回上一级
              // this.$router.go(-1)
              let classifyId = this.classify_id
              this.$router.push({
                path: `/console/content/noticeClassifyList/noticeList/${classifyId}`,
                query: {
                  save: 1,
                },
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '新建公告失败',
            content: result.message,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '新建公告失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    // 公告详情接口
    async noticeDetail () {
      try {
        let params = {
          id: this.id,
        }
        let {result, response} = await this.messageDetailApi(params)
        if (response.status === 200 && result.code === 0) {
          if (result.data.content_type == 1) {
            result.data.content_first = result.data.content
            this.$refs.editor.info(result.data.content_first)
          } else {
            result.data.content_second = result.data.content
          }
          if (result.data.version_type === 3) {
            this.checkedType = ['1', '2']
          } else if (result.data.version_type === 2) {
            this.checkedType = ['2']
          } else if (result.data.version_type === 1) {
            this.checkedType = ['1']
          }
          if (result.data.is_top === 1) {
            result.data.is_top = 0
          }
          this.item = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取公告详情失败',
            content: result.message,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取公告详情失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    let edit = this.$route.query.edit
    this.classify_id = this.$route.query.classify_id
    this.edit = edit
    if (this.$route.query.id) {
      this.id = this.$route.query.id
      this.noticeDetail() // 公告详情接口
    }
  },
  validations: {
    item: {
      title: {
        required,
        validate (val) {
          return this.wordLength(val) <= 20
        },
      },
      summary: {
        required,
        validate (val) {
          return wordLength(val) <= 50
        },
      },
      content_second: {
        validate (val) {
          if (this.item.content_type == 2) {
            return required(val) && (val.toLowerCase().indexOf('http://') > -1 || val.toLowerCase().indexOf('https://') > -1)
          } else {
            return true
          }
        },
      },
    },
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log(to.query.classify_id)
  //   next()
  // },
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
.rich-eidtor-description
  margin-bottom 8px
.field-content
  font-size: 13px
  line-height: 16px
  color: #353535
.upload-pic.is-normal
  width 300px !important
  height 166px !important
  background-color gray
  display block
.type-item
  display inline-flex
  min-width 88px
.mini-type
  padding-left 7px
  font-size 13px
  color darker
  margin-right: 20px
</style>
