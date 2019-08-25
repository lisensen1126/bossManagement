<template lang="pug">
  .section-layout
    //- 项目详情模态框
    slide-out-modal(v-if="slide_detail", @input="showDetail")
      vehicle-detail-model(:project="project_info")

    .content-wrapper
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 车检单名称
            custom-input(v-model="class_item.name", input-type="hasCount", placeholder="请输入车检单名称", :validator="$v.class_item.name", error-info="车检单名称必填并且小于八字")
              span(slot="countInfo") {{wordLength(class_item.name)}}/8
          .field.is-horizontal
            label.label 车检单介绍
            custom-input(v-model="class_item.desc", input-type="hasCount", placeholder="请输入车检单介绍", :validator="$v.class_item.desc", error-info="车检单内容必填并且小于五十字")
              span(slot="countInfo") {{wordLength(class_item.desc)}}/50
      .list-wrapper(v-if="list.length > 0 && page_init")
        .table-wrapper
          table.table
            thead
              tr
                td(width="30%") 场景名称
                td(width="70%") 关联项目
            tbody
              tr(v-for="(item, index) in list", :key="index")
                td
                  .simple-td {{item.name}}
                td
                  .multi-content-td.word-break
                    ul
                      li.vehicle-item(v-for="(info, index) in item.items") 
                        .checkbox
                          input(type="checkbox", v-model="info.selected")
                          label {{info.name}}
                        span.see(@click="showDetail(info.id)") 查看
      .empty(v-if="page_init && list.length == 0")
        span 暂无场景可选，赶快去添加吧
        //- span.box 赶快去添加吧>>
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="save") 保存
        a.button.large(@click="goBack") 返回
</template>

<script>
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import SlideOutModal from '@/components/generics/SlideOutModal'
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import Api from '@/mixins/modules/FunctionSetting'
import VehicleDetailModel from '@/components/functionSetting/modal/VehicleDetailModel'

export default {
  name: 'addInspec',
  mixins: [validationMixin, Api],
  components: {
    SlideOutModal,
    CustomInput,
    VehicleDetailModel,
  },
  data () {
    return {
      class_item: {
        name: '',               // 车检名称
        desc: '',               // 车检内容
        id: '',                 // 车检标识
      },
      is_select: false,
      slide_detail: false,      // 控制显示
      list: [],
      project_info: {},
      page_init: false,
    }
  },
  methods: {
    wordLength,

    // 控制详情模态框显隐
    showDetail (id) {
      // this.slide_detail = !this.slide_detail
      id ? this.fetchProjectItem(id) : this.slide_detail = !this.slide_detail
    },

    // 添加车检单时获取车检场景&项目
    async fetchScene () {
      try {
        const { response, result } = await this.getVehicleSceneApi()
        if (response.status === 200 && result.code === 0) {
          this.list = result.data
          this.page_init = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检场景失败',
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

    // 编辑车检单时获取车检单详情
    async fetchDetail () {
      try {
        const { response, result } = await this.getClassDetailApi({id: this.$route.query.classify_id})
        if (response.status === 200 && result.code === 0) {
          result.data.categories.forEach(v => {
            v.selected === 1 ? v.selected = true : v.selected = false
          })
          this.list = result.data.categories
          this.class_item.name = result.data.name
          this.class_item.desc = result.data.desc
          this.class_item.id = result.data.id
          this.page_init = true
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车检单详情失败',
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

    // 获取项目详情
    async fetchProjectItem (project_id) {
      try {
        const { response, result } = await this.getInspectionDetailApi({
          id: project_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.project_info = result.data
          this.slide_detail = !this.slide_detail
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取场景项目详情失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取场景项目详情失败',
          content: err,
        })
      }
    },

    // 保存数据
    save () {
      this.$v.$touch()
      if (this.$v.$error) return
      let select_item = []
      this.list.forEach(v => {
        v.items.forEach(m => {
          if (m.selected) {
            select_item.push(m.pivot_id)
          }
        })
      })
      if (select_item.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '请勾选场景的项目值！',
        })
        return
      }
      let params = {
        id: this.class_item.id,
        name: this.class_item.name,
        desc: this.class_item.desc,
        pivot_ids: select_item,
      }
      this.$route.query.classify_id && Number(this.$route.query.edit) === 2 ? this.editData(params) : this.addData(params)
    },

    // 编辑车检单数据请求 editClassDetailApi
    async editData (params) {
      try {
        const { response, result } = await this.editClassDetailApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '修改成功',
            resolve: () => {
              this.$router.go(-1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '车检单编辑失败',
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

    // 添加车检单数据请求
    async addData (params) {
      try {
        const { response, result } = await this.createClassListApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '添加成功',
            resolve: () => {
              this.$router.go(-1)
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '车检单新增失败',
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

    // 返回上一页
    goBack () {
      this.$router.go(-1)
    },
  },
  mounted () {
    this.$route.query.classify_id && Number(this.$route.query.edit) === 2 ? this.fetchDetail() : this.fetchScene()
  },
  validations: {
    class_item: {
      desc: {
        required,
        validate (val) {
          return this.wordLength(val) <= 50
        },
      },
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 8
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.form-wrapper
  border-bottom none
.table tbody tr td
  padding 0
  vertical-align middle
.list-wrapper
  padding 0 20px
  padding-bottom 20px
.btn-wrapper
    padding 12px 40px 12px
.field.is-horizontal .label
  flex: 0 0 100px
.field-group
  border none
.content-wrapper
  margin-bottom 0px
  padding-bottom 0px
.vehicle-item
  width 300px
  line-height 40px
  float left
  margin-right 30px
.table
  background-color #f0f1f2
  border-spacing 0 1px
.see
  float right
  margin-right 100px
  cursor pointer
  color #2fabdd
  font-size 13px
.see:hover
  color #0a71a1
.empty
  width 100%
  height 200px
  text-align center
  padding-top 80px
  span
    font-size 12px
    color #666
  .box
    cursor pointer
    color #2fabdd
  .box:hover
    color #0a71a1 
</style>
