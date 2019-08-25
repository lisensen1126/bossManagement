<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title {{is_edit == 1 ? '添加项目' : '编辑项目'}}
      .field-group
        .field
          label.label 项目名称
          custom-input(v-model.trim="prize_info.name", input-type="hasCount", placeholder="请输入项目名称", :validator="$v.prize_info.name", error-info="车检单内容必填且小于六个字", :is-disabled="is_loading || is_disabled")
            span(slot="countInfo") {{wordLength(prize_info.name)}}/6

        .field
          label.label 更换里程（非必填）
          custom-input(v-model.trim="prize_info.exchange_mile",need-type='float', maxlength="6", placeholder="请输入更换里程数", :is-disabled="is_loading || is_disabled")

        .field
          label.label 检测里程
          custom-input(v-model.trim="prize_info.inspect_mile", need-type='float', maxlength="6", placeholder="请输入检测里程数", :validator="$v.prize_info.inspect_mile", error-info="检测里程数必填且小于六个数字", :is-disabled="is_loading || is_disabled")

        .field
          label.label 项目提示
          custom-input(v-model.trim="prize_info.tip", input-type="hasCount", placeholder="项目提示", :validator="$v.prize_info.tip", error-info="项目提示必填且小于三十个字", :is-disabled="is_loading || is_disabled")
            span(slot="countInfo") {{wordLength(prize_info.tip)}}/30

        .field
          div.perform-point
            label.label 检测点
            span.add(@click="addCheckpoint") 添加
            .switch.check
              input(type="checkbox", v-model="prize_info.is_multi", id="multi")
              label(for="multi")
          div.perform(v-for="(item, index) in point")
            custom-input(v-model.trim="point[index]", input-type="hasCount", placeholder="请输入检测点", :validator="$v.point.$each[index]", error-info="监测点必填且小于十个字", :is-disabled="is_loading || is_disabled")
              span(slot="countInfo") {{wordLength(point[index])}}/10
            span.del(@click="delCheckpoint(index)") 移除

        .field
          div.perform-point
            label.label 异常问题
            span.add(@click="addAbnormal") 添加
          div.perform(v-for="(item, index) in exception")
            custom-input(v-model.trim="exception[index]", input-type="hasCount", placeholder="请输入异常问题", :validator="$v.exception.$each[index]", error-info="异常问题必填且小于二十个字", :is-disabled="is_loading || is_disabled")
              span(slot="countInfo") {{wordLength(exception[index])}}/20
            span.del(@click="delAbnormal(index)") 移除
            
        .field
          div.perform-point
            label.label 异常建议
            span.add(@click="addProposal") 添加
          div.perform(v-for="(item, index) in suggest")
            custom-input(v-model.trim="suggest[index]", input-type="hasCount", placeholder="请输入异常建议", :validator="$v.suggest.$each[index]", error-info="异常建议必填且小于二十个字")
              span(slot="countInfo") {{wordLength(suggest[index])}}/20
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
    is_edit: {
      type: [String, Number],
      default: 1,
    },
    id: {
      type: [Number, String],
      default: '',
    }
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
    point: {
      $each: {
        required,
        validate (val) {
          return this.wordLength(val) <= 10
        },
      },
    },
    exception: {
      $each: {
        required,
        validate (val) {
          return this.wordLength(val) <= 20
        },
      },
    },
    suggest: {
      $each: {
        required,
        validate (val) {
          return this.wordLength(val) <= 20
        },
      },
    },
  },

  data () {
    return {
      item_id: '',
      is_disabled: false,
      is_loading: false,
      is_enabled: true,
      prize_info: {
        name: '',
        exchange_mile: '',
        inspect_mile: '',
        tip: '',
        is_multi: 1
      },
      point: [],       // 检测点
      exception: [],   // 异常问题
      suggest: [],     // 异常建议
      is_uploading: true,
    }
  },

  methods: {
    wordLength,
    // 添加检测点
    addCheckpoint () {
      this.point.push('')
    },

    // 移除检测点
    delCheckpoint (index) {
      this.$delete(this.point, index)
    },

    // 添加异常问题
    addAbnormal () {
      this.exception.push('')
    },

    // 移除异常问题
    delAbnormal (index) {
      this.$delete(this.exception, index)
    },

    // 添加异常建议
    addProposal () {
      this.suggest.push('')
    },

    // 移除异常建议
    delProposal (index) {
      this.$delete(this.suggest, index)
    },

    // 创建/编辑数据校验格式化
    async saveData () {
      this.$v.$touch()
      if (this.$v.$error) return
      if (this.point.length === 0 || this.exception.length === 0 || this.suggest.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          content: `温馨提示！${this.point.length === 0 ? '检测点、' : ''}${this.exception.length === 0 ? '异常问题、' : ''}${this.suggest.length === 0 ? '异常建议' : ''}不能为空，请重新填写完毕后保存`,
        })
        return false
      }
      if (!this.prize_info.exchange_mile) this.prize_info.exchange_mile = 0
      if (!this.item_id) this.item_id = 0
      let params = {
        id: this.item_id,
        name: this.prize_info.name,
        exchange_mile: this.prize_info.exchange_mile,
        inspect_mile: this.prize_info.inspect_mile,
        tip: this.prize_info.tip,
        point: this.point,
        exception: this.exception,
        suggest: this.suggest,
        is_multi: this.prize_info.is_multi ? 1 : 2
      }
      this.is_edit === 1 ? this.setData(params) : this.editData(params)
    },

    // 添加数据接口
    async setData (params) {
      try {
        const { result, response } = await this.saveInspectionApi(params)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'success',
            title: '添加成功',
            resolve: () => {
              this.$emit('vehicleSuccess', {})
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: result.message,
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
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '编辑成功',
            resolve: () => {
              this.$emit('vehicleSuccess', {})
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑失败',
            content: result.message,
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
      try {
        const { result, response } = await this.getInspectionDetailApi({id: this.item_id})
        if (response.status === 200 && result.code === 0) {
          this.prize_info.name = result.data.name
          this.prize_info.exchange_mile = result.data.exchange_mile
          this.prize_info.inspect_mile = result.data.inspect_mile
          this.prize_info.tip = result.data.tip
          this.prize_info.is_multi = Number(result.data.is_multi) === 1 ? true : false
          this.point = result.data.point
          this.exception = result.data.exception
          this.suggest = result.data.suggest
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取项目详情失败',
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
  },

  mounted () {
    this.item_id = this.id
    if (this.is_edit === 2 && this.item_id !== '') this.getDetailData()
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
  position: relative;
}

.check {
  position: absolute;
  top: 0;
  right: 0;
}

.add {
  font-size: 12px;
  line-height: 16px;
  color: #2fabdd;
  margin-bottom: 6px;
  display: block;
  margin-left: 5px;
  margin-right: 5px;
  vertical-align: middle;
  cursor: pointer;
}
.add:hover {
  color: #0a71a1;
}
.has-count .error-icon {
  right: 8px !important;
}

.del {
  font-size: 13px;
  color: #666;
  cursor: pointer;
  color: #2fabdd;
}

.del:hover {
  color: #0a71a1;
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
