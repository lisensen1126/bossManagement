<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.name_keyword", placeholder="管理员名称/账号", @keyupEnter="applyFilter")
        .field
          label.label 管理员类型
          custom-select(v-model="type" ,:list="typeList")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addInfo")
            span.add-icon
            span 添加管理员
    empty-page(v-if="list.length === 0", :tip="'当前没有管理员'")
    .content-wrapper.list-wrapper(v-if="list.length>0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 管理员名称
              td(width="100") 账号
              td(width="50") 管理员类型
              td(width="120") 所属门店
              td(width="50") 状态
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td
                .simple-td(v-text="item.mobile")
              td
                .simple-td(v-if="item.role_name === 'STORE_ADMIN'") 门店管理员
                .simple-td(v-if="item.role_name === 'SYSTEM_ADMIN'") 系统管理员
              td
                .simple-td(v-text="item.role_name === 'STORE_ADMIN' && item.store_name ? item.store_name : '--'")
              td
                .simple-td(v-if="item.status === 'LOCKED'") 禁用
                .simple-td(v-if="item.status === 'NORMAL'") 启用
              td
                .operation-td
                  a.operation-link.left(v-if="item.status === 'NORMAL'", @click="disable(item.id)") 禁用
                  a.operation-link.left(v-if="item.status === 'LOCKED'", @click="able(item.id)") 启用
                  a.operation-link.left(@click="editInfo(item)") 编辑
                  a.operation-link.left(@click="resetPassWordFnc(item.id)") 重置密码
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      add-admin(v-if="addModalShow", :edit-item="editItem", @success="additionHandler",)
      edit-admin(v-if="editModalShow", :edit-item="editItem", @success="additionHandler",)
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import Pagination from '@/components/generics/Pagination'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import CustomSelect from '../generics/form/CustomSelect'
  import AddAdmin from '@/components/enterprise/AddAdmin'
  import EditAdmin from '@/components/enterprise/EditAdmin'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import EnterApi from '@/mixins/modules/enterprise'

  export default {
    name: 'Administration',
    mixins: [filterTools, imageScale, EnterApi],
    components: {
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
      AddAdmin,
      EditAdmin,
      SlideOutModal,
    },
    data () {
      const schema = {
        isInitiated: false,
        type: {},
        typeList: [
          {
            status: '',
            name: '全部',
          },
          {
            status: 'SYSTEM_ADMIN',
            name: '系统管理员',
          },
          {
            status: 'STORE_ADMIN',
            name: '门店管理员',
          },
        ],
        filterData: {
          name_keyword: '',
        },
        queryData: {
          name_keyword: '',
        },
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 2,
          total: 0,
        },
        list: [],
        slideVisible: false,
        addModalShow: false,
        editModalShow: false,
        slideInspectionId: undefined,
        enterpriseId: undefined,
        editItem: null, // 编辑传参 item
      }
        // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.name_keyword = ''
      })
      return schema
    },
    methods: {
      additionHandler () {
        this.slideVisible = !this.slideVisible
        this.fetchData()
      },
      // 禁用
      disable (e) {
        this.setAdminState(e)
      },
      // 启用
      able (e) {
        this.setAdminState(e)
      },
      // 搜索
      applyFilter () {
        this.paginationData.current_page = 1
        this.switchFilterData(this.filterData, this.queryData)
        this.fetchData()
      },
      // 分页
      paging (state) {
        this.paginationData = state
        this.recallFilter()
        this.fetchData()
      },
      // 新增
      addInfo () {
        this.editItem = null
        this.customer = undefined
        this.addModalShow = true
        this.editModalShow = false
        this.slideInspectionId = undefined
        this.toggleSidePannel()
      },
      // 控制模态框
      toggleSidePannel () {
        this.slideVisible = !this.slideVisible
      },
      /*
      * 编辑
      * item 管理员对象
      * */
      editInfo (item) {
        this.editItem = item
        this.addModalShow = false
        this.editModalShow = true
        this.toggleSidePannel()
      },
      /*
      * 重置密码
      * id 管理员id
      * */
      async resetPassWordFnc (id) {
        try {
          const {response, result} = await this.resetPassWord({
            id: id,
            password: '123456',
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '重置成功，默认密码为123456',
              resolve: () => this.fetchData(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改状态失败1',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改状态失败2',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取数据
      async fetchData () {
        try {
          const {response, result} = await this.adminList({
            enterprise_id: this.enterpriseId,
            name: this.queryData.name_keyword,
            role_name: this.type.status || '',
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
      // 禁用启用函数
      async setAdminState (params) {
        try {
          const {response, result} = await this.adminState({
            id: params,
          })
          if (response.status === 200) {
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
      resetFilter () {
        this.paginationData.current_page = 1
        this.queryData.name_keyword = ''
        this.type = {}
        this.recallFilter()
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.queryData, this.filterData)
      },
    },
    mounted () {
      this.enterpriseId = this.$route.query.enterpriseId
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'

  .section-filter
    display flex
    justify-content space-between
  .name_keyword-wrapper
    width 244px
  .button
    align-items center
  .give-icon
    display none
  .left
    margin-right 10px !important
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

