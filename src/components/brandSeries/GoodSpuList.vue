<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.title-name
      .h2 当前分类: {{name}}
      .field
        a.button.primary.save-btn(@click="saveData") 保存
    .section-filter.is-horizontal.search-content
      .field.is-narrow
        label.label 全部分类
        custom-select(v-model="first_state", :list="first_class_list", @input="changefirst_state", nameField="category_name")
      .field.is-narrow
        label.label
        custom-select(v-model="second_state", :list="second_class_list", nameField="category_name")
      .field
        label.label
        a.button.primary(@click="searchFilter") 搜索
      .field
        label.label
        a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有服务'")
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="50")
              td(width="100") 商品名称
              td(width="50") 品牌
              td(width="100") 所属分类
              td(width="80") 更新日期
              td(width="80") 上架状态
              td(width="80") 操作人
              td(width="80") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .radio
                  input(type="radio", :id="item.product_id", :value="item", name="modal" v-model="selected_item")
                  label.sepcific-setting(:for="item.product_id")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                  .content-item(v-text="item.product_name")
              td
                .simple-td(v-text="item.brand_name")
              td
                .simple-td(v-text="item.category_data")
              td
                .simple-td(v-text="item.updated_at ? formateDate(item.updated_at) : '--'")
              td
                .simple-td(v-text="(item.is_sale === 1 ? '上架' : '下架')")
              td
                .simple-td(v-text="item.operator_name ? item.operator_name : '--'")
              td
                .operation-td
                  span.operation-link(@click="goodDetail(item)") 查看
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")

</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import bossApi from '@/mixins/modules/boss'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ServiceCategoryPicker from '@/components/generics/form/ServiceCategoryPicker'
  import imageScale from '@/mixins/utilities/imageScale'
  import formateDate from '@/mixins/utilities/formateDate'
  import filterTools from '@/mixins/utilities/filterTools'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'GoodSpuList',
    mixins: [filterTools, imageScale, bossApi, formateDate, SeriesApi],
    components: {
      EmptyPage,
      Pagination,
      ServiceCategoryPicker,
      filterTools,
      CustomSelect,
    },
    watch: {
      'selected_item': function () {
        this.check_spu_id = this.selected_item.product_id
      },
    },
    data () {
      return {
        id: this.$route.query.id,
        name: this.$route.query.name,
        is_initiated: false,
        first_state: null,
        first_class_list: [],
        second_state: null,
        second_class_list: [],
        list: [],
        selected_item: null,
        check_spu_id: '',
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
      }
    },
    methods: {
      searchFilter () {
        this.fetchData()
      },
      resetFilter () {
        this.first_state = {}
        // this.first_class_list = []
        this.second_state = {}
        this.second_class_list = []
        this.pagination_data.current_page = 1
        this.fetchData()
      },
      // 选择一级分类，赋值二级分类
      changefirst_state () {
        this.second_state = null
        this.second_class_list = []
        this.getClassifyList(this.first_state.category_id)
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
      // 获取商品列表数据
      async fetchData () {
        let currentId = ''
        if (this.second_state && this.second_state.category_id) {
          currentId = this.second_state.category_id
        } else if (this.first_state && this.first_state.category_id) {
          currentId = this.first_state.category_id
        }
        try {
          const {response, result} = await this.goodListApi({
            id: this.id,
            category_id: currentId,
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200) {
            this.list = result.data
            if (!this.check_spu_id) {
              this.check_spu_id = result.check_spu_id
            }
            result.data.forEach(item => {
              item.category_data = item.category_data[0]
              if (!(this.selected_item && this.selected_item.product_id)) {
                if (this.check_spu_id === item.product_id) {
                  this.selected_item = item
                }
              }
            })
            this.pagination_data = result.meta
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

      // 翻页操作
      paging (state) {
        this.pagination_data = state
        this.fetchData()
      },

      // 服务详情
      goodDetail (item) {
        let data = {
          selected_item: this.selected_item,
          check_spu_id: this.check_spu_id,
          pagination_data: this.pagination_data,
          first_state: this.first_state,
          first_class_list: this.first_class_list,
          second_state: this.second_state,
          second_class_list: this.second_class_list,
        }
        sessionStorage.setItem('spuList_data', JSON.stringify(data))
        this.$router.push({
          name: 'goodSpuDetail',
          query: {
            id: item.product_id,
          },
        })
      },
      async saveData () {
        if (!this.check_spu_id) {
          if (!(this.selected_item && this.selected_item.product_id)) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '请选择商品',
            })
            return
          }
        }
        let params = {
          id: this.id,
        }
        if (this.selected_item && this.selected_item.product_id) {
          params.spu_id = this.selected_item.product_id
        } else {
          params.spu_id = this.check_spu_id
        }
        try {
          const {response, result} = await this.saveGoodApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                title: '保存成功!',
                autoClose: true, // 控制弹框自动消失
                type: 'success',
              })
              this.$router.push({
                name: 'spuList',
                query: {
                  name: 'SPU',
                  type: 'spuList',
                  urlName: 'spuList',
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '保存失败',
                content: `出错了:${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      let spuData = sessionStorage.getItem('spuList_data')
      if (spuData) {
        let data = JSON.parse(spuData)
        this.selected_item = data.selected_item
        this.pagination_data = data.pagination_data
        this.first_class_list = data.first_class_list
        this.second_class_list = data.second_class_list
        this.check_spu_id = data.check_spu_id
        this.first_state = data.first_state
        this.second_state = data.second_state
        this.fetchData()
        sessionStorage.setItem('spuList_data', '')
      } else {
        // 获取分类列表、商品列表
        this.getClassifyList(0)
        this.fetchData()
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .is-narrow
    margin-right 30px
  .search-content
    display flex
    justify-content start !important
    padding 10px 30px
    .label
      width 100px !important
  .sepcific-setting
    width 62px
    padding-left 20px
  .title-name {
    line-height 20px !important
    padding 14px !important
    height 50px !important
  }
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
  .checkbox
    flex-shrink 0
    margin-right 16px
  .radio
    width 16px
    height 16px
  label
    width 16px
    height 16px
    padding-left 14px
  input[type="radio"]
    width 16px
    height 16px
  .save-btn
    margin-right 50px
</style>
