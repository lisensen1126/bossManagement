<!-- 门店授权失效 -->
<template lang="pug">
  .section-layout 
    empty-page(v-if="!(list && list.length)", :tip="'当前没有授权失效门店'")
    .m-t-24
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="160") 应用名称
              td(width="160") 门店名称
              td(width="160") 所属企业
              td(width="50") 应用类型
              td(width="50") 失效时间
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td.textzh {{item.app_name ? item.app_name : '--'}}
              td
                .simple-td.textzh {{item.store_name ? item.store_name : '--'}}
              td
                .simple-td.textzh(v-text="item.enterprise_name")
              td
                .simple-td.textzh(v-text="formatePlatform(item.platform)")
              td
                .simple-td.textzh(v-text="formateDate(item.created_at, true)")
</template>

<script type="text/ecmascript-6">
import EmptyPage from '@/components/generics/EmptyPage'
import Pagination from '@/components/generics/Pagination'
import formateDate from '@/mixins/utilities/formateDate'
import Api from '@/mixins/modules/StorePay'
export default {
  name: '',
  mixins: [Api, formateDate],
  components: {
    EmptyPage,
    Pagination,
  },
  data () {
    return {
      list: [],
    }
  },
  methods: {
    // 格式化应用类型
    formatePlatform (type) {
      let text = ''
      if (type === 1) {
        text = '服务号'
      } else {
        text = '小程序'
      }
      return text
    },
    // 请求门店授权失效列表
    async getTokenInvalid () {
      try {
        const { response, result } = await this.getTokenInvalidApi()
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店授权失效列表失败',
            content: `${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取门店授权失效列表失败',
          content: `错误: ${err}`,
        })
      }
    },
  },
  mounted () {
    this.getTokenInvalid() // 请求门店授权失效列表
  },
}
</script>

<style scoped lang="stylus">
@import '~@/stylus/mixins'
.m-t-24
  height 36px
  background #E8E9EB
.textzh
  text-overflow ellipsis
  overflow hidden
  white-space normal
  padding-right 40px
</style>
