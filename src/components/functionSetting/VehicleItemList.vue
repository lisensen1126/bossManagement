<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="showVelhicle(1)")
    empty-page(v-if="list.length == 0 && is_initiated", :tip="'当前没有车检项目'")
    .content-wrapper.list-wrapper(v-if="list.length > 0 && is_initiated")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 项目
              td(width="80") 更换历程
              td(width="80") 检测历程
              td(width="100") 项目提示
              td(width="80") 检测点
              td(width="100") 异常问题
              td(width="100") 异常建议
              td(width="60") 操作
          tbody
            tr(v-for="(item, index) in list" :key="index")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.exchange_mile}}KM
              td
                .simple-td {{item.inspect_mile}}KM
              td
                .multi-content-td.textzh {{item.tip | empty}}
              td
                .multi-content-td.word-break
                  ul
                    li(v-for="(info, index) in item.point", :key="index") {{index + 1}}、{{info}}
              td
                .multi-content-td.word-break 
                  ul
                    li(v-for="(info, index) in item.exception", :key="index") {{index + 1}}、{{info}}
              td
                .multi-content-td.word-break 
                  ul
                    li(v-for="(info, index) in item.suggest", :key="index") {{index + 1}}、{{info}}
              td
                .operation-td
                  span.operation-link(@click="showVelhicle(2, item.id)") 编辑
                  span.operation-link(@click="deleteProject(item)") 删除
          .tfoot
            pagination(:pagination-data="pagination_data", @input="paging")
    //- 添加场景项目模态框
    slide-out-modal(v-if="slide_vehicle", @input="showVelhicle")
      add-vehicle-model(@vehicleSuccess="addVehicleSuccess", :is_edit="is_edit", :id="curr_id")
</template>

<script>
import filterTools from '@/mixins/utilities/filterTools'
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import AddVehicleModel from '@/components/functionSetting/modal/AddVehicleModel'
import Pagination from '@/components/generics/Pagination'
import Api from '@/mixins/modules/FunctionSetting'

export default {
  name: 'ProjectManage',
  mixins: [filterTools, Api],
  components: {
    EmptyPage,
    SlideOutModal,
    AddVehicleModel,
    Pagination,
  },
  data() {
    return {
      slide_vehicle: false, // 是否展示添加车检项目模态框
      pagination_data: {
        current_page: 1,
        per_page: 15,
        last_page: 1,
        total: 0,
      },
      is_initiated: false,
      is_edit: 1,           // 编辑&添加
      list: [],             // 项目列表
      curr_id: ''           // 要编辑项目的id
    }
  },
  methods: {
    /**
     * 控制车检项目模态框展示
     * edit {Number} 1.标识添加，2.标识编辑
     * id {Number} 项目id(编辑时使用)
     */
    showVelhicle (edit, id) {
      edit === 1 ? this.is_edit = 1 : this.is_edit = 2
      if (id) this.curr_id = id
      this.slide_vehicle = !this.slide_vehicle
    },

    // 项目列表
    async fetchProjectList () {
      let params = {
        page: this.pagination_data.current_page,
        per_page: this.pagination_data.per_page,
        simple: 0,
      }
      try {
        const { response, result } = await this.getArticleListApi(params)
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.pagination_data = result.meta
          this.is_initiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取项目列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取项目列表失败',
          content: err,
        })
      }
    },

    // 分页操作 
    paging (state) {
      this.pagination_data = state
      this.fetchProjectList()
    },

    // 删除项目确认操作
    deleteProject (params) {
      if (params.is_used === 1) {
        this.$store.dispatch('showMessage', {
          title: '操作警示',
          content: '您删除的车检项目已使用，如删除后所有车检单该项目均会删除，请谨慎操作！',
          isRejectable: 1,
          resolve: () => {
            this.removeApi(params.id)
          },
        })
      }
      if (params.is_used === 0) {
        this.$store.dispatch('showMessage', {
          title: '温馨提示',
          content: '确定删除该车检项目吗？',
          isRejectable: 1,
          resolve: () => {
            this.removeApi(params.id)
          },
        })
      }
    },

    // 删除项目接口请求函数
    async removeApi (id) {
      try {
        const { response, result } = await this.delInspectionApi({id: id})
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '成功',
            content: '项目删除成功',
            resolve: () => {
              this.fetchProjectList()
            }
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '项目删除失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '项目删除失败',
          content: err,
        })
      }
    },

    // 车检项目模态框回调
    addVehicleSuccess () {
      this.slide_vehicle = false
      this.fetchProjectList()
    },
  },
  mounted () {
    this.fetchProjectList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.multi-content-td{
  vertical-align: middle;
}

.textzh {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: normal;
}

.icon-img {
  height: 36px;
}

.icon-img img {
  width: 36px;
  height: 36px;
}

.section-filter .add-button {
  bottom: initial;
}

.word-break {
  word-break: break-all;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.section-filter-none.is-horizontal {
  height: 0;
  padding: 0;
}

.button {
  align-items: center;
}
.primary {
  height: 28px;
  line-height: 29px;
  font-size: 14px;
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