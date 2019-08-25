<template lang="pug">
  .section-layout
    add-classify(v-if="show_add", v-model="show_add" @resolve="getName", :default-value="show_name", :default-id="show_id", :type="type_status.type")
    prior-conditions
      service-tab(v-model="type_status", :tabs="content_type", :have-icon="false", :have-quantity="false", @input="changeType")
    .section-filter.is-horizontal.section-filter-none(stype="height: 34px")
      span.add-button(@click="addItem()")
    empty-page(v-if="!(list && list.length)", tip="当前没有文章分类")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table(style="padding-bottom: 36px;")
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td(v-if="!item.updated_at") --
                .simple-td(v-else, v-text="formateDate(item.updated_at, true, 2)")
              td
                .simple-td {{item.operator}}
              td
                .operation-td
                  a.operation-link(@click="editName(item)") 编辑
                  a.operation-link(@click="deleteItem(index)") 删除
        .tfoot(v-if="list.length")
          pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import PriorConditions from '@/components/generics/PriorConditions'
  import ServiceTab from '@/components/generics/ServiceTab'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import SupportApi from '@/mixins/modules/SeriesSupport'
  import FormateDate from '@/mixins/utilities/formateDate'
  import AddClassify from '@/components/brandSupport/modal/AddContentClassify'
  import filterTools from '@/mixins/utilities/filterTools'
  export default {
    name: 'brandSupportList',
    mixins: [SupportApi, FormateDate, filterTools],
    components: {
      PriorConditions,
      ServiceTab,
      EmptyPage,
      CustomInput,
      AddClassify,
      Pagination,
    },
    data () {
      return {
        show_name: '',
        show_add: false,
        show_id: '',
        showImg: false,
        imgsrc: '',
        // 搜索对象
        filterData: {
          keyword: '',
        },
        type_status: {
          type: 1,
          name: '培训',
        },
        content_type: [
          {
            type: 1,
            name: '培训',
          },
          {
            type: 2,
            name: '案例分享',
          },
          {
            type: 3,
            name: '促销通知',
          },
        ],
        theadConfig: [
          {
            name: '文章分类名称',
            width: '160',
          },
          {
            name: '发布时间',
            width: '150',
          },
          {
            name: '操作人',
            width: '80',
          },
          {
            name: '操作',
            width: '200',
          }],
        list: [],
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        setting_id: '',
        index: '',
        query_data: {},
        is_first_enter: false, // 是否第一次进入页面
        is_back: false, // 是否返回
      }
    },
    methods: {
      getName () {
        this.getList()
      },
      // 编辑分类
      editName (item) {
        this.show_add = true
        this.is_edit = true
        this.show_name = item.name
        this.show_id = item.id
      },
      addItem () {
        this.show_name = ''
        this.show_id = ''
        this.is_edit = false
        this.show_add = true
      },
      // 删除
      deleteItem (index) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该文章分类？',
          isRejectable: 1,
          resolve: () => {
            this.delData(this.list[index].id)
          },
        })
      },
      /*
      * 删除接口
      * id int SPUid
      * */
      async delData (id) {
        try {
          const {response, result} = await this.delBrandCategoryApi({
            id: id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                title: '删除成功!',
                autoClose: true, // 控制弹框自动消失
                type: 'success',
              })
              this.getList()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '删除失败',
                content: `出错了:${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          console.error(err, '删除')
        }
      },
      // 分页
      paging (state) {
        this.paginationData = state
        this.getList()
      },
      search () {
        this.paginationData.current_page = 1
        this.getList()
      },
      reset () {
        this.changeType()
      },
      changeType () {
        this.$set(this.paginationData, 'current_page', 1)
        this.filterData = {
          keyword: '',
        }
        this.query_data = JSON.parse(JSON.stringify(this.filterData))
        this.getList()
      },
      async getList () {
        try {
          const { response, result } = await this.brandCategoryListApi({
            type: this.type_status.type,
            page: this.paginationData.current_page,
            size: this.paginationData.per_page,
          })
          if (result.code === 0 && response.status === 200) {
            this.list = result.data
            result.meta.current_page = result.meta.current_page - 0
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取文章列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取文章列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      goEdit (item) {
        sessionStorage.setItem('type_status', JSON.stringify(this.type_status))
        this.$router.push({
          name: 'editbrand',
          query: {
            type: this.type_status.type,
            id: item.id,
          },
        })
      },
      createContent () {
        sessionStorage.setItem('type_status', JSON.stringify(this.type_status))
        this.$router.push({
          name: 'addcontent',
          query: {
            type: this.type_status.type,
          },
        })
      },
    },
    mounted () {
      let typeStatus = sessionStorage.getItem('type_status')
      if (typeStatus) {
        this.type_status = JSON.parse(typeStatus)
        sessionStorage.setItem('type_status', '')
      }
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .section-filter-none{
    height 34px !important
  }
  .list-wrapper {
    padding-bottom 0px !important
  }
  .img-cover{
    width 36px
    height 36px
    border-radius 2px
  }
  .bottom-image {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 4px;

    img {
      height: 100%;
      width: 100%;
    }
  }
  .money{
    width: 82px;
    height:36px;
  }
  .fccc {
    width: 100px;
    height: 200px;
    background: red;
  }

  .bigImg {
    z-index: 9999;
  }
  .section-filter {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .margin {
    margin: 0 8px;
    font-size: 14px;
  }
  .simple-td{
    max-width 200px
  }
</style>
