<template lang="pug">
  .section-layout
    slide-out-modal(v-if="slideVisible", :is-slim="true", @input="toggleSidePannel")
      poster-preview-modal(:img-url="img_bg", :type="type")
      span(v-if="type==1||type==2||type==5").red 注：该海报仅为示意图片，您可到门店小程序体验分享海报及扫码功能。
      span(v-if="type==3||type==4||type==6").red 注：该海报仅为示意图片，您可到企业微信体验分享海报及扫码功能。
    .section-filter
      .field-group.is-horizontal
        .field.keyword-wrapper
          label.label 名称搜索
          custom-input(v-model="filterData.name", placeholder="请输入背景名称", @keyupEnter="applyFilter")
        .field
          label.label 背景类型
          custom-select(:list="statusList", v-model="filterData.getStatus", :input="changeStatus")
        .field
          a.button.primary(@click="applyFilter") 搜索
        .field
          a.button(@click="resetFilter") 重置
      .field-group.is-horizontal
        .field
          label.label &nbsp;
          a.button.primary(@click="addPoster")
            span.add-icon
            span 添加背景
    empty-page(v-if="list.length === 0", :tip="'当前没有海报背景'")
    .content-wrapper.list-wrapper(v-if="list && list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="200") 背景名称
              td(width="200") 背景类型
              td(width="200") 上次修改时间
              td(width="100") 是否使用
              td(width="150") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.name}}
              td
                .simple-td {{item.category_name}}
              td
                .simple-td {{item.updated_at}}
              td
                .simple-td
                  .switch
                    input(type="checkbox", :id="'display' + index", v-model="item.is_select", @change="displayConfirm(index)")
                    label(:for="'display' + index")
              td
                .operation-td
                  a.operation-link.right(@click="toggleSidePannel(item)") 预览
                  a.operation-link.right(@click="goEdit(item)") 编辑
                  a.operation-link.right(@click="deleteData(item)") 删除
          .tfoot(v-if="list.length > 0")
            pagination(:pagination-data="paginationData", @input="paging")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import Pagination from '@/components/generics/Pagination'
  import drawApi from '@/mixins/modules/draw'
  import filterTools from '@/mixins/utilities/filterTools'
  import imageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import SlideOutModal from '@/components/generics/SlideOutModal'
  import PosterPreviewModal from '@/components/draw/modal/PosterPreviewModal'

  export default {
    name: 'DrawList',
    mixins: [drawApi, filterTools, imageScale],
    components: {
      SlideOutModal,
      PosterPreviewModal,
      CustomInput,
      EmptyPage,
      Pagination,
      CustomSelect,
    },
    data () {
      const schema = {
        img_bg: '',
        type: 1,
        slideVisible: false,
        // 活动的状态
        statusList: [{
          name: '全部',
          status: 0,
        }, {
          name: '秒杀海报背景',
          status: 1,
        }, {
          name: '拼团海报背景',
          status: 2,
        }, {
          name: '门店海报背景',
          status: 3,
        }, {
          name: '活动海报背景',
          status: 4,
        }, {
          name: '养护卡海报背景',
          status: 5,
        }, {
          name: '节日海报背景',
          status: 6,
        }],
        isInitiated: true,
        filterData: {
          name: '',
          getStatus: {
            name: '全部',
            status: 0,
          },
        },
        queryData: {
          name: '',
          getStatus: {
            name: '全部',
            status: 0,
          },
        },
        // 分页的数据
        paginationData: {
          current_page: 1, // 当前页
          per_page: 20, // 每页的数据
          last_page: 2, // 最后一页
          total: 31, // 总数据
        },
        // 活动列表
        list: [],
        is_first_enter: false, // 是否第一次进入
      }
      return schema
    },
    methods: {
      // 预览
      toggleSidePannel (item) {
        console.log(item)
        this.img_bg = item.cover
        this.type = item.type
        this.slideVisible = !this.slideVisible
      },
      // 编辑页面
      goEdit (item) {
        let obj = {
          paginationData: this.paginationData,
          filterData: this.filterData,
        }
        sessionStorage.setItem('posterSearchData', JSON.stringify(obj))
        this.$router.push({
          name: 'editPoster',
          query: {
            id: item.id,
          },
        })
      },
      // 修改状态
      async displayConfirm (index) {
        try {
          const { response, result } = await this.getPosterStatusApi({
            id: this.list[index].id,
            status: this.list[index].is_select ? 1 : 2,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true,
              type: 'success',
              title: '修改成功',
              resolve: () => {
                this.fetchData()
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '修改失败',
              content: result.message,
            })
            this.list[index].is_select = !this.list[index].is_select
          }
        } catch (err) {
          console.error(err, '状态错误')
          this.list[index].is_select = !this.list[index].is_select
        }
      },
      /* 删除活动提示
      *  @ item 海报obj
      * */
      deleteData (item) {
        this.$store.dispatch('showMessage', {
          title: '提示',
          content: `确认删除‘${item.name}’该背景？`,
          isRejectable: true,
          resolve: () => {
            this.deleteApi(item.id)
          },
        })
      },
      /* 删除接口
      *  @ id 海报id
      * */
      async deleteApi (id) {
        try {
          const { result, response } = await this.getPosterDeleteApi({
            id: id,
          })
          if (response.status === 200) {
            if (result.message === 'success') {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '删除成功',
                resolve: () => {
                  this.fetchData()
                },
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '删除失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '删除')
        }
      },
      /* 选择类型
      *  @ q 类型
      * */
      changeStatus (q) {
        this.getStatus = q
      },
      /**
       * 分页处理
       * @status  分页的状态
       */
      paging (state) {
        this.paginationData = state
        this.fetchData()
      },
      // 添加
      addPoster () {
        this.$router.push({
          name: 'addPoster',
        })
      },
      /**
       * 获取海报列表
       * @returns {Promise<void>}
       */
      async fetchData () {
        try {
          const { response, result } = await this.getPosterListApi({
            name: this.queryData.name,
            page: this.paginationData.current_page,
            size: this.paginationData.per_page,
            type: this.queryData.getStatus.status,
          })
          if (response.status === 200 && result.code === 0) {
            let self = this
            result.data.forEach(item => {
              item.updated_at = this.changeDateTime(item.updated_at)
              item.category_name = self.statusList[item.type].name
              item.status === 1 ? item.is_select = true : item.is_select = false
            })
            this.list = result.data
            this.paginationData = result.meta
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '海报列表')
        }
      },
      applyFilter () {
        for (let key in this.filterData) {
          if (this.queryData.hasOwnProperty(key)) {
            this.queryData[key] = this.filterData[key]
          }
        }
        this.paginationData.current_page = 1
        this.fetchData()
      },
      // 重置
      resetFilter () {
        this.filterData.name = ''
        this.filterData.getStatus = {
          name: '全部',
          status: 0,
        }
        this.paginationData.current_page = 1
        this.queryData = JSON.parse(JSON.stringify(this.filterData))
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
      let obj = sessionStorage.getItem('posterSearchData')
      if (obj) {
        obj = JSON.parse(obj)
        this.paginationData = obj.paginationData
        this.filterData = {...obj.filterData}
        this.queryData = {...obj.filterData}
        sessionStorage.setItem('posterSearchData', '')
      }
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  td,.multi-content-td{
    padding-right 10px
    vertical-align middle
  }
  .section-filter {
    display: flex;
    justify-content: space-between;
  }
  .section-layout {
    height calc(100% - 56px)
  }
  .right {
    margin-right: 10px !important;
  }
  .keyword-wrapper {
    width: 244px;
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

  .gray {
    color: #989ba1;
  }
  .red {
    color: red;
    font-size: 15px;
    margin-left: 10px;
  }
  .text-center {
    text-align: center;
  }

  .justify-center {
    justify-content: center;
  }

  .operation-link {
    margin-right: 0;
  }
</style>
