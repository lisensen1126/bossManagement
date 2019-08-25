<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="showScene(1)")
    empty-page(v-if="list.length == 0 && is_initiated", :tip="'当前没有车检场景'")
    .content-wrapper.list-wrapper(v-if="list.length > 0 && is_initiated")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 场景名称
              td(width="80") 创建时间
              td(width="80") 操作人
              td(width="120") 项目数
              td(width="80") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.created_time}}
              td
                .simple-td {{item.operator_name | empty}}
              td
                .simple-td {{item.category_item_count}}
              td
                .operation-td
                  span.operation-link(@click="showScene(2, item.id)") 编辑
                  span.operation-link(@click="showVelhicle(item.items, item.id)") 项目设置
                  span.operation-link(@click="deleteItem(item)") 删除
    //- 添加场景模态框
    slide-out-modal(v-if="slide_visible", @input="showScene")
      add-scene-model(@sceneSuccess="addSceneSuccess", :params="curr_scene", :is_edit="is_edit")

    //- 场景关联项目模态框
    choose-vehicle(v-if="slide_vehicle", v-model="slide_vehicle", :array="select_item", @resolve="selectProject")

</template>

<script>
import Pagination from '@/components/generics/Pagination'
import marketingMixin from '@/mixins/modules/marketing'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import AddSceneModel from '@/components/functionSetting/modal/AddSceneModel'
import ChooseVehicle from '@/components/functionSetting/modal/ChooseVehicle'
import Api from '@/mixins/modules/FunctionSetting'

export default {
  name: 'ProjectManage',
  mixins: [marketingMixin, filterTools, imageScale, Api],
  components: {
    EmptyPage,
    Pagination,
    AddSceneModel,
    SlideOutModal,
    ChooseVehicle,
    // AddVehicleModel,
  },
  data () {
    return {
      list: [],
      slide_visible: false, // 是否展示添加车检场景模态框
      is_edit: 1,           // 编辑&添加
      curr_scene: {         // 点击编辑，当前的场景对象
        desc: '',
        icon: '',
        id: '',
        name: '',
      },       
      slide_vehicle: false, // 是否展示添加车检项目模态框
      is_initiated: false,  // 页面初始状态
      select_item: [],      // 选中的车检项目
      select_id: '',        // 要关联的场景id
    }
  },
  methods: {
    // 获取场景列表
    async fetchSceneList () {
      try {
        const { response, result } = await this.getFirstClassListApi()
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.is_initiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取场景列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取场景列表失败',
          content: err,
        })
      }
    },

    // 控制场景模态框展示
    showScene (edit, sceneid) {
      edit === 1 ? this.is_edit = 1 : this.is_edit = 2
      if (sceneid) {
        this.fetchSceneDetali(sceneid)
      } else {
        this.slide_visible = !this.slide_visible
      }
    },

    // 获取场景详情 
    async fetchSceneDetali (sceneid) {
      try {
        const { response, result } = await this.getArticleDetailApi({
          id: sceneid,
        })
        if (response.status === 200 && result.code === 0) {
          this.curr_scene = result.data
          this.slide_visible = !this.slide_visible
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取场景详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取场景详情失败',
          content: err,
        })
      }
    },

    // 场景模态框回调数据
    addSceneSuccess (value) {
      if (value.id && this.is_edit === 2) {
        this.editScene(value)
      } else {
        this.addScene(value)
      }
    },

    // 新增场景
    async addScene (params) {
      try {
        const { response, result } = await this.getFirstClassApi(params)
        if (response.status === 200 && result.code === 0) {
          this.slide_visible = false
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '成功',
            autoClose: true,
            content: '添加场景成功',
            resolve: () => {
              this.fetchSceneList()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加场景失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加场景失败',
          content: err,
        })
      }
    },

    // 编辑场景
    async editScene (params) {
      try {
        const { response, result } = await this.editFirstClassApi(params)
        if (response.status === 200 && result.code === 0) {
          this.slide_visible = false
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '成功',
            autoClose: true,
            content: '编辑场景成功',
            resolve: () => {
              this.fetchSceneList()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑场景失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '编辑场景失败',
          content: err,
        })
      }
    },

    // 删除场景
    deleteItem (params) {
      if (params.is_used === 1) {
        this.$store.dispatch('showMessage', {
          title: '操作警示',
          content: '您删除的车检场景已使用，如删除后所有车检单该场景信息均会删除，请谨慎操作！',
          isRejectable: 1,
          resolve: () => {
            this.deleteScene(params.id)
          },
        })
      }
      if (params.is_used === 0) {
        this.$store.dispatch('showMessage', {
          title: '温馨提示',
          content: '确定删除该车检场景吗？',
          isRejectable: 1,
          resolve: () => {
            this.deleteScene(params.id)
          },
        })
      }
    },

    // 删除场景接口请求
    async deleteScene (secenid) {
      try {
        const { response, result } = await this.delProjectApi({
          id: secenid,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '成功',
            autoClose: true,
            content: '删除场景成功',
            resolve: () => {
              this.fetchSceneList()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除场景失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除场景失败',
          content: err,
        })
      }
    },

    // 场景关联项目模态框回调 选中的项目
    async selectProject (list) {
      try {
        const { response, result } = await this.setVehicleSceneApi({
          id: this.select_id,
          item_ids: list.map(v => v.id),
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            type: 'success',
            title: '成功',
            autoClose: true,
            content: '项目设置成功',
            resolve: () => {
              this.fetchSceneList()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '项目设置失败',
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

    // 控制车检项目模态框展示
    showVelhicle (params, id) {
      this.select_item = params
      this.select_id = id
      this.slide_vehicle = !this.slide_vehicle
    },
  },
  mounted () {
    this.fetchSceneList()
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

.word-break {
  word-break: break-all;
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

