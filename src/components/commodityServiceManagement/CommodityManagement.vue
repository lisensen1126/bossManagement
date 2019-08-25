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
          label.label 商品状态
          custom-select(v-model="filter_data.is_sale", :list="commodity_states")
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model="filter_data.product_name", placeholder="请输入商品名称", @keyupEnter="searchFilter")
        .field
          a.button.primary(@click="searchFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
        .field
          a.button.primary(@click="addCommodity") 新增商品
    empty-page(v-if="!(list && list.length) && is_initiated", tip="暂无数据")
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
              td(width="200") 商品名称
              td(width="200") 品牌
              td(width="220") 所属分类
              td(width="80") SKU数量
              td(width="180") 更新日期
              td(width="90") 上架状态
              td(width="90") 操作人
              td(width="200") 操作
          tbody
            tr(v-for="item in list")
              td
                checkbox(:value="item", :list="list", checkoutType="unit", @isCheckboxFun="isCheckout")
              td
                .simple-td.has-image
                  .left-image
                    img(v-if="item.product_pic", :src="item.product_pic")
                  .content-item(v-text="item.product_name")
              td
                .simple-td(v-text="item.brand_name")
              td
                .simple-td(v-text="item.classfiy_name")
              td
                .simple-td(v-text="item.sku_count")
              td
                .simple-td(v-text="item.updated_at")
              td
                .simple-td(v-text="(item.is_sale === 1 ? '上架' : '下架')")
              td
                .simple-td(v-text="item.operator_name")
              td
                .operation-td
                  span.operation-link(@click="commodityDetail(item)") 查看
                  span.operation-link(v-if="item.is_sale === 2", @click="editCommodity(item)") 编辑
                  span.operation-link(v-if="item.is_sale === 2", @click="toggleSellingState(item)") 上架
                  span.operation-link(v-if="item.is_sale === 1", @click="toggleSellingState(item)") 下架
                  span.operation-link(v-if="item.is_sale === 2", @click="deleteGood(item)") 删除
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
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import filterTools from '@/mixins/utilities/filterTools'
import bossMixin from '@/mixins/modules/boss'
import Checkbox from '@/components/generics/form/Checkbox'

export default {
  name: 'CommodityManagement',
  mixins: [bossMixin, filterTools],
  data () {
    const schema = {
      is_all_select: false, // 是否全选
      checkout_ids: [], // 选择的id
      is_initiated: false,
      name_field: '商品分类',
      first_class_list: [],
      second_class_list: [],
      third_state: null,
      third_classList: [],
      commodity_states: [
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
      filter_data: {
        first_state: null,
        second_state: null,
        product_name: '',
        is_sale: null,
      },
      query_data: {},
      list: [],
      is_first_enter: false, // 是否第一次进入
    }
    // initialize conditions
    ;[schema.filter_data, schema.query_data].forEach(conditions => {
      conditions.product_name = ''
      conditions.is_sale = schema.commodity_states[0]
    })
    return schema
  },
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    Checkbox,
  },
  methods: {
    /*
      *  删除
      *  @item 删除的对象
      * */
    deleteGood (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认删除‘${item.product_name}’该商品？`,
        isRejectable: 1,
        resolve: () => {
          this.deleteApi(item)
        },
      })
    },

    /**
     * 删除商品
     * @flag {Object} 删除商品的信息
     */
    async deleteApi (flag) {
      try {
        let { response, result } = await this.deleteGoodsApi({
          product_id: flag.product_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.getCommodityList()
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
      let sellGoods = [] // 上架参数
      let lowerGoods = [] // 下架参数
      this.list.forEach(v => {
        if (v.is_select) {
          if (v.is_sale === 1) {
            lowerGoods.push(v.product_id)
          } else {
            sellGoods.push(v.product_id)
          }
        }
      })
      // item===2 批量上架  item===1 批量下架
      item === 1
        ? this.setShopStatus(lowerGoods, item)
        : this.setShopStatus(sellGoods, item)
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
        this.list.forEach(function (item) {
          if (params.is_all_select) {
            item.is_select = true
            ids.push(item)
          } else {
            item.is_select = false
          }
        })
        this.checkout_ids = ids
      }
    },

    // 分类列表
    async getClassifyList (parentId) {
      let params = {
        type: 1,
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
            this.third_classList = result.data
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
          content: `服务异常，请稍后再试（${response.status}${
            result && result.code ? ' ' + result.code : ''
          }）`,
        })
      }
    },

    // 商品列表
    async getCommodityList () {
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
        const { response, result } = await this.commodityList({
          category_id: currentId,
          is_sale: isSale,
          product_name: this.query_data.product_name
            ? this.query_data.product_name
            : '',
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          // 列表数据赋值
          for (let i = 0; i < result.data.length; i++) {
            result.data[i].classfiy_name = result.data[i].category_data[0]
            result.data[i].is_select = false
          }
          this.list = result.data
          this.is_initiated = true
          // this.list.splice(0, this.list.length, ...result.data)
          // 分页器数据更新
          this.pagination_data = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品列表失败',
            content: '获取商品列表发生错误，请稍后再试',
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品列表失败',
          content: `服务异常，请稍后再试（${
            err.response ? err.response.status : err
          }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },

    // 新增商品跳转页面
    addCommodity (item) {
      this.$router.push({
        name: 'commodityAdd',
      })
    },

    // 编辑商品跳转页面
    editCommodity (item) {
      this.$router.push({
        name: 'commodityEdit',
        query: {
          id: item.product_id,
        },
      })
    },

    // 查看商品跳转页面
    commodityDetail (item) {
      this.$router.push({
        name: 'commodityDetail',
        query: {
          id: item.product_id,
        },
      })
    },

    // 上、下架操作
    toggleSellingState (item) {
      this.$store.dispatch('showMessage', {
        title: `确认${item.is_sale === 1 ? '下架' : '上架'}该商品？`,
        content:
          item.is_sale === 1
            ? '下架后商品将不在商城售卖'
            : '上架后门店即可售卖该商品',
        isRejectable: 1,
        resolve: () => this.setShopStatus([item.product_id], item.is_sale),
      })
    },

    // 取消选择
    cannelChoose () {
      this.checkout_ids = []
      this.is_all_select = false
      this.list.forEach(item => {
        item.is_select = false
      })
    },

    /**
     * 修改上下架，批量上下架状态函数
     * @param ids {Array} 批量上下架参数集合
     * @param sale       原本上下架状态
     * @returns {Promise<void>}
     */
    async setShopStatus (ids, sale) {
      if (ids.length === 0) return
      if (sale === 1) {
        sale = 2
      } else {
        sale = 1
      }
      try {
        let { response, result } = await this.commodityUpdateSale({
          product_ids: ids,
          is_sale: sale,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.getCommodityList()
            this.is_all_select = false
            this.checkout_ids = []
            if (result.data.product_ids.length > 0) {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: `${result.data.product_ids.length}件商品上架失败`,
                content: '失败原因：商品sku信息不完整，请完善信息',
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改商品状态失败',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改商品状态失败',
            content: '修改商品状态错误，请稍后再试',
          })
        }
      } catch ({ response, result }) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取分类列表失败',
          content: `服务异常，请稍后再试（${response.status}${
            result && result.code ? ' ' + result.code : ''
          }）`,
        })
      }
    },

    // 条件筛选
    searchFilter () {
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      this.pagination_data.current_page = 1
      this.getCommodityList()
    },

    // 重置筛选条件
    resetFilter (page) {
      this.pagination_data.current_page = page || 1
      this.filter_data.first_state = null
      this.filter_data.second_state = null
      this.filter_data.product_name = ''
      this.filter_data.is_sale = null
      this.second_class_list = []
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.getCommodityList()
    },

    // 翻页操作
    paging (state) {
      this.pagination_data = state
      this.getCommodityList()
    },
    // 选择一级分类，赋值二级分类
    changefirst_state () {
      this.filter_data.second_state = null
      this.second_class_list = []
      this.getClassifyList(this.filter_data.first_state.category_id)
    },
  },
  mounted () {
    // 获取分类列表、商品列表
    this.is_first_enter = true
    this.getClassifyList(0)
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if ((from.name === 'commodityDetail' || from.name === 'commodityEdit') && to.query.save !== 1) {
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

.field {
  &.is-keyword {
    width: 200px;
  }

  &.is-narrow {
    width: 140px;
  }
}

.inline-block {
  display: inline-block !important;
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
