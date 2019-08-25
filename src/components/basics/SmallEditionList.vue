<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.is-narrow
          label.label 小程序名称
          custom-input(v-model="filterData.search_name", placeholder="小程序名称", @keyupEnter="applyFilter")
        .field.is-keyword
          label.label 所属企业
          custom-input(v-model="filterData.search_accounts", placeholder="所属企业", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 当前版本
          custom-input(v-model="filterData.version", placeholder="当前版本", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 小程序版本类型
          custom-select.w-120(v-model="filterData.type", placeholder="请选择", :list="type_list")
        .field.is-narrow
          label.label 小程序平台类型
          custom-select.w-120(v-model="filterData.open", placeholder="请选择", :list="open_list")
        .field
          label.label 提审状态
          custom-select.w-160(v-model="filterData.examine_status", placeholder="请选择", :list="status_list")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
        .field.w-80(v-if="currentUser.is_system_admin === 1")
          a.button.primary(@click="allAuditing") 全部提审
    empty-page(v-if="list.length === 0", :tip="'当前没有数据'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="10%") 小程序名称
              td(width="15%") 所属企业
              td(width="10%") 当前版本
              td(width="10%") 审核版本
              td(width="11%") 提审时间
              td(width="10%") 小程序版本类型
              td(width="10%") 小程序平台类型
              td(width="7%") 可用最高版本
              td(width="7%") 审核状态
              td(width="10%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td.textzh(v-text="item.name")
              td
                .simple-td.textzh(v-text="item.enterprise_name")
              td
                .simple-td(v-text="item.used_code_library_version")
              td
                .simple-td(v-text="item.code_library_version ? item.code_library_version : '--'")
              td
                .simple-td(v-text="item.code_library_created_at ? item.code_library_created_at : '--'")
              td
                .simple-td(v-text="item.type")
              td
                .simple-td(v-text="item.open_platform_version")
              td
                .simple-td(v-text="item.max_version")
              td.status
                .simple-td(v-text="formatStatus(item.code_library_audit_status)")
                el-popover.tips-text(placement="top-start", width="200", trigger="hover", :content="item.refused_reason", v-if="item.code_library_audit_status === 'REFUSED'")
                  .el-icon-question(slot="reference")
              td
                  a.operation-link.right(v-if="item.code_library_version.length>0 ", @click="RevokeAudit(item.account_id)") 撤审
                  a.operation-link.right(v-if="item.code_library_version.length==0 ", @click="Auditing(item.account_id)") 提审
                  a.operation-link.right(v-if="item.code_library_online_status == 'ONLINE'", @click="GoOnline(item.account_id)") 上线
                  a.operation-link.right(v-if="item.code_library_online_status == 'OFFLINE'", @click="Downline(item.account_id)") 下线
                  a.operation-link.right(@click="goCheck(item)",v-if="item.code_library_audit_status") 查看审核进度
          .tfoot(v-if="list.length > 0")
            pagination(:pagination-data="paginationData", @input="paging")
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      admin-add(@success="additionHandler",)
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import adminApi from '@/mixins/modules/basics'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import { root } from '@/plugins/Fetch'
import { mapGetters } from 'vuex'

export default {
  name: 'SmallEditionList',
  mixins: [adminApi, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    SlideOutModal,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    const schema = {
      root,
      type_list: [{ // 小程序版本类型
        id: '',
        name: '全部',
      }, {
        id: 'SHOP_SIMPLE',
        name: '保养版',
      }, {
        id: 'SHOP',
        name: '综合版',
      }],
      open_list: [{ // 小程序版本类型
        id: '',
        name: '全部',
      }, {
        id: 1,
        name: '旧平台',
      }, {
        id: 2,
        name: '新平台',
      }],
      status_list: [{ // 审核状态
        id: '',
        name: '全部',
      }, {
        id: 1,
        name: '审核中',
      }, {
        id: 2,
        name: '审核通过',
      }, {
        id: 3,
        name: '审核失败',
      }, {
        id: 4,
        name: '授权失效',
      }],
      isInitiated: true,
      filterData: {
        search_name: '',
        search_accounts: '',
        version: '',
        status: null,
        type: {
          id: '',
          name: '全部',
        },
        open: {
          id: '',
          name: '全部',
        },
        examine_status: {
          id: '',
          name: '全部',
        },
      },
      queryData: {},
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      list: [],
      slideVisible: false,
      adminStates: [
        { name: '全部', value: '' },
        { name: '启用', value: 'NORMAL' },
        { name: '禁用', value: 'LOCKED' },
      ],
      is_first_enter: false, // 是否第一次进入
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.search_name = ''
        conditions.search_accounts = ''
        conditions.status = schema.adminStates[0]
      })
    return schema
  },
  methods: {
    // 格式化审核状态
    formatStatus (statu) {
      // 审核状态（PENDING等待，AUDITING审核中，AUDITED审核完成，REFUSED拒绝')
      let text = ''
      if (statu === 'PENDING') {
        text = '等待中'
      } else if (statu === 'AUDITING') {
        text = '审核中'
      } else if (statu === 'AUDITED') {
        text = '审核完成'
      } else if (statu === 'REFUSED') {
        text = '被拒绝'
      } else {
        text = '--'
      }
      return text
    },
    // 点击查看审核进度按钮
    goCheck (item) {
      this.$router.push({
        name: 'miniProgramAuditStatus',
        query: {
          name: item.name,
          app_id: item.app_id,
          code_library_version: item.code_library_version,
        },
      })
    },
    // 全部提审
    allAuditing () {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认全部提审？',
        isRejectable: 1,
        resolve: () => {
          this.allAuditingFun()
        },
      })
    },
    async allAuditingFun () {
      try {
        const { response, result } = await this.allAuditingApi()
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    additionHandler () {
      this.slideVisible = !this.slideVisible
      this.fetchData()
    },
    // 控制模态框
    toggleSidePannel () {
      this.customer = undefined
      this.slideInspectionId = undefined
      this.slideVisible = !this.slideVisible
    },
    // 撤审
    async RevokeAudit (params) {
      try {
        const { response, result } = await this.revokeAudit({
          account_id: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 提审
    async Auditing (params) {
      try {
        const {response, result} = await this.auditing({
          account_id: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `${result.code} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `错误: ${err}`,
        })
      }
    },
    // 上线
    async GoOnline (params) {
      try {
        const { response, result } = await this.goOnline({
          account_id: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 下线
    async Downline (params) {
      try {
        const { response, result } = await this.downLine({
          account_id: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 分页处理
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 重置密码
    async resetPassword (params) {
      try {
        const { response, result } = await this.basicsResetPassword({
          id: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '重置成功，默认密码为123456',
            resolve: () => this.fetchData(),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改状态失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改状态失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
     * 获取版本库列表
     * @returns {Promise<void>}
     */
    async fetchData () {
      try {
        const { response, result } = await this.smallEditionlist({
          name: this.queryData.search_name,
          enterprise_name: this.queryData.search_accounts,
          version: this.queryData.version,
          type: this.queryData.type.id,
          open_platform_version: this.queryData.open.id,
          flag: this.queryData.examine_status.id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取管理员列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取管理员列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    applyFilter () {
      for (let key in this.filterData) {
        if (this.queryData.hasOwnProperty(key)) {
          this.queryData[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    resetFilter () {
      this.paginationData.current_page = 1
      this.filterData.enterprise_name = ''
      this.filterData.search_name = ''
      this.filterData.version = ''
      this.filterData.search_accounts = ''
      this.filterData.type = this.type_list[0]
      this.filterData.open = this.open_list[0]
      this.filterData.examine_status = this.status_list[0]
      this.filterData.status = this.adminStates[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.fetchData()
    },
  },
  mounted () {
    this.is_first_enter = true
  },
  // keep-alive 进入
  activated () {
    let save = this.$route.query.save
    if (!save || this.is_first_enter) this.resetFilter()
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
td
  vertical-align middle !important
.field
  &.is-keyword
    width 180px
  &.is-narrow
    width 120px
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  line-height 22px
.p-l-20
  padding-left 20px
.p-r-20
  padding-right 20px
.right
  margin-right 10px !important
.section-filter
  display flex
  justify-content space-between
.keyword-wrapper
  width 244px
.button
  align-items center
.give-icon
  display none
.add-icon
  display inline-flex
  width 16px
  height 16px
  background url('~@/assets/icons/button-add.svg') no-repeat center center
  background-size cover
  margin-right 6px
.td-with-tip
  position relative
  display flex
  align-items center
.help-tip-icon
  position relative
  display inline-block
  width 12px
  height 12px
  background url('~@/assets/icons/help.svg') no-repeat center center
  background-size cover
  margin-left 4px
  &:hover
    .help-tip
      display block
.help-tip
  display none
  z-index 213
  position absolute
  top 22px
  left -76px
  width 160px
  padding 4px 6px
  border-radius 2px
  background-color #121212
  color #fff
  font-size 12px
  line-height 18px
  &::after
    content ''
    position absolute
    width 8px
    height 8px
    left 50%
    top -4px
    margin-left -2px
    transform rotate(45deg)
    background-color #121212
.gray
  color #989ba1
.text-center
  text-align center
.justify-center
  justify-content center
.operation-link
  margin-right 0
.w-120
  width 120px
.w-160
  width 160px
.w-80
  width 80px
.status
  position relative
  .tips-text
    position absolute
    top 14px
    left 45px
</style>

