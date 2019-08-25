<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.is-narrow
          label.label 名称
          custom-input(v-model="filterData.search_name", placeholder="请输入名称", @keyupEnter="applyFilter")
        .field.is-keyword
          label.label 帐号
          custom-input(v-model="filterData.search_accounts", need-type='number', placeholder="请输入帐号", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 状态
          custom-select(v-model="filterData.status", :list="adminStates", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(v-if="currentUser.is_system_admin == 1", @click="toggleSidePannel")
            span.add-icon
            span 新建管理员
    empty-page(v-if="list.length === 0", :tip="'当前没有管理员'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="10%") 名称
              td(width="20%") 帐号
              td(width="10%") 角色
              td(width="10%") 状态
              td(width="20%") 创建时间
              td(width="10%") 创建人
              td(width="20%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td.textzh(v-text="item.name")
              td
                .simple-td.textzh(v-text="item.mobile")
              td
                .simple-td.textzh(v-if="item.is_system_admin ==0") 系统管理员
                .simple-td.textzh(v-if="item.is_system_admin ==1") 超级管理员
              td
                .simple-td(v-if="item.status == 'NORMAL'")
                  span 启用
                .simple-td(v-if="item.status == 'LOCKED'")
                  span 禁用
              td
                .simple-td(v-text="item.created_at")
              td
                .simple-td(v-text="item.operator_name ? item.operator_name : '--'")
              td
                .operation-td(v-if="currentUser.is_system_admin ==0") --
                .operation-td(v-if="currentUser.is_system_admin ==1")
                  a.operation-link.right(v-if="item.status === 'NORMAL'", @click="isDisable(item.id)") 禁用
                  a.operation-link.right(v-if="item.status === 'LOCKED'", @click="isOpen(item.id)") 启用
                  a.operation-link.right(@click="resetPassword(item.id)" ) 重置密码
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
import AdminAdd from '@/components/basics/AdminAdd'
import SlideOutModal from '@/components/generics/SlideOutModal'
import {root} from '@/plugins/Fetch'
import { mapGetters } from 'vuex'
export default {
  name: 'AdminList',
  mixins: [adminApi, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    SlideOutModal,
    AdminAdd,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    const schema = {
      root,
      isInitiated: true,
      filterData: {
        search_name: '',
        search_accounts: '',
        status: null,
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
        {name: '全部', value: ''},
        {name: '启用', value: 'NORMAL'},
        {name: '禁用', value: 'LOCKED'},
      ],
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
    // 禁用
    isDisable (e) {
      this.setAdminState(e)
    },
    // 启用
    isOpen (e) {
      this.setAdminState(e)
    },
    // 禁用启用函数
    async setAdminState (params) {
      try {
        const {response, result} = await this.basicsAdminState({
          id: params,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '修改状态成功',
              resolve: () => this.fetchData(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改状态成功失败',
              content: `错误: ${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改状态成功失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改状态成功失败',
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
        const {response, result} = await this.basicsResetPassword({
          id: params,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '重置成功，默认密码为123456',
              resolve: () => this.fetchData(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '重置密码失败',
              content: `错误：${result.message}`,
            })
          }
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
     * 获取管理员列表
     * @returns {Promise<void>}
     */
    async fetchData () {
      try {
        const {response, result} = await this.basicsAdminList({
          name: this.queryData.search_name,
          mobile: this.queryData.search_accounts,
          status: this.queryData.status.value ? this.queryData.status.value : '',
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
      this.filterData.search_name = ''
      this.filterData.search_accounts = ''
      this.filterData.status = this.adminStates[0]
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.fetchData()
    },
  },
  mounted () {},
  // keep-alive 进入
  activated () {
    this.resetFilter()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
td
  vertical-align middle !important
.field
  &.is-keyword
    width 300px
  &.is-narrow
    width 140px
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
</style>

