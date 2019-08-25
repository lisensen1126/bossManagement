<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.enterprise_name", placeholder="活动名称", @keyupEnter="applyFilter")
        .field
          custom-select(:list="statusList", v-model="filterData.getStatus", :input="changeStatus")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addEvent")
            span.add-icon
            span 新建活动
    empty-page(v-if="list.length === 0", :tip="'当前没有活动'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="25%") 活动名称
              td(width="25%") 活动起止时间
              td(width="10%") 参与人数/次数
              td(width="10%") 参与门店数
              td(width="10%") 中奖数
              td(width="10%") 状态
              td(width="10%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td(v-text="item.name")
              td.line-16
                span(v-if='item.end_time') {{item.start_time}} <br> {{item.end_time}}
                span(v-if='!item.end_time', v-text=' "长期" ')
              td
                .simple-td {{item.join_people}} / {{item.join_nums}}
              td
                .simple-td(v-text="item.store_nums")
              td
                .simple-td {{item.store_prize_nums}}
              td
                .simple-td(v-if="item.status ==='READYING'") 准备中
                .simple-td(v-if="item.status ==='PROGRESSING'") 进行中
                .simple-td(v-if="item.status ==='OFF_SHELVES'") 已下架
                .simple-td(v-if="item.status ==='FINISHED'") 已结束
              td
                .operation-td
                  a.operation-link.right(@click="goDetail(item.id)") 查看
                  a.operation-link.right(v-if="item.status=='READYING'||item.status=='PROGRESSING'", @click="remove(item)") 下架
          .tfoot(v-if="list.length > 0")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import drawApi from '@/mixins/modules/draw'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import { root } from '@/plugins/Fetch'

export default {
  name: 'DrawList',
  mixins: [drawApi, filterTools, imageScale],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
    CustomSelect,
  },
  data () {
    const schema = {
      root,
      // 活动的状态
      statusList: [{
        name: '全部',
        status: '',
      }, {
        name: '准备中',
        status: 'READYING',
      }, {
        name: '进行中',
        status: 'PROGRESSING',
      }, {
        name: '已下架',
        status: 'OFF_SHELVES',
      }, {
        name: '已结束',
        status: 'FINISHED',
      }],
      isInitiated: true,
      filterData: {
        enterprise_name: '',
        getStatus: {
          name: '全部',
          status: '',
        },
      },
      queryData: {},
      // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 20, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      // 活动列表
      list: [],
      is_first_enter: false, // 是否第一次进入
    }
    return schema
  },
  methods: {
    /* 下架活动提示
    *  @ item 活动详情
    * */
    remove (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认下架‘${item.name}’该活动？`,
        isRejectable: 1,
        resolve: () => {
          this.removeApi(item.id)
        },
      })
    },
    /* 下架接口
    *  @ id 活动id
    * */
    async removeApi (id) {
      try {
        const { result, response } = await this.downEvent({
          activity_id: id,
        })
        if (response.status === 200) {
          if (result.message === 'success') {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '活动下架成功',
              resolve: () => {
                this.fetchData()
              },
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '活动下架失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '活动下架失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /* 选择活动状态
    *  @ q 活动状态
    * */
    changeStatus (q) {
      this.getStatus = q
    },
    /**
     * 查看
     * @id  活动id
     */
    goDetail (id) {
      this.$router.push({
        name: 'eventDetail',
        query: {
          eventId: id,
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
    // 添加
    addEvent () {
      this.$router.push({
        name: 'drawAdd',
      })
    },
    /**
     * 获取企业列表
     * @returns {Promise<void>}
     */
    async fetchData () {
      try {
        const { response, result } = await this.eventList({
          keyword: this.queryData.enterprise_name,
          status: this.queryData.getStatus.status,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          result.data.forEach(item => {
            item.start_time = this.changeDateTime(item.start_time)
            item.end_time = this.changeDateTime(item.end_time)
          })
          this.list = result.data
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取活动列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取活动列表失败',
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
    // 重置
    resetFilter () {
      this.filterData.enterprise_name = ''
      this.filterData.getStatus = {
        name: '全部',
        status: '',
      }
      this.paginationData.current_page = 1
      this.queryData = JSON.parse(JSON.stringify(this.filterData))
      this.fetchData()
    },
    /**
     * 时间戳转年月日
     * @val  时间戳
     */
    changeDateTime (val) {
      if (!val) {
        return ''
      }
      let date = new Date(val * 1000)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = this.judgeTime(date.getDate()) + ' '
      let h = this.judgeTime(date.getHours()) + ':'
      let m = this.judgeTime(date.getMinutes())
      return Y + M + D + h + m
    },
    /**
     * 时 分 格式化
     * @t  时分
     */
    judgeTime (t) {
      if (t < 10) {
        return '0' + t
      } else {
        return t
      }
    },
  },
  mounted () {
    this.is_first_enter = true
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'eventDetail') {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter()
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

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

.line-16 {
  line-height: 16px !important;
}
</style>
