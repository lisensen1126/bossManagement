<template lang="pug">
  div(style="height: 100%;overflow-y: auto;padding-bottom: 20px")
    div.top-menu(v-text="text_name")
    .top-brand.clearfix
      .add-brand(@click="toggleSidePannel()")
        span +添加品牌
      .brand-list.clearfix
        span(v-for="item in relation_item.brands" v-text="item.brand_name" :class="{'active':item.is_select}" @click="selectBrand(item)")
    div.tab-header.clearfix
      div.left 属性
        span.add(@click="addList") +
      div.right 属性值
      div.operation 操作
    div.content
      div.tab-body.clearfix(v-for="(item, index) in list" :key="index")
        div.left
          input(v-if="show_all_brand === 'all'" type="text" placeholder="请输入属性" v-model.trim="item.attribute_name")
          input(v-if="show_all_brand === 'on'" type="text" placeholder="请选择属性" v-model.trim="item.attribute_name" :disabled="item.attribute_items.length !== 0")
          select(v-if="show_all_brand === 'on'", v-model="item.attrname" id="province", @change="getRegions(item)")
            option(v-for="js in count_list", :value="js.attribute_name") {{js.attribute_name}}
        div.right
          div.clearfix
            span.attr-list(v-for="(attr,index) in item.attribute_items" :key="index")
              i(v-text="attr.attribute_item_value" style="padding-right:6px" v-if="!attr.is_edit")
              input(v-model.trim="attr.attribute_item_value" type="text" :key="index" v-if="attr.is_edit" @keyup.enter="editAttr(attr)")
              i.edit(v-text="'!'" v-if="!attr.is_used && show_all_brand === 'all'" @click="editAttr(attr)")
              i.del(v-text="'x'" v-if="!attr.is_used || show_all_brand === 'on'" @click="delAttr(index, item.attribute_items)")
        div.operation
          span(@click="addAttrModel(item)" v-if="item.attribute_name.length>0 && show_all_brand === 'all'") 添加属性值
          span(@click="addAttrModel(item)" v-if="item.attribute_name.length>0 && show_all_brand === 'on'") 选择属性值
          span(@click="delList(index, list)" v-if="item.is_del") 移除整行
    div.field
      button.button.large.primary(@click="save(show_all_brand)" v-text="'保存'")
    slide-out-modal(v-if="slide_visible", @input="toggleSidePannel")
      relation-brand(:relationItem="relation_item" :category_id="category_id" @success="relationBrandSuccess")
    add-attr-model(v-model="add_attr", v-if="add_attr", @resolve="getChooseAttr", :sku="flag_attr", :all="show_all_brand", :category_id="category_id")
</template>

<script>
import BossMixin from '@/mixins/modules/boss' // 接口文件
import RelationBrand from '@/components/commodityServiceManagement/model/SelectBrand' // 品牌列表
import SlideOutModal from '@/components/generics/SlideOutModal' // 左侧模态框
import AddAttrModel from '@/components/commodityServiceManagement/model/AddBrandAttr'

export default {
  name: 'ClassifyAttrAdd',
  mixins: [BossMixin],
  components: {
    SlideOutModal,
    RelationBrand,
    AddAttrModel,
  },
  data () {
    const schema = {
      list: [],
      count_list: [],
      category_id: this.$route.query.storeId, // 当前分类id
      text_name: this.$route.query.txtName, // 分类层级名称
      slide_visible: false, // 控制添加品牌模态框的显隐
      add_attr: false, // 控制抽奖显隐
      flag_attr: {}, // 父组件传递到子组件的sku值
      show_all_brand: 'all', // 给子组件传递，判断是否是品牌，是品牌请求全部sku,不是品牌不请求接口  默认all
      relation_item: {
        brands: [
          {
            brand_name: '全部',
            brand_id: 'all',
            is_select: true,
          },
        ],
      }, // 已选中的品牌数据集合
      submit_brand_id: '', // 含品牌sku保存时所需的品牌id
      submit_data: {
        attributes: [],
        category_id: this.$route.query.storeId,
      },
    }
    return schema
  },
  methods: {
    /**
     * 添加一条空的sku
     */
    addList () {
      let self = this
      let obj = {
        attribute_name: '',
        attribute_items: [],
        is_del: true,
      }
      self.list.push(obj)
    },

    /**
     * 删除属性值
     * @param {number} index：需需删除的属性下标值
     * @param {obj} item:当前操作对象
     */
    delAttr (index, item) {
      item.splice(index, 1)
    },

    /**
     * 删除一条sku
     * @param index:需需删除的属性列表下标值
     * @param item：当前操作对象
     */
    delList (index, item) {
      item.splice(index, 1)
    },

    /**
     * 保存sku操作
     * @param {String} flag: all(全部的sku保存)  on(含品牌的sku保存)
     */
    save (flag) {
      let _this = this
      _this.submit_data.attributes = []
      // 格式化后端所需数据
      _this.list.map(v => {
        let tempArr = []
        let tempObj = {}
        tempObj.attribute_name = v.attribute_name
        tempObj.attribute_id = v.attribute_id
        v.attribute_items.map(v1 => {
          tempArr.push(v1)
        })
        tempObj.attribute_items = tempArr
        _this.submit_data.attributes.push(tempObj)
      })
      if (flag === 'all') {
        this.setClassifyAttrAdd(_this.submit_data)
      } else {
        _this.submit_data.brand_id = this.submit_brand_id
        _this.setClassifyBrandAttr(_this.submit_data)
      }
    },

    // 获取当前分类下的属性（不含品牌）
    async fetchAllAttr () {
      try {
        const { response, result } = await this.classifyAttrList({
          category_id: this.category_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = []
          if (result.data.length > 0) {
            result.data.forEach(v => {
              let isDelAll = true
              v.attribute_items.forEach(f => {
                f.is_edit = false
                if (f.is_used === 1) {
                  isDelAll = false
                }
              })
              v.is_del = isDelAll
            })
            this.list = result.data
            this.count_list = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // 获取当前分类下的属性（含品牌）
    async fetchBrandAttr () {
      try {
        const { response, result } = await this.getBrandAttrApi({
          category_id: this.category_id,
          brand_id: this.submit_brand_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.list = []
          if (result.data.length > 0) {
            result.data.forEach(v => {
              let isDelAll = true
              v.attribute_items.forEach(f => {
                f.is_edit = false
                if (f.is_used === 1) {
                  isDelAll = false
                }
              })
              v.is_del = isDelAll
            })
            this.list = result.data
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // 全部sku分类属性编辑新增、编辑
    async setClassifyAttrAdd (params) {
      let ftemp = true
      let tempArr = []
      params.attributes.forEach(v => {
        tempArr.push(v.attribute_name)
        if (v.attribute_name === '' || v.attribute_items.length === 0) {
          ftemp = false
        }
      })
      if (this.isRepeat(tempArr)) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '不能出现重复的属性，请再次确定',
        })
        return false
      }
      if (!ftemp) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '分类的属性、属性值不能为空',
        })
        return false
      }
      try {
        const { response, result } = await this.classifyAttrAdd(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '属性操作成功',
            resolve: () => {
              this.fetchAllAttr()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作商品分类属性出错',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作商品分类属性出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // 含品牌的sku分类属性新增、编辑
    async setClassifyBrandAttr (params) {
      let ftemp = true
      let tempArr = []
      params.attributes.forEach(v => {
        tempArr.push(v.attribute_name)
        if (v.attribute_name === '' || v.attribute_items.length === 0) {
          ftemp = false
        }
      })
      if (this.isRepeat(tempArr)) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '不能出现重复的属性，请再次确定',
        })
        return false
      }
      if (!ftemp) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '分类的属性、属性值不能为空',
        })
        return false
      }
      try {
        const { response, result } = await this.setClassifyBrandApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '操作商品分类属性成功',
            resolve: () => {
              this.fetchBrandAttr()
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '操作商品分类属性出错',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作商品分类属性出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // 触发选择品牌弹框的显隐
    toggleSidePannel () {
      this.slide_visible = !this.slide_visible
    },

    /**
     * 选择品牌回调
     * @param e {Object} 回调过来的参数
     */
    relationBrandSuccess (e) {
      this.relation_item.brands = e
      this.slide_visible = !this.slide_visible
      this.fetchAllAttr()
    },

    /**
     * 选择品牌显示对应的sku属性
     * @param flag
     */
    selectBrand (flag) {
      if (flag.is_select) return // 如果已经是选中的品牌，那么就不必在请求接口
      let _this = this
      this.relation_item.brands.forEach(v => {
        if (v.brand_id === flag.brand_id) {
          v.is_select = true
          if (v.brand_id === 'all') {
            _this.show_all_brand = 'all' // 如果是all  请求全部sku列表 show_all_brand：传给子组件所需参数
            _this.submit_brand_id = 'all'
            _this.fetchAllAttr()
          } else {
            _this.show_all_brand = 'on' // 如果是on   请求品牌对应的sku列表  show_all_brand：传给子组件所需参数
            _this.submit_brand_id = v.brand_id
            _this.list = []
            _this.fetchBrandAttr() // 获取分类品牌属性列表
          }
        } else {
          v.is_select = false
        }
      })
    },

    /**
     * 添加sku属性之后的回调
     * @param {Object} 已选数据
     * @id {Number, String} 第二参数
     */
    getChooseAttr (params) {
      this.list.forEach(v => {
        if (v.attribute_name === params.attribute_name) {
          v.attribute_items = params.attribute_items
          v.attribute_id = params.attribute_id
        }
      })
    },

    // 控制属性值的编辑
    editAttr (flag) {
      flag.is_edit = !flag.is_edit
    },

    // 添加属性值弹框
    addAttrModel (item) {
      let tempArr = []
      this.list.forEach(i => {
        tempArr.push(i.attribute_name)
      })
      // if (this.isRepeat(tempArr)) {
      //   this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '警告',
      //     content: '不能出现重复的属性，请再次确定',
      //   })
      //   return false
      // }
      item.attribute_items.forEach(v => {
        v.is_check = true
        tempArr.push(v.attribute_name)
      })
      this.flag_attr = JSON.stringify(item)
      this.add_attr = true
    },

    // 判断一个数组中是否有重复项
    isRepeat (arr) {
      let hash = {}
      for (let i in arr) {
        if (hash[arr[i]]) return true
        hash[arr[i]] = true
      }
      return false
    },

    // 获取分类属性关联的品牌
    async fetchClassifyBrandList () {
      let _this = this
      try {
        const { response, result } = await this.getClassfiyBrandApi({
          category_id: this.category_id,
        })
        if (response.status === 200 && result.code === 0) {
          if (result.data.length > 0) {
            result.data.forEach(v => {
              _this.relation_item.brands.push(v)
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: response.status,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '操作商品分类属性出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },

    // d
    getRegions (flag) {
      flag.attribute_items = []
      flag.attribute_name = flag.attrname
    },
  },
  mounted () {
    this.fetchAllAttr()
    this.fetchClassifyBrandList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.top-menu {
  height: 40px;
  line-height: 40px;
  background: #e8e9eb;
  padding-left: 40px;
  font-size: 14px;
}

.top-brand {
  background-color: #fff;
  min-height: 60px;
  padding-left: 40px;
  padding-right: 40px;

  .add-brand {
    float: left;
    min-height: 60px;

    span {
      height: 30px;
      padding: 0 8px;
      line-height: 28px;
      float: left;
      margin-top: 15px;
      cursor: pointer;
      border: 1px solid #ccc;
      margin-right: 10px;
    }
  }

  .brand-list {
    float: left;
    min-height: 60px;
    padding-bottom: 10px;
    span {
      height: 30px;
      padding: 0 8px;
      line-height: 30px;
      float: left;
      margin-top: 15px;
      cursor: pointer;
      border: 1px solid #ccc;
      margin-right: 10px;
    }
    .active {
      background-color: #ffbb29;
      border-color: #ffbb29;
    }
  }
}

.clearfix:after {
  display: block;
  content: '';
  clear: both;
  height: 0;
}

.tab-header {
  height: 60px;
  width: 1200px;
  margin: 0 auto;
  background-color: #ffffff;
  margin-top: 20px;

  .left {
    width: 240px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    float: left;
    padding-left: 16px;
    border-right: none;

    .add {
      float: right;
      width: 60px;
      height: 60px;
      display: block;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
    }

    .add:hover {
      background-color: #989ba1;
      color: #ffffff;
    }
  }

  .right {
    width: 758px;
    height: 60px;
    line-height: 60px;
    border: 1px solid #ccc;
    float: left;
    padding-left: 16px;
  }

  .operation {
    width: 202px;
    float: left;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 1px solid #ccc;
    border-left: none;
  }
}

.tab-body {
  background-color: #ffffff;
  width: 1200px;
  margin: 0 auto;

  input {
    border: none;
    background-color: #ffffff;
  }

  .input {
    width: 270px;
  }

  border: 1px solid #ccc;
  border-top: none;

  .left {
    width: 239px;
    height: 60px;
    line-height: 60px;
    /* border 1px solid #ccc */
    float: left;
    padding-left: 16px;
    border-right: none;
    border-top: none;
    position: relative;

    .add {
      float: right;
      width: 60px;
      height: 60px;
      display: block;
      text-align: center;
      font-size: 20px;
      font-weight: 600;
      cursor: pointer;
      background: url('../../assets/calendar/input-clear.svg') no-repeat center;
    }

    select {
      position: absolute;
      top: 20px;
      left: 15px;
      width: 270px;
      opacity: 0;
    }
  }

  .right {
    width: 758px;
    border-top: none;
    float: left;
    padding-left: 16px;
    line-height: 60px;
    min-height: 60px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    padding-bottom: 20px;

    .attr-list {
      border: 1px solid #e5e5e5;
      padding-right: 0;
      font-size: 14px;
      float: left;
      line-height: 1.4;
      padding-left: 6px;
      margin-top: 20px;
      margin-right: 8px;

      .del, .edit {
        border-left: 1px solid #e5e5e5;
        text-align: center;
        display: inline-block;
        width: 20px;
        height: 20px;
        cursor: pointer;
        color: transparent;
      }

      .del {
        background: url('../../assets/delete.svg') no-repeat center;
        background-size: 20px 12px;
      }

      .edit {
        background: url('../../assets/edit.svg') no-repeat center;
        background-size: 20px 14px;
      }

      i:hover {
        background-color: #f5f5f5;
      }
    }
  }

  .operation {
    width: 200px;
    height: 60px;
    float: left;
    line-height: 60px;
    text-align: center;
    padding-left: 30px;

    span {
      float: left;
      margin-right: 10px;
      cursor: pointer;
      color: #4fb9fa;
    }
  }
}

.field {
  width: 900px;
  margin: 20px auto;

  .button {
    float: right;
  }
}
</style>
