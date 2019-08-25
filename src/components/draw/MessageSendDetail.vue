<template lang="pug">
  .section-layout(ref="scrolls")
    h2.level.header-wrapper
      .level-left
        .nav-back-btn(@click="goBack")
        .header-title(style={'padding-left':'25px'}) 发送详情
    .section-filter
      .field-group.is-horizontal
        .field.is-keyword
          label.label 关键字搜索
          custom-input(v-model.tirm="filter_data.keyword", placeholder="请输入手机号", @keyupEnter="applyFilter")
        .field
          label.label 按发送状态搜索
          custom-select.fl.w-100(:list="send_status", v-model="filter_data.status", placeholder="请选择发送状态")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!(send_list && send_list.length) && isInitiated", :tip="'当前没有发送记录'")
    .content-wrapper.list-wrapper(v-if="send_list && send_list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 手机号码
              td(width="200") 短信内容
              td(width="100") 模板分类
              td(width="100") 模板名称
              td(width="80") 发送时间
              td(width='80') 发送状态
          tbody(v-if="send_list.length")
            tr(v-for="(item, index) in send_list")
              td
                .simple-td(v-text="item.mobile")
              td
                .simple-td.width-fixed(v-text="item.content",:title="item.content")
              td
                .simple-td.width-fixed(v-text='item.module_category_name')
              td
                .simple-td(v-text='item.module_name')
              td
                .simple-td(v-text='item.created_at')
              td
                .simple-td(v-text='item.status === 1 ? "发送成功" : item.status === 0 ? "发送失败" : item.status === 2 ? "发送中" : ""')
      .tfoot(v-if="send_list.length")
        pagination(:pagination-data="paginationData", @input="paging")
</template>


<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import drawApi from '@/mixins/modules/draw'
import { mapGetters } from 'vuex'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import DatePicker from '@/components/generics/form/DatePicker'

export default {
  name: 'MessageAdmin',
  mixins: [drawApi, filterTools, imageScale],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
    DatePicker,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
        // 分页的数据
      paginationData: {
        current_page: 1, // 当前页
        per_page: 15, // 每页的数据
        last_page: 2, // 最后一页
        total: 31, // 总数据
      },
      // 搜索对象
      filter_data: {
        keyword: '',
        status: {
          name: '全部',
          id: '',
        },
      },
      send_status: [
        {
          name: '全部',
          id: '',
        },
        {
          name: '发送成功',
          id: 1,
        },
        {
          name: '发送失败',
          id: 0,
        },
        {
          name: '发送中',
          id: 2,
        },
      ],
      // 活动列表
      send_list: [],
      send_info: [],
    }
    return schema
  },
  computed: {
    ...mapGetters({
      store_list: 'stores',
    }),
  },
  methods: {
    // 获取短信发送列表接口
    async fetchData () {
      try {
        const {response, result} = await this.getSendDetailApi({
          mobile: this.filter_data.keyword,
          id: this.$route.query.id,
          status: this.filter_data.status.id,
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200 && result.code === 0) {
          this.send_list.splice(0, this.send_list.length, ...result.data)
          this.paginationData = result.meta
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取短信发送列表失败',
            content: `${result && result.code ? ' ' + result.code + result.message : ''}）`,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取短信发送列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
    applyFilter () {
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置按钮
    resetFilter () {
      this.filter_data.keyword = ''
      this.filter_data.status = {
        name: '全部',
        id: '',
      }
      this.paginationData.current_page = 1
      this.fetchData()
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },
    // 返回
    goBack () {
      this.$router.back()
    },
  },
  mounted () {
    this.fetchData()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.section-filter {
    display: flex;
    justify-content: space-between;
}

.keyword-wrapper {
    width: 244px;
}

.staff-wrapper {
  width 120px
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
.margin
  margin 0 8px
  font-size 14px
.p-b-0
  padding-bottom 0
.p-t-0
  padding-top 0 !important
.display-block
  display block
.height-auto
  height auto
.section-filter
  background #fff
.message-send
  display flex
  width 300px
  height 120px
  padding 15px 20px
  margin-top 20px
  flex-direction column
  justify-content space-between
  border 1px solid #eeeeee
.message-send-data
  text-align right
.empty-page-wrapper
  margin-top 50px
.width-fixed
  width 260px !important
.store-list
  width 240px !important
.header-wrapper
  height 56px
  align-items center
  padding-left 32px
  border-bottom 1px solid line
.keywords
  width 180px !important
  height 56px
  align-items center
  padding-left 32px
  border-bottom 1px solid line
.nav-back-btn
  position absolute
  top 12px
  left 15px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
.level-left
  align-items center
  flex 1
.level-left .field
  margin-left 30px
.clearflex
  display block !important
</style>
