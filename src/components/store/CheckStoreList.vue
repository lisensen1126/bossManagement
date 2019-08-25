<template lang="pug">
  .section-layout
    loading(v-if="is_loading")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.name_keyword", placeholder="门店名称", @keyupEnter="applyFilter")
        .field
          label.label 省
          custom-select(v-model="filterData.province", :list="province_list", nameField="name", placeholder="请选择省")
        .field
          label.label 市
          custom-select(v-model="filterData.city", :list="city_list", nameField="name", placeholder="请选择市")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有门店'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 门店名称
              td(width="60") 省
              td(width="80") 市
              td(width="120") 门店联系人
              td(width="120") 门店联系人电话
              td(width="120") 所属企业
              td(width="80") 门店类型
              td(width="80") 签约状态
              td(width="80") 经销商编码
              td(width="80") 门店编码
              td(width="160") 同步时间
              td(width="120") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.store_name")
              td
                .multi-content-td(v-text="item.province?item.province.name:'--'")
              td
                .multi-content-td(v-text="item.city?item.city.name:'--'")
              td
                .simple-td(v-text="item.contacts?item.contacts:'--'")
              td
                .simple-td(v-text="item.business_phone?item.business_phone:'--'")
              td
                .multi-content-td(v-text="item.enterprise?item.enterprise:'--'")
              td
                .multi-content-td(v-if="item.store_type == 1", v-text="'智慧门店'") 
                .multi-content-td(v-if="item.store_type == 2", v-text="'超凡门店'") 
              td
                .multi-content-td(v-if="item.sign_status == 1", v-text="'已签约'")
                .multi-content-td(v-if="item.sign_status == 2", v-text="'未签约'")
              td
                .multi-content-td(v-text="item.dealer_code")
              td
                .multi-content-td(v-text="item.store_code")
              td
                .multi-content-td(v-text="formateDate(item.created_at, true)")
              td
                .operation-td
                  a.operation-link.left(@click="goDetail(item)") 同步
                  .operation-link.left.post
                    span 添加电子合同
                    input(type="file", name="file", @change="selectPdf($event, item)")
                  a.operation-link(@click="setSigningState(item)", v-if="item.sign_status != 1") 修改签约状态
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import enterpriseMixin from '@/mixins/modules/enterprise'
import filterTools from '@/mixins/utilities/filterTools'
import EmptyPage from '@/components/generics/EmptyPage'
import formateDate from '@/mixins/utilities/formateDate'
import Loading from '@/components/generics/Loading'

export default {
  name: 'checkStoreList',
  mixins: [enterpriseMixin, filterTools, formateDate],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    Loading,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      store_id: '',
      filterData: {
        name_keyword: '',
        province: null, // 省
        city: null,  // 市
      },
      queryData: {},
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      showVersionModal: false,
      list: [],
      version: 1,
      version_value: '',
      province_list: [],  // 省列表
      city_list: [],  // 市列表
      is_loading: false,
    }
    // initialize conditions
    ;[schema.filterData, schema.queryData].forEach(conditions => {
      conditions.name_keyword = ''
    })
    return schema
  },
  methods: {
    /**
     * 去同步页面
     * @ id  门店的id
     */
    goDetail (item) {
      // 门店的四种类型图片未同步完时，给予提示，以延缓用户操作
      if (item.imageStatus == 1) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '数据未加载完成，请稍后尝试同步',
          resolve: () => {
            this.fetchData() // 刷新提审列表
          },
        })
        return false
      }
      this.$router.push({
        name: 'checkStoreEdit',
        params: {
          storeCode: item.store_code,
        },
        query: {
          edit: 1,
        },
      })
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 提审门店列表
    async fetchData () {
      try {
        const { response, result } = await this.fetchXianFengList({
          province: this.queryData.province ? this.queryData.province.name : '',
          city: this.queryData.city ? this.queryData.city.name : '',
          name_keyword: this.queryData.name_keyword,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
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
      this.filterData.name_keyword = ''
      this.filterData.province = null
      this.filterData.city = null
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.city_list = []
      this.fetchData()
    },
        /**
     * 上传电子合同
     * file {Object} 文件对象
     * item {Object} 门店信息
     */
    async selectPdf (file, item) {
      this.is_loading = true
      let file_obj = file.target.files[0]
      if (file_obj.type !== 'application/pdf') {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '请选择pdf格式文件',
        })
        return false
      }
      let _this = this
      await this.upAfferentApi({
        id: item.id,
        file: file_obj,
      }).then(function (result) {
        if (result.data.code === 0) {
          _this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '成功',
            content: '上传电子合同成功！',
          })
          item.sign_status = 1
          _this.is_loading = false
        } else {
          _this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '上传电子合同失败',
            content: `出错啦!${result.data.message}`,
          })
        }
      }, function (err) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '上传电子合同失败',
          content: `出错啦!${err.message}`,
        })
      })
    },
    /**
     * 获取省市区
     * parentId  {Number, String}  省市区id
     * type  {String} 类别
     */
    async getRegions (type, parentId) {
      const { response, result } = await this.fetchRegions({ parent_id: parentId })
      if (response.status === 200 && result.code === 0) {
        type === 'province' ? this.province_list = result.data : this.city_list = result.data
      } else {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '网络出错了，请稍后再试',
          content: `${response.status} ${result.message}`,
        })
      }
    },
    /**
     * 修改签约状态操作
     * state {Object} 门店数据
     */
    setSigningState (state) {
      this.$store.dispatch('showMessage', {
        title: '温馨提示',
        content: '确认修改签约状态？',
        isRejectable: 1,
        resolve: () => {
          this.signingStateFn(state)
        },
      })
    },
    /**
     * 修改签约状态接口请求
     * state {Object} 门店数据
     */
    async signingStateFn (state) {
      try {
        const { response, result } = await this.setSigningApi({
          id: state.id,
        })
        if (response.status === 200 && result.code === 0) {
          state.sign_status === 1 ? state.sign_status = 2 : state.sign_status = 1
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改门店签约状态失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '修改门店签约状态失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.queryData = JSON.parse(JSON.stringify(this.filterData))
    this.getRegions('province', 0)
    this.fetchData()
  },
  watch: {
    'filterData.province' (v) {
      this.filterData.city = null
      this.city_list = []
      if (v) this.getRegions('city', v.id)
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
td,.multi-content-td {
  vertical-align: middle;
  word-break: break-all;
}
.section-filter {
  display: flex;
  justify-content: space-between;
}

.name_keyword-wrapper {
  width: 244px;
}
.left {
  margin-right: 10px !important;
}
.post {
  position: relative;
  input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
  }
}
</style>

