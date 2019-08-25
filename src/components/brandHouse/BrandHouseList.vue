<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="name_keyword", placeholder="品牌馆名称", @keyupEnter="applyFilter")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createBrand")
            span.add-icon
            span 添加品牌馆
    empty-page(v-if="!(list && list.length) && isInitiated", :tip="'当前没有品牌馆'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 品牌馆名称
              td(width="60") 品牌馆封面图
              td(width="50") 品牌名称
              td(width="70") 上传时间
              td(width="50") 创建人
              td(width="110") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.max-200(v-text="item.name")
              td
                .icon-img(v-if="item.cover")
                  img(:src="item.cover")
                .simple-null(v-else) - -
              td
                .simple-td(v-text="item.brand_name")
              td
                .simple-td(v-text="item.created_at")
              td
                .simple-td(v-text="item.admin_name")
              td
                .operation-td
                  a.operation-link.left(@click="setVideo(item.id)") 视频设置
                  a.operation-link.left(@click="setGoodServe(item.id)") 商品服务设置
                  a.operation-link.left(@click="goContent(item.id)")  内容设置
                  a.operation-link.left(@click="goDetail(item.id)")  编辑
                  a.operation-link(@click="deleteBrand(item)", v-if="false")  删除
          .tfoot(v-if="list.length")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Pagination from '@/components/generics/Pagination'
import enterpriseMixin from '@/mixins/modules/enterprise'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import BrandApi from '@/mixins/modules/BrandHouse'
export default {
  name: 'BrandHouseList',
  mixins: [enterpriseMixin, filterTools, imageScale, BrandApi],
  components: {
    CustomInput,
    EmptyPage,
    Pagination,
  },
  data: _ => {
    const schema = {
      isInitiated: false,
      enterprise_id: '',
      name_keyword: '',
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 2,
        total: 0,
      },
      list: [],
      is_search: false, // 是否搜索(翻页时判断用)
    }
    return schema
  },
  methods: {
    /**
     * 视频设置
     * @ id  品牌馆的id
     */
    setVideo (id) {
      this.$router.push({
        name: 'brandVideo',
        query: {
          brand_id: id,
        },
      })
    },
    /**
     * 内容设置
     * @ id  品牌馆的id
     */
    goContent (id) {
      this.$router.push({
        name: 'brandContent',
        query: {
          brand_id: id,
        },
      })
    },
    /**
     * 商品服务设置
     * @ id  品牌馆的id
     */
    setGoodServe (id) {
      this.$router.push({
        name: 'brandProductService',
        query: {
          brand_id: id,
        },
      })
    },
    /**
     * 编辑
     * @ id  品牌馆的id
     */
    goDetail (id) {
      this.$router.push({
        name: 'addBrandHouse',
        query: {
          edit: 2,
          brand_id: id,
        },
      })
    },
    /**
     * 删除品牌馆提示
     * @ item  品牌馆对象
     */
    deleteBrand (item) {
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确认删除‘${item.name}’该品牌库？`,
        isRejectable: 1,
        resolve: () => {
          this.removeApi(item.id)
        },
      })
    },
    /**
     * 删除品牌馆接口
     * @ id 品牌馆id
     */
    async removeApi (id) { },
    /**
     * 分页处理
     * @status  分页的状态
     */
    paging (state) {
      this.paginationData = state
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
    // 品牌馆列表
    async fetchData () {
      try {
        const { response, result } = await this.brandHouseList({
          keyword: this.is_search ? this.name_keyword : '',
          page: this.paginationData.current_page,
          per_page: this.paginationData.per_page,
        })
        if (response.status === 200) {
          result.data.forEach(item => {
            item.created_at = this.changeDateTime(item.created_at)
          })
          this.list = result.data
          this.paginationData = result.meta
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌馆列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌馆列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
      this.isInitiated = true
    },
    // 搜索按钮
    applyFilter () {
      this.is_search = true
      this.paginationData.current_page = 1
      this.fetchData()
    },
    // 重置
    resetFilter (page) {
      this.paginationData.current_page = page || 1
      this.is_search = false
      this.name_keyword = ''
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
    this.enterprise_id = this.$route.query.enterpriseId || ''
  },
  // 导航守卫
  beforeRouteEnter (to, from, next) {
    if (from.name === 'addBrandHouse' && to.query.save !== 1) {
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

.icon-img {
  height: 36px;
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
