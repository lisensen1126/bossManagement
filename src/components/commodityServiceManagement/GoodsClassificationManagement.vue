<template lang="pug">
  .section-layout
    .section-filter.field-group.is-horizontal
      .field-group.is-horizontal.haha
        .field
          label.label &nbsp;
          a.button.primary(@click="showAddModel(false)" v-if="showAddBtn")
            span 添加分类
    .listData
      .left-list
        .thead 商品分类
        el-tree(:props="props1" :load="loadNode" lazy="" @node-click="changeTree" node-key="category_ischeck" :default-expanded-keys="[1]")
      .right-data
        empty-page(v-if="!(list && list.length) && isInitiated", :tip="'暂无数据'")
        .content-wrapper.list-wrapper(v-if="list.length>0")
          .table-wrapper
            table.table
              thead
                tr
                  td(width="10") 分类名称
                  td(width="10") 分类icon
                  td(width="50") 关联品牌
                  td(width="10") 状态
                  td(width="10") 操作
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
                    .brand-box(v-if="item.level==2 && item.brands && item.brands.length")
                      span(v-if="index < (item.brands.length - 1)", v-for="(brand,index) in item.brands", v-text="brand.brand_name + ','")
                      span(v-else, v-text="brand.brand_name")
                    .simple-td(v-else) -
                  td
                    .simple-td
                      span(v-if="item.is_enabled==1") 启用
                      span(v-if="item.is_enabled==2") 禁用
                  td
                    .operation-td
                      <!--a.operation-link(@click="disableClassify()") 禁用-->
                      a.operation-link(@click="showAddModel(item)") 编辑
                      a.operation-link(v-if="item.level==2" @click="attrConfig(item, false)") 属性配置
                      a.operation-link(v-if="item.level==2" @click="showRelationModel(item)") 关联品牌
    slide-out-modal(v-if="slideVisible", @input="toggleSidePannel")
      classify-add(v-if="slideType == 'CLASS'", :isAdd="isAdd" :classType="classType" :parantId="parantId" @success="addSuccess")
      relation-brand(v-if="slideType == 'BRAND'", :relationItem="relationItem" @callback="relationBrandSuccess")
</template>

<script>
import EmptyPage from '@/components/generics/EmptyPage'
import SlideOutModal from '@/components/generics/SlideOutModal'
import ClassifyAdd from '@/components/commodityServiceManagement/ClassifyAdd'
import RelationBrand from '@/components/commodityServiceManagement/RelationBrand'
import bossMixin from '@/mixins/modules/boss'
export default {
  name: 'goodsClassificationManagement',
  mixins: [bossMixin],
  components: {
    EmptyPage,
    SlideOutModal,
    ClassifyAdd,
    RelationBrand,
  },
  inject: ['reload'],
  data () {
    const schema = {
      isInitiated: false,
      props1: {
        // 树状结构数据
        label: 'category_name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      showAddBtn: true,
      classType: '1', // 商品分类标识符
      parantId: '', // 添加分类时的父类id
      submitData: {
        // 获取右边列表的数据
        type: '1',
        parent_id: 0,
        is_page: 2,
      },
      fristName: '',
      secondName: '',
      thirdName: '',
      menuName: 'category_name', // 显示菜单名称的属性
      list: [],
      paginationData: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0,
      },
      isAdd: '',
      slideVisible: false,
      slideType: '',
      relationItem: '', // 关联品牌的分类
      filterData: {
        keyword: '',
        role_name: '',
        position: '',
        status: '',
        store: undefined,
      },
    }
    return schema
  },
  methods: {
    // 显示品牌添加模态框
    showAddModel (item) {
      if (item) {
        this.parantId = item.parent_id
      }
      item ? (this.isAdd = item) : (this.isAdd = '')
      this.slideType = 'CLASS'
      this.toggleSidePannel()
    },
    // 显示关联品牌模态框
    showRelationModel (item) {
      this.slideType = 'BRAND'
      this.relationItem = item
      this.toggleSidePannel()
    },
    // 显示隐藏模态框
    toggleSidePannel () {
      this.slideVisible = !this.slideVisible
    },

    // 分类添加、编辑成功之后的回调函数  由于分类列表是异步 此处需要重新加载页面
    addSuccess () {
      this.reload()
    },
    // 关联品牌成功
    relationBrandSuccess () {
      this.toggleSidePannel()
      this.fetchData()
    },
    // 当第三级分类时 去往属性配置页面
    attrConfig (item) {
      this.secondName = item.category_name
      this.$router.push({
        name: 'classifyAttrAdd',
        query: {
          storeId: item.category_id,
          txtName: this.fristName + '>' + this.secondName,
        },
      })
    },

    // 禁用分类
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
      this.parantId = node.category_id
      if (node.level !== 2) {
        this.submitData.parent_id = node.category_id
        if (node.level === 1) this.fristName = node.category_name
        this.fetchData()
        this.showAddBtn = true
      } else {
        this.showAddBtn = false
      }
    },

    // 获取分类列表
    async fetchData () {
      this.isInitiated = false
      if (!this.submitData.parent_id) {
        this.submitData.parent_id = 0
      }
      try {
        const { response, result } = await this.classifyList(this.submitData)
        if (response.status === 200) {
          result.data.forEach(v => {
            // 控制小三角的显隐
            if (v.level === 2) v.leaf = true
          })
          this.list = result.data
          this.isInitiated = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取商品分类列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  // mounted () {
  //   this.fetchData()
  // },
}
</script>

<style lang="stylus" scoped>
// @import '~@/stylus/mixins'
.table-wrapper {
  max-height: 580px;
}
.listData {
  position: relative;
  display: flex;
  justify-content: start;
  flex-grow: 1;
}

.brand-box {
  max-width: 450px;
}

.section-filter {
  display: flex;
  justify-content: flex-end;
}

.add-icon, .category-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: url('~@/assets/icons/button-add.svg') no-repeat center center;
  background-size: cover;
  margin-right: 6px;
  margin-top: 8px;
}

.category-icon {
  background-image: url('~@/assets/icons/button-catrgory.svg');
}

.page-selector {
  label {
    z-index: 5;
  }
}

.left-list {
  max-width: 300px;
  margin-left: 20px;
  /* margin-right 18px */
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

.right-data {
  display: flex;
  flex-grow: 1;
}

.list {
  min-height: 100%;
  overflow: scroll;
  background: rgba(247, 247, 247, 1);
  box-shadow: 0px 4px 10px 0px rgba(53, 53, 53, 0.08);
  border-radius: 3px;
  border: 1px solid rgba(221, 221, 221, 1);
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

.table {
  margin-top: 5px;
}

.list-wrapper {
  // height 496px
  position: relative;
}

.tfoot {
  position: absolute;
  bottom: 0;
}

.bian {
  height: 16px;
  font-size: 13px;
  font-family: MicrosoftYaHei;
  color: rgba(47, 171, 221, 1);
  line-height: 16px;
  padding-right: 17px;
  margin-right: 0;
}

.shan {
  padding-left: 17px;
  color: rgba(235, 78, 56, 1) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.emp {
  width: 770px;
  height: 440px;
  background: white;
  margin-left: 24px;
  margin-top: 56px;
}
</style>

