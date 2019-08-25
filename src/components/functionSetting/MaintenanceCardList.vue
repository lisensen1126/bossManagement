<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="搜索名称", @keyupEnter="applyFilter")
        .field.is-narrow
          label.label 分类
          custom-select(v-model="choose_classify", :list="classify_list", nameField="name")
        .field.is-narrow
          label.label 价格排序
          custom-select(v-model="price_classify", :list="price_list", nameField="name")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      span.add-button(@click="createCard")
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有养护卡'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 名称
              td(width="80") 卡面
              td(width="80") 分类
              td(width="50") 项目数量
              td(width="50") 使用次数
              td(width="70") 关联商品数
              td(width="70") 有效期（月）
              td(width="80") 价格
              td(width="80") 状态
              td(width="100") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .multi-content-td.has-image
                  a.left-image(@click="showCardFace(item.image_url)")
                    img(:src="item.image_url")
              td
                .simple-td {{item.category}}
              td
                .simple-td {{item.item_num}}
              td
                .simple-td {{item.num}}
              td
                .simple-td {{item.product_count}}
              td
                .simple-td {{item.expiry == 0 ? '无限制': item.expiry}}
              td
                .simple-td ￥{{item.price/100}}
              td
                .simple-td
                  .status-dot(:class="{ 'green': item.status == '1', 'grey': item.status == '2'}")
                  span(v-if="item.status == '1'") 上架中
                  span(v-if="item.status == '2'") 已下架
              td
                .operation-td
                  span.operation-link(@click="goCardDetail(item.id)") 查看
                  span.operation-link(v-if="item.status == 2",@click="shelfCard(item.id,1)") 上架
                  span.operation-link(v-if="item.status == 1",@click="shelfCard(item.id,2)") 下架
                  span.operation-link(v-if="item.status == 2",@click="editCard(item.id)") 编辑
                  span.operation-link(v-if="item.status == 2",@click="deleteCard(item.id)") 删除
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")
    card-face(:url="image_url", v-if="show_card_face", @callback="modalHide")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import FunctionApi from '@/mixins/modules/FunctionSetting'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CardFace from '@/components/functionSetting/modal/CardFace'

  export default {
    name: 'maintenanceCardList',
    mixins: [filterTools, FunctionApi, imageScale],
    components: {
      EmptyPage,
      Pagination,
      CustomInput,
      CustomSelect,
      CardFace,
    },
    data: _ => {
      const schema = {
        filter_data: {
          keyword: '',
        },
        choose_classify: null, // 已选分类
        price_classify: null, // 已选分类
        classify_list: [], // 分类列表
        price_list: [
          {
            name: '默认',
            id: '',
          },
          {
            name: '价格从高到低',
            id: 1,
          },
          {
            name: '价格从低到高',
            id: 2,
          },
        ],
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        list: [],
        is_initiated: false,
        show_card_face: false,    // 是否展示卡面弹框
        image_url: null,    // 查看卡面弹框需要的参数
      }
      return schema
    },
    methods: {
      // 搜索按钮
      applyFilter () {
        this.pagination_data.current_page = 1
        this.getCardList()
      },
      // 重置
      resetFilter () {
        this.pagination_data.current_page = 1
        this.filter_data.keyword = ''
        this.choose_classify = null
        this.price_classify = null
        this.getCardList()
      },
      // 新建养护卡
      createCard () {
        this.$router.push({
          name: 'maintenanceCardAdd',
          query: {
            edit: 1,
            type: 2, // 有 type 代表要清缓存
          },
        })
      },
      // 编辑养护卡操作
      editCard (id) {
        this.$router.push({
          name: 'maintenanceCardAdd',
          query: {
            edit: 2,
            id: id,
          },
        })
      },
      // 查看养护卡操作
      goCardDetail (id) {
        this.$router.push({
          name: 'maintenanceCardDetail',
          query: {
            id: id,
          },
        })
      },
      /*
      * 查看养护卡卡面
      * url 养护卡的卡面
      * */
      showCardFace (url) {
        this.image_url = url
        this.show_card_face = true
      },
      // 关闭查看卡面
      modalHide () {
        this.show_card_face = false
      },
      /*
      * 删除养护卡
      * id 养护卡id
      * */
      deleteCard (id) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认删除养护卡？',
          isRejectable: 1,
          resolve: () => {
            this.delApi(id)
          },
        })
      },
      /*
      * 删除接口
      * id 养护卡id
      * */
      async delApi (id) {
        let _this = this
        try {
          const { response, result } = await this.upkeepDelApi({
            id: id,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                _this.getCardList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 上下架养护卡操作
      shelfCard (id, type) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认上下架养护卡？',
          isRejectable: 1,
          resolve: () => {
            this.shelfApi(id, type)
          },
        })
      },
      /**
       * 上下架接口
       * @id {int} 上下架的id
       */
      async shelfApi (id, type) {
        let _this = this
        let txt = (type === 1 ? '上' : '下')
        try {
          const { response, result } = await this.upkeepStatusApi({
            id: id,
            status: type,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: txt + '架成功',
              resolve: () => {
                _this.getCardList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: txt + '架失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: txt + '架失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      paging (state) {
        this.pagination_data = state
        this.getCardList()
      },
      // 获取养护卡分类列表
      async getClassifyList () {
        try {
          const { response, result } = await this.cardCategoryApi()
          if (response.status === 200 && result.code === 0) {
            this.classify_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡分类列表失败',
              content: result.message,
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
      // 获取养护卡列表
      async getCardList () {
        console.log(this.price_classify)
        try {
          const { response, result } = await this.upkeepListApi({
            name: this.filter_data.keyword ? this.filter_data.keyword : '',
            category_id: this.choose_classify ? this.choose_classify.id : '',
            order: this.price_classify ? this.price_classify.id : '',
            page: this.pagination_data.current_page,
            per_page: this.pagination_data.per_page,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.pagination_data = result.meta
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取养护卡列表失败',
              content: result.message,
            })
          }
        } catch ({ response, result }) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      sessionStorage.setItem('cardType', null)
      this.getClassifyList() // 获取养护卡分类列表
      this.getCardList() // 获取养护卡列表
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  td,.simple-td {
    vertical-align middle
  }
  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-filter {
    display: flex;
    justify-content: space-between;
  }

  .button {
    align-items: center;
  }

  .add-icon {
    display: inline-flex;
    width: 16px;
    height: 16px;
    background: url('~@/assets/icons/button-add.svg') no-repeat center center;
    background-size: cover;
    margin-right: 6px;
  }

  .section-layout {
    height: calc(100% - 48px);
  }

  .list-wrapper {
    height: calc(100% - 90px) !important;
  }
</style>
