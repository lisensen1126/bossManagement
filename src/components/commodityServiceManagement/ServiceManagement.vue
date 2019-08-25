<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.is-narrow
          label.label 全部分类
          custom-select(v-model="filter_data.first_state", :list="first_class_list", @input="changefirst_state", nameField="category_name")
        .field.is-narrow
          custom-select(v-model="filter_data.second_state", :list="second_class_list", nameField="category_name")
        .field.is-narrow
          label.label 上下架状态
          custom-select(v-model="filter_data.is_sale", :list="selling_states")
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filter_data.product_name", placeholder="请输入服务名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createService")
            span.add-icon
            span 添加服务
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有服务'")
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="50")
                // 全选按钮
                // checkoutType 类型：all标识全选，默认unit某一项
                // list：当前列表数据
                // is_all_select: 是否全选
                // value: 当前项数据
                checkbox(checkoutType="all", :list="list", :is_all_select="is_all_select", @isCheckboxFun="isCheckout")
              td(width="15%") 服务名称
              td(width="10%") 服务分类
              td(width="40%") 服务简述
              td(width="10%") 更新日期
              td(width="10%") 上架状态
              td(width="15%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                  .content-item(v-text="item.product_name")
              td
                .simple-td(v-text="item.category_data")
              td
                .multi-content-td.m-r-20(v-if="item.summary === ''") - -
                .multi-content-td.m-r-20(v-text="item.summary", v-else)
              td
                .simple-td(v-text="formateDate(item.updated_at)")
              td
                .simple-td(v-if="item.is_sale == 1")
                  .status-dot.green
                  span 已上架
                .simple-td(v-if="item.is_sale == 2")
                  .status-dot.grey
                  span 已下架
              td
                .operation-td
                  span.operation-link(@click="serviceDetail(item)") 查看
                  span.operation-link(v-if="item.is_sale == 2", @click="editService(item,'isEdit')") 编辑
                  span.operation-link(v-if="item.is_sale == 1", @click="toggleSellingState(item)") 下架
                  span.operation-link(v-if="item.is_sale == 2", @click="toggleSellingState(item)") 上架
                  span.operation-link(v-if="item.is_sale == 2", @click="deleteServer(item)") 删除
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")
        transition(name="sliding")
          .batched-operations(v-if="checkout_ids.length>0")
            .batched-operation-segment.batched-operation.is-secondary(@click="cannelChoose") 取消选择
            .batched-operation-divider
            .batched-operation-segment
              | 已选择
              span.selected-item-count(v-text="checkout_ids.length")
              | 件商品
            .batched-operation-segment.batched-operation.btn-up.btn-cover(@click="batchOperation(2)") 批量上架
            .batched-operation-segment.batched-operation.btn-down.btn-cover(@click="batchOperation(1)") 批量下架
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import bossApi from '@/mixins/modules/boss'
import EmptyPage from '@/components/generics/EmptyPage'
import ServiceCategoryPicker from '@/components/generics/form/ServiceCategoryPicker'
import imageScale from '@/mixins/utilities/imageScale'
import formateDate from '@/mixins/utilities/formateDate'
import filterTools from '@/mixins/utilities/filterTools'
import Checkbox from '@/components/generics/form/Checkbox'

export default {
  name: 'ServiceManagement',
  mixins: [filterTools, imageScale, bossApi, formateDate],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    ServiceCategoryPicker,
    filterTools,
    Checkbox,
  },
  data () {
    const schema = {
      is_initiated: false,
      service_category_list: [],
      first_class_list: [],
      second_class_list: [],
      filter_data: {
        first_state: null,
        second_state: null,
        product_name: '',
        is_sale: null,
        // serviceCategory: null,
      },
      query_data: {},
      list: [],
      selling_states: [
        { name: '全部', value: 0 },
        { name: '上架', value: 1 },
        { name: '下架', value: 2 },
      ],
      pagination_data: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      is_all_select: false,
      checkout_ids: [],
      is_first_enter: false, // 是否第一次进入
    }
      // initialize conditions
      ;[schema.filter_data, schema.query_data].forEach(conditions => {
        conditions.product_name = ''
        conditions.is_sale = schema.selling_states[0]
      })
    return schema
  },
  methods: {
    /*
    *  删除
    *  @item 删除的对象
    * */
    deleteServer (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认删除‘${item.product_name}’该服务？`,
        isRejectable: 1,
        resolve: () => {
          this.deleteApi(item)
        },
      })
    },
    /*
    * 删除服务
    * @flag {Object} 删除服务的信息
    * */
    async deleteApi (flag) {
      try {
        let { response, result } = await this.deleteServiceApi({
          product_id: flag.product_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: result.message,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: `服务异常，请稍后再试（${response.status}${
            result && result.code ? ' ' + result.code : ''
            }）`,
        })
      }
    },

    /**
     * 批量上下架
     * @param item {Number} 上下架区别参数
     * @returns {boolean}
     */
    batchOperation (item) {
      let sellSrevice = []   // 上架参数
      let lowerSrevice = []  // 下架参数
      this.checkout_ids.forEach(v => {
        if (v.is_sale === 1) {
          lowerSrevice.push(v.product_id)
        } else {
          sellSrevice.push(v.product_id)
        }
      })
      // item===2 批量上架  item===1 批量下架
      item === 1 ? this.setSelaState(lowerSrevice, item) : this.setSelaState(sellSrevice, item)
    },

    // 复选框选中列表项
    isCheckout (params) {
      // 当前项的选中
      if (params.type === 'unit') {
        this.is_all_select = params.is_all_select
        // 选中项的id集合
        let ids = []
        this.list.forEach(function (item) {
          if (item.is_select) {
            ids.push(item)
          }
        })
        this.checkout_ids = ids
      }
      // 全选操作
      if (params.type === 'all') {
        let ids = []
        this.is_all_select = params.is_all_select
        // 更新列表 list 数据
        // let oldList = this.list
        this.list.forEach(function (item) {
          if (params.is_all_select) {
            item.is_select = true
            ids.push(item)
          } else {
            item.is_select = false
          }
        })
        // this.list = []
        // this.list = oldList
        this.checkout_ids = ids
      }
    },

    // 取消选择
    cannelChoose () {
      this.checkout_ids = []
      this.is_all_select = false
      this.list.forEach(item => {
        item.is_select = false
      })
    },

    // 获取服务列表数据
    async fetchData () {
      let currentId = ''
      let isSale = '' // 上下架状态
      if (this.query_data.second_state && this.query_data.second_state.category_id) {
        currentId = this.query_data.second_state.category_id
      } else if (this.query_data.first_state && this.query_data.first_state.category_id) {
        currentId = this.query_data.first_state.category_id
      }
      if (this.query_data.is_sale) {
        if (this.query_data.is_sale.value !== 0) {
          isSale = this.query_data.is_sale.value
        } else {
          isSale = ''
        }
      }
      try {
        const { response, result } = await this.serviceList({
          product_name: this.query_data.product_name
            ? this.query_data.product_name
            : '',
          is_sale: isSale,
          category_id: currentId,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        })
        if (response.status === 200) {
          result.data.forEach(item => {
            item.is_select = false
          })
          this.list = result.data
          // this.list.splice(0, this.list.length, ...result.data)
          // result.data.category_data = result.data.category_data[0] // 神操作
          result.data.forEach(item => {
            item.category_data = item.category_data[0]
          })
          this.pagination_data = result.meta
          this.is_initiated = true
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
      this.is_initiated = true
    },

    // 分类列表
    async getClassifyList (parentId) {
      let params = {
        type: 2,
        parent_id: parentId,
      }
      try {
        let { response, result } = await this.classifyList(params)
        if (response.status === 200 && result.code === 0) {
          // 根据返回的分类级别组装数据
          if (result.data[0].level === 1) {
            this.first_class_list = result.data
          } else if (result.data[0].level === 2) {
            this.second_class_list = result.data
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

    // 翻页操作
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },

    // 搜索
    applyFilter () {
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      this.pagination_data.current_page = 1
      this.fetchData()
    },

    // 重置
    resetFilter (page) {
      this.pagination_data.current_page = page || 1
      this.filter_data.first_state = null
      this.filter_data.second_state = null
      this.filter_data.product_name = ''
      this.filter_data.is_sale = null
      this.second_class_list = []
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.fetchData()
    },
    // 添加服务
    createService () {
      this.$router.push({
        name: 'serviceAdd',
      })
    },

    // 编辑服务
    editService (item) {
      this.$router.push({
        name: 'serviceEdit',
        query: {
          id: item.product_id,
          isEdit: true,
        },
      })
    },

    // 服务详情
    serviceDetail (item) {
      this.$router.push({
        name: 'serviceDetail',
        query: {
          id: item.product_id,
        },
      })
    },

    // 上、下架操作
    toggleSellingState (item) {
      let idArr = []
      idArr.push(item.product_id)
      this.$store.dispatch('showMessage', {
        title: `确认${parseInt(item.is_sale) === 1 ? '下架' : '上架'}该服务？`,
        content: parseInt(item.is_sale) === 1 ? '下架后服务将不在商城售卖' : '上架后门店即可售卖该服务',
        isRejectable: 1,
        resolve: () => this.setSelaState(idArr, item.is_sale),
      })
    },

    /**
     * 修改上下架，批量上下架状态函数
     * @param ids {Array} 批量上下架参数集合
     * @param sale       原本上下架状态
     * @returns {Promise<void>}
     */
    async setSelaState (ids, sale) {
      if (ids.length === 0) return
      sale === 1 ? sale = 2 : sale = 1
      try {
        const { response, result } = await this.serviceUpdateSale({
          product_ids: ids,
          is_sale: sale,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.product_ids.length > 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: result.data.product_ids.length + '件商品' + sale === 2 ? '下' : '上' +'架失败',
                content: sale === 2 ? '' : '服务价格不能为0',
                isRejectable: 1,
                resolve: () => {
                  this.fetchData()
                  this.is_all_select = false
                  this.checkout_ids = []
                },
              })
            } else {
              this.fetchData()
              this.is_all_select = false
              this.checkout_ids = []
            }
          } else {
            await this.fetchData()
            this.is_all_select = false
            this.checkout_ids = []
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: `出错了：${result.message}`,
              content: '服务价格不能为0'
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改服务上下架状态失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改服务上下架状态失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },

    // 选择一级分类，赋值二级分类
    changefirst_state () {
      this.filter_data.second_state = null
      this.second_class_list = []
      this.getClassifyList(this.filter_data.first_state.category_id)
    },
  },
  mounted () {
    this.is_first_enter = true
    this.getClassifyList(0)
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if ((from.name === 'serviceDetail' || from.name === 'serviceEdit') && to.query.save !== 1) {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter(this.pagination_data.current_page)
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.multi-content-td {
  vertical-align: middle;
}

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

.up-down {
  margin-right: 10px;
}

/* 批量上下 样式 */
.btn-up {
  position: absolute;
  right: 108px;
}

.btn-down {
  position: absolute;
  right: 16px;
}

.btn-cover {
  color: #121212;
  background: #ffbb29;
  border: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.08);
  padding: 6px 14px;
  border-radius: 3px;
}
</style>

