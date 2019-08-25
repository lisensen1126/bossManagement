<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 文章添加
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 文章标题
            custom-input(v-model="info.title", maxlength=20, placeholder="请输入文章名称", :validator="$v.info.title", error-info="名称不能为空")
          .field.is-horizontal
            label.label 文章描述
            textarea.textarea(v-model="info.description", maxlength=20, placeholder="请输入文章描述")
          .field.is-horizontal
            label.label 文章分类
            custom-select(v-model="select_classify", :list="select_list", :validator="$v.select_classify", error-info="请选择文章分类")
          .field.is-horizontal
            label.label 封面图
            upload-pic(v-model="info.cover", img-type="info.cover", :img-id="1")
          .field.is-horizontal
            label.label 是否发布
            .switch
              input(type="checkbox", :id="1", v-model="info.is_status")
              label(:for="1")
          .field.is-horizontal
            label.label 文章正文
            .control
              rich-editor(v-model="info.content", ref="editor")
              //- u-editor(v-model.sync="info.content" ref="editor")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
</template>

<script>
  import Api from '@/mixins/modules/Content'
  import upLoadApi from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import UploadPic from '@/components/generics/form/UploadPic'
  import RichEditor from '@/components/generics/form/RichEditor'
  // import UEditor from '@/components/generics/form/UEditor'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import Utils from '@/mixins/utilities/utils'
  import SupportApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'ContentAdd',
    mixins: [validationMixin, Api, SupportApi, upLoadApi, Utils],
    components: {
      CustomInput,
      CustomSelect,
      uploadImgModel,
      UploadPic,
      RichEditor,
      // UEditor,
    },
    data () {
      return {
        info: {
          title: '',
          cover: '',
          description: '',
          content: '',
          is_status: false,
        },
        type: '',
        brand: null,
        brand_list: [],
        select_list: [],
        select_classify: null,
        show_choose_goods: false,
      }
    },
    watch: {
      'info.title': function (val, oldval) {
        this.info.title = val.trim()
      },
      'info.description': function (val, oldval) {
        this.info.description = val.trim()
      },
      'info.content': function (val, oldval) {
        this.info.content = val.trim()
      },
    },
    methods: {
      // 返回
      goBack () {
        this.$router.go(-1)
      },
      // 验证数据
      validateData () {
        let _this = this
        let pass = true
        if (!_this.info.cover) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '封面图不能为空',
          })
          pass = false
          return pass
        }
        if (!_this.info.description) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '文章描述不能为空',
          })
          pass = false
          return pass
        }
        if (!_this.info.content) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '文章正文不能为空',
            // autoClose: true,
          })
          pass = false
          return pass
        }
        if (this.info.content) {
          let str = this.info.content.replace(/\s+/g, '')
          if (str === '<p></p>') {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '文章正文不能输入空格',
            })
            return
          }
        }
        return pass
      },
      // 保存数据
      async saveData () {
        let _this = this
        _this.$v.$touch()
        if (_this.$v.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return
        }
        // 验证数据
        let res = this.validateData()
        if (!res) {
          return false
        }
        let params = {
          category_id: this.select_classify.id,
          type: this.type,
          name: this.info.title,
          description: this.info.description,
          cover: this.info.cover,
          content: this.info.content,
          status: this.info.is_status ? 1 : 2,
        }
        try {
          const {response, result} = await _this.addContentApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存成功',
                resolve: () => {
                  // 返回上一级
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '保存内容出错',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存内容出错',
              content: `出错啦！错误码：${response.status}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存内容出错',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      /**
       * 删除关联商品
       * @id 要删除的关联商品的id
       */
      deletePro (id) {
        this.info.product.splice(this.info.product.findIndex(item => item.product_id === id), 1)
      },
      getContent (params, id) {
        this.info.product = params
      },
      async getClassifyList () {
        try {
          const { response, result } = await this.brandCategoryListApi({
            type: this.type,
            page: 1,
            size: 1000,
          })
          if (result.code === 0 && response.status === 200) {
            this.select_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取文章列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '分类列表')
        }
      },
    },
    mounted () {
      this.type = this.$route.query.type
      this.getClassifyList()
    },
    validations: {
      info: {
        title: {
          required,
        },
      },
      select_classify: {
        required,
      },
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
  label.label
    font-size 13px
  .upload-pic
    width 88px
    height 88px
    margin-right 8px
  .long-field
    width 750px !important
  .goods-item
    border: 1px solid #c2c2c2
    padding 8px 10px
    border-radius 5px
    float left
    margin-right 15px
    display flex
    justify-content space-between
    align-items center
    width 300px
    margin-bottom 10px
    .img
      width 50px
      height 50px
      img
        width 100%
        height 100%
    .pro-name
      font-size 13px
      width 180px
      color #333
    .delete-btn
      font-size 13px
      color red
</style>

