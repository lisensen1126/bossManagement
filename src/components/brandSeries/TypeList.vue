<template lang="pug">
  .section-layout
    add-type(v-if="show_add", v-model="show_add" @resolve="getName", :default-value="show_name", :default-id="show_id")
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    empty-page(v-if="list.length === 0", :tip="'当前没有类型'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 分类名称
              td(width="100") 排序
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in list")
              td {{item.name}}
              td
                .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                .down(v-if="index !== list.length-1", @click="sortItem(index, 'down')")
              td
                .operation-td
                  a.operation-link.left(@click="editName(item, index)") 编辑
                  a.operation-link(@click="goServe(item, index)") 引用服务
                  a.operation-link(@click="deleteItem(index)")  删除
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
</template>

<script>
  import EmptyPage from '@/components/generics/EmptyPage'  // 空页面组件
  import addType from '@/components/brandSeries/modal/addTypeModal'  // 添加分类
  import SeriesApi from '@/mixins/modules/SeriesSupport'
  export default {
    name: 'TypeList',
    mixins: [SeriesApi],
    components: {
      EmptyPage,
      addType,
    },
    data () {
      return {
        show_add: false, // 是否展示添加弹框
        show_id: '',
        show_name: '', // 编辑默认值
        list: [],
        now_index: '',
        is_edit: false,
      }
    },
    methods: {
      // 保存
      async saveData () {
        let params = []
        this.list.forEach((item, index) => {
          let obj = {
            id: item.id,
            sort: index + 1,
          }
          params.push(obj)
        })
        try {
          const {response, result} = await this.seriesSortApi({
            data: params,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                title: '保存成功!',
                autoClose: true, // 控制弹框自动消失
                type: 'success',
              })
              this.fetchData()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '保存失败',
                content: `出错了:${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      goServe (item, index) {
        this.$router.push({
          name: 'serviceTypeList',
          query: {
            name: item.name,
            id: item.id,
          },
        })
      },
      // 编辑分类
      editName (item, index) {
        this.show_add = true
        this.is_edit = true
        this.show_name = item.name
        this.show_id = item.id
        this.now_index = index
      },
      /**
       * 删除分类型
       * @ index
       */
      deleteItem (index) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该分类型？',
          isRejectable: 1,
          resolve: () => {
            this.delData(this.list[index].id)
          },
        })
      },
      /*
      * 删除接口
      * id int 分类型id
      * */
      async delData (id) {
        try {
          const {response, result} = await this.delSeriesApi({
            id: id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                title: '删除成功!',
                autoClose: true, // 控制弹框自动消失
                type: 'success',
              })
              this.fetchData()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '删除失败',
                content: `出错了:${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '删除失败失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        let arr = [...this.list]
        this.list = []
        let temp = arr[index]
        // 向上移动
        if (type === 'up') {
          arr[index] = arr[index - 1]
          arr[index - 1] = temp
        }
        // // 向下移动
        if (type === 'down') {
          arr[index] = arr[index + 1]
          arr[index + 1] = temp
        }
        this.list = [...arr]
      },
      getName () {
        this.fetchData()
      },
      addItem () {
        this.show_name = ''
        this.show_id = ''
        this.is_edit = false
        this.show_add = true
      },
      async fetchData () {
        try {
          const {response, result} = await this.getSeriesListApi({
            type: 1,
          })
          if (response.status === 200 && result.code === 0) {
            this.list = result.data
            this.is_initiated = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取分类型列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类型列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.is_initiated = true
      },
    },
    mounted () {
      this.fetchData()
    },
  }

</script>

<style  lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.section-layout {
  height: calc(100% - 48px);
}
.content-wrapper
  background none
.table-data {
  height: calc(100% - 90px) !important;
}
.section-filter-none{
  height 0px
  padding 0
}
.add-button
  z-index 99 !important
  bottom -43px !important
.up, .down {
  position: absolute;
  top: 19px;
  width: 20px;
  height: 30px;
  opacity: 0.5;
  cursor: pointer;

  &.is-disable {
    opacity: 0.2;
    pointer-events: none;
  }

  &:hover {
    opacity: 1;
  }
}

.up {
  left: 0;
  background: center no-repeat url('~@/assets/icons/move-up.svg');
  background-size: 20px 30px;
}

.down {
  left: 25px;
  background: center no-repeat url('~@/assets/icons/move-down.svg');
  background-size: 20px 30px;
}
.btn-wrapper
  margin-top 20px
  padding-right 70px
  text-align right
  .large
    width 120px
.btn-wrapper
  text-align right
  position fixed
  bottom 15px
  right 0
  padding 23px 40px 0
</style>
