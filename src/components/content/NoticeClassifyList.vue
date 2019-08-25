<template lang="pug">
  .section-layout
    .page-title
      .left
      a.right.button(@click="operateDialog") 添加分类

    empty-page(v-if="!list.length", tip="暂无数据")
    // 列表
    .content-wrapper.list-wrapper(v-else)
      .table-wrapper
        table.table
            thead
              tr
                td(v-for="item in table_head_list", v-text="item.name", :width="item.width")
            tbody(v-if="list.length")
              tr(v-for="(item, i) in list")
                td {{item.title}}
                td {{item.created_at | formatDate}}
                td {{item.admin_name}}
                td {{item.number}}
                td.operation-td
                  .operation-link(@click="operateDialog(item)") 编辑
                  router-link.operation-link(:to="{name: 'noticeList', params: {id: item.id}}") 添加公告
                  .operation-link(@click="deleteClassifyBefore(item.id,i)") 删除
      pagination(:pagination-data="page_data", @input="paging")

    // 弹窗 - 添加分类
    modal-dialog(v-if="modal_dialog_flag", modal-scale="large")
      .modal-card(slot="card")
        .modal-header
          .modal-card-title {{create_classify.id? '编辑' : '添加'}}系列
          .close-button(@click="operateDialog")
        .modal-body
          .field.is-horizontal.keyword-wrapper
            label.label 系列名称：
            custom-input(v-model="create_classify.title", maxlength="10", placeholder="请输入", :validator="$v.create_classify.title", error-info="系列名称必填，10个字以内")
        .modal-footer.level
          .level-left
          .level-right
            a.button.large.primary(@click="saveNotice") 确定
            a.button.large(@click="operateDialog") 取消
</template>

<script>
import { validationMixin } from 'vuelidate'
import ContentApi from '@/mixins/modules/Content'

import { required } from 'vuelidate/lib/validators'

import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import ModalDialog from '@/components/generics/ModalDialog'
import CustomInput from '@/components/generics/form/CustomInput'
export default {
  name: 'NoticeClassifyList',
  components: { EmptyPage, Pagination, ModalDialog, CustomInput },
  mixins: [ validationMixin, ContentApi ],
  computed: {
    table_head_list () { // 表头
      return [
        { name: '公告分类名称', width: '20%' },
        { name: '发布时间', width: '20%' },
        { name: '操作人', width: '20%' },
        { name: '公告数量', width: '20%' },
        { name: '操作', width: '20%' },
      ]
    },
  },
  data () {
    return {
      modal_dialog_flag: false,
      list: [], // 列表
      page_data: null,
      create_classify: {
        id: null,
        title: null,
      },
    }
  },
  created () {
    this.content_id = this.$route.params.id
    this.resetPageData()
  },
  mounted () {
    this.fetchDataList()
  },
  methods: {
    operateDialog (notice = {}) {
      this.modal_dialog_flag = !this.modal_dialog_flag
      if (this.modal_dialog_flag) {
        this.create_classify.id = notice.id || null
        this.create_classify.title = notice.title || null
      }
    },
    resetPageData () {
      this.page_data = {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      }
    },
    // 分页跳转
    paging (state) {
      this.paginationData = state
      this.fetchDataList()
    },
    async fetchDataList () {
      try {
        const { response, result } = await this.NoticeClassifyListApi({
          page: this.page_data.current_page,
          per_page: this.page_data.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.page_data = result.meta
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表失败',
          content: `服务异常，请稍后再试（${e.message}）`,
        })
      }
    },
    saveNotice () {
      this.$v.$touch()
      if (this.$v.$error) return
      this.CUclassify()
    },
    /**
     * 公告分类 - 创建、修改
     */
    async CUclassify () {
      let _id = this.create_classify.id || null
      try {
        const { response, result } = await this[
          _id ? 'UpdateNoticeClassifyApi' : 'CreateNoticeClassifyApi']({
          id: _id,
          title: this.create_classify.title,
        })
        if (response.status === 200 && result.code === 0) {
          this.operateDialog()
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => {
              this.fetchDataList()
            },
          })
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作公告失败',
          content: `${e.message}`,
        })
      }
    },
    deleteClassifyBefore (id, index) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认删除该条内容嘛？',
        isRejectable: 1,
        resolve: () => {
          this.deleteClassify(id, index)
        },
      })
    },
    /**
     * 公告分类 - 删除
     */
    async deleteClassify (id, index) {
      try {
        const { response, result } = await this.DeleteNoticeClassifyApi({
          id: id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '删除成功',
            resolve: () => {
              this.list.splice(index, 1)
            },
          })
        } else {
          throw new Error(result.message)
        }
      } catch (e) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作公告失败',
          content: `${e.message}`,
        })
      }
    },
  },
  validations: {
    create_classify: {
      title: {
        required,
        validate (val) {
          return true
        },
      },
    }
  },
  filters: {
    formatDate (date) {
      if (date) {
        date=new Date(date*=1000)
        return `${date.getFullYear()}-${
          date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${
          date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        } ${
          date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
        }:${
          date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        }`
      }
      return ''
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.section-layout
  .page-title
    display: flex
    flex: 0 0 48px
    align-items: center
    position: relative
    padding: 0 40px
    background-color: #e8e9eb
    z-index: 8
    .left
      flex 1
      color: #353535;
      font-size: 13px;
  .right
    margin-left 16px

  .modal-card
    width 400px !important
    .modal-body
      padding 16px
      min-height 100px
      display flex
      flex-direction column
      .is-horizontal .label
        flex none
        margin-right 16px
    .modal-footer
      padding 12px 16px
      .level-left
        line-height 40px
        color #666
</style>