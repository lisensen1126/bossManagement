<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 编辑项目
      .field-group
        .field
          label.label 项目名称
          div.typeface {{prize_info.name}}
        .field
          label.label 更换里程
          div.typeface {{exchange_mile}} KM
        .field
          label.label 检测里程
          div.typeface {{inspect_mile}} KM
        .field
          label.label 项目提示
          div.typeface {{tip}}
        .field.is-narrow
          div.perform-point
            label.label 检测点 
            span.add(@click="addCheckpoint") 添加
            .switch.check
              input(type="checkbox", v-model="isEnabled", id="multi", @change="changeEnable")
              label(for="multi")
          div.perform(v-for="(item, index) in projectList1")
            custom-select.select(:list="point_list1", v-model="projectList1[index]", name-field="name", @input="getType1(projectList1[index])", error-info="请选择监测点且不能重复", :validator="$v.projectList1.$each[index]") 
            span.del(@click="delCheckpoint(index)") 移除
        .field.is-narrow
          div.perform-point
            label.label 异常问题 
            span.add(@click="addAbnormal") 添加
          div.perform(v-for="(item, index) in projectList2")
            custom-select.select(:list="point_list2", v-model="projectList2[index]", name-field="name", @input="getType2", error-info="请选择异常问题且不能重复", :validator="$v.projectList2.$each[index]") 
            span.del(@click="delAbnormal(index)") 移除
        .field.is-narrow
          div.perform-point
            label.label 异常建议 
            span.add(@click="addProposal") 添加
          div.perform(v-for="(item, index) in projectList3")
            custom-select.select(:list="point_list3", v-model="projectList3[index]", name-field="name", @input="getType3", error-info="请选择异常建议且不能重复", :validator="$v.projectList3.$each[index]") 
            span.del(@click="delProposal(index)") 移除
    .field
      button.button.large.primary(@click="savePro") 保存
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import FilterTools from '@/mixins/utilities/filterTools'
import ClassApi from '@/mixins/modules/FunctionSetting'
export default {
  name: 'EditInspection',
  mixins: [ClassApi, validationMixin, FilterTools],
  components: {
    CustomInput,
    CustomSelect,
  },
  props: {
    isAllEdit: {
      id: '',
    },
  },
  validations: {
    projectList1: {
      $each: {
        required,
        validate (val) {
          let status = true
          for (let i = 0; i < this.projectList1.length; i++) {
            if (this.projectList1[i].id === val.id && i !== val.index) {
              status = false
            }
          }
          return status
        },
      },
    },
    projectList2: {
      $each: {
        required,
        validate (val) {
          let status = true
          for (let i = 0; i < this.projectList2.length; i++) {
            if (this.projectList2[i].id === val.id && i !== val.index) {
              status = false
            }
          }
          return status
        },
      },
    },
    projectList3: {
      $each: {
        required,
        validate (val) {
          let status = true
          for (let i = 0; i < this.projectList3.length; i++) {
            if (this.projectList3[i].id === val.id && i !== val.index) {
              status = false
            }
          }
          return status
        },
      },
    },
    prize_info: {
      id: {
        required,
      },
    },
  },
  data () {
    return {
      isEnabled: true,
      is_multi: '',
      type_list: [],
      exchange_mile: '', // 更换里程
      inspect_mile: '', // 检测里程
      tip: '', // 项目提示
      prize_info: {
        name: '', //
        id: '',
      },
      projectList1: [], // 监测点列表
      point_list1: [], // 监测点
      projectList2: [],
      point_list2: [], // 异常问题
      projectList3: [],
      point_list3: [], // 异常建议
    }
  },
  methods: {
    getType (item) {
      this.prize_info.id = item.id
      this.getArticleDetail()
    },
    getType1 (item) {
      this.projectList1.map(function (e, i) {
        e.index = i
      })
    },
    getType2 () {
      this.projectList2.map(function (e, i) {
        e.index = i
      })
    },
    getType3 () {
      this.projectList3.map(function (e, i) {
        e.index = i
      })
    },
    // 添加检测点
    addCheckpoint () {
      let params = {
        type: 1,
      }
      this.projectList1.push(params)
    },
    // 移除检测点
    delCheckpoint (index) {
      this.projectList1.splice(index, 1)
    },
    // 添加异常问题
    addAbnormal () {
      let params = {
        type: 2,
      }
      this.projectList2.push(params)
    },
    // 移除异常问题
    delAbnormal (index) {
      this.projectList2.splice(index, 1)
    },
    // 添加异常建议
    addProposal () {
      let params = {
        type: 3,
      }
      this.projectList3.push(params)
    },
    // 移除异常建议
    delProposal (index) {
      this.projectList3.splice(index, 1)
    },
    // 保存
    async savePro () {
      this.$v.$touch()
      if (this.$v.$error) return
      let pass = true
      if (this.projectList1.length === 0 || this.projectList2.length === 0 || this.projectList3.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `请注意！
            ${this.projectList1.length === 0 ? '监测点、' : ''}
            ${this.projectList2.length === 0 ? '异常问题、' : ''}
            ${this.projectList3.length === 0 ? '异常建议' : ''}
          不能为空，请重新填写完毕后保存`,
        })
        pass = false
      }
      if (!pass) return
      let _point = []
      this.projectList1.forEach(function (e) {
        _point.push(e.id)
      })
      this.projectList2.forEach(function (e) {
        _point.push(e.id)
      })
      this.projectList3.forEach(function (e) {
        _point.push(e.id)
      })
      let strPoint = _point.join(',')
      let params = {
        category_id: this.parent_id,
        item_id: this.prize_info.id,
        point: strPoint,
        is_multi: this.is_multi,
      }
      try {
        const { result, response } = await this.editArticleDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑成功',
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '编辑失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取分类详情
    async getArticleDetail () {
      let params = {
        category_id: this.category_id,
      }
      var self = this
      try {
        const { result, response } = await this.getArticleDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            result.data.point.forEach(function (e) {
              if (e.type === 1) {
                e.list.map(function (e, i) {
                  e.index = i
                })
                self.projectList1 = [].concat(JSON.parse(JSON.stringify(e.list)))
              } else if (e.type === 2) {
                e.list.map(function (e, i) {
                  e.index = i
                })
                self.projectList2 = [].concat(JSON.parse(JSON.stringify(e.list)))
              } else if (e.type === 3) {
                e.list.map(function (e, i) {
                  e.index = i
                })
                self.projectList3 = [].concat(JSON.parse(JSON.stringify(e.list)))
              }
            })
            self.prize_info = {
              id: result.data.id,
              name: result.data.name,
            }
            self.getInspecDetail(result.data.id)
            result.data.is_multi === 1 ? (self.isEnabled = true) : (self.isEnabled = false)
            result.data.is_multi === 1 ? (self.is_multi = 1) : (self.is_multi = 2)
            self.exchange_mile = result.data.exchange_mile
            self.inspect_mile = result.data.inspect_mile
            self.tip = result.data.tip
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取项目详情失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取项目详情失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取项目详情失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /*
      * 获取项目列表
      * */
    async addProject () {
      try {
        const { result, response } = await this.getArticleListApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.type_list = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 复选框
    changeEnable () {
      this.isEnabled ? (this.is_multi = 1) : (this.is_multi = 2)
    },
    // 获取项目详情
    async getInspecDetail (id) {
      let params = {
        id: id,
      }
      try {
        const { result, response } = await this.getInspectionDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.point_list1 = result.data.point[0].list
            this.point_list2 = result.data.point[1].list
            this.point_list3 = result.data.point[2].list
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: this.isEdit === 1 ? '添加失败' : '编辑失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: this.isEdit === 1 ? '添加失败' : '编辑失败',
            content: '创建发生错误，请稍后再试',
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
    this.category_id = this.isAllEdit.id
    this.parent_id = this.isAllEdit.parent_id
    this.getArticleDetail()
    this.addProject()
  },
}
</script>

<style lang="stylus" scoped>
.typeface {
  font-size: 13px;
  color: #868686;
}

.slide-layout .cus-box .field-group .field {
  width: 100% !important;
}

.slide-layout .cus-box .field-group .field {
  &.is-narrow {
    width: 250px !important;
    flex: 1;
  }
}

.check {
  margin-bottom: 5px;
  margin-left: 10px;
}

.perform {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.perform-point {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.button-delete {
  display: block;
  width: 30px;
  height: 30px;
  background: center getImage('trash.svg') no-repeat;
  margin-left: 20px;
  cursor: pointer;

  &:hover {
    background-image: getImage('trash-hover.svg');
  }

  &.is-featured {
    left: 100%;
    margin-left: 16px;
  }

  &.is-item {
    right: 24px;
  }
}

.add-button, .add {
  font-size: 12px;
  line-height: 16px;
  color: #666;
  margin-bottom: 6px;
  display: block;
  margin-left: 5px;
  margin-right: 5px;
  vertical-align: middle;
  cursor: pointer;
  // width: 20px;
  // height: 20px;
}

.perform .select {
  margin-bottom: 10px;
}

.perform .select:last-child {
  margin-bottom: 0;
}

.del {
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.condition-setting {
  display: inline-flex;
  align-items: center;
}

.condition-input {
  margin: 0 8px;
  width: 100px;
}

.man {
  height: 70px;
}

.choose {
  width: 100%;

  .date {
    display: inline-block;
    width: 40%;
  }

  .haha {
    display: inline-block;
    width: 15%;
    font-size: 12px;
  }
}

.select-box-wrapper, display flex, .select-box {
  flex: 1;

  select {
    width: 100%;
    border: 1px solid #ccc;
    height: 32px;
    box-sizing: border-box;
    border-radius: 2px;
    box-sizing: border-box;
    padding: 0 12px;
  }
}

.select-box + .select-box {
  margin-left: 8px;
}

.is-flex {
  display: flex;
}

.shiyong {
  margin-bottom: 12px;
}
</style>
