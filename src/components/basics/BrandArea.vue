<template lang="pug">
  .section-layout.content-box
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if="brand_list && brand_list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 品牌馆名称
              td(width="80") 品牌馆封面图
              td(width="70") 排序
              td(width="70") 品牌名称
              td(width="140") 操作
          tbody(v-if="brand_list.length")
            tr(v-for="(item, index) in brand_list")
              td
                .simple-td( v-if='item.houses.name', v-text="item.houses.name")
                .simple-null(v-else) - -
              td
                upload-pic.cover-img(v-model="item.houses.cover", :img-id="index", :default-img="default_img_src", :isDisabled="true")
              td.tr-p
                div(v-if="index>0")
                  .up(v-if="index !== 1", @click="sortItem(index, 'up')")
                  .down(v-if="index !== brand_list.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td(v-text="item.houses.brand_name")
              td
                .operation-td
                  a.operation-link.left(@click="openSetting(item, index)") 选择品牌专区
                  a.operation-link(v-if="index>0", @click="deleteItem(index)")  删除
          .tfoot(v-if="brand_list.length")
    empty-page(v-if="brand_list.length<=0  && show_page", :tip="'当前没有品牌专区'")
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    // 选择商品弹框
    choose-brand-area(v-model="show_product", v-if="show_product", :ids_set="ids" :id="current_item.product_id", @resolve="getProduct")
</template>

<script>

  import ImageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import UploadPic from '@/components/generics/form/UploadPic'
  import ChooseBrandArea from '@/components/basics/modal/ChooseBrandArea'
  import AdminApi from '@/mixins/modules/basics'

  export default {
    name: 'brandArea',

    data () {
      return {
        // 默认图片
        default_img_src: '',
        // 设置浮层
        setting_block: false,
        // 选择弹窗展示隐藏
        show_product: false,
        show_service: false,
        brand_list: [], // 品牌专区列表
        // 当前项下标
        current_index: 0,
        // 当前项
        current_item: {},
        // 缺省页显示
        show_page: false,
        set_list: [
          {
            name: '商品信息',
            type: 1,
          },
          {
            name: '服务信息',
            type: 2,
          },
        ],
      }
    },
    mixins: [ImageScale, AdminApi],
    components: {
      EmptyPage,
      UploadPic,
      ChooseBrandArea,
    },
    // 业务代码
    methods: {
      /**
       * 获取品牌专区列表
       * @returns {Promise<void>}
       */
      async fetchData () {
        try {
          const {response, result} = await this.fetchBrandAreaApi()
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(function (item) {
              item.setting_block = false
            })
            // 添加一条默认数据
            if (result.data.length === 0) {
              let arr = [...this.brand_list]
              this.brand_list = []
              let houses = {
                cover: '',
                name: '',
                brand_name: '',
                id: '',
              }
              arr.push({
                brand_houses_id: '',
                houses: houses,
                locking: 2,
                setting_block: false,
              })
              result.data = [...arr]
            }
            this.brand_list = result.data
            this.show_page = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌专区列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
            this.show_page = false
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌专区列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          this.show_page = false
        }
      },

      /**
       * 选择商品弹框的回调处理
       * @param {Object} 已选商品的数据
       * @id {Number, String} 触发该弹框的id
       */
      getProduct (params, id) {
        this.formateData(params)
      },

      /**
       * @param {Object} 已选商品的数据
       * 赋值于列表
       * */
      formateData (params) {
        let _this = this
        let index = this.current_index
        this.brand_list[index].brand_houses_id = params.id
        this.brand_list[index].houses.name = params.name
        this.brand_list[index].houses.cover = params.cover
        this.brand_list[index].houses.brand_name = params.brand_name
      },

      /**
       * 新增品牌专区
       * @index {int} 序列号
       * @type {string} up or down
       */
      addItem () {
        this.brand_list.forEach(function (item) {
          item.setting_block = false
        })
        if (this.brand_list.length > 2) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加3个品牌专区',
          })
          return
        }
        let arr = [...this.brand_list]
        this.brand_list = []
        let houses = {
          cover: '',
          name: '',
          brand_name: '',
          id: '',
        }
        arr.push({
          brand_houses_id: '',
          houses: houses,
          locking: 2,
          setting_block: false,
        })
        this.brand_list = [...arr]
      },

      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        let arr = [...this.brand_list]
        this.brand_list = []
        let temp = arr[index]
        // 向上移动
        if (type === 'up') {
          arr[index] = arr[index - 1]
          arr[index - 1] = temp
        }
        // // 向下移动
        if (type === 'down') {
          arr[index] = arr[index + 1]
          arr[index + 1] = temp
        }
        this.brand_list = [...arr]
      },

      /**
       * 打开选择品牌专区模块框
       * @ item
       */
      openSetting (item, index) {
        let ids = []
        this.brand_list.forEach(function (item) {
          if (item.brand_houses_id) {
            ids.push(item.brand_houses_id)
          }
          item.setting_block = false
        })
        this.current_item = item
        this.ids = ids
        this.current_index = index
        this.show_product = true
      },

      /**
       * 删除品牌专区
       * @ item  品牌馆对象
       */
      deleteItem (index) {
        this.brand_list.splice(index, 1)
      },
      /**
       * 保存操作
       * @isCanSave id验证
       * @isCanNameSave 品牌馆名称验证
       * @isCanSaveImg 品牌馆封面图验证
       * @isSaveType 品牌名称验证
       * */
      async saveData () {
        let self = this
        let isCanSave = true
        let isNameSave = true
        let isCanSaveImg = true
        self.brand_list.forEach(function (e, i) {
          if (!e.brand_houses_id) {
            isCanSave = false
          }
          if (!e.houses.name) {
            isNameSave = false
          }
          if (!e.houses.cover) {
            isCanSaveImg = false
          }
        })
        if (!isCanSave) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '数据不合法',
          })
          return false
        }
        if (!isNameSave) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '品牌馆名称不能为空',
          })
          return false
        }
        if (!isCanSaveImg) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '图片不能为空',
          })
          return false
        }
        let params = []
        self.brand_list.forEach(function (item) {
          if (item.brand_houses_id && item.houses.cover) {
            params.push({
              brand_houses_id: item.brand_houses_id,
            })
          }
        })
        try {
          const {response, result} = await this.saveBrandAreaApi({ data: params })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => this.$emit('success'),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    // 生命周期函数，置于代码底部
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .list-wrapper
    padding-bottom 120px!important
  .section-filter-none.is-horizontal
    height 0
    padding 0
  .section-filter .add-button
    bottom initial
  .section-layout
    position relative
    .add-button
      z-index 3
      position absolute
      right 40px
      top 0!important
  .operation-link
    position relative
  .setting-block
    position absolute
    top: 6px
    left 32px
    background #f0f1f2
    z-index 1000
    width 70px
    box-sizing border-box
    border-radius 2px
    li
      color: #999
      padding 10px
      line-height 12px
      font-size 12px
    li:hover
      background #ffc723
      color: white
  .content-box
    height: calc(100% - 48px)
  .cover-img img
    height 102px
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
  .gray
    color #989ba1
  .justify-center
    justify-content center
  .operation-link
    margin-right 0
  .text-overflow
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  table td
    vertical-align middle
  .tr-p
    position relative
    .up
    .down
      position absolute
      top 40px
      width 20px
      height 30px
      opacity .5
      cursor pointer
      &.is-disable
        opacity .2
        pointer-events none
      &:hover
        opacity 1
    .up
      left 0
      background center no-repeat url('~@/assets/icons/move-up.svg')
      background-size 20px 30px
    .down
      left 25px
      background center no-repeat url('~@/assets/icons/move-down.svg')
      background-size 20px 30px
    .delete
      position absolute
      top 8px
      right 8px
      width 16px
      height 16px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
  .btn-wrapper
    margin-top 20px
    padding-right 70px
    text-align right
    .large
      width 120px
  .btn-wrapper
    text-align right
    position fixed
    bottom 40px
    right 0
    padding 23px 40px 0
</style>


