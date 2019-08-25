<template lang="pug">
  .section-layout.pps
    .section-filter
      .field-group.is-horizontal.haha
        .field
          label.label &nbsp;
          a.button.primary(@click="showAddModel(false)", v-if="showAddBtn")
            span.add-icon
            span 添加分类
    .listData
      .left-list
        .thead 服务分类
        el-tree(:props="props1" :load="loadNode" lazy="" @node-click="changeTree" node-key="category_ischeck" :default-expanded-keys="[1]")
      .right-data
        empty-page(v-if="!(list && list.length) && isInitiated", tip="当前没有分类信息")
        .content-wrapper.list-wrapper(v-if="list.length>0")
          .table-wrapper
            table.table
              thead
                tr
                  td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
              tbody
                tr(v-for="item in list")
                  td
                    .simple-td(v-text="item.category_name")
                  td
                    .multi-content-td.has-image(v-if="item.category_logo")
                      .left-image.round
                        img(:src="item.category_logo")
                    .simple-td(v-else) -
                  td
                    .simple-td
                      span(v-if="item.is_enabled == 1" v-text="'启用'")
                      span(v-if="item.is_enabled == 2" v-text="'禁用 '")
                  td
                    .operation-td
                      a.operation-link(@click="showAddModel(item)") 编辑
    slide-out-modal(v-if="slideVisible", @input="showAddModel")
      classify-add(:isAdd="isAdd" :classType="classType" :parantId="parantId" @success="addSuccess")
</template>

<script>
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import ClassifyAdd from '@/components/commodityServiceManagement/ClassifyAdd'
import bossMixin from '@/mixins/modules/boss' // 接口文件
export default {
  name: 'serviceClassificationManagement',
  mixins: [bossMixin],
  components: {
    EmptyPage,
    SlideOutModal,
    ClassifyAdd,
  },
  data () {
    const schema = {
      isInitiated: false,
      props1: {
        // 树状结构数据
        label: 'category_name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      menuName: 'menuName', // 显示菜单名称的属性
      classType: '2', // 服务分类标识符
      parantId: '0', // 服务分类添加必须参数 默认父类分类id 0
      theadConfig: [
        {
          name: '分类名称',
          width: '40%',
        },
        {
          name: '分类icon',
          width: '20%',
        },
        {
          name: '状态',
          width: '20%',
        },
        {
          name: '操作',
          width: '20%',
        },
      ],
      list: [],
      submitData: {
        type: '2',
        parent_id: 0,
        is_page: 2,
      },
      isAdd: '',
      slideVisible: false,
      showAddBtn: true,
    }
    return schema
  },
  inject: ['reload'],
  methods: {
    // 显示品牌添加模态框
    showAddModel (item) {
      if (item) {
        this.isAdd = item
      } else {
        this.isAdd = ''
      }
      this.slideVisible = !this.slideVisible
    },
    // 添加编辑服务分类成功之后的回调函数
    addSuccess () {
      this.reload()
      this.fetchData()
      this.slideVisible && (this.slideVisible = !this.slideVisible)
    },
    // 禁用分类   后期功能
    disableClassify () {
      this.$store.dispatch('showMessage', {
        title: '确认禁用该分类吗？',
        content: '禁用之后前端将不在显示',
        isRejectable: 1,
        resolve: function () {},
      })
    },

    // 动态获取分类
    loadNode (node, resolve) {
      console.log(2222222)
      let self = this
      if (node.level === 0) {
        self.submitData.parent_id = 0
        self.parantId = 0
        return resolve([{ category_name: '全部分类', category_ischeck: 1 }])
      }
      if (node.level > 2) return resolve([])
      // 模拟异步数据加载
      self.submitData.parent_id = node.data.category_id
      self.parantId = node.data.category_id
      self.fetchData().then(function (data) {
        resolve(self.list)
      })
    },

    // 点击分类
    changeTree (node, resolve) {
      if (node.category_name === '全部分类') {
        this.submitData.parent_id = 0
        this.parantId = 0
        this.fetchData()
        this.showAddBtn = true
      } else if (node.level === 1) {
        this.submitData.parent_id = node.category_id
        this.parantId = node.category_id
        this.fetchData()
        this.showAddBtn = true
      } else {
        this.showAddBtn = false
      }
    },
    // 服务分类列表获取
    async fetchData () {
      this.isInitiated = false
      if (!this.submitData.parent_id) {
        this.submitData.parent_id = 0
      }
      try {
        const { result, response } = await this.classifyList(this.submitData)
        if (response.status === 200) {
          console.log(result, '222222222222222222222')
          result.data.forEach(v => {
            // 控制小三角的显隐
            if (v.level === 2) v.leaf = true
          })
          this.list = result.data
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表失败',
            content: `出错啦！${result.message}！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.table-wrapper {
  max-height: 580px;
}
.section-filter {
  display: flex;
  justify-content: flex-end;
}

.listData {
  position: relative;
  display: flex;
  justify-content: start;
  flex-grow: 1;
}

.left-list {
  max-width: 300px;
  margin-left: 20px;
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  position: relative;
  padding-top: 60px;

  .el-tree {
    overflow-y: auto;
    height: 100%;
    padding-left: 10px;
    max-height: 520px;
  }
}

.thead {
  position: absolute;
  top: 1px;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: #fff;
  line-height: 56px;
  width: 100%;
  background-color: #efac1b;
  text-align: center;
}

.right-data {
  display: flex;
  flex-grow: 1;
}

.left-cont {
  float: left;
  width: 25%;
  margin-left: 20px;
  margin-right: 20px;
  background-color: #ffffff;
  overflow-y: auto;

  .thead {
    height: 52px;
    line-height: 52px;
    text-align: center;
    background: #ffbb29;
    font-size: 14px;
  }

  .all-classify {
    span:hover {
      color: #ffffff;
      background-color: #19a0db;
    }
  }

  .first {
    .first-span {
      line-height: 40px;
      width: 100%;
      display: inline-block;
    }
  }

  .second {
    .second-span {
      line-height: 40px;
      width: 100%;
      display: inline-block;
      padding-left: 30px;
    }
  }

  .three {
    .three-span {
      line-height: 40px;
      width: 100%;
      display: inline-block;
      padding-left: 60px;
    }
  }
}

.right-cont {
  float: left;
  width: 100%;
  height: 580px;
  overflow-y: auto;
  position: relative;

  .table {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }
}

.is-horizontal {
  padding: 0;
  height: 0;
}

.add-button {
  bottom: -80px;
}
</style>
