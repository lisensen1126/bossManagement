<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.title-name
      .h2 当前分类: {{name}}
      .field
        a.button.primary.save-btn(@click="saveData") 保存
    empty-page(v-if="!(list && list.length) && is_initiated", :tip="'当前没有服务'")
    .content-wrapper.list-wrapper(v-if="list.length > 0")
      .table-wrapper
        table.table
          thead
            tr
              td(width="10%")
                .checkbox
                  input(type="checkbox", id="all01", v-model="checkedAll", @click="checkedAllFnc")
                  label.sepcific-setting(for="all01", v-text="'全选'")
              td(width="15%") 服务名称
              td(width="10%") 服务分类
              td(width="10%") 更新日期
              td(width="30%") 服务简述
              td(width="10%") 操作人
              td(width="15%") 操作
          tbody
            tr(v-for="(item, index) in list")
              td
                .simple-td
                  .checkbox
                    input(type="checkbox", :id="item.product_id", :value="item", name="modal", v-model="selected_item", :checked='item.selected')
                    label.sepcific-setting(:for="item.product_id")
              td
                .simple-td.has-image
                  .left-image
                    img(:src="scaleImage(item.product_pic, 1, 36, 36)")
                  .content-item(v-text="item.product_name")
              td
                .simple-td(v-text="item.category_data")
              td
                .simple-td(v-text="formateDate(item.updated_at)")
              td
                .multi-content-td.m-r-20(v-if="item.summary === ''") - -
                .multi-content-td.m-r-20(v-text="item.summary", v-else)
              td
                .simple-td(v-text="item.operator_name ? item.operator_name : '--'")
              td
                .operation-td
                  span.operation-link(@click="serviceDetail(item)") 查看
      .tfoot
        pagination(:pagination-data="pagination_data", @input="paging")

</template>

<script>
import Pagination from "@/components/generics/Pagination"
import bossApi from "@/mixins/modules/boss"
import EmptyPage from "@/components/generics/EmptyPage"
import ServiceCategoryPicker from "@/components/generics/form/ServiceCategoryPicker"
import imageScale from "@/mixins/utilities/imageScale"
import formateDate from "@/mixins/utilities/formateDate"
import filterTools from "@/mixins/utilities/filterTools"
import SeriesApi from "@/mixins/modules/SeriesSupport"
export default {
  name: "ServiceTypeList",
  mixins: [filterTools, imageScale, bossApi, formateDate, SeriesApi],
  components: {
    EmptyPage,
    Pagination,
    ServiceCategoryPicker,
    filterTools
  },
  data() {
    const schema = {
      all_ids: [], // 已选的id
      surplus_ids: [], // 没有遍历过得id
      all_page: [], // 已经遍历过得页
      id: this.$route.query.id,
      name: this.$route.query.name,
      is_initiated: false,
      checkedAll: [],
      list: [],
      selected_item: [],
      pagination_data: {
        current_page: 1,
        per_page: 20,
        last_page: 1,
        total: 0
      }
    }
    return schema
  },
  watch: {
    selected_item() {
      this.checkedAll = false
      let length = 0
      let src = JSON.stringify(this.list)
      this.selected_item.forEach(item => {
        if (src.indexOf(JSON.stringify(item)) !== -1) {
          length += 1
        }
      })
      if (length === this.list.length) this.checkedAll = true
    }
  },
  methods: {
    // 全选 or 取消
    checkedAllFnc() {
      let _this = this
      if (!this.checkedAll) {
        // 多选
        this.list.forEach(item => {
          let has = _this.selected_item.some(obj => obj.product_id === item.product_id)
          if (!has) {
            _this.selected_item.push(item)
          }
        })
      } else {
        // 取消
        this.list.forEach(item => {
          let index = 0
          let has = _this.selected_item.some((obj, i) => {
            index = i
            return obj.product_id === item.product_id
          })
          if (has) {
            _this.selected_item.splice(index, 1)
          }
        })
      }
    },
    // 获取服务列表数据
    async fetchData() {
      try {
        const { response, result } = await this.serviceListApi({
          page: this.pagination_data.current_page,
          per_page: this.pagination_data.per_page
        })
        if (response.status === 200) {
          this.list = result.data
          result.data.forEach(item => {
            item.is_select = false
            item.category_data = item.category_data[0]
          })
          this.pagination_data = result.meta
          // 处理当前页有选中的
          let pages = this.all_page
          let ids = this.surplus_ids
          if (pages.indexOf(result.meta.current_page) === -1) {
            pages.push(result.meta.current_page)
            this.all_page = pages
            result.data.forEach(item => {
              if (ids.indexOf(item.product_id) !== -1) {
                // 当前页数据选择的放入数组并且把把id从剩余的id数组中surplus_ids移除
                ids.splice(ids.indexOf(item.product_id), 1)
                this.selected_item.push(item)
              }
            })
            this.surplus_ids = ids
          }
          // 处理是否当前页全选
          this.is_initiated = true
          this.checkedAll = false
          let length = 0
          let src = JSON.stringify(this.list)
          this.selected_item.forEach(item => {
            if (src.indexOf(JSON.stringify(item)) !== -1) {
              length += 1
            }
          })
          if (length === this.list.length) this.checkedAll = true
        } else {
          this.$store.dispatch("showMessage", {
            type: "failure",
            title: "获取服务列表失败",
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? " " + result.code : ""}）`
          })
        }
      } catch (err) {
        this.$store.dispatch("showMessage", {
          type: "failure",
          title: "获取服务列表失败",
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? " " + err.result.code : ""}）`
        })
      }
      this.is_initiated = true
    },

    // 翻页操作
    paging(state) {
      this.pagination_data = state
      this.fetchData()
    },

    // 服务详情
    serviceDetail(item) {
      let data = {
        selected_item: this.selected_item,
        pagination_data: this.pagination_data,
        all_ids: this.all_ids, // 已选的id
        surplus_ids: this.surplus_ids, // 没有遍历过得id
        all_page: this.all_page // 已经遍历过得页
      }
      sessionStorage.setItem('typeList_data', JSON.stringify(data))
      this.$router.push({
        name: 'serviceDetail',
        query: {
          id: item.product_id,
          is_hidden: 2,
        },
      })
    },
    async saveData () {
      if (this.surplus_ids.length === 0 && this.selected_item.length === 0) {
        this.$store.dispatch("showMessage", {
          type: "failure",
          title: "请选择服务"
        })
        return
      }
      let data = []
      let resultIds = [] // 所选择的id
      // let delData = [] // 删除选择的数组id
      this.selected_item.forEach(spu => {
        resultIds.push(spu.product_id)
        data.push({
          spu_id: spu.product_id,
          name: spu.product_name,
          pic: spu.product_pic,
          suggested_price: spu.sell_price
        })
      })
      // 如果剩余数组有id
      if (this.surplus_ids.length > 0) {
        this.surplus_ids.forEach(id => {
          resultIds.push(id)
          data.push({
            spu_id: id,
            name: "",
            pic: "",
            suggested_price: ""
          })
        })
      }
      // 获取取消选择的id
      // this.all_ids.forEach(id => {
      //   if (resultIds.indexOf(id) === -1) {
      //     delData.push({
      //       spu_id: id
      //     })
      //   }
      // })
      let ids = []
      data.forEach(item => {
        ids.push(item.spu_id)
      })
      let params = {
        id: this.id,
        spu_ids: ids,
      }
      try {
        const { response, result } = await this.saveServiceApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch("showMessage", {
              title: '保存成功!',
              autoClose: true, // 控制弹框自动消失
              type: 'success',
            })
            this.$router.push({
              name: 'typeList'
            })
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
            content: result.message,
          })
        }
      } catch (err) {
        console.error(err, '保存')
      }
    },
    async getDetail() {
      try {
        const { response, result } = await this.getChooseIdsApi({
          id: this.id
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.all_ids = result.data.ids
            this.surplus_ids = JSON.parse(JSON.stringify(result.data.ids))
            this.fetchData()
          } else {
            this.$store.dispatch("showMessage", {
              type: "failure",
              title: "获取服务列表失败",
              content: `出错了：${result.message}`
            })
          }
        } else {
          this.$store.dispatch("showMessage", {
            type: "failure",
            title: "获取服务列表失败",
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? " " + result.code : ""}）`
          })
        }
      } catch (err) {
        this.$store.dispatch("showMessage", {
          type: "failure",
          title: "获取服务列表失败",
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? " " + err.result.code : ""}）`
        })
      }
      this.is_initiated = true
    }
  },
  mounted() {
    let typeData = sessionStorage.getItem("typeList_data")
    if (typeData) {
      let data = JSON.parse(typeData)
      this.selected_item = data.selected_item
      this.pagination_data = data.pagination_data
      this.all_ids = data.all_ids
      this.surplus_ids = data.surplus_ids
      this.all_page = data.all_page
      sessionStorage.setItem("typeList_data", "")
    }
    this.getDetail()
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.sepcific-setting {
  width: 62px;
  padding-left: 20px;
}

.title-name {
  line-height: 20px !important;
  padding: 14px !important;
  height: 50px !important;
}

.simple-td {
  max-width: 160px !important;
}

.multi-content-td {
  vertical-align: middle;
}

.prior-conditions {
  background-color: #fcfcfc;
}

.field {
  &.is-keyword {
    width: 300px;
  }

  &.is-narrow {
    width: 140px;
  }
}

.package-content {
  display: flex;
  padding-right: 18px;
  flex-direction: column;
  justify-content: center;
  line-height: 18px;
  height: 36px;
  overflow: hidden;
}

.section-filter {
  display: flex;
  justify-content: space-between;
}

.button {
  align-items: center;
}

.page-selector {
  label {
    z-index: 5;
  }
}

.tfoot {
  overflow: hidden;
}

.checkbox {
  flex-shrink: 0;
  margin-right: 16px;
}

.radio {
  width: 16px;
  height: 16px;
}

label {
  width: 16px;
  height: 16px;
  padding-left: 14px;
}

input[type='radio'] {
  width: 16px;
  height: 16px;
}

.save-btn {
  margin-right: 50px;
}
</style>

