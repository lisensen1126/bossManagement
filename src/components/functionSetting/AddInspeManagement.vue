<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title {{isEdit === 1 ? '添加项目' : '编辑项目'}}
      .field-group
        .field
          label.label 项目名称
          custom-input(v-model="prize_info.name", input-type="hasCount", placeholder="请输入项目名称", :validator="$v.prize_info.name", error-info="车检单内容必填且小于六个字", :is-disabled="isLoading || isDisabled")
            span(slot="countInfo") {{wordLength(prize_info.name)}}/6
        .field
          label.label 更换里程（非必填）
          custom-input(v-model="prize_info.exchange_mile",need-type='float', maxlength="6", placeholder="请输入更换里程数", :is-disabled="isLoading || isDisabled")
        .field
          label.label 检测里程
          custom-input(v-model="prize_info.inspect_mile", need-type='float', maxlength="6", placeholder="请输入检测里程数", :validator="$v.prize_info.inspect_mile", error-info="检测里程数必填且小于六个数字", :is-disabled="isLoading || isDisabled")
        .field
          label.label 项目提示
          custom-input(v-model="prize_info.tip", input-type="hasCount", placeholder="项目提示", :validator="$v.prize_info.tip", error-info="项目提示必填且小于三十个字", :is-disabled="isLoading || isDisabled")
            span(slot="countInfo") {{wordLength(prize_info.tip)}}/30
        .field
          div.perform-point
            label.label 检测点
            span.add(@click="addCheckpoint") 添加
          div.perform(v-for="(item, index) in point1")
            custom-input(v-model="point1[index].name", input-type="hasCount", placeholder="请输入检测点", :validator="$v.point1.$each[index]", error-info="监测点必填且小于十个字", :is-disabled="isLoading || isDisabled")
              span(slot="countInfo") {{wordLength(point1[index].name)}}/10
            span.del(@click="delCheckpoint(index)") 移除
        .field
          div.perform-point
            label.label 异常问题
            span.add(@click="addAbnormal") 添加
          div.perform(v-for="(item, index) in point2")
            custom-input(v-model="point2[index].name", input-type="hasCount", placeholder="请输入异常问题", :validator="$v.point2.$each[index]", error-info="异常问题必填且小于二十个字", :is-disabled="isLoading || isDisabled")
              span(slot="countInfo") {{wordLength(point2[index].name)}}/20
            span.del(@click="delAbnormal(index)") 移除
        .field
          div.perform-point
            label.label 异常建议
            span.add(@click="addProposal") 添加
          div.perform(v-for="(item, index) in point3")
            custom-input(v-model="point3[index].name", input-type="hasCount", placeholder="请输入异常建议", :validator="$v.point3.$each[index]", error-info="异常建议必填且小于二十个字")
              span(slot="countInfo") {{wordLength(point3[index].name)}}/20
            span.del(@click="delProposal(index)") 移除
    .field
      button.button.large.primary(@click="saveData") 保存
</template>

<script>
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import FilterTools from '@/mixins/utilities/filterTools'
import ClassApi from '@/mixins/modules/FunctionSetting'
export default {
  name: 'AddInspeManagement',
  mixins: [ClassApi, validationMixin, FilterTools],
  components: {
    CustomInput,
    CustomSelect,
  },
  props: {
    isAllEdit: {
      id: '',
      type: '',
    },
  },
  validations: {
    prize_info: {
      name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 6
        },
      },
      inspect_mile: {
        required,
      },
      tip: {
        required,
        validate (val) {
          return this.wordLength(val) <= 30
        },
      },
    },
    point1: {
      $each: {
        name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 10
          },
        },
      },
    },
    point2: {
      $each: {
        name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 20
          },
        },
      },
    },
    point3: {
      $each: {
        name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 20
          },
        },
      },
    },
  },
  data () {
    return {
      isEdit: '',
      item_id: '',
      isDisabled: false,
      isLoading: false,
      is_enabled: true,
      prize_info: {
        name: '',
        exchange_mile: '',
        inspect_mile: '',
        tip: '',
      },
      // 检测点
      point1: [
        {
          name: '',
          id: 0,
          type: 1,
        },
      ],
      // 异常问题
      point2: [
        {
          name: '',
          id: 0,
          type: 2,
        },
      ],
      // 异常建议
      point3: [
        {
          name: '',
          id: 0,
          type: 3,
        },
      ],
      is_uploading: true,
    }
  },
  methods: {
    wordLength,
    // 添加检测点
    addCheckpoint () {
      let params = {
        id: 0,
        type: 1,
        name: '',
      }
      this.point1.push(params)
    },
    // 移除检测点
    delCheckpoint (index) {
      this.point1.splice(index, 1)
    },
    // 添加异常问题
    addAbnormal () {
      let params = {
        id: 0,
        type: 2,
        name: '',
      }
      this.point2.push(params)
    },
    // 移除异常问题
    delAbnormal (index) {
      this.point2.splice(index, 1)
    },
    // 添加异常建议
    addProposal () {
      let params = {
        id: 0,
        type: 3,
        name: '',
      }
      this.point3.push(params)
    },
    // 移除异常建议
    delProposal (index) {
      this.point3.splice(index, 1)
    },
    // 创建/保存数据
    async saveData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      let pass = true
      if (this.point1.length === 0 || this.point2.length === 0 || this.point3.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: `请注意！
            ${this.point1.length === 0 ? '监测点、' : ''}
            ${this.point2.length === 0 ? '异常问题、' : ''}
            ${this.point3.length === 0 ? '异常建议' : ''}
          不能为空，请重新填写完毕后保存`,
        })
        pass = false
      }
      if (!pass) return
      let _point = []
      let pointList1 = [
        {
          type: 1,
          list: this.point1,
        },
      ]
      let pointList2 = [
        {
          type: 2,
          list: this.point2,
        },
      ]
      let pointList3 = [
        {
          type: 3,
          list: this.point3,
        },
      ]
      _point = [...pointList1, ...pointList2, ...pointList3]
      if (!this.prize_info.exchange_mile) {
        this.prize_info.exchange_mile = 0
      }
      if (!this.item_id) {
        this.item_id = 0
      }
      let params = {
        id: this.item_id,
        name: this.prize_info.name,
        exchange_mile: this.prize_info.exchange_mile,
        inspect_mile: this.prize_info.inspect_mile,
        tip: this.prize_info.tip,
        point: _point,
      }
      this.isEdit === 1 ? this.setData(params) : this.editData(params)
    },
    async setData (params) {
      try {
        const { result, response } = await this.saveInspectionApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: this.isEdit === 1 ? '添加成功' : '编辑成功',
              resolve: () => {
                this.$emit('success', {})
              },
            })
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
    // 编辑项目
    async editData (params) {
      try {
        const { result, response } = await this.editInspectionApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: this.isEdit === 1 ? '添加成功' : '编辑成功',
              resolve: () => {
                this.$emit('success', {})
              },
            })
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
    // 获取详情
    async getDetailData () {
      let params = {
        id: this.item_id,
      }
      try {
        const { result, response } = await this.getInspectionDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.prize_info.name = result.data.name
            this.prize_info.exchange_mile = result.data.exchange_mile
            this.prize_info.inspect_mile = result.data.inspect_mile
            this.prize_info.tip = result.data.tip
            this.point1 = result.data.point[0].list
            this.point2 = result.data.point[1].list
            this.point3 = result.data.point[2].list
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
    this.isEdit = parseInt(this.isAllEdit.type)
    this.item_id = this.isAllEdit.id
    if (this.item_id) {
      this.getDetailData()
    }
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

.perform {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.perform-point {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.add {
  font-size: 12px;
  line-height: 16px;
  color: #666;
  margin-bottom: 6px;
  display: block;
  margin-left: 5px;
  margin-right: 5px;
  vertical-align: middle;
  cursor: pointer;
}

.has-count .error-icon {
  right: 8px !important;
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
