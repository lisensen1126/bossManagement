<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 模板名称
          custom-input(v-model="filterData.name", placeholder="请输入模板名称", @keyupEnter="applyFilter")
        .field
          label.label 模板分类
          custom-select(:list="typeList", v-model="getType")
        .field
          label.label 状态
          custom-select(:list="statusList", v-model="getStatus")
        .field
          label.label 模板归属
          custom-select(:list="sence_list", v-model="get_sence")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addMsg")
            span.add-icon
            span 新建模板
    empty-page(v-if="list.length === 0", :tip="'当前没有模板信息'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="15%") 模板名称
              td(width="8%") 模板分类
              td(width="20%") 模板内容
              td(width="6%") 状态
              td(width="6%") 模板归属
              td(width="10%") 操作人
              td(width="10%") 操作时间
              td(width="10%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.template_type_name")
              td
                .multi-content-td {{item.content}}
              td
                .status-dot(:class="{'primary': item.audit_status == -1, 'green': item.audit_status == 1, 'red': item.audit_status == 0}")
                span(v-if="item.audit_status == 0") 审核中
                span(v-if="item.audit_status == 1") 审核通过
                span(v-if="item.audit_status == -1") 审核失败
              td
                .simple-td {{item.type === 1 ? '门店' : '平台'}}
              td
                .simple-td {{item.operator_name}}
              td
                .simple-td {{item.last_updated}}
              td
                .operation-td
                  a.operation-link.right(v-if="item.audit_status != 0",@click="editMsg(item)") 编辑
                  a.operation-link.right(@click="deleteMsg(item)") 删除
      .tfoot(v-if="list.length > 0")
        pagination(:pagination-data="paginationData", @input="paging")
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      message-add(@success="additionHandler",:is-edit="isEdit",:msg-id="MsgId")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import drawApi from '@/mixins/modules/draw'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import MessageAdd from '@/components/draw/MessageAdd'

export default {
  name: 'messageTemplateList',
  mixins: [drawApi, filterTools, imageScale],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    CustomSelect,
    SlideOutModal,
    MessageAdd,
  },
  data () {
    const schema = {
      slideVisible: false, // 控制新建模板模态框显隐
      isEdit: 1, // flag,1：新建模板，2：编辑模板
      MsgId: 0, // 已选模板id
      // 默认的状态
      getStatus: {
        name: '全部',
        status: '',
      },
      // 已选模板分类初始化
      getType: {},
      // 审核状态
      statusList: [{
        name: '全部',
        status: '',
      }, {
        name: '审核中',
        status: 0,
      }, {
        name: '审核通过',
        status: 1,
      }, {
        name: '审核失败',
        status: -1,
      }],
      sence_list: [{
        name: '全部',
        id: '',
      }, {
        name: '门店',
        id: 1,
      }, {
        name: '平台',
        id: 2,
      }],
      get_sence: {
        name: '全部',
        id: '',
      },
      typeList: [], // 模板分类列表
      isInitiated: true,
      filterData: {
        name: '',
      },
      queryData: {
        name: '',
      },
      paginationData: {
        current_page: 1, // 当前页
        per_page: 20, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      list: [], // 模板列表
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.name = ''
      })
    return schema
  },
  methods: {
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    // 新建模板组件展示/隐藏
    toggleSidePannel () {
      this.slideVisible = !this.slideVisible
    },
    // 新建模板成功回调
    additionHandler () {
      this.fetchData()
      this.toggleSidePannel()
    },
    // 新建模板操作
    addMsg () {
      this.slideVisible = true
      this.isEdit = 1
    },
    // 编辑模板操作
    editMsg (item) {
      this.slideVisible = true
      this.isEdit = 2
      this.MsgId = item.id
    },
    /*
    *  删除模板操作
    *  @item 删除的对象
    * */
    deleteMsg (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认要删除该模板信息？',
        isRejectable: 1,
        resolve: () => {
          this.deleteApi(item)
        },
      })
    },
    /*
    * 删除模板接口
    * @item {Object} 删除模板的信息
    * */
    async deleteApi (item) {
      try {
        let { response, result } = await this.smsDeleteApi({
          id: item.id,
          template_id: item.template_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '删除成功',
          })
          this.fetchData() // 刷新列表
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
    /**
     * 获取短信模板列表接口
     */
    async fetchData () {
      try {
        const { response, result } = await this.smsListApi({
          name: this.queryData.name,
          template_type_id: this.getType.id,
          audit_status: this.getStatus.status,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          type: this.get_sence.id,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.last_updated = this.changeDateTime(item.last_updated)
          })
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信模板列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信模板列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
     * 获取模板分类列表接口
     */
    async fetchTypeData () {
      try {
        const { response, result } = await this.smsTypeApi({})
        if (response.status === 200 && result.code === 0) {
          this.typeList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板分类列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取模板分类列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.getStatus = {
        name: '全部',
        status: '',
      }
      this.get_sence = {
        name: '全部',
        id: '',
      }
      this.getType = {}
      this.paginationData.current_page = 1
      this.queryData.name = ''
      this.recallFilter()
      this.fetchData()
    },
    // 重置搜索数据
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
  },
  mounted () {
    this.fetchData() // 获取短信模板列表
    this.fetchTypeData() // 获取模板分类列表接口
  },
  created () {
    // 设置列表历史页数记录并重置
    this.$set(this.paginationData, 'current_page', this.$store.state.list.currentPageStorage)
    this.$store.dispatch('setCurrentPageStorage', 1)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
td,.multi-content-td{
  padding-right 10px
  vertical-align middle
}
.section-filter {
  display: flex;
  justify-content: space-between;
}
.section-layout {
  height calc(100% - 56px)
}
.right {
  margin-right: 10px !important;
}
.keyword-wrapper {
  width: 244px;
}

.button {
  align-items: center;
}
.add-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: url('~@/assets/icons/button-add.svg') no-repeat center center;
  background-size: cover;
  margin-right: 6px;
}

.gray {
  color: #989ba1;
}

.text-center {
  text-align: center;
}

.justify-center {
  justify-content: center;
}

.operation-link {
  margin-right: 0;
}
</style>
