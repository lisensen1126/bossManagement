<template lang="pug">
  .section-layout
    loading(v-if="is_loading")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.name_keyword", placeholder="门店名称/门店编码", @keyupEnter="applyFilter")
        .field
          label.label 省
          custom-select(v-model="filterData.province", :list="province_list", nameField="name", placeholder="请选择省")
        .field
          label.label 市
          custom-select(v-model="filterData.city", :list="city_list", nameField="name", placeholder="请选择市")
        .field
          label.label 是否加入平台
          custom-select(:list="statusList", v-model="filterData.getStatus", :input="changeStatus")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置{{currentUser.isis_system_admin}}
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary.add(@click="createStore",v-if="currentUser.is_system_admin && currentUser.is_system_admin == 1")
            span.add-icon
            span.add-store 添加门店
        .field
          a.button.primary.export(@click="exportData")
            span 导出门店数据
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有门店'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 门店名称
              td(width="80") 门店编码
              td(width="40") 省
              td(width="40") 市
              td(width="40") 联系人
              td(width="40") 联系人电话
              td(width="90") 所属企业
              td(width="80") 小程序类型
              <!--td(width="60") 门店类型-->
              td(width="80") 是否加入平台
              td(width="80") 门店开通时间
              td(width="120") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .multi-content-td.textzh(v-text="item.store_name")
              td
                .multi-content-td.textnew(v-if="item.store_code !== ''" v-text="item.store_code")
                .simple-td(v-else v-text="'--'")
              td
                .simple-td(v-text="item.province_name?item.province_name:'--'")
              td
                .simple-td(v-text="item.city_name?item.city_name:'--'")
              td
                .simple-td(v-text="item.contacts")
              td
                .simple-td(v-text="item.business_phone")
              td
                .multi-content-td.textzh(v-if="item.enterprise !== null" v-text="item.enterprise.name")
                .simple-td(v-else v-text="'--'")
              td
                .multi-content-td.textzh(v-if="item.is_chain == 1") 一个小程序
                .multi-content-td.textzh(v-if="item.is_chain == 2") 多小程序
              <!--td-->
                <!--.simple-td(v-if="item.store_type == 1" v-text="'智慧门店'")-->
                <!--.simple-td(v-if="item.store_type == 2" v-text="'超凡门店'")-->
              td
                .simple-td(v-if="item.is_apply==1") 是
                .simple-td(v-if="item.is_apply==2") 否
              td
                .simple-td(v-text="formateDate(item.sync_time, true)")
              td
                .operation-td
                  a.operation-link.left(@click="goPay(item)") 支付
                  a.operation-link.left(@click="fetchDetail(item.store_id,item.shop.shop_id)") 查看
                  a.operation-link.left(@click="goStoreDetail(item.store_id)") 编辑
                  a.operation-link.left(@click="deleteStore(item)", v-if="currentUser.is_system_admin === 1") 删除
                  a.operation-link.left(@click="goStoreEvaluate(item.store_id)") 评价管理
                  // a.operation-link.left(v-if="item.is_chain !== 1" @click="tabVersionModal(item)") 类型切换
                  .operation-link.left.post
                    span 添加电子合同
                    input(type="file", name="file", @change="selectPdf($event, item)")
                  a.operation-link(v-if="item.compact_url !=''", :href="item.compact_url", target="_blank") 查看电子合同
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
    .modal(v-if="showVersionModal")
      .box
        .header-box 门店类型切换
        .field-group
          .radio
            input(type="radio", id="man", value="2", v-model="version")
            label.sepcific-setting(for="man") 保养版(C版)
          .radio
            input(type="radio", id="woman", value="1", v-model="version")
            label.sepcific-setting(for="woman") 综合版(B版)
        .footer-box
          .button.primary(@click="switchVersion") 确认
          .button(@click="cancel") 取消
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import Loading from '@/components/generics/Loading'
import enterpriseMixin from '@/mixins/modules/enterprise'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import storePayApi from '@/mixins/modules/StorePay'
import formateDate from '@/mixins/utilities/formateDate'
import { mapGetters } from 'vuex'
import {root} from '@/plugins/Fetch'
export default {
  name: 'StoreList',
  mixins: [enterpriseMixin, filterTools, imageScale, storePayApi, formateDate],
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    CustomSelect,
    Loading,
  },
  data () {
    const schema = {
      root,
      isInitiated: false,
      enterprise_id: '',
      store_id: '',
      province_list: [],  // 省列表
      city_list: [],  // 市列表
      statusList: [{
        name: '全部',
        status: '',
      }, {
        name: '是',
        status: '1',
      }, {
        name: '否',
        status: '2',
      }],
      filterData: {
        name_keyword: '',
        province: null, // 省
        city: null,  // 市
        getStatus: {
          name: '全部',
          status: '',
        },
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
      up_pdf: null,
      is_loading: false,
      is_first_enter: false, // 是否第一次进入
    }
    ;[schema.filterData, schema.queryData].forEach(conditions => {
      conditions.name_keyword = ''
    })
    return schema
  },
  methods: {
    changeStatus (q) {
      this.getStatus = q
    },
    /*
    * 支付
    * @ item  门店对象
    * */
    async goPay (item) {
      try {
        const { response, result } = await this.getMerchantApi({ store_id: item.store_id })
        if (response.status === 200) {
          if (result.code === 0) {
            if (result.data.merchantId) {
              this.$router.push({
                name: 'storePay',
                query: {
                  storeId: item.store_id,
                  storeName: item.store_name,
                },
              })
            } else {
              this.$router.push({
                name: 'storePerfect',
                query: {
                  storeId: item.store_id,
                  storeName: item.store_name,
                },
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取虚拟门店失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取虚拟门店失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取虚拟门店失败',
          content: `错误：${err}`,
        })
      }
    },
    /**
     * 编辑
     * @ id  门店的id
     */
    goStoreDetail (id) {
      this.$router.push({
        name: 'storeEdit',
        params: {
          storeId: id,
        },
        query: {
          edit: 2,
        },
      })
    },
    /**
     * 查看
     * @ id  门店的id
     */
    fetchDetail (id, shopId) {
      this.$router.push({
        name: 'storeDetailNav',
        params: {
          storeId: id,
        },
        query: {
          edit: 3,
          shop_id: shopId,
        },
      })
    },
    /**
     * 删除
     * @item 删除的门店对象
     */
    deleteStore (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认删除‘${item.store_name}’该门店？`,
        isRejectable: 1,
        resolve: () => {
          this.deleteFun(item.store_id)
        },
      })
    },
    /**
     * 删除门店
     * @id 删除的门店id
     */
    async deleteFun (id) {
      try {
        let { response, result } = await this.deleteStoreApi({
          store_id: id,
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
      } catch ({response, result}) {
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
     * 评价管理
     * @ id  门店的id
     */
    goStoreEvaluate (id) {
      this.$router.push({
        name: 'storeEvaluate',
        query: {
          storeId: id,
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
    // 添加门店按钮
    createStore () {
      this.$router.push({
        name: 'storeCreate',
        query: {
          edit: 1,
        },
      })
    },
    // 门店列表
    async fetchData () {
      try {
        const { response, result } = await this.fetchStoreList({
          name_keyword: this.queryData.name_keyword,
          province_id: this.queryData.province ? this.queryData.province.id : '',
          city_id: this.queryData.city ? this.queryData.city.id : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
          enterprise_id: this.enterprise_id,
          is_apply: this.queryData.getStatus.status
        })
        if (response.status === 200) {
          if (result.code === 0) {
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
    // 导出门店列表
    exportData () {
      window.open(`${root}/stores/list?name_keyword=${this.queryData.name_keyword}&province_id=${this.queryData.province ? this.queryData.province.id : ''}&city_id=${this.queryData.city ? this.queryData.city.id : ''}&enterprise_id=${this.enterprise_id}&is_apply=${this.queryData.getStatus.status}&export=1`)
    },
    // 搜索按钮
    applyFilter () {
      for (let key in this.filterData) {
        if (this.queryData.hasOwnProperty(key)) {
          this.queryData[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      // this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    // 重置
    resetFilter (page) {
      this.paginationData.current_page = page || 1
      this.filterData.name_keyword = ''
      this.filterData.getStatus = {
        name: '全部',
        status: '',
      },
      this.filterData.province = null
      this.filterData.city = null
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.city_list = []
      this.fetchData()
    },
    // 控制小程序版本切换弹框
    tabVersionModal (params) {
      this.showVersionModal = !this.showVersionModal
      this.version = params.mini_type + ''
      this.store_id = params.store_id
    },
    cancel () {
      this.showVersionModal = !this.showVersionModal
    },
    // 确定切换版本操作
    async switchVersion () {
      try {
        const { response, result } = await this.updataMiniType({
          store_id: this.store_id,
          mini_type: this.version,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.fetchData()
            this.showVersionModal = !this.showVersionModal
          } else {
            this.showVersionModal = !this.showVersionModal
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '类型切换失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } else {
          this.showVersionModal = !this.showVersionModal
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '网络出错了，请稍后再试',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.showVersionModal = !this.showVersionModal
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '类型切换失败',
          content: `错误：${err}`,
        })
      }
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
        this.is_loading = false
        return false
      }
      let _this = this
      await this.upContractApi({
        store_id: item.store_id,
        file: file_obj,
      }).then(function (result) {
        if (result.data.code === 0) {
          _this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '成功',
            content: '上传电子合同成功！',
          })
          _this.fetchData()
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
  },
  mounted () {
    this.is_first_enter = true
    this.enterprise_id = this.$route.query.enterpriseId || ''
    this.getRegions('province', 0)
  },
  watch: {
    'filterData.province' (v) {
      this.filterData.city = null
      this.city_list = []
      if (v) this.getRegions('city', v.id)
    },
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if ((from.name === 'storeDetailNav' || from.query.edit === 2) && to.query.save !== 1) {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter(this.paginationData.current_page)
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
td {
  vertical-align: middle !important;
}
.multi-content-td{
  vertical-align: middle;
}
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 40px;
}
.textnew {
  text-overflow: ellipsis;
  max-width: 80px;
  word-break: break-all;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.name_keyword-wrapper {
  width: 244px;
}

.button {
  align-items: center;
}

.give-icon {
  display: none;
}

.left {
  margin-right: 10px !important;
}

.add-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: url('~@/assets/icons/button-add.svg') no-repeat center center;
  background-size: cover;
  margin-right: 6px;
}

.td-with-tip {
  position: relative;
  display: flex;
  align-items: center;
}

.help-tip-icon {
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  background: url('~@/assets/icons/help.svg') no-repeat center center;
  background-size: cover;
  margin-left: 4px;

  &:hover {
    .help-tip {
      display: block;
    }
  }
}

.help-tip {
  display: none;
  z-index: 213;
  position: absolute;
  top: 22px;
  left: -76px;
  width: 160px;
  padding: 4px 6px;
  border-radius: 2px;
  background-color: #121212;
  color: #fff;
  font-size: 12px;
  line-height: 18px;

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    left: 50%;
    top: -4px;
    margin-left: -2px;
    transform: rotate(45deg);
    background-color: #121212;
  }
}

.gray {
  color: #989ba1;
}

.text-center {
  text-align: center;
}

.justify-center {
  justify-content: center;
}

.operation-link {
  margin-right: 0;
}

.text-overflow {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
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

.modal{
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
  position:fixed;
  top: 0;
  left: 0;
  z-index: 100;
  .box{
    width: 320px;
    height: 200px;
    background-color: #fff
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    margin auto
    border-radius borderRadiusLarge
    .header-box{
      border-bottom 1px solid #f5f5f5
      text-align center
      height 48px
      line-height 48px
      font-size 16px
    }
    .radio{
      margin-top 20px
      margin-left 80px
    }
    .footer-box{
      width 100%
      padding 10px 20px
      position absolute
      bottom 0
      left 0
      border-top 1px solid #f5f5f5
      .button{
        float right
      }
      .primary{
        margin-left 10px
      }
    }
  }
}
.add-store {
  display inline-block
  width 56px
}
.export, .add {
  margin-left 10px
}
.export span {
  display inline-block
  width 80px
}
</style>

