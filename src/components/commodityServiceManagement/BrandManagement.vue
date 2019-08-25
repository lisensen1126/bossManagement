<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="showAddModel(false)")
            span.add-icon
            span 添加品牌
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody
            tr(v-for="item in list")
              td
                .simple-td.max-200(v-text="item.brand_name")
              td
                .simple-td(v-text="item.english_name")
              td
                .multi-content-td.has-image
                  .left-image.round
                    img(:src="item.brand_logo")
              td
                .multi-content-td.textzh(v-text="item.content")
              td
                .operation-td
                  a.operation-link(@click="showAddModel(item)") 编辑
                  a.operation-link(@click= "delBrand(item)") 删除
      .tfoot
        pagination(:pagination-data="paginationData", @input="paging")
    // 空页面
    empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有品牌信息")
    // 编辑新增组件（模态框）
    slide-out-modal(v-if="slideVisible", @input="showAddModel")
      brand-add(@success="addSuccess" :isEdit="isEdit")
</template>

<script>
import ShopCategoryPicker from '@/components/generics/form/ShopCategoryPicker'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import SlideOutModal from '@/components/generics/SlideOutModal'
import BrandAdd from '@/components/commodityServiceManagement/BrandAdd'
import bossMixin from '@/mixins/modules/boss' // 接口文件
import EmptyPage from '@/components/generics/EmptyPage' // 空页面组件
export default {
  name: 'brandManagement',
  mixins: [bossMixin],
  components: {
    ShopCategoryPicker,
    CustomInput,
    CustomSelect,
    Pagination,
    SlideOutModal,
    BrandAdd,
    EmptyPage,
  },
  data () {
    const schema = {
      isEdit: '',
      theadConfig: [
        {
          name: '品牌名称',
          width: '20%',
        },
        {
          name: '英文名称',
          width: '20%',
        },
        {
          name: '品牌Logo',
          width: '10%',
        },
        {
          name: '品牌介绍',
          width: '40%',
        },
        {
          name: '操作',
          width: '10%',
        },
      ],
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      slideVisible: false,
      isInitiated: false,
    }
    // [schema.filterData, schema.queryData].forEach(conditions => {
    //   conditions.role_name = schema.roleNameList[0]
    //   conditions.position = schema.positionList[0]
    //   conditions.status = schema.statusList[0]
    // })
    return schema
  },

  methods: {
    // 删除
    delBrand (item) {
      this.$store.dispatch('showMessage', {
        title: '确认删除品牌？',
        isRejectable: 1,
        resolve: () => {
          this.delData(item.brand_id)
        },
      })
    },
    /*
    * 删除接口
    * id int SPUid
    * */
    async delData (id) {
      try {
        const {response, result} = await this.delBrandApi({
          brand_id: id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              title: '删除成功!',
              autoClose: true, // 控制弹框自动消失
              type: 'success',
            })
            this.fetchData()
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
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    paging (state) {
      this.paginationData = state
      // this.recallFilter()
      this.fetchData()
    },

    // 显示品牌添加模态框
    showAddModel (item) {
      if (item) {
        this.isEdit = item
      } else {
        this.isEdit = ''
      }
      this.slideVisible = !this.slideVisible
    },

    // 新增或者编辑成功后的回调函数
    addSuccess () {
      this.fetchData()
      this.slideVisible && (this.slideVisible = !this.slideVisible)
    },

    // 品牌列表信息
    async fetchData () {
      try {
        const { response, result } = await this.brandList({
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          is_page: 1,
          source_type: 1,
        })
        if (response.status === 200) {
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /* resetFilter () {
        this.queryData.keyword = ''
        this.queryData.role_name = this.roleNameList[0]
        this.queryData.position = this.positionList[0]
        this.queryData.status = this.statusList[0]
        this.queryData.store = undefined
        this.recallFilter()
        // this.fetchData()
      },*/
  },
  mounted () {
    this.fetchData()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';

td {
  vertical-align: middle !important;
}

.keyword-wrapper {
  width: 240px;
}

.staff-wrapper {
  width: 120px;
}
.max-200{
  max-width 200px !important
}
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 40px;
}

.field-group.is-horizontal {
  position: relative;

  .field {
    position: absolute;
    right: 0;
  }
}
</style>
