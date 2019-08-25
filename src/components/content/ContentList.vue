<template lang="pug">
  .section-layout
    .section-filter
      span.add-button(@click="goCreate()")
      .field-group.is-horizontal
        .field.is-narrow
          label.label 品牌
          custom-select(v-model="filter_data.brand", :list="brand_list", nameField="brand_name", :show-search="true")
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filter_data.title", placeholder="请输入内容名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
    empty-page(v-if="!list.length && is_initiated", :tip="'当前没有内容'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="300") 内容名称
              td(width="110") 封面图
              td(width="180") 品牌名称
              td(width="200") 上传时间
              td(width="110") 操作人
              td(width="210") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.max-200(v-text="item.title")
              td
                .icon-img(v-if="item.cover")
                  img(:src="item.cover")
                .simple-null(v-else) -
              td
                .simple-td.max-200(v-text="item.brand_name")
              td
                .simple-td(v-text="item.created_at")
              td
                .simple-td {{item.operator_name ? item.operator_name : '--'}}
              td
                .operation-td
                  a.operation-link.left(@click="signUp(item)") {{item.sign_up==1?'关闭':'开启'}}报名
                  router-link.operation-link.left(:to="{name: 'registrationUser', params: {id: item.id}}") 报名用户
                  a.operation-link.left(@click="goEdit(item.id)") 编辑
                  a.operation-link(@click="deleteInfo(item.id)",) 删除
        .tfoot(v-if="list.length")
          pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import Pagination from '@/components/generics/Pagination'
import enterpriseMixin from '@/mixins/modules/enterprise'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import Api from '@/mixins/modules/Content'
import BossApi from '@/mixins/modules/boss'
export default {
  name: 'ContentList',
  mixins: [enterpriseMixin, filterTools, imageScale, Api, BossApi],
  components: {
    CustomInput,
    CustomSelect,
    EmptyPage,
    Pagination,
  },
  data: () => {
    return {
      brand_list: [],
      filter_data: {
        brand: null,
        title: '',
      },
      queyr_data: {},
      pagination_data: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      list: [],
      is_initiated: false, // 初始化完成
    }
  },
  methods: {
    // 内容列表
    async fetchData () {
      this.is_initiated = false
      try {
        const { response, result } = await this.ContentListApi({
          brand_id: this.query_data.brand ? this.query_data.brand.brand_id : '',
          title: this.query_data.title,
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        })
        if (result.code === 0 && response.status === 200) {
          result.data.forEach(element => {
            element.created_at = this.changeDateTime(element.created_at)
          })
          this.list = result.data
          this.pagination_data = result.meta
          this.is_initiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取内容列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取内容列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    // 搜索按钮
    applyFilter () {
      for (let key in this.filter_data) {
        if (this.query_data.hasOwnProperty(key)) {
          this.query_data[key] = this.filter_data[key]
        }
      }
      this.pagination_data.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter (page) {
      this.pagination_data.current_page = page || 1
      this.filter_data.brand = null
      this.filter_data.title = ''
      this.query_data = JSON.parse(JSON.stringify(this.filter_data))
      this.fetchData()
    },
    /**
     * 报名
     */
    async signUp (item) {
      try {
        let _su = item.sign_up === 1 ? 2 : 1
        const { response, result } = await this.SignUpApi({
          id: item.id,
          sign_up: _su,
        })
        if (response.status === 200) {
          item.sign_up = _su
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '操作成功',
          })
        } else {
          throw new Error(result.message)
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作失败',
          content: `错误：${err}`,
        })
      }
    },
    // 获取品牌列表
    async getBrandList () {
      try {
        const { response, result } = await this.brandList({
          is_page: 2,
          source_type: 1,
        })
        if (response.status === 200) {
          this.brand_list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /**
     * 添加
     */
    goCreate () {
      this.$router.push({
        name: 'contentCreate',
      })
    },
    /**
     * 去编辑
     * @id {int} 编辑的id
     */
    goEdit (id) {
      this.$router.push({
        name: 'contentEdit',
        query: {
          id: id,
        },
      })
    },
    /**
     * 删除提示
     * @id {int} 删除的id
     */
    deleteInfo (id) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: '确认删除该条内容嘛？',
        isRejectable: 1,
        resolve: () => {
          this.removeApi(id)
        },
      })
    },
    /**
     * 删除接口
     * @id {int} 删除的id
     */
    async removeApi (id) {
      let _this = this
      try {
        const { response, result } = await this.ContentDeleteApi({
          id: id,
        })
        if (response.status === 200) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '删除成功',
            resolve: () => {
              _this.fetchData()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除信息失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除信息失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.pagination_data = state
      this.fetchData()
    },
    // 添加品牌库按钮
    createBrand () {
      this.$router.push({
        name: 'addBrandHouse',
        query: {
          edit: 1,
        },
      })
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
    this.getBrandList()
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'contentEdit' && to.query.save !== 1) {
      to.meta.isBack = true
    }
    next()
  },
  // keep-alive 进入
  activated () {
    if (!this.$route.meta.isBack || this.is_first_enter) this.resetFilter(this.pagination_data.current_page)
    this.$route.meta.isBack = false
    this.is_first_enter = false
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.icon-img {
  height: 36px;
}
.max-200{
  max-width 200px !important
}
.icon-img img {
  width: 36px;
  height: 36px;
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

.gray {
  color: #989ba1;
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
</style>
