<template lang="pug">
  .section-layout
    loading(v-if="is_loading")
    .section-filter
      .field-group.is-horizontal
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
              td(width="160") 评价内容
              td(width="60") 打分
              td(width="50") 综合评分
              td(width="80") 门店名称
              td(width="80") 时间
              td(width="60") 门店回复
              td(width="80") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td(style="max-width:160px")
                .multi-content-td.textzh(v-text="item.comment_content")
                .pic(v-if="item.comment_image.length>0")
                  open-image(img-type="3",:img-url="item.comment_image",key-name="image_url",mini-width="20",mini-height="20",margin-bottom="0", margin-right="5", border-radius="2")
              td
                .simple-td(v-text="item.comment_score[0].score")
              td
                .simple-td(v-text="item.avg_score")
              td
                .simple-td(v-text="item.store_name")
              td
                .simple-td(v-text="formateDate(item.created_at, true)")
              td(style="max-width:160px")
                .multi-content-td.word-reply(v-if="item.sub_comment.length!==0") {{item.sub_comment[0].comment_content}}
                .multi-content-td(v-else) --
              td
                .operation-td
                  a.operation-link.left(@click="delDetail(item.comment_id)") 删除
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
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
import OpenImage from '@/components/generics/OpenImage'
import { mapGetters } from 'vuex'
export default {
  name: 'checkComment',
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
    OpenImage,
  },
  data () {
    const schema = {
      isInitiated: false,
      enterprise_id: '',
      store_id: '',
      province: null, // 省
      city: null,  // 市
      province_list: [],  // 省列表
      city_list: [],  // 市列表
      filterData: {
        name_keyword: '',
      },
      queryData: {
        name_keyword: '',
      },
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      list: [],
      is_loading: false,
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
    /**
     * 删除
     * @ id  门店的id
     */
    delDetail (id) {
      this.$store.dispatch('showMessage', {
        title: '确认删除该评价？',
        content: '删除后数据将无法恢复',
        isRejectable: 1,
        resolve: () => {
          this.deleteEvaluate(id)
        },
      })
    },
    async deleteEvaluate (id) {
      try {
        const { response, result } = await this.delcommentApi({ comment_id: id })
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
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
      this.recallFilter()
      this.fetchData()
    },
    // 评论列表
    async fetchData () {
      try {
        const { response, result } = await this.commentListApi({
          name_keyword: this.queryData.name_keyword,
          province_id: this.province ? this.province.id : '',
          city_id: this.city ? this.city.id : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            console.log(result.data)
            this.list = result.data
            this.paginationData = result.meta
            this.isInitiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              content: `出错了：${result.message}`,
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
    // 搜索按钮
    applyFilter () {
      this.paginationData.current_page = 1
      this.switchFilterData(this.filterData, this.queryData)
      this.fetchData()
    },
    // 重置
    resetFilter () {
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
    },
    // 分账信息的提交
    SeparateVersion () {
    }
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
    }
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
  word-break: break-all;
}
.word-reply {
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
.pic
  span
    display inline-block
    padding: 8px 5px 0 0
    img
      width 20px
      height 20px
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
    width: 380px;
    height: 264px;
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
    .header-box-vice{
      padding 0 40px
      text-align left
      height 48px
      line-height 48px
      font-size 12px
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
</style>

