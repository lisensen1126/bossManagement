<template lang="pug">
  .section-layout
    .section-filter.is-horizontal
      span.add-button(@click="openModel()")
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="80") 名称
              td(width="130") 图标
              td(width="10") 操作
          tbody
            tr(v-for="item in list")
              td
                .simple-td(v-text="item.title")
              td
                .icon-img(v-if="item.icon_img")
                  img(:src="item.icon_img")
                .simple-null(v-else) -
              td
                .operation-td
                  a.operation-link(@click="openModel(item)") 编辑
                  a.operation-link(@click="deleteModel(item)") 删除
    // 空页面
    empty-page(v-if="list.length === 0", tip="当前没有认证信息")
    // 编辑新增组件（模态框）
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      setting-service-model(@callBack="settingSuccess", :itemInfo="itemInfo", :isFrom="isFrom")
</template>

<script>
import Pagination from '@/components/generics/Pagination'
import SlideOutModal from '@/components/generics/SlideOutModal'
import SettingServiceModel from '@/components/basics/SettingServiceModel'
import bossMixin from '@/mixins/modules/basics' // 接口文件
import EmptyPage from '@/components/generics/EmptyPage' // 空页面组件
export default {
  name: 'brandManagement',
  mixins: [bossMixin],
  components: {
    Pagination,
    SlideOutModal,
    SettingServiceModel,
    EmptyPage,
  },
  data () {
    return {
      list: [],
      slideVisible: false, // 是否展示模态框
      itemInfo: null, // 临时编辑数据信息
      isFrom: {
        isEdit: false, // 打开模态框是否是编辑
        type: 1, // 1 认证 2服务
      },
    }
  },
  methods: {
    /**
     * 分页回调
     * state 状态
     */
    paging (state) {
      this.paginationData = state
      this.fetchData()
    },

    /**
     * 获取数据
     */
    async fetchData () {
      try {
        const { response, result } = await this.settingList({
          setting_type: this.isFrom.type, // 1：认证，2：服务
        })
        if (response.status === 200) {
          this.list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取认证列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取认证列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    /**
     * 打开模态框 进行新增 or 编辑
     * @item 编辑的某条数据信息
     */
    openModel (item) {
      if (item) {
        this.isFrom.isEdit = true
        this.itemInfo = item
      } else {
        this.isFrom.isEdit = false
        this.itemInfo = null
      }
      this.toggleSidePannel()
    },
    /**
     * 删除前提示确认
     * @item 编辑的某条数据信息
     */
    deleteModel (item) {
      this.$store.dispatch('showMessage', {
        type: 'warning',
        title: '确认要删除此条数据嘛?',
        content: '数据删除后无法恢复!',
        isRejectable: 1,
        resolve: () => {
          this.deleteInfo(item)
        },
      })
    },
    /**
     * 删除数据
     * @item 编辑的某条数据信息
     */
    async deleteInfo (item) {
      try {
        const { response, result } = await this.settingDelete({
          setting_id: item.setting_id, // 1：认证，2：服务
        })
        if (response.status === 200 && result.code === 0) {
          this.fetchData()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除数据出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '删除数据失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /**
     * 新增 编辑回调
     */
    settingSuccess () {
      this.toggleSidePannel()
      this.fetchData()
    },
    /**
     * 显示隐藏模态框
     */
    toggleSidePannel () {
      this.slideVisible = !this.slideVisible
    },
  },
  mounted () {
    this.fetchData()
  },
}
</script>
<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.icon-img, .icon-img img {
  width: 36px;
  height: 36px;
}

.section-filter {
  height: 48px;
}
</style>
