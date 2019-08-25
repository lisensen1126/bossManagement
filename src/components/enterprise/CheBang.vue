<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="toggleSidePannel")
            span.add-icon
            span 新增设备
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .content-item(v-text="customer.id")
              td
                .content-item(v-text="customer.store_name")
              td
                .content-item(v-text="customer.traffic_device_sn")
              td
                .content-item(v-text="customer.video_device_sn")
              td
                .content-item(v-text="customer.video_channel_id")
              td
                .operation-td
                  a.bian.operation-link( @click="updateEmployee(customer)") 编辑
                  a.bian.del.operation-link( @click="deletEmployee(customer.id)") 删除
      .tfoot
        pagination(:pagination-data="paginationData", @input="paging")
    empty-page.m-t-20(v-if="!(list && list.length) && isInitiated", tip="当前没有设备信息")
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      add-modal(@success="additionHandler", :id="slideInspectionId", :enterpriseName="enterpriseName", :customer="customer", :enterpriseId="enterpriseId")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import DatePicker from '@/components/generics/form/DatePicker'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import CustomInput from '@/components/generics/form/CustomInput'
  import StaffPicker from '@/components/generics/form/StaffPicker'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import enterApi from '@/mixins/modules/enterprise'
  import EmptyPage from '@/components/generics/EmptyPage'
  import AddModal from '@/components/enterprise/AddModal'
  import {root} from '@/plugins/Fetch'
  export default {
    name: 'CheBang',
    mixins: [enterApi, filterTools, imageScale],
    components: {
      CustomInput,
      StaffPicker,
      Pagination,
      DatePicker,
      SlideOutModal,
      EmptyPage,
      AddModal,
    },
    data () {
      return {
        root,
        searName: '',
        customer: undefined,
        isInitiated: true,
        enterpriseName: this.$route.query.enterpriseName,
        enterpriseId: this.$route.query.enterpriseId,
        theadConfig: [{
          name: 'ID',
          width: '100',
        }, {
          name: '门店',
          width: '300',
        }, {
          name: '车流设备 SN',
          width: '200',
        }, {
          name: '视频设备 SN',
          width: '200',
        }, {
          name: '视频设备通道号',
          width: '200',
        }, {
          name: '操作',
          width: '200',
        }],
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 15,
          last_page: 1,
          total: 0,
        },
        filterData: {
          keyword: undefined,
          saleAssistant: undefined,
        },
        token: {
          accessToken: '',
        },
        queryData: {},
        slideVisible: false,
        slideInspectionId: undefined,
      }
    },
    methods: {
      // 获取列表信息
      async fetchData () {
        try {
          const {response, result} = await this.equipmentList({
            enterprise_id: this.enterpriseId,
            page: this.paginationData.current_page,
            per_page: this.paginationData.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取设备列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取设备列表失败',
            content: `错误：${err}`,
          })
        }
      },
      // 控制模态框
      toggleSidePannel () {
        this.customer = undefined
        this.slideInspectionId = undefined
        this.slideVisible = !this.slideVisible
      },
      // 添加编辑设备成功之后的回调函数
      additionHandler () {
        this.fetchData()
        this.toggleSidePannel()
      },
      /*
      *  删除设备接口
      *  @id 设配的id
      * */
      async deleteEApi (id) {
        try {
          const {response, result} = await this.delEquipment({
            id: id,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
            })
            this.fetchData()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `错误：${err}`,
          })
        }
      },
      /*
      *  删除设备弹窗
      *  @item 设配对象
      * */
      deletEmployee (item) {
        this.$store.dispatch('showMessage', {
          title: `确认${item.is_selling ? '删除' : '删除'}该设备？`,
          content: item.is_selling ? '删除后设备将不存在' : '删除后设备将不存在',
          isRejectable: 1,
          resolve: () => this.deleteEApi(item),
        })
      },
      /*
      *  编辑设备
      *  @item 设配对象
      * */
      updateEmployee (item) {
        this.customer = item
        this.slideInspectionId = item.id
        this.slideVisible = !this.slideVisible
      },
      // 数据筛选（暂留）
      resetFilter () {
        this.resetFilterData(this.queryData)
        this.fetchData()
      },
      // 分页操作
      paging (state, evt) {
        this.paginationData = state
        // this.recallFilter()
        this.fetchData()
      },
      recallFilter () {
        this.switchFilterData(this.queryData, this.filterData)
      },
      applyFilter () {
        this.paginationData.current_page = 1
        this.switchFilterData(this.filterData, this.queryData)
        this.fetchData()
      },
    },
    mounted () {
      this.fetchData()
      // if (this.$route.params.enterpriseId) {
      //   this.enterpriseId = this.$route.params.enterpriseId
      // }
      // if (this.$route.query.enterpriseName) {
      //   let enterpriseName = this.$route.query.enterpriseName
      //   this.enterpriseName = enterpriseName
      // }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .m-t-20
    margin-top 200px
  .list-wrapper
    height 560px
  .field-group.is-horizontal
    position relative
    .field
      position absolute
      right 0
  /*.contentss
    height calc(100% - 48px)
  .table-data
    height calc(100% - 90px) !important
  .emp
    margin-top 40px
  .upc
    width 73px
    height 32px
  .content
    display flex
    justify-content start
  .pp
    position relative
  .haha
  .add-icon
  .category-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
    margin-top 8px
  .category-icon
    background-image url('~@/assets/icons/button-catrgory.svg')
  .page-selector
    label
      z-index 5
  .right-box
    display flex
    position absolute
    bottom 20px
    right 30px
  .xi
    align-self flex-end
  .bian
    height 16px
    font-size 13px
    font-family:MicrosoftYaHei
    color rgba(47,171,221,1)
    line-height 16px
    padding-right 17px
    margin-right 0
  .del
    padding-left 17px
    color rgba(235,78,56,1) !important
    border-left 1px solid rgba(0,0,0,0.08)
  .button
    padding 0 10px
  .username
    line-height 36px
  .button-import:hover a
    position relative
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.05);
    color: #121212;
    top: -1px;
  .subFile
    width 74px
    height 32px
    position absolute
    top 0
    left 0
    opacity 0
  .position-relative
    position relative*/
</style>
