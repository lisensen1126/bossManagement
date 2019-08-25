<template lang="pug">
  .section-layout
    .section-filter-schedule
      .field-group.is-horizontal
        .field
          label.label 按时间筛选
          .field.is-horizontal
            date-picker.w_236(type="range", placeholder="请选择", v-model="filter_data.time")
        .field
          label.label 门店状态
          custom-select(:list="status_list", v-model="filter_data.status")
        .field
          label.label 省
          custom-select(v-model="filter_data.province", :list="province_list", nameField="name", placeholder="请选择省")
        .field
          label.label 市
          custom-select(v-model="filter_data.city", :list="city_list", nameField="name", placeholder="请选择市")
        .field
          label.label 关键字搜索
          custom-input(v-model="filter_data.keyword", placeholder="门店名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
        .field
          a.button(@click="exportExcel()") 导出
    empty-page(v-if="list.length === 0 && page_init", :tip="'暂无报名门店'")
    .content-wrapper.list-wrapper(v-if="list.length > 0 && page_init")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 报名时间
              td(width="120") 门店名称
              td(width="80") 连锁数量
              td(width="200") 物料接收地址
              td(width="80") 联系人
              td(width="100") 联系电话
              td(width="80") 确认报名信息
              td(width="80") 物料照片上传
              td(width="80") 优惠券配置
              td(width="80") 状态
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.apply_time}}
              td
                .multi-content-td {{item.store_name}}
              td {{item.store_num}}
              td.line-16
                .simple-td.max-200(:title="item.province_name + item.city_name + item.area_name + item.address") {{item.province_name + item.city_name + item.area_name + item.address}}
              td
                .simple-td {{item.contacts}}
              td.line-16
                .simple-td {{item.mobile}}
              td
                .simple-td {{item.apply_status == 1 ? '是' : '否'}}
              td
                .simple-td {{item.upload_status == 1 ? '是' : '否'}}
              td
                .simple-td {{item.coupon_status == 1 ? '是' : '否'}}
              td
                .simple-td {{item.status == 1 ? '报名中' : item.status == 2 ? '参与中' : '已暂停'}}
              td
                .operation-td
                  a.operation-link.right(@click="goDetail(item.id)") 查看
                  a.operation-link.right(v-if="item.materiel_status == 3", @click="downMateriel(item.id)") 下载物料
          .tfoot
            pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import storePayApi from '@/mixins/modules/StorePay'    // 获取省市区
import drawApi from '@/mixins/modules/draw'
import EmptyPage from '@/components/generics/EmptyPage'
import { root } from '@/plugins/Fetch'
import { hub } from '@/plugins/EventHub'
// 时间组件
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'PayReduceList',
  mixins: [drawApi, storePayApi],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    CustomSelect,
    DatePicker,
  },
  data () {
    return {
      root,
      status_list: [
        {name: '全部', type: 0},
        {name: '报名中', type: 1},
        {name: '参与中', type: 2},
        {name: '已暂停', type: 3},
      ],
      province_list: [],          // 省列表
      city_list: [],              // 市列表
      filter_data: {              // 搜索条件
        keyword: '',
        province: null,          // 选中省
        city: null,              // 选中市
        time: null,
        status: {
          name: '全部',
          type: 0,
        },
      },
      pagination_data: {
        current_page: 1,          // 当前页
        per_page: 20,             // 每页的数据
        last_page: 2,             // 最后一页
        total: 31,                // 总数据
      },
      list: [],                   // 报名列表
      page_init: false,
      init: false,
    }
  },
  watch: {
    'filter_data.province' (v) {
      this.filter_data.city = null
      this.city_list = []
      if (v) this.getRegions('city', v.id)
    },
    // 监听搜索时间区间 获取起止时间
    'filter_data.time' () {
      if (this.filter_data.time) {
        let tr = this.filter_data.time.split(' 至 ')
        this.filter_data.start_time = new Date(`${tr[0]} 00:00:00`).getTime() / 1000
        this.filter_data.end_time = new Date(`${tr[1]} 23:59:59`).getTime() / 1000
      } else {
        this.filter_data.start_time = null
        this.filter_data.end_time = null
      }
    },
  },
  methods: {
    /**
     * 获取省市区
     * @id  {Number}                省市区id
     * @type  {String}              类别
     */
    async getRegions (type, id) {
      const { response, result } = await this.fetchRegions({ parent_id: id })
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

    // 获取列表信息 getPayStoreListApi
    async fetchData () {
      try {
        const { response, result } = await this.getPayStoreListApi({
          'name_keyword': this.filter_data.keyword,
          'province_name': this.filter_data.province ? this.filter_data.province.name : '',
          'city_name': this.filter_data.city ? this.filter_data.city.name : '',
          'status': this.filter_data.status.type,
          'page': this.pagination_data.current_page,
          'start_time': this.filter_data.time ?this.filter_data.start_time : '',
          'end_time': this.filter_data.time ? this.filter_data.end_time : '',
        })
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.pagination_data = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err)
      }
      this.page_init = true
    },

    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },

    applyFilter () {
      this.pagination_data.current_page = 1
      this.fetchData()
    },

    // 重置
    resetFilter () {
      this.list = []
      this.page_init = false
      this.filter_data =  {              // 搜索条件
        keyword: '',
        province: null,          // 选中省
        city: null,              // 选中市
        time: null,
        status: {
          name: '全部',
          type: 0,
        },
      }
      hub._data._global = null
      this.fetchData()
    },

    // 报名详情
    goDetail (id) {
      hub._data._global = {
        keyword: this.filter_data,
        meta: this.pagination_data,
      }
      this.$router.push({
        name: 'PayReduceDetail',
        query: {
          id: id,
        },
      })
    },

    // 导出
    exportExcel () {
      window.open(`${root}/random_coupon/apply_list_export?end_time=${this.filter_data.time ? this.filter_data.end_time : ''}&start_time=${this.filter_data.time ? this.filter_data.start_time : ''}&name_keyword=${this.filter_data.keyword}&province_name=${this.filter_data.province ? this.filter_data.province.name : ''}&city_name=${this.filter_data.city ? this.filter_data.city.name : ''}&status=${this.filter_data.status.type}&export=1`)
    },

    // 下载物料 /random_coupon/download_zip  id为报名门店的id
    downMateriel (id) {
      window.open(`${root}/random_coupon/download_zip?id=${id}`)
    }
  },

  mounted () {
    if (!hub._data._global) {
      this.getRegions('province', 0)
      this.fetchData()
    } else {
      this.filter_data = hub._data._global.keyword
      this.pagination_data = hub._data._global.meta
      this.getRegions('province', 0)
      this.fetchData()
    }
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
}
.max-200{
  max-width:200px !important;
}
.section-filter {
  display: flex;
  justify-content: space-between;
}
.multi-content-td {
  vertical-align: middle;
  word-break: break-all;
}
.keyword-wrapper {
  width: 244px;
}

.button {
  align-items: center;
}

</style>
