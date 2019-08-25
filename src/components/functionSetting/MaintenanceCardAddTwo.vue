<template lang="pug">
.section-layout
  .content-wrapper
    h2 设置关联商品
    .main-wrapper
      .search-box
        .left
          custom-input(v-model.lazy="filterData.keyword", placeholder="请输入名称关键词", @keyupEnter="listFilter")
          a.button.primary(@click="listFilter") 搜索
          //- a.button(@click="resetFilter") 重置
        .right
          a.button(@click="battchDeleteInfo")
            span 批量删除
          a.button.primary(@click="addGood")
            span 添加商品
          a.button.primary(@click="addServe")
            span 添加服务
      .table-wrapper
        table.table
          thead
            tr
              td(width="80")
                .checkbox
                  input(type="checkbox", id="all00", v-model="checkedAll"
                  :checked="info_list.length == selected_item.length && selected_item" @click="checkedAllFnc")
                  label(for="all00", v-text="'全选'")
              td(width="80") 图片
              td(width="80") 名称
              td(width="80") 类型
              td(width="80") 分类
              td(width="80") 操作
          tbody.hide-hover(v-if="info_list && info_list.length")
            tr(v-for="(item, index) in info_list")
              td
                .simple-td
                  .checkbox
                    input(type="checkbox", :id="'brand' + index", :value="item", name="modal", v-model="selected_item" @change="testingCheckAll")
                    label(:for="'brand' + index", v-text="''")
              td
                .simple-td
                  img(v-if="item.product_pic", :src="item.product_pic" style='height:36px; width:36px')
              td
                .simple-td(v-text="item.product_name")
              td
                .simple-td(v-if="item.type==1") 商品
                .simple-td(v-if="item.type==2") 服务
              td
                .simple-td(v-text="item.category_data[0]")
              td
                .operation-td
                  span.operation-link(@click="deleteInfo(index, item.type, item.product_id)") 删除
        empty-page(v-if="info_list && !info_list.length", :tip="'暂无关联商品服务'")
    .btn-wrapper
      .button-group
        a.button.primary.large(v-if="card.info && card.info.id && card.info.id !=''", @click="updateInfo") 完成并更新卡片
        a.button.primary.large(v-else, @click="saveInfo") 完成并新建卡片
        a.button.large(@click="goBack") 返回上一步
        a.button.large(@click="cancleCreate") 取消
    choose-commodity(
      v-if='show_modal_good'
      v-model="show_modal_good"
      :array="temp_goods_list"
      @resolve="addGoodTrue")
    choose-serve(
      v-if='show_modal_serve'
      v-model="show_modal_serve"
      :array="temp_serves_list"
      @resolve="addServeTrue")

</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomTextarea from '@/components/generics/form/CustomTextarea'
import SelectTime from '@/components/generics/SelectTime'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import EmptyPage from '@/components/generics/EmptyPage'
import ChooseCommodity from '@/components/functionSetting/modal/ChooseCommodity'
import ChooseServe from '@/components/functionSetting/modal/ChooseServe'
import Api from '@/mixins/modules/FunctionSetting'

export default {
  name: 'maintenanceCardAddTwo',
  mixins: [Api],
  components: {
    CustomInput,
    CustomSelect,
    SelectTime,
    CustomTextarea,
    uploadImgModel,
    EmptyPage,
    ChooseCommodity,
    ChooseServe
  },
  data () {
    return {
      // 搜索条件
      filterData: {
        keyword: ''
      },
      // 列表数据
      data_list: [],
      selected_item: [], // 选中的
      checkedAll: false, // 全选
      show_modal_good: false, // 选择商品弹框
      show_modal_serve: false, // 选择服务弹框
      temp_goods_list: [], // 临时保存商品数据
      temp_serves_list: [], // 临时保存商品数据
      card: {}, // 临时保存养护卡信息
    }
  },
  computed: {
    info_list () {
      let self = this
      let arr = []
      arr = this.data_list.filter(item => {
        return item.product_name.indexOf(self.filterData.keyword) !== -1
      })
      return arr
    }
  },
  methods: {
    // 获取养护卡关联商品列表
    async fetchGoodsList () {
      let _this = this
      try {
        const { response, result } = await this.upkeepProductApi({
          id: _this.card.info.id
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(v => {
            if (v.type === 1) {
              v.product_name = v.sku_name
              v.product_id = v.sku_id
              v.category_data = [v.category_name]
              v.product_pic = v.sku_pic
              _this.temp_goods_list.push(v)
            } else {
              v.product_name = v.spu_name
              v.category_data = [v.category_name]
              v.product_pic = v.spu_pic
              v.product_id = v.spu_id
              _this.temp_serves_list.push(v)
            }
            _this.data_list = result.data
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取养护卡详情失败',
            content: '获取养护卡详情失败，请稍后再试',
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取养护卡详情失败',
          content: `服务异常，请稍后再试（${
            err.response ? err.response.status : err
          }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 搜索
    listFilter () {
    },
    // 重置
    resetFilter () {
    },
    // 列表过滤
    infoListFilter (arr) {
      return this.data_list.filter(item => {
        return item.product_name.indexOf(self.filterData.keyword) !== -1
      })
    },
    // 添加商品
    addGood () {
      this.show_modal_good = true
    },
    // 选中商品
    addGoodTrue (list) {
      this.temp_goods_list = list
      this.data_list = [...this.temp_goods_list, ...this.temp_serves_list]
      this.testingCheckAll()
    },
    // 添加服务
    addServe () {
      this.show_modal_serve = true
    },
    // 选中服务
    addServeTrue (list) {
      this.temp_serves_list = list
      this.data_list = [...this.temp_serves_list, ...this.temp_goods_list]
      this.testingCheckAll()
    },
    // 全选 or 取消
    checkedAllFnc () {
      let _this = this
      if (!this.checkedAll) {
        // 多选
        _this.selected_item = []
        this.info_list.forEach(item => {
          _this.selected_item.push(item)
        })
      } else {
        // 取消
        _this.selected_item = []
      }
    },
    // 检测是否全选
    testingCheckAll () {
      let checkNum = 0
      this.data_list.forEach(item => {
        let has = this.selected_item.some(sel => {
          return sel.product_id === item.product_id
        })
        if (has) {
          checkNum = checkNum + 1
        }
      })
      this.checkedAll = this.data_list.length === checkNum
    },
    // 单个删除商品服务
    deleteInfo (index, type, id) {
      this.data_list.splice(index, 1)
      if (type === 1) {
        // 同时删除临时保存 商品
        this.temp_goods_list.some((item, i) => {
          if (item.product_id === id) {
            this.temp_goods_list.splice(i, 1)
          }
          return item.product_id === id
        })
      } else {
        // 同时删除临时保存 服务
        this.temp_serves_list.some((item, i) => {
          if (item.product_id === id) {
            this.temp_serves_list.splice(i, 1)
          }
          return item.product_id === id
        })
      }
    },
    // 批量删除商品服务
    battchDeleteInfo () {
      let _this = this
      _this.checkedAll = false
      if (this.selected_item && this.selected_item.length) {
        this.selected_item.forEach(item => {
          _this.data_list.some((obj, index) => {
            if (obj.product_id === item.product_id) {
              _this.deleteInfo(index, item.type, item.product_id)
            }
            return obj.product_id === item.product_id
          })
        })
      }
      this.selected_item = []
    },
    // 完成并创建
    async saveInfo () {
      let card = JSON.parse(sessionStorage.getItem('card'))
      this.card = card || {}
      // 项目数据格式化
      let item = []
      let arr = this.card.items
      if (this.card.items) {
        arr.forEach(v => {
          v.num === '' ? v.num = 0 : v.num = v.num
          v.is_end ? v.is_end = 1 : v.is_end = 2
          v.type = 1
          v.expiry = 0
          v.price = 0
          item.push(v)
        })
      }
      let brr = this.card.project
      if (this.card.project.length) {
        brr.forEach(cell => {
          let obj = {
            num: cell.num === '' ? 0 : cell.num,
            type: 2,
            expiry: cell.expiry - 0,
            is_end: 2,
            price: 0,
            name: cell.name,
            description: cell.description,
          }
          if (cell.id) obj.id = cell.id
          item.push(obj)
        })
      }
      if (this.data_list && !this.data_list.length) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '关联商品不能为空',
        })
        return false
      }
      let info = this.card.info
      let condition = []
      this.data_list.forEach(item => {
        let temp = {
          sku_id: item.sku_id,
          type: item.type,
          spu_id: item.spu_id
        }
        condition.push(temp)
      })
      let obj = {
        info: {
          enterprise_id: 0,
          shop_id: 0,
          from: 2, // 2壳牌 1非壳牌
          name: info.name,
          image_url: info.image_url,
          category_id: info.classify.id,
          num: info.num,
          origin_price: (info.origin_price - 0) * 100, // 原价
          price: (info.price - 0) * 100, // 价格
          content: info.content, // 图文详情, 一张图
          expiry: info.expiry, // 有效期
          description: info.description, // 使用规则
        },
        item: item,
        condition: condition,
      }
      try {
        const {response, result} = await this.upkeepCreateApi(obj)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡添加失败',
              content: `${result.message}`,
            })
            this.isLoading = false
            return false
          }
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '养护卡添加成功',
            resolve: () => {
              this.$router.push({
                name: 'maintenanceCardList',
              })
            },
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '养护卡添加失败',
          content: `服务异常，请稍后再试（${err.message}）`,
        })
      }
    },
    // 更新数据
    async updateInfo () {
      let card = JSON.parse(sessionStorage.getItem('card'))
      this.card = card || {}
      // 项目数据格式化
      // 项目数据格式化
      let item = []
      let arr = this.card.items
      if (this.card.items) {
        arr.forEach(v => {
          v.num === '' ? v.num = 0 : v.num = v.num
          v.is_end ? v.is_end = 1 : v.is_end = 2
          v.type = 1
          v.expiry = 0
          v.price = 0
          item.push(v)
        })
      }
      let brr = this.card.project
      if (this.card.project.length) {
        brr.forEach(cell => {
          let obj = {
            id: cell.id,
            num: cell.num === '' ? 0 : cell.num,
            type: 2,
            expiry: cell.expiry - 0,
            is_end: 2,
            price: 0,
            name: cell.name,
            description: cell.description,
          }
          item.push(obj)
        })
      }
      if (this.data_list && !this.data_list.length){
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '关联商品不能为空',
        })
        return false
      }
      let info = this.card.info
      let condition = []
      this.data_list.forEach(item => {
        let temp = {
          sku_id: item.sku_id,
          type: item.type,
          spu_id: item.spu_id,
        }
        condition.push(temp)
      })
      let obj = {
        info: {
          enterprise_id: 0,
          shop_id: 0,
          from: 2, // 2壳牌 1非壳牌
          name: info.name,
          id: info.id,
          image_url: info.image_url,
          category_id: info.classify.id,
          num: info.num,
          origin_price: (info.origin_price - 0) * 100, // 原价
          price: (info.price - 0) * 100, // 价格
          content: info.content, // 图文详情, 一张图
          expiry: info.expiry, // 有效期
          description: info.description, // 使用规则
        },
        item: item,
        condition: condition,
      }
      try {
        const {response, result} = await this.upkeepUpdateApi(obj)
        if (response.status === 200) {
          if (result.code && result.code !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '养护卡更新失败',
              content: `${result.message}`,
            })
            this.isLoading = false
            return false
          }
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '养护卡更新成功',
            resolve: () => {
              this.$router.push({
                name: 'maintenanceCardList',
              })
            },
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '养护卡更新失败',
          content: `服务异常，请稍后再试（${err.message}）`,
        })
      }

    },
    // 返回上一步
    goBack () {
      this.card.temp_goods_list = this.temp_goods_list || []  // 临时保存商品数据
      this.card.temp_serves_list = this.temp_serves_list || []  // 临时保存商品数据
      sessionStorage.setItem('card', JSON.stringify(this.card))

      this.$router.push({
        name: 'maintenanceCardAdd',
      })
    },
    // 取消创建
    cancleCreate () {
      this.$router.push({
        name: 'maintenanceCardList',
      })
    },
  },
  mounted () {
    let card = JSON.parse(sessionStorage.getItem('card'))
    this.card = card || {}
    if (card && card.info && card.info.id) this.fetchGoodsList()
  },
  activated () {
    let card = JSON.parse(sessionStorage.getItem('card'))
    this.card = card || {}
  },
  deactivated () {
    sessionStorage.setItem('cardType', 1)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.btn-wrapper .button.primary{
  width: 145px;
}

.main-wrapper{
  padding: 0 40px;
  border-top: 1px solid #f1f1f1;
  border-bottom: 1px solid #f1f1f1;
}

.search-box{
  display flex
  justify-content space-between
  align-items center
  padding: 20px 0 10px;
  .left{
    display flex
    justify-content flex-start
  }
  .button{
    margin-left: 10px;
  }
}

.hide-hover{
  tr:hover{
    box-shadow: none;
  }
  tr:hover td:first-child{
    border-left: 2px solid transparent
  }
  tr{
    border-bottom: 1px solid #666
  }
  // tr td {
  //   padding-right: 10px;
  // }
  // tr td.has-text{
  //   padding-right: 30px;
  // }
}
.table{
  // min-height 300px;
}
.table-wrapper .empty-page-wrapper {
  min-height 300px
}
.btn-wrapper{
  padding-left: 40px;
}

.default{
  width: 100%;
  line-height: 300px;
  text-align: center;
  color: #999;
}


</style>

