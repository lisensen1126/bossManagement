<!--选择地域或门店-->
<template lang="pug">
  modal-dialog(modal-scale="card", class="choose-store")
    .modal-card(slot="card")
      .modal-header
        service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
        .close-button(@click="modalClose")
      .modal-body
        .main-left(v-if="parseInt(default_value) === 1")
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 门店名称
                custom-input(v-model="filter_data.keywords", placeholder="请输入门店名称", @keyupEnter="searchFilter(1)")
              .field
                a.button.primary(@click="searchFilter(1)") 搜索
              .field
                a.button(@click="resetFilter") 重置
          empty-page(v-if="!data_list.length", :tip="'暂无内容'")
          .table-wrapper(v-if="data_list && data_list.length")
            table.table
              thead
                tr
                  td(width="30")
                    .checkbox
                      input(type="checkbox", id="all01", v-model="checkedAll", @click="checkedAllFnc")
                      label.sepcific-setting(for="all01", v-text="'全选'")
                  td(width="150") 门店名称
              tbody
                tr(v-for="item in data_list")
                  td
                    .simple-td
                      .checkbox
                        input(type="checkbox", :id="item.product_id", :value="item", name="modal", @change="checkItem(item)", v-model="selected_item", :checked="item.selected")
                        label.sepcific-setting(:for="item.product_id")
                  td
                    .simple-td(v-if="item.is_chain === 1") (连锁){{item.store_name}}
                    .simple-td(v-if="item.is_chain === 2") {{item.store_name}}
          .tfoot(v-if="parseInt(default_value) === 1")
            pagination(:pagination-data="pagination_data", @input="paging")
        .main-left(v-if="parseInt(default_value) === 2" :class="parseInt(defaultValue) > 2 ? 'width-100' : ''",)
          .section-filter.is-horizontal
            .field-group.is-horizontal
              .field.is-keyword
                label.label 省
                .control.select-box-wrapper
                  .select-box
                    custom-select(v-model="province", :list="provinceList", @input="changePrive")
              .field.is-keyword
                label.label 市
                .control.select-box-wrapper
                  .select-boxs
                    .item-select.select-city(@click="getCity")
                      .add-icon
                      |  选择城市
          .div.choose-select
            .right-title 已选择地域：
            .right-content
              div(v-for="(item, index) in show_city")
                .item-box
                  .item-name {{item.name}}
                  label.item-delete(@click="del(index)")
                .item-box.secondary(v-for="(city_item, cindex) in item.children", v-if="item.id !== -1")
                  .item-name {{city_item.name}}
                  label.item-delete(@click="delSubarray(index, cindex)")
        .main-right-store(v-if="parseInt(default_value) === 1")
          .right-title 选中内容
          .right-content
            .item-box-store(v-for="(item, index) in selected_item")
              input(type="checkbox", :id="item.store_id" hidden="true" :value="item", name="modal", v-model="selected_item", :checked="item.selected")
              .item-name(v-text="item.store_name")
              label.item-delete-store(:for="item.store_id")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
      choose-city(v-model="itemCity", v-if="itemCity", @resolve="addCity", :provinceId="provinceId", :nowCityList="nowCityList")
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import Api from '@/mixins/modules/boss'
  import ImageScale from '@/mixins/utilities/imageScale'
  import FilterTools from '@/mixins/utilities/filterTools'
  import Pagination from '@/components/generics/Pagination'
  import ServiceTab from '@/components/generics/ServiceTab'
  import ChooseCity from '@/components/generics/ChooseCity'
  import Utils from '@/mixins/utilities/utils'
  import drawApi from '@/mixins/modules/draw'
  import basicsApi from '@/mixins/modules/basics'

  export default {
    name: 'ChooseGoods',
    components: {
      ModalDialog,
      CustomSelect,
      CustomInput,
      EmptyPage,
      Pagination,
      ServiceTab,
      ChooseCity,
    },
    mixins: [ModalInteractions, drawApi, basicsApi, Api, ImageScale, FilterTools, Utils],
    props: {
      array: {
        type: Array,
        default: () => [],
      },
      cityList: {
        type: Array,
        default: () => [],
      },
      arrayShop: {
        type: Array,
        default: () => [],
      },
      id: {
        type: [String, Number],
      },
      isEdit: {
        type: [String, Number],
      },
      isBoss: {
        type: [String, Number],
      },
      defaultValue: {
        type: [String, Number],
        default: 2,
      },
    },
    data () {
      return {
        filter_data: { // 搜索条件
          id: '',
          keywords: '',
        },
        first_state: null, // 一级分类
        first_class_list: [],
        second_state: null, // 二级分类
        second_class_list: [],
        data_list: [], // 数据列表
        pagination_data: { // 分页
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        checkedAll: false, // 全选状态
        tabList: [
          {
            name: '指定门店',
            type: '1',
          },
          {
            name: '指定地域',
            type: '2',
          },
        ],
        tab: {               // 默认选中tab
          name: '指定门店',
          type: '1',
        },
        default_value: '1',  // 页面tab初始值
        selected_item: [], // 选中的
        all_city: [],  // 组装省市的数组
        show_city: [], // 显示省市的数组
        nowCityList: [], // 当前选择的城市
        itemCity: false, // 是否展示城市组件
        province: null, //  所有省
        all: false, // 判断是否选择所有省
        city_id: [], // 传入后台的市id
        city_list: [], // 暂存每次选中的市
        provinceList: [{
          id: -1,
          name: '全部',
        }],
        items: [],
        temporary_store: [], //暂存得门店数据
        original_store: [], // 弹出框原始数据
        temporary_city_store: [], //接口返回城市下的城市数据
        is_edit: 2,
        center: [],
      }
    },
    watch: {
      'selected_item' () {
        this.checkedAll = false
        let length = 0
        let src = JSON.stringify(this.data_list)
        this.selected_item.forEach(item => {
          if (src.indexOf(JSON.stringify(item)) !== -1) {
            length += 1
          }
        })
        if (length === this.data_list.length) this.checkedAll = true
      },
    },
    methods: {
      checkItem(item) {
        let self = this
        this.temporary_store = []
        this.selected_item.forEach(item => {
          if(item.type === 2) {
            item.selected = true
            self.temporary_store.push(item)
          }
        })
      },
      // tab切换
      changePage (params) {
        if (params.type === this.default_value) return   // 已是选中状态不再请求接口
        this.default_value = params.type
        if (parseInt(this.default_value) === 1) {
          this.getStoreCityList()
        } else {
          if (this.filter_data.id) {
            this.province = null
          }
        }
      },
      // 搜索按钮
      searchFilter () {
        this.pagination_data.current_page = 1
        this.getStoreList()
      },
      // 重置
      resetFilter () {
        this.filter_data.keywords = ''
        if (parseInt(this.default_value) === 1) {
          this.getStoreList()
        } else {
          if (this.filter_data.id) {
            this.province = null
          }
        }
      },
      // 获取门店列表数据
      async getStoreList () {
        let arr_city = []
        this.show_city.forEach(e => {
          if (e.children) {
            arr_city = []
          } else {
            arr_city.push(-1)
          }
        })
        let params = {
          setting_id: this.filter_data.id,
          city_id: arr_city,
          type: 1,
          store_name: this.filter_data.keywords ? this.filter_data.keywords : '',
          page: this.pagination_data.current_page,
          size: this.pagination_data.per_page
        }
        try {
          const { response, result } = await this.getStoreListApi(params)
          if (response.status === 200 && result.code === 0) {
            this.data_list = result.data.map(item => {
              let tempType
              let has = this.selected_item.some(sel => {
                tempType = sel.type
                return item.shop_id == sel.shop_id
              })
              item.selected = has
              if (has) {
                item.type = tempType
              }
              return item
            })
            // 分页器数据更新
            this.pagination_data = result.meta
            this.checkedAll = false
            let length = 0
            let src = JSON.stringify(this.data_list)
            this.selected_item.forEach(item => {
              if (src.indexOf(JSON.stringify(item)) !== -1) {
                length += 1
              }
            })
            if (length === this.data_list.length) this.checkedAll = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店列表失败',
              content: '获取门店列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取全部门店列表
      async getStoreAllList () {
        let arr_city = []
        this.show_city.forEach(e => {
          if (e.children) {
            arr_city = []
          } else {
            arr_city.push(-1)
          }
        })
        let params = {
          setting_id: this.filter_data.id,
          city_id: arr_city,
          type: 1,
          store_name: this.filter_data.keywords ? this.filter_data.keywords : '',
          page: this.pagination_data.current_page,
          size: 9999
        }
        try {
          const { response, result } = await this.getStoreListApi(params)
          if (response.status === 200 && result.code === 0) {
            // 列表数据赋值
            let arr = []
            for (let i = 0; i < result.data.length; i++) {
              result.data[i].selected = result.data[i].type === 1 ? true : false
              if (result.data[i].type === 1) {
                arr.push(result.data[i])
              }
            }
            this.original_store = arr // 原始数据备份
            this.selected_item = arr
            this.getStoreList() // 获取门店列表
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店列表失败',
              content: '获取门店列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取城市下的门店
      async getStoreCityList () {
        let arr_city = []
        this.show_city.forEach(e => {
          if (e.children) {
            e.children.forEach(i => {
              arr_city.push(i.id)
            })
          } else {
            arr_city.push(-1)
          }
        })
        let params = {
          setting_id: this.filter_data.id,
          city_id: arr_city,
          type: 2,
          store_name: this.filter_data.keywords ? this.filter_data.keywords : '',
          page: this.pagination_data.current_page,
          size: 9999
        }
        try {
          const { response, result } = await this.getStoreListApi(params)
          if (response.status === 200 && result.code === 0) {
            if(result.data && result.data.length > 0) {
              this.temporary_city_store = result.data.map(item => {
                item.type = 3
                item.selected = true
                return item
              })
            } else {
              this.temporary_city_store = []
            }
            let tempArr = []
            this.selected_item.forEach(item => {
              if(item.type != 3) {
                tempArr.push(item)
              }
            })
            this.selected_item = this.uniqForBasic([...tempArr, ...this.temporary_city_store])
            this.getStoreList()
            console.log(this.selected_item, '选中')
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店列表失败',
              content: '获取门店列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      async getBossList () {
        let params = {}
        if (this.defaultValue - 0 === 4) {
          params.open_screen_id = this.filter_data.id
        } else {
          params.slide_id = this.filter_data.id
        }
        try {
          const { response, result } = this.defaultValue - 0 === 4 ? await this.getOpenCityApi(params) : await this.bossBannerCityApi(params)
          if (response.status === 200 && result.code === 0) {
            if (!result.data.length) {
              result.data = [{
                name: '全国',
                id: -1,
                data: [{
                  name: '全国',
                  id: -1,
                }],
              }]
            }
            let arr = []
            result.data.forEach(e => {
              e.children = e.data
            })
            arr = [...result.data]
            this.show_city = this.uniqForBasicCity(arr)
            this.all_city = this.uniqForBasicCity(arr)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地域列表失败',
              content: '获取地域列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地域列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取城市列表数据
      async getAppointStoreList () {
        let params = {
          setting_id: this.filter_data.id,
        }
        try {
          const { response, result } = await this.getAppointCityApi(params)
          if (response.status === 200 && result.code === 0) {
            let arr = []
            result.data.forEach(e => {
              e.children = e.data
            })
            arr = [...result.data]
            this.show_city = this.uniqForBasicCity(arr)
            this.all_city = this.uniqForBasicCity(arr)
            if (this.defaultValue === 2) this.getStoreAllList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地域列表失败',
              content: '获取地域列表发生错误，请稍后再试',
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地域列表失败',
            content: `服务异常，请稍后再试（${
              err.response ? err.response.status : err
              }${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 去重门店
      uniqForBasic(array){
        let temp = [];
        let index = [];
        let len = array.length;
        for(let i = 0;i < len;i++){
          for(let j = i+1;j < len;j++){
            //如果下一个值等于前一个值重复
            if(array[i].store_id === array[j].store_id){
              i++;
              j = i;
            }
          }
          temp.push(array[i]);
          index.push(i);
        }
        return temp;
      },
      // 去重地域
      uniqForBasicCity(array){
        let temp = [];
        let index = [];
        let len = array.length;
        for(let i = 0;i < len;i++){
          for(let j = i+1;j < len;j++){
            //如果下一个值等于前一个值重复
            if(array[i].id === array[j].id){
              i++;
              j = i;
            }
          }
          temp.push(array[i]);
          index.push(i);
        }
        return temp;
      },
      // 分页
      paging (state, evt) {
        this.pagination_data = state
        this.getStoreList()
      },
      // 全选 or 取消
      checkedAllFnc () {
        let _this = this
        if(!this.checkedAll){
          // 多选
          this.data_list.forEach(item => {
            let has = _this.selected_item.some(obj => obj.store_id == item.store_id)
            if(!has){
              _this.selected_item.push(item)
              _this.temporary_store.push(item)
              _this.temporary_store.forEach(e => {
                e.selected = true
              })
            }
          })
        }else{
          // 取消
          this.data_list.forEach(item => {
            let index = 0
            let has = _this.selected_item.some((obj, i) => {
              index = i
              return obj.store_id == item.store_id
            })
            if(has){
              _this.selected_item.splice(index, 1)
              _this.temporary_store.splice(index, 1)
              _this.temporary_store.forEach(e => {
                e.selected = false
              })
            }
          })
        }
      },
      // 完成
      complete () {
        this.modalResolve(this.selected_item, this.show_city, this.is_edit)
      },
      cancle () {
        this.$emit('callback')
      },
      // 获取省份
      async getSheng () {
        try {
          const {response, result} = await this.fetchRegions()
          if (response.status) {
            var arr = this.provinceList
            result.data.forEach(item => {
              arr.push(item)
            })
            this.provinceList = arr
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取省列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取省列表失败',
            content: `错误：${err}`,
          })
        }
      },
      /*
      * 接收组件选择的城市
      * @ q 组件所选择的城市
      * */
      addCity (q) {
        this.nowCityList = q
        this.all_city[this.all_city.length-1].children = this.nowCityList
        let arr = []
        this.all_city.forEach(e => {
          if (e.children) {
            arr.push(e)
          }
        })
        this.show_city = this.uniqForBasicCity(arr)
      },
      // 选择省
      changePrive (q) {
        let self = this
        self.nowCityList = []
        self.province = q
        if (self.province.id === -1) {
          self.all = true
          self.show_city = []
          self.all_city = []
          self.show_city.push(self.province)
        } else {
          self.all = false
          self.provinceId = self.province.id
          self.all_city.push(self.province)
        }
      },
      // 选择城市
      getCity () {
        if (this.province) {
          if (this.province.id !== -1) {
            this.itemCity = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '已选择覆盖全国，不需要再次选择城市',
            })
            return
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请先选择省级',
          })
          return
        }
      },
      // 删除
      del (index) {
        this.show_city.splice(index, 1)
        this.all_city.splice(index, 1)
        this.province = null
      },
      // 删除子数组
      delSubarray (index, cindex) {
        this.province = null
        let arr = this.show_city[index].children
        arr.splice(cindex, 1)
        this.$set(this.show_city[index], 'children', arr)
        this.$set(this.all_city[index], 'children', arr)
        this.$forceUpdate()
        if (this.show_city[index].children.length === 0) {
          this.show_city.splice(index, 1)
          this.all_city.splice(index, 1)
        }
      },
    },
    mounted () {
      this.filter_data.id = this.id
      this.selected_item = [...this.array]
      this.show_city = [...this.cityList]
      this.all_city = [...this.cityList]
      this.getSheng() // 获取省
      if (this.defaultValue - 0 > 2) {
        this.tabList = [{
          name: '指定地域',
          type: '2',
        }]
        this.tab = {
          name: '指定地域',
          type: '2',
        }
        this.default_value = 2
        if (parseInt(this.isEdit) === 1) {
          this.getBossList() // 获取城市列表
        }
      } else {
        this.getStoreList() // 获取全部门店得列表
        if (parseInt(this.isEdit) === 1) {
          this.getAppointStoreList() // 获取城市列表
        }
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-card
    width 1150px !important
  .modal-card-title
    overflow hidden
    .shop
      float left
      margin-right 20px
      color #353535
    .active
      border-bottom 2px solid #ffbb29
  .modal-footer
    padding 12px 16px
  .modal-body
    display flex
    justify-content space-between
    .main-left
      position relative
      width 800px
      height 520px
      display flex
      flex-direction column
      padding-bottom 36px
    .main-right-store
      width 350px
      padding 0 15px
      .right-title
        font-size 14px
        line-height 40px
        border-bottom 1px solid #f0f1f2
      .right-content
        height 479px
        overflow-y auto
        .item-box-store
          display flex
          justify-content space-between
          align-items center
          height 40px
          padding 0 5px
          border-bottom 1px solid #f0f1f2
          margin-bottom 5px
          font-size 12px
          .item-name
            width 300px
          .item-delete-store
            width 20px
            height 20px
            background center no-repeat url('~@/assets/modal/close.svg')
            cursor pointer
  .table-wrapper
    padding 8px 16px
    flex-grow 1
    background standBackground
    .items
      + .items
        margin-top 8px
      display flex
      height 48px
      align-items center
      background #ffffff
      padding 0 16px
    .checkbox
      flex-shrink 0
      margin-right 16px
    .image
      width 32px
      height 32px
      flex-shrink 0
      margin-right 16px
    .item-content
      max-width 343px
      margin-right 16px
      font-size 13px
      line-height 16px
      flex-grow 1
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
    .price-content
      font-weight bold
      width 100px
      flex-shrink 0
      font-size 13px
      line-height 16px
      text-overflow ellipsis
      white-space nowrap
      overflow hidden
  .simple-td
    height 32px
    line-height 32px
    display flex
    align-items center
  .limit-info
    font-size 13px
    color darker
    align-items center
    .count
      color mediumYellow
      margin-left 10px
  .filter-wrapper
    flex-shrink 0
    box-sizing border-box
    background #e8e9eb
    padding 12px 16px
    display flex
    flex-direction row
  .custom-select
    width 128px
    margin-right 8px
    flex-shrink 0
  .custom-input
    flex-grow 1
    margin-right 8px
  .filter-wrapper
    .button + .button
      margin-left 8px
  .pagination
    flex-shrink 0
    height 36px
    display flex
    justify-content space-between
    align-items center
    padding 0 16px
    background #ffffff
    box-shadow 0 -1px 12px 0 rgba(0, 0, 0, 0.08)
  .pagination-info
    font-size 13px
    line-height 16px
    color lightGrey
  .page-turning
    font-size 13px
    line-height 16px
    color lightGrey
    height 100%
    display flex
    align-items center
    cursor pointer
    &.is-disabled
      opacity .2
      pointer-events none
    &:hover
      color mediumYellow
      .pre-icon
        background-image url('~@/assets/prev-hover.svg')
      .next-icon
        background-image url('~@/assets/next-hover.svg')
  .pre-icon
  .next-icon
    display inline-block
    width 16px
    height 16px
    background url('~@/assets/prev.svg') no-repeat center center
    background-size 14px
  .next-icon
    background-image url('~@/assets/next.svg')
  .img
    width 32px
    height 32px
  .tfoot
    z-index 3
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
  .select-city
    padding 0 15px
    background #fff
    border 1px solid #ccc
    border-radius 2px
    color #353535
    height 32px
    line-height 32px
    cursor pointer
    box-sizing border-box
    width 100%
    font-size: 13px
  .choose-select
    padding 14px 24px
  .right-title
    font-size 14px
    height 40px
    line-height 40px
  .right-content
    height 350px
    overflow-y auto
    .item-box
      width: 200px
      display flex
      justify-content space-between
      align-items center
      height 34px
      padding 0 5px
      border-bottom 1px solid #f0f1f2
      margin-bottom 5px
      font-size 12px
      .item-name
        font-size 14px
        width 300px
      .item-delete
        width 20px
        height 20px
        background center no-repeat url('~@/assets/modal/close.svg')
        cursor pointer
    .secondary
      margin-left 10px
      width 190px

  .width-100
    width 100% !important
</style>

<style lang="stylus">
  .choose-store
    .section-filter
      padding-left 24px!important
    .top-nav
      .status-list
        justify-content flex-start!important
</style>
