<template lang="pug">
  .section-layout
    prior-conditions
      service-tab(v-model="type_status", :tabs="content_type", :have-icon="false", :have-quantity="false", @input="changeType")
    .section-filter.is-horizontal
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 关键字搜索
          custom-input(v-model="filterData.keyword", placeholder="按文章标题查询", @keyupEnter="search", maxlength="30")
        .field.keyword-wrapper
          label.label 文章分类
          custom-select(v-model="select_classify", :list="select_list",)
        .field
          a.button.primary(@click="search") 搜索
        .field
          a.button(@click="reset") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="createContent")
            span.add-icon
            span 添加文章
    empty-page(v-if="!(list && list.length)", tip="当前没有文章")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.description}}
              td
                .simple-td(v-if="item.category_name") {{item.category_name}}
                .simple-td(v-else) --
              td
                .icon-img
                  .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                  .down(v-if="index !== list.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td
                  img.img-cover(:src="item.cover")
              td
                .simple-td(v-if="!item.open_time") --
                .simple-td(v-else, v-text="formateDate(item.open_time, true, 2)")
              td
                .switch
                  input(type="checkbox", :id="'display' + index", v-model="item.is_selected", @change="changeStatus(index)")
                  label(:for="'display' + index")
              td
                .operation-td
                  a.operation-link(@click="goEdit(item)") 编辑
                  a.operation-link(@click="deleteItem(index)") 删除
</template>

<script>
  import PriorConditions from '@/components/generics/PriorConditions'
  import ServiceTab from '@/components/generics/ServiceTab'
  import CustomInput from '@/components/generics/form/CustomInput'
  import EmptyPage from '@/components/generics/EmptyPage'
  import SupportApi from '@/mixins/modules/SeriesSupport'
  import FormateDate from '@/mixins/utilities/formateDate'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  export default {
    name: 'brandSupportList',
    mixins: [SupportApi, FormateDate],
    components: {
      CustomSelect,
      PriorConditions,
      ServiceTab,
      EmptyPage,
      CustomInput,
    },
    data () {
      return {
        showImg: false,
        imgsrc: '',
        // 搜索对象
        filterData: {
          keyword: '',
        },
        type_status: {
          type: 1,
          name: '培训',
        },
        setList: [
          {
            type: 1,
            name: '培训',
          },
          {
            type: 2,
            name: '案例分享',
          },
          {
            type: 3,
            name: '促销通知',
          },
        ],
        content_type: [
          {
            type: 1,
            name: '培训',
          },
          {
            type: 2,
            name: '案例分享',
          },
          {
            type: 3,
            name: '促销通知',
          },
        ],
        theadConfig: [
          {
            name: '文章标题',
            width: '160',
          },
          {
            name: '文章描述',
            width: '240',
          },
          {
            name: '文章分类',
            width: '150',
          },
          {
            name: '排序',
            width: '100',
          },
          {
            name: '封面图',
            width: '100',
          },
          {
            name: '发布时间',
            width: '150',
          },
          {
            name: '是否发布',
            width: '80',
          },
          {
            name: '操作',
            width: '200',
          }],
        list: [],
        select_classify: null,
        select_list: [],
        paginationData: {
          current_page: 1,
          per_page: 20,
          last_page: 1,
          total: 0,
        },
        setting_id: '',
        index: '',
        query_data: {},
        is_first_enter: false, // 是否第一次进入页面
        is_back: false, // 是否返回
      }
    },
    methods: {
      /*
      * 修改开启状态
      * index 数据下标
      * */
      async changeStatus (index) {
        let _this = this
        try {
          const { response, result } = await _this.contentStatusApi({
            id: _this.list[index].id,
            status: _this.list[index].is_selected ? 1 : 2,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              _this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '修改成功',
              })
            } else {
              _this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改失败',
                content: `${result.message}`,
              })
            }
          } else {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改信息失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
        this.getList()
      },
      // 删除
      deleteItem (index) {
        this.$store.dispatch('showMessage', {
          title: '确认删除该文章？',
          isRejectable: 1,
          resolve: () => {
            this.delData(this.list[index].id)
          },
        })
      },
      /*
      * 删除接口
      * id int SPUid
      * */
      async delData (id) {
        try {
          const {response, result} = await this.delContentApi({
            id: id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                title: '删除成功!',
                autoClose: true, // 控制弹框自动消失
                type: 'success',
              })
              this.getList()
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
          console.error(err, '删除')
        }
      },
      /*
      * 排序
      * index 下标
      * type 上 下
      * */
      async sortItem (index, type) {
        let _this = this
        let params = {}
        if (type === 'up') {
          params.first_id = _this.list[index].id
          params.second_id = _this.list[index - 1].id
        } else {
          params.first_id = _this.list[index + 1].id
          params.second_id = _this.list[index].id
        }
        try {
          const { response, result } = await _this.contentSortApi(params)
          if (response.status === 200) {
            if (result.code === 0) {
              _this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '修改成功',
                resolve: () => {
                  _this.getList()
                },
              })
            } else {
              _this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '修改失败',
                content: `${result.message}`,
              })
            }
          } else {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改信息失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '修改信息失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 分页
      paging (state) {
        this.paginationData = state
        this.getList()
      },
      search () {
        this.paginationData.current_page = 1
        this.getList()
      },
      reset () {
        this.changeType()
      },
      changeType () {
        this.$set(this.paginationData, 'current_page', 1)
        this.filterData = {
          keyword: '',
        }
        this.select_classify = null
        this.query_data = JSON.parse(JSON.stringify(this.filterData))
        this.getList()
        this.getClassifyList()
      },
      async getList () {
        try {
          const { response, result } = await this.contentListApi({
            type: this.type_status.type,
            name: this.filterData.keyword,
            page: this.paginationData.current_page,
            category_id: this.select_classify ? this.select_classify.id : '',
            per_page: 1000,
          })
          if (result.code === 0 && response.status === 200) {
            this.list = result.data
            result.data.forEach(item => {
              item.setting_block = false
              let status = true
              if (item.status === 2) status = false
              item.is_selected = status
            })
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取文章列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '文章列表')
        }
      },
      goEdit (item) {
        sessionStorage.setItem('type_status', JSON.stringify(this.type_status))
        this.$router.push({
          name: 'editbrand',
          query: {
            type: this.type_status.type,
            id: item.id,
          },
        })
      },
      createContent () {
        sessionStorage.setItem('type_status', JSON.stringify(this.type_status))
        if (this.select_list.length === 1) {
          this.$store.dispatch('showMessage', {
            title: `当前${this.type_status.name}下没有分类,请先添加分类`,
            isRejectable: 1,
          })
          return
        }
        this.$router.push({
          name: 'addcontent',
          query: {
            type: this.type_status.type,
          },
        })
      },
      async getClassifyList () {
        try {
          const { response, result } = await this.brandCategoryListApi({
            type: this.type_status.type - 0,
            page: 1,
            size: 1000,
          })
          if (result.code === 0 && response.status === 200) {
            result.data.unshift({
              id: '',
              name: '全部',
            })
            this.select_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取文章列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '分类列表')
        }
      },
    },
    mounted () {
      let typeStatus = sessionStorage.getItem('type_status')
      if (typeStatus) {
        this.type_status = JSON.parse(typeStatus)
        sessionStorage.setItem('type_status', '')
      }
      this.getClassifyList()
      this.getList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .list-wrapper {
    padding-bottom 0px !important
  }
  .img-cover{
    width 36px
    height 36px
    border-radius 2px
  }
  .bottom-image {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 4px;

    img {
      height: 100%;
      width: 100%;
    }
  }
  .money{
    width: 82px;
    height:36px;
  }
  .fccc {
    width: 100px;
    height: 200px;
    background: red;
  }

  .bigImg {
    z-index: 9999;
  }
  .section-filter {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
  .margin {
    margin: 0 8px;
    font-size: 14px;
  }

  .up, .down {
    position: absolute;
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
  .simple-td{
    max-width 200px
  }

</style>

