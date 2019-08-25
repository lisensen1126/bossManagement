<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="createInspection")
    empty-page(v-if="list.length == 0 && is_initiated", :tip="'当前没有车检类型'")
    .content-wrapper.list-wrapper(v-if="is_initiated && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="120") 车检单名称
              td(width="140") 更新时间
              td(width="120") 操作人
              td(width="120") 车检场景
              td(width="120") 车检项目
              td(width="120") 启用
              td(width="60") 操作
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.created_time}}
              td
                .simple-td {{item.operator_name}}
              td
                .simple-td {{item.categories_count}}
              td
                .simple-td {{item.items_count}}
              td
                .simple-td
                  .switch
                    input(type="checkbox", :id="'display' + index", v-model="item.is_select", @change="displayConfirm(index)")
                    label(:for="'display' + index")
              td
                .operation-td
                  span.operation-link(@click="editInspection(item.id)") 编辑
                  span.operation-link(v-if="!item.is_select", @click="delInspection(item.id)") 删除
      .tfoot(v-if="true")
        pagination(:pagination-data="pagination_data", @input="paging")
</template>

<script>
  import Pagination from '@/components/generics/Pagination'
  import marketingMixin from '@/mixins/modules/marketing'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import Api from '@/mixins/modules/FunctionSetting'

  export default {
    name: 'TypeManage',
    mixins: [marketingMixin, Api, imageScale],
    components: {
      EmptyPage,
      Pagination,
    },
    data () {
      return {
        pagination_data: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        list: [],
        is_initiated: false,
      }
    },
    methods: {
      // 修改状态
      async displayConfirm (index) {
        try {
          const { response, result } = await this.changeStatusApi({
            id: this.list[index].id,
            is_open: this.list[index].is_select ? 1 : 2,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true,
              type: 'success',
              title: '修改成功',
              resolve: () => {
                this.getClassList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改信息失败',
              content: result.message,
            })
            this.list[index].is_select = !this.list[index].is_select
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '失败',
            content: err,
          })
          this.list[index].is_select = !this.list[index].is_select
        }
      },

      // 添加车检报告
      createInspection () {
        this.$router.push({
          name: 'addInspec',
          query: {
            edit: 1,
          },
        })
      },

      // 编辑车检报告
      editInspection (id) {
        this.$router.push({
          name: 'addInspec',
          query: {
            edit: 2,
            classify_id: id,
          },
        })
      },

      // 删除车检项
      delInspection (id) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认删除该条车检内容嘛？',
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
        try {
          const { response, result } = await this.delClassListApi({
            id: id,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                this.getClassList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除信息失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '失败',
            content: err,
          })
        }
      },

      // 分页
      paging (state) {
        this.pagination_data = state
        this.getClassList()
      },

      // 获取分类列表
      async getClassList () {
        let params = {
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page,
        }
        try {
          const { response, result } = await this.getClassListApi(params)
          if (response.status === 200 && result.code === 0) {
            result.data.forEach(item => {
              item.is_open === 1 ? item.is_select = true : item.is_select = false
            })
            this.list = result.data
            this.pagination_data = result.meta
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取车检列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '失败',
            content: err,
          })
        }
      },
    },
    mounted () {
      this.getClassList()
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

  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-filter {
    display: flex;
    justify-content: space-between;
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

  .section-layout {
    height: calc(100% - 48px);
  }

  .list-wrapper {
    height: calc(100% - 90px) !important;
  }
</style>
