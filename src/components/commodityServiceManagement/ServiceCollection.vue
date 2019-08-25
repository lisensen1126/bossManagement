<template lang="pug">
    .section-layout
        .section-filter.is-horizontal
            .field-group.is-horizontal
                //- .field.is-narrow
                //-     label.label 全部分类
                //-     custom-select(v-model="filterData.serviceCategory", @input="serviceCategoryBindingChange", :list="categoryList", name-field="category_name")
                .field.is-narrow
                  label.label 全部分类
                  custom-select(v-model="filterData.firstState", :list="firstClassList", nameField="category_name")
                .field.is-narrow
                  custom-select(v-model="filterData.secondState", :list="secondClassList", nameField="category_name")
                .field.is-keyword
                    label.label 关键字搜索
                    custom-input(v-model="filterData.keyword", placeholder="请输入服务名称", @keyupEnter="applyFilter")
                .field
                    a.button.primary(@click="applyFilter") 搜索
                .field
                    a.button(@click="resetFilter") 重置
        empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有服务'")
        .content-wrapper.list-wrapper(v-if="list && list.length")
            .table-wrapper
                table.table
                    thead
                        tr
                            td(width="120") 服务名称
                            td(width="120") 服务分类
                            td(width="150") 所属地区
                            td(width="120") 门店
                            td(width="120") 添加日期
                            td(width="120") 操作
                    tbody(v-if="list.length")
                        tr(v-for="(item, index) in list")
                            td
                                .simple-td.has-image
                                    .left-image
                                        img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                                    .content-item(v-text="item.product_name")
                            td
                                .simple-td(v-text="item.category_data[0]")
                            td
                                .simple-td {{item.province_name}}-{{item.city_name}}-{{item.district_name}}
                            td
                                .simple-td(v-text="item.store_name")
                            td
                                .simple-td(v-text="formateDate(item.created_at)")
                            td
                                .operation-td
                                    span.operation-link( @click="createService(item.product_id)") 查看
                                    //- span.operation-link( @click="addServiceStore(item.product_id)") 添加到服务库
            .tfoot(v-if="list.length")
                pagination(:pagination-data="paginationData", @input="paging")
        select-class(v-model="itemSelectorClass", v-if="itemSelectorClass", @resolve="itemSelectorResolve", :id="nowId")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import SelectClass from '@/components/generics/SelectorClass'
import Pagination from '@/components/generics/Pagination'
import enterpriseApi from '@/mixins/modules/enterprise'
import EmptyPage from '@/components/generics/EmptyPage'
import ServiceCategoryPicker from '@/components/generics/form/ServiceCategoryPicker'
import imageScale from '@/mixins/utilities/imageScale'
import filterTools from '@/mixins/utilities/filterTools'
import formateDate from '@/mixins/utilities/formateDate'

export default {
  name: 'ServiceCollection',
  mixins: [enterpriseApi, filterTools, imageScale, formateDate],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    ServiceCategoryPicker,
    filterTools,
    SelectClass,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      nowId: undefined,
      itemSelectorClass: null,
      categoryList: [],
      firstClassList: [],
      secondClassList: [],
      filterData: {
        firstState: null,
        secondState: null,
        keyword: '',
      },
      queryData: {},
      list: [],
      sellingStates: [
        { name: '全部', value: 'ALL' },
        { name: '已启用', value: true },
        { name: '已禁用', value: false },
      ],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      is_first_enter: false, // 是否第一次进入
    }
      // initialize conditions
      ;[schema.filterData, schema.queryData].forEach(conditions => {
        conditions.keyword = ''
        conditions.selectedSellingState = schema.sellingStates[0]
      })
    return schema
  },
  methods: {
    // 获取服务列表数据
    async fetchData () {
      let currentId = ''
      if (this.queryData.secondState && this.queryData.secondState.category_id) {
        currentId = this.queryData.secondState.category_id
      } else if (this.queryData.firstState && this.queryData.firstState.category_id) {
        currentId = this.queryData.firstState.category_id
      }
      try {
        const { response, result } = await this.fuCollectionList({
          product_name: this.queryData.keyword,
          category_id: currentId,
          // category_name: this.filterData.serviceCategory.category_name,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          result.data.forEach(candidate => (
            candidate.isSelected = false
          ))
          this.list.splice(0, this.list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取服务列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 翻页操作
    paging (state) {
      this.paginationData = state
      this.fetchData()
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
    // 重置
    resetFilter () {
      this.paginationData.current_page = 1
      this.filterData.keyword = ''
      this.filterData.firstState = null
      this.filterData.secondState = null
      this.secondClassList = []
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.fetchData()
    },
    // 查看服务
    createService (item) {
      this.$router.push({
        name: 'serviceCollectionDetail',
        query: {
          id: item,
        },
      })
    },
    // 添加到服务库
    addServiceStore (item) {
      this.nowId = item
      this.itemSelectorClass = true
    },
    itemSelectorResolve (item) {
      this.fetchData()
    },
    // 分类列表
    async getClassifyList (parentId) {
      let params = {
        type: 2,
        parent_id: parentId,
      }
      try {
        let { response, result } = await this.getCateList(params)
        if (response.status === 200 && result.code === 0) {
          // 根据返回的分类级别组装数据
          if (result.data[0].level === 1) {
            this.firstClassList = result.data
          } else if (result.data[0].level === 2) {
            this.secondClassList = result.data
          } else if (result.data[0].level === 3) {
            this.thirdClassList = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类失败',
            content: '获取商品分类发生错误，请稍后再试',
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.fetchData()
    this.getClassifyList(0)
  },
  watch: {
    // 选择一级分类，赋值二级分类
    'filterData.firstState' () {
      this.filterData.secondState = null
      this.secondClassList = []
      if (this.filterData.firstState) this.getClassifyList(this.filterData.firstState.category_id)
    },
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'serviceCollectionDetail') {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter()
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.prior-conditions {
  background-color: #fcfcfc;
}

.field {
  &.is-keyword {
    width: 300px;
  }

  &.is-narrow {
    width: 140px;
  }
}

.package-content {
  display: flex;
  padding-right: 18px;
  flex-direction: column;
  justify-content: center;
  line-height: 18px;
  height: 36px;
  overflow: hidden;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.button {
  align-items: center;
}

.page-selector {
  label {
    z-index: 5;
  }
}

.tfoot {
  overflow: hidden;
}

.batched-operations {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  width: 100%;
  height: 36px;
  background-color: #fff;
  box-shadow: 0 -1px 12px 0 rgba(0, 0, 0, 0.08);
}

.sliding-enter-active {
  transition: top ease-in 0.2s;
}

.sliding-leave-active {
  transition: top ease-out 0.2s;
}

.sliding-enter, .sliding-leave-to {
  top: 100%;
}

.batched-operation-segment, .batched-operation-divider {
  margin-left: 16px;
  cursor: default;
}

.batched-operation-segment {
  line-height: 16px;
  font-size: 13px;
  color: lightGrey;
}

.batched-operation-divider {
  height: 13px;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.selected-item-count {
  margin: 0 2px;
  color: standblack;
}

.batched-operation {
  color: #2fabdd;
  cursor: pointer;

  &.is-secondary {
    color: lightGrey;
  }

  &.is-danger {
    color: error;
  }
}

.m-r-20 {
  margin-right: 20px;
}
</style>

