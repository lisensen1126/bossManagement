<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.enterprise_name", placeholder="企业名称", @keyupEnter="applyFilter")
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
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createEnterprise")
            span.add-icon
            span 新建企业
    empty-page(v-if="list.length === 0", :tip="'当前没有企业'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="16%") 企业名称
              td(width="12%") 省
              td(width="12%") 市
              td(width="10%") 企业类型
              td(width="8%") 联系人
              td(width="12%") 联系人电话
              td(width="10%") 门店数量
              td(width="20%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td.textzh(v-text="item.enterprise_name")
              td
                .simple-td(v-text="item.province_name?item.province_name:'--'")
              td
                .simple-td(v-text="item.city_name?item.city_name:'--'")
              td
                .simple-td(v-if="item.is_chain == 1") 一个小程序
                .simple-td(v-else) 多小程序
              td
                .simple-td(v-text="item.contact")
              td
                .simple-td(v-text="item.mobile")
              td
                .operation-td
                  a.operation-link.right(@click="goStoreList(item)", v-text="item.store_num")
              td
                .operation-td
                  a.operation-link.right(@click="fetchDetail(item.enterprise_id)") 查看
                  a.operation-link.right(@click="goEnterDetail(item)") 编辑
                  a.operation-link.right(@click="gopayment(item)") 支付
                  a.operation-link.right(@click="deleteEnterprise(item)", v-if="currentUser.is_system_admin === 1") 删除
                  a.operation-link.right(@click="goYouLuoKe(item)") 直播
                  a.operation-link.right(@click="goAdmin(item)", v-if="(item.store_num-0) > 0") 管理员维护
                  a.operation-link.right(@click="storeTypeChange(item)", v-if="(item.store_num-0) <= 1") 切换类型
                  a.operation-link(@click="goStore(item)", v-if="(item.store_num-0) > 0") 门店后台
          .tfoot(v-if="list.length > 0")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import enterApi from '@/mixins/modules/enterprise'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import { root } from '@/plugins/Fetch'
import { mapGetters } from 'vuex'

export default {
  name: 'EnterpriseList',
  mixins: [enterApi, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser',
    }),
  },
  data () {
    const schema = {
      root,
      isInitiated: true,
      filterData: {
        enterprise_name: '',
        province: null,
        city: null,
      },
      queryData: {},
      province: null,
      city: null,
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      list: [],
      province_list: [],    // 省列表
      city_list: [],        // 市列表
      is_first_enter: false, // 是否第一次进入
    }
    return schema
  },
  methods: {
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
     * 管理员维护
     * @param params
     */
    goAdmin (params) {
      this.$router.push({
        name: 'administration',
        query: {
          enterpriseId: params.enterprise_id,
        },
      })
    },
    /**
     * 直播
     * @param params
     */
    goYouLuoKe (params) {
      this.$router.push({
        name: 'appSetting',
        params: {
          enterpriseId: params.enterprise_id,
        },
        query: {
          enterpriseName: params.enterprise_name,
          enterpriseId: params.enterprise_id,
        },
      })
    },
    /**
     * 支付
     * @param params
     */
    gopayment (params) {
      this.$router.push({
        name: 'enterprisePay',
        params: {
          enterpriseId: params.enterprise_id,
        },
        query: {
          enterpriseName: params.enterprise_name,
          channel_id: params.channel_id,
          enterpriseId: params.enterprise_id,
        },
      })
    },
    /**
     * 编辑
     * @param params
     */
    goEnterDetail (params) {
      this.$router.push({
        name: 'enterpriseCreate',
        params: {
          enterpriseId: params.enterprise_id,
        },
        query: {
          edit: 2,
          enterpriseId: params.enterprise_id,
          page: this.paginationData.current_page,
        },
      })
    },
    /**
     * 查看
     * @param id 企业id
     */
    fetchDetail (id) {
      this.$router.push({
        name: 'enterpriseEdit',
        params: {
          enterpriseId: id,
        },
        query: {
          edit: 3,
          enterpriseId: id,
        },
      })
    },
    /**
     * 删除
     * @item 删除的企业对象
     */
    deleteEnterprise (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认删除‘${item.enterprise_name}’该企业？`,
        isRejectable: 1,
        resolve: () => {
          this.deleteFun(item.enterprise_id)
        },
      })
    },
    /**
     * 删除企业接口
     * @id 删除的企业id
     */
    async deleteFun (id) {
      try {
        let { response, result } = await this.deleteEnterpriseApi({
          enterprise_id: id,
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
     * 门店类型切换
     * @item 企业对象
     */
    storeTypeChange (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认切换该企业为 '${item.is_chain === 1 ? '多小程序' : '一个小程序'}' ？`,
        isRejectable: 1,
        resolve: () => {
          this.storeTypeChangeFun(item)
        },
      })
    },
    /**
     * 门店类型切换接口
     * @item 切换的企业对象
     */
    async storeTypeChangeFun (item) {
      try {
        let { response, result } = await this.storeTypeChangeApi({
          enterprise_id: item.enterprise_id,
          is_chain: item.is_chain === 1 ? 2 : 1,
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
     * 去往门店
     * @param item 企业对象
     */
    goStore (item) {
      window.open(this.root + `/enterprise/login/${item.enterprise_id}`)
    },
    /**
     * 去往企业所属门店列表
     * @param item 企业对象
     */
    goStoreList (item) {
      this.$router.push({
        name: 'storeList',
        query: {
          enterpriseId: item.enterprise_id,
          store: true,
        },
      })
    },
    // 分页处理
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 添加
    createEnterprise () {
      this.$router.push({
        name: 'enterpriseCreate',
        query: {
          edit: 1,
        },
      })
    },
    /**
     * 获取企业列表
     * @returns {Promise<void>}
     */
    async fetchData () {
      try {
        const { response, result } = await this.GetEnterList({
          province_id: this.queryData.province ? this.queryData.province.id : '',
          city_id: this.queryData.city ? this.queryData.city.id : '',
          enterprise_name: this.queryData.enterprise_name,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取企业列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取企业列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    applyFilter () {
      for (let key in this.filterData) {
        if (this.queryData.hasOwnProperty(key)) {
          this.queryData[key] = this.filterData[key]
        }
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    resetFilter (page) {
      this.filterData.enterprise_name = ''
      this.filterData.province = null
      this.filterData.city = null
      this.paginationData.current_page = page || 1
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.city_list = []
      this.fetchData()
    },
  },
  mounted () {
    this.is_first_enter = true
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
    if ((from.name === 'enterpriseEdit' || from.query.edit === 2) && to.query.save !== 1) {
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

.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
  line-height: 22px;
}

.p-l-20 {
  padding-left: 20px;
}

.p-r-20 {
  padding-right: 20px;
}

.right {
  margin-right: 10px !important;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.keyword-wrapper {
  width: 244px;
}

.button {
  align-items: center;
}

.give-icon {
  display: none;
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
</style>

