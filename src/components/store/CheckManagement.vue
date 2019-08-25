<template lang="pug">
  .section-layout
    loading(v-if="is_loading")
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 门店状态
          custom-select(:list="statusList", v-model="filterData.getStatus", :input="changeStatus")
        .field
          label.label 省
          custom-select(v-model="province", :list="province_list", nameField="name", placeholder="请选择省")
        .field
          label.label 市
          custom-select(v-model="city", :list="city_list", nameField="name", placeholder="请选择市")
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.name_keyword", placeholder="门店名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置{{currentUser.isis_system_admin}}
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有门店'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 门店名称
              td(width="60") 门店地址
              td(width="50") 联系人
              td(width="50") 联系电话
              td(width="80") 预约电话
              td(width="60") 所属企业
              td(width="120") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td
                  .multi-content-td.textzh(v-text="item.store.store_name")
              td
                .simple-td {{item.store.province_name}}{{item.store.city_name}}{{item.store.district_name}}{{item.store.address}}
              td
                .simple-td(v-text="item.store.contacts?item.store.contacts:'--'")
              td
                .simple-td(v-text="item.store.business_phone?item.store.business_phone:'--'")
              td
                .simple-td(v-text="item.store.reservation_phone?item.store.reservation_phone:'--'")
              td
                .simple-td(v-text="item.enterprise.name?item.enterprise.name:'--'")
              td
                .operation-td
                  a.operation-link.left(@click="debar(item, index, 1)", v-if="item.status === 2") 解禁
                  a.operation-link.left(@click="debar(item, index, 1)", v-if="item.status === 1") 禁入
                  a.operation-link.left(@click="fetchDetail(item, index)") 分账信息
                  a.operation-link.left(@click="delDetail(item.shop_id)") 删除
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
    .modal(v-if="showVersionModal")
      .box
        .header-box-vice 分账信息
        .info-class 微信信息
        .field-group.content-frame
          .field.is-horizontal
            label.label 微信号
            custom-input(v-model.trim="weChat_number", :validator="$v.weChat_number", placeholder="请输入微信号", error-info="微信号必填")          
        .info-class 银行卡信息
        .field-group.content-frame
          .field.is-horizontal
            label.label 开户人姓名
            custom-input(v-model.trim="weChat_name", :validator="$v.weChat_name", placeholder="请输入姓名", error-info="姓名必填")
          .field.is-horizontal
            label.label 银行卡卡号
            custom-input(v-model.trim="bankcard", need-type="number", :validator="$v.bankcard", placeholder="请输入银行卡号", error-info="银行卡号必填")
          .field.is-horizontal.select-100
            label.label 开户总行
            custom-select.width-100(:list="main_bank_list", v-model="main_bank", @input="getBranchList(true)", :validator="$v.main", error-info="请选择开户总行", :show-search="true")
          .field.is-horizontal
            label.label 开户城市
            .city-line
              custom-select(:list="bank_province_list", v-model="bank_province", @input="getAddress(2,true)", :validator="$v.bank_province", error-info="请选择省", :show-search="true")
              custom-select.middle(:list="bank_city_list", v-model="bank_city", @input="getBranchList(true)", :validator="$v.bank_city", error-info="请选择城市", :show-search="true")
          .field.is-horizontal.select-100
            label.label 开户支行
            .branch-bank(v-if="!branch_bank_choose")
              custom-input.custom-input(v-model.trim="branch_bank.branch", :validator="$v.branch_bank", placeholder="请输入开户支行", error-info="开户支行必填")
              span.branch-tip(@click="toggleBranch(true)")  选择支行
            .branch-bank(v-if="branch_bank_choose")
              custom-select(:list="branch_bank_list", v-model="branch_bank", :validator="$v.branch_bank", error-info="请选择开户支行", :show-search="true", nameField="branch")
              span.branch-tip(@click="toggleBranch(false)")  没有支行？
          .field(style='margin-top:10px;')
            label(style="color:#FF0000;font-size:12px") 注：1、微信分账将收取千分之六的手续费。 <br>
            label(style="color:#FF0000;font-size:12px;margin-left:25px;margin-top:5px;") 2、姓名需为绑定银行卡账户户主姓名。
        .footer-box
          .button.primary(@click="SeparateVersion") 确认
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
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  name: 'CheckManagement',
  mixins: [enterpriseMixin, validationMixin, filterTools, imageScale, storePayApi],
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
      branch_bank_list: [], // 开户支行列表
      branch_bank: {},  // 开户支行
      main_bank_list: [], // 开户总行列表
      main_bank: {},  // 开户总行
      branch_bank_choose: true, // 开户支行使用选择的方式还是输入的方式
      bank_province_list: [],  // 开户行省份列表
      bank_province: {},  // 开户行的省份
      bank_city_list: [],  // 开户行城市列表
      bank_city: {},  // 开户行的城市
      weChat_number: '', // 微信号
      weChat_name: '',  // 姓名
      bankcard: '', // 银行卡
      // 活动的状态
      statusList: [
        {
          name: '全部',
          status: '',
        }, {
          name: '禁入',
          status: '2',
        }, {
          name: '入驻',
          status: '1',
        },
      ],
      isInitiated: false,
      enterprise_id: '',
      store_id: '',
      province: null, // 省
      city: null,  // 市
      province_list: [],  // 省列表
      city_list: [],  // 市列表
      filterData: {
        name_keyword: '',
        getStatus: {
          name: '全部',
          status: '',
        },
      },
      queryData: {
        name_keyword: '',
        getStatus: {
          name: '全部',
          status: '',
        },
      },
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      current_index: 0, // 当前操作的Index
      list: [],
      is_loading: false,
      showVersionModal: false, // 分账信息的显示/隐藏
    }
    ;[schema.filterData, schema.queryData].forEach(conditions => {
      conditions.name_keyword = ''
    })
    return schema
  },
  methods: {
    /* 选择活动状态
    *  @ q 活动状态
    * */
    changeStatus (q) {
      this.getStatus = q
    },
    toggleBranch (bool) {
      this.branch_bank_choose = bool
      this.branch_bank = {}
    },
    /*
    * 禁入、解禁、分账信息提交
    * @ item  门店对象
    * */
    async debar (item, index, type) {
      let params = {}
      if (type === 1) {
        params = {
          shop_id: item.shop_id,
          type: 1,
          status: item.status === 1 ? 2 : 1,
        }
      } else {
        params = {
          shop_id: item.shop_id,
          wechat: this.weChat_number,
          real_name: this.weChat_name,
          cardno: this.bankcard,
          type: 2,
          bank_code: this.main_bank.id,
          bank_name: this.main_bank.name,
          branch_name: this.branch_bank.branch,
          branch_code: this.branch_bank.id,
          province_code: this.bank_province.id,
          province_name: this.bank_province.name,
          city_code: this.bank_city.id,
          city_name: this.bank_city.name,
        }
      }
      try {
        const { response, result } = await this.debarStoreApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '操作成功',
            })
            this.fetchData()
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
     * 删除
     * @ id  门店的id
     */
    delDetail (id) {
      this.$store.dispatch('showMessage', {
        title: '确认删除该门店？',
        content: '删除后数据将无法恢复',
        isRejectable: 1,
        resolve: () => {
          this.deleteEvaluate(id)
        },
      })
    },
     /*
      * 获取银行卡列表对应的省市
      *  @level 省市区
      *  @clear 是否清除市的信息
      * */
    async getAddress (level, clear) {
      // 如果是用户改变省，那么先清除支行信息，如果是打开页面第一次调用，则不清除
      if (clear) {
        this.branch_bank_list = []
        this.branch_bank = {}
        this.bank_city = {}
      }
      let params = {
        level: level,
      }
      if (level === 2) {
        params.parentId = this.bank_province.id
      }
      try {
        const {response, result} = await this.adressApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            if (level === 1) {
              this.bank_province_list = result.data
            }
            if (level === 2) {
              this.bank_city_list = result.data
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取地址列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取地址列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取地址列表失败',
          content: `错误：${err}`,
        })
      }
    },
    /**
     * 获取开户支行列表
     */
    async getBranchList (clear) {
      // 如果是因为用户选择总行或城市导致此方法被调用，就清除支行信息，如果是用户打开弹窗调用此方法，则不清除
      if (clear) {
        this.branch_bank_list = []
        this.branch_bank = {}
      }
      // 如果没有选择总行或者城市，则不获取列表
      if (!this.bank_city.id || !this.main_bank.id) {
        return
      }
      try {
        const {response, result} = await this.getBranchApi({
          cityId: this.bank_city.id,
          branchId: this.main_bank.id,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.branch_bank_list = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户支行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户支行列表失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取总行列表
    async getMainList () {
      try {
        const {response, result} = await this.getTotalApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.main_bank_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开户总行列表失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开户总行列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开户总行列表失败',
          content: `错误：${err}`,
        })
      }
    },
    async deleteEvaluate (id) {
      try {
        const { response, result } = await this.delStoreApi({ shop_id: id })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => this.fetchData(),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除失败',
          content: `错误：${err}`,
        })
      }
    },
    /**
     * 分账信息（弹框展示）
     */
    fetchDetail (id, index) {
      let user = this.list[index]
      this.showVersionModal = !this.showVersionModal
      this.weChat_number = user.wechat // 微信号
      this.weChat_name = user.real_name  // 姓名
      this.bankcard = user.cardno  // 姓名
      this.current_index = index
      this.main_bank = {
        id: user.bank_code,
        name: user.bank_name,
      }
      this.branch_bank = {
        id: user.branch_code,
        branch: user.branch_name,
      }
      this.bank_province = {
        id: user.province_code,
        name: user.province_name,
      }
      this.bank_city = {
        id: user.city_code,
        name: user.city_name,
      }
      this.getMainList()
      this.getAddress(1)
      this.getAddress(2)
      this.getBranchList()
    },
    // 分账信息的提交
    SeparateVersion () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.debar(this.list[this.current_index], this.current_index, 2)
      this.showVersionModal = !this.showVersionModal
      this.clearBankInfo()  // 清除银行卡信息
    },
    clearBankInfo () {
      this.branch_bank_list = []
      this.branch_bank = {}
      this.main_bank_list = []
      this.main_bank = {}
      this.branch_bank_choose = true
      this.bank_province_list = []
      this.bank_province = {}
      this.bank_city_list = []
      this.bank_city = {}
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    // 门店列表
    async fetchData () {
      let params = {
        store_name: this.queryData.name_keyword,
        province_id: this.province ? this.province.id : '',
        city_id: this.city ? this.city.id : '',
        page: this.paginationData.current_page,
        per_page: this.paginationData.per_page,
        status: this.queryData.getStatus.status,
      }
      try {
        const { response, result } = await this.fetchStoreApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.list = result.data
            this.paginationData = result.meta
            this.isInitiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取平台门店列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取平台门店列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取平台门店列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    // 重置
    resetFilter () {
      this.filterData = {
        name_keyword: '',
        getStatus: {
          name: '全部',
          status: '',
        },
      },
      this.queryData = {
        name_keyword: '',
        getStatus: {
          name: '全部',
          status: '',
        },
      },
      this.paginationData.current_page = 1
      this.queryData.name_keyword = ''
      this.province = null
      this.city = null
      this.city_list = []
      this.recallFilter()
      this.fetchData()
    },
    recallFilter () {
      this.switchFilterData(this.queryData, this.filterData)
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
    // 关闭弹框
    cancel () {
      this.showVersionModal = !this.showVersionModal
      this.clearBankInfo()
    },
  },
  created () {
    // 设置列表历史页数记录并重置
    if (!this.$route.query.store) {
      this.$set(this.paginationData, 'current_page', this.$store.state.list.currentPageStorage)
      this.$store.dispatch('setCurrentPageStorage', 1)
    }
  },
  mounted () {
    this.enterprise_id = this.$route.query.enterpriseId || ''
    this.getRegions('province', 0)
    this.fetchData()
  },
  watch: {
    $route () {
      this.enterprise_id = ''
      this.fetchData()
    },
    province (v) {
      this.city = {}
      if (v) this.getRegions('city', v.id)
    },
  },
  validations: {
    weChat_number: {
      required,
    },
    weChat_name: {
      required,
    },
    bankcard: {
      required,
    },
    main_bank: {
      required,
    },
    branch_bank: {
      required,
    },
    bank_province: {
      required,
    },
    bank_city: {
      required,
    },

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
  width: 160px !important;
}
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  padding-right: 40px;
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
  .content-frame{
    padding: 0 40px;
  }
  .label{
    margin-right: 0;
  }
  .box{
    width: 600px;
    height: 550px;
    background-color: #fff
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    margin auto
    border-radius borderRadiusLarge
    .header-box-vice{
      padding 0 15px
      text-align left
      height 48px
      line-height 48px
      font-size 18px
      border-bottom: 1px solid #c5c5c5
      color #666
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
.simple-td {
  max-width: 160px !important;
}
.info-class{
  margin: 10px 0 15px 0;
  font-weight: 700;
  font-size: 14px;
  padding-left: 30px;
}
.city-line{
  display: flex;
  width: 450px;
  justify-content: space-between;
}
.select-100{
  .custom-select{
    width: 432px;
  }
  .branch-bank{
    display: flex;
    width:435px;
    align-items: center;
    .custom-select,.custom-input{
      flex:1;
    }
    .branch-tip{
      margin-left: 15px;
      font-size:14px;
      text-decoration : underline;
      color: #0709f5;
      cursor:pointer;
    }
  }
}
</style>

