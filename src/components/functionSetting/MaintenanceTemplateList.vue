<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if='template_list.length !== 0')
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 卡面
              td(width="150") 名称
              td(width="100") 状态
              td(width="60") 使用范围
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in template_list")
              td
                .simple-image
                  img.pic-item(:src="item.image_url")
              td
                .simple-image {{item.name}}
              td.set-lock
                .switch
                  input(type="checkbox", :id="index", v-model="item.enabled", @change="isEnabel(item)")
                  label(:for="index")
              td(v-text="item.type === 1 ? '通用' : '仅BOSS'")
              td
                .operation-td
                  a.operation-link(@click="editItem(item)") 编辑
                  a.operation-link(v-if="item.status === 2" @click="deleteItem(item.id)") 删除
    // 空页面
    empty-page(v-if="is_initiated && template_list.length === 0", tip="当前没有养护卡模板")
</template>

<script>
  import EmptyPage from '@/components/generics/EmptyPage'
  // import UploadPic from '@/components/generics/form/UploadPic'
  import OpenImage from '@/components/generics/OpenImage'
  import filterTools from '@/mixins/utilities/filterTools'
  import FunctionSettingApi from '@/mixins/modules/FunctionSetting'
  export default {
    name: 'maintenanceTemplateList',
    mixins: [FunctionSettingApi, filterTools],
    components: {
      EmptyPage,
      OpenImage,
    },
    data () {
      return {
        template_list: [], // 模板列表
        is_initiated: false,
      }
    },
    methods: {
      // 新建模板
      addItem () {
        this.$router.push({
          name: 'maintenanceTemplateAdd',
          query: {
            edit: 1,
          },
        })
      },
      /*
      * 删除养护卡
      * id 模板id
      * */
      deleteItem (id) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: '确认删除模板？',
          isRejectable: 1,
          resolve: () => {
            this.delApi(id)
          },
        })
      },
      /*
      * 删除接口
      * id 模板id
      * */
      async delApi (id) {
        let _this = this
        try {
          const { response, result } = await this.maintenanceDelApi({
            id: id,
          })
          if (response.status === 200) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '删除成功',
              resolve: () => {
                _this.getTemplateList()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 编辑模板
      editItem (item) {
        this.$router.push({
          name: 'maintenanceTemplateAdd',
          query: {
            edit: 2,
            id: item.id,
          },
        })
      },
      // 启用/禁用操作
      async isEnabel (item) {
        try {
          const { response, result } = await this.cardTemplateOperateApi({
            id: Number(item.id),
            status: item.enabled ? 1 : 2,
          })
          if (response.status === 200 && result.code === 0) {
            if (!item.enabled) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '禁用成功',
              })
            } else {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '启用成功',
              })
            }
            this.getTemplateList()
          } else {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'failure',
              title: '操作失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'failure',
            title: '操作失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取模板列表
      async getTemplateList () {
        try {
          const { response, result } = await this.cardTemplateListApi()
          if (response.status === 200 && result.code === 0) {
            this.template_list = result.data.map(item => {
              // 重新赋值
              item.status === 1 ? item.enabled = true : item.enabled = false
              return item
            })
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取模板列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getTemplateList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal';
  td,.simple-td {
    vertical-align: middle;
  }
  .section-layout {
    height: calc(100% - 48px);
  }

  .content-wrapper {
    background: initial;
    margin-top: 0;
    margin-bottom: 0;
  }

  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .empty-page-wrapper {
    padding: 30px 0;
  }

  .simple-image .pic-item {
    width: 200px;
    height: 113px;
    background-color: gray;
    display: block;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .btn-wrapper {
    text-align: right;
    position: fixed;
    bottom: 40px;
    right: 0;
    padding: 23px 40px 0;
  }
</style>


