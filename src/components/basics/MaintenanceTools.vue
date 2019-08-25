<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="toggleSideVideo")
            span.add-icon
            span 视频链接生成

    empty-page(v-if="list.length === 0", :tip="'当前没有视频'")
    loading(v-if="is_loading")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 操作人姓名
              td(width="200") 操作时间
              td(width="300") 视频地址
              td(width="300") 备注
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in list", :key="index")
              td
                .simple-td.textzh(v-text="item.operator")
              td
                .simple-td.textzh(v-text="formateDate(item.created_at, true)")
              td.copy-box
                .simple-td.textzh(v-text="item.video_url")
                textarea(class="input", v-model="item.video_url", ref="input")
              td
                .simple-td.textzh(v-text="item.describe ? item.describe : '--'")
              td
                a.operation-link.right(@click="copyAddress(item.video_url, index)") 复制地址
          .tfoot(v-if="list.length > 0")
            pagination(:pagination-data="paginationData", @input="paging")

    slide-out-modal(v-if="slideVisible", @input="toggleSideVideo")
     .slide-layout 
      .cus-box
        .slide-title 添加视频
          .field-group.is-horizontal
          .field
            label.label 备注
            custom-textarea.textarea(maxlength=100, v-model="info.describe", :validator="$v.info.describe", error-info="最多输入30字符",)
          .field-group.is-horizontal
          .field
            label.label 请选择视频

            //- 不直接上传
            el-upload(ref="upload", :action="root", :file-list="fileList", :auto-upload="false",  :before-upload="beforeAvatarUploadVideo", :on-success="handleAvatarSuccessVideo", :on-error="avatarUploadOnErrorVideo", accept="video/*", name="video", :data="info", :limit="1", :with-credentials="true", :on-change="beforeAvatarChangeVideo")
              el-button(slot="trigger", size="small", type="primary") 选取文件
              el-button(style="margin-left: 10px;", size="small", type="success", @click="submitUpload") 上传到服务器
              

            //- 直接上传
            //- el-upload(:action="root", :show-file-list="false", :on-success="handleAvatarSuccessVideo", :on-error="avatarUploadOnErrorVideo", accept="video/*", name="video", :before-upload="beforeAvatarUploadVideo", :with-credentials="true")
            //-   div(class="upload-box")
            //-     span(class="add-icon")
</template>

<script type="text/ecmascript-6">
import EmptyPage from '@/components/generics/EmptyPage'
import Loading from '@/components/generics/Loading'
import SlideOutModal from '@/components/generics/SlideOutModal'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import Pagination from '@/components/generics/Pagination'
import { root } from '@/plugins/Fetch'
import adminApi from '@/mixins/modules/basics'
import formateDate from '@/mixins/utilities/formateDate'
import { validationMixin } from 'vuelidate'
import { wordLength } from '@/mixins/custom-validators/custom-validators'
export default {
  name: '',
  mixins: [adminApi, formateDate, validationMixin],
  components: {
    EmptyPage,
    SlideOutModal,
    Pagination,
    Loading,
    CustomTextarea,
  },
  validations: {
    info: {
      describe: {
        validate (val) {
          return val.length <= 30
          // return wordLength(val) <= 30
        },
      }
    },
  },
  data () {
    return {
      wordLength,
      root: `${root}/common/upload_video`, // 上传的地址
      slideVisible: false, // 是否展示侧边栏
      list: [], // 视频列表
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      is_loading: false, // 是否显示小车车
      fileList: [], // 上传的商品列表
      info: { describe: '' }, // 备注
      is_submit: false, // 能否提交
    }
  },
  methods: {
    // 添加视频侧栏
    toggleSideVideo () {
      this.slideVisible = !this.slideVisible
    },
    // 开始上传
    submitUpload () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      this.$refs.upload.submit()
    },
    beforeAvatarChangeVideo (file, fileList) {
      if (file.status === 'ready') {
        if (
          file.raw.type === 'image/jpeg' ||
          file.raw.type === 'image/png' ||
          file.raw.type === 'image/gif'
        ) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传失败',
            content: '格式不正确',
          })
          this.is_submit = false
          return false
        }
        let size = file.size / 1024 / 1024
        if (size > 10) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '上传失败',
            content: '视频文件大小不能超过 5M',
          })
          this.fileList = []
          this.is_submit = false
          return false
        }
        this.is_submit = true
      }
    },
    /**
     * @method
     * @description 上传视频前
     */
    beforeAvatarUploadVideo (file) {
      if (!this.is_submit) {
        return false
      }
      this.is_loading = true
    },
    /**
     * @method
     * @description 上传成功 video
     */
    handleAvatarSuccessVideo (res, file) {
      if (res.code === 0) {
        this.$store.dispatch('showMessage', {
          autoClose: true, // 控制弹框自动消失
          type: 'success',
          title: '上传成功',
        })
        this.slideVisible = false
        this.fetchData()
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '上传失败',
          // content: '格式不正确',
        })
      }
      this.info.describe = ''
      this.is_submit = false
      this.is_loading = false
    },
    /**
     * @method
     * @description 上传失败
     */
    avatarUploadOnErrorVideo (res) {
      this.$store.dispatch('showMessage', {
        type: 'failure',
        title: '上传失败',
        // content: '格式不正确',
      })
      this.is_loading = false
    },
    // 复制地址
    copyAddress (address, index) {
      let input = this.$refs.input
      input[index].select()
      document.execCommand('copy') // 执行浏览器复制命令
      this.$store.dispatch('showMessage', {
        autoClose: true, // 控制弹框自动消失
        type: 'success',
        title: '复制成功',
      })
    },
    // 分页处理
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 获取视频列表
    async fetchData () {
      try {
        const { response, result } = await this.getVideoListApi({
          page: this.paginationData.current_page,
          limit: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取视频列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取视频列表失败',
          content: `${err}`,
        })
      }
    },
  },
  mounted () {
    this.fetchData()
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.button
  align-items center
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 40px
.upload-box
  display flex
  justify-content center
  align-items center
  margin-top 20px
  width 100px
  height 100px
  background #fbfdff
  border 1px dashed #c0ccda
  border-radius 6px
  &:hover
    border 1px dashed #ffbb29
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
.copy-box
  position relative
  .input
    position absolute
    top 0
    left 0
    opacity 0
    z-index -10
</style>
