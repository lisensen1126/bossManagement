<template lang="pug">
  .slide-layout
    .slide-title {{isEdit === 1 ? '创建一级分类' : '编辑一级分类'}}
    .field-group
      .field
        label.label 分类名称
        custom-input(placeholder="分类名称", v-model="submitData.classify_name", input-type="hasCount",  :validator="$v.submitData.classify_name", error-info="分类名称必填并且小于八个字", :is-disabled="isLoading || isDisabled")
          span(slot="countInfo") {{wordLength(submitData.classify_name)}}/6
      .field
        label.label 分类介绍
        custom-input(v-model="submitData.classify_desc", input-type="hasCount", placeholder="请输入分类介绍", :validator="$v.submitData.classify_desc", error-info="分类内容必填并且小于五十个字", :is-disabled="isLoading || isDisabled")
          span(slot="countInfo") {{wordLength(submitData.classify_desc)}}/50
      .field
        label.label 分类图片
        upload-pic(v-model="submitData.classify_logo", :need-default="false")
      .field
        button.button.large.primary(@click="staffSave" v-text="'保存'")
</template>

<script>
import { wordLength } from '@/mixins/custom-validators/custom-validators'
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import UploadPic from '@/components/generics/form/UploadPic'
import ClassApi from '@/mixins/modules/FunctionSetting'
export default {
  name: 'NewFirstLevel',
  mixins: [validationMixin, ClassApi],
  components: {
    CustomInput,
    UploadPic,
  },
  // 接收父组件传递过来的组件
  props: {
    isFirstEdit: {
      id: '',
      type: '', // 编辑或保存
    },
  },
  // 数据初始化
  data () {
    const schema = {
      submitData: {
        classify_name: '',
        classify_desc: '',
        classify_logo: '',
      },
      isEdit: '',
      inspect_id: '', // 一级分类id
      isDisabled: false,
      isLoading: false,
    }
    return schema
  },
  methods: {
    wordLength,
    emitDisable () {
      this.$emit('disableEvent', this.submitData.id)
    },

    emitEnable () {
      this.$emit('enableEvent', this.submitData.id)
    },

    // 保存数据时候的数据验证
    staffSave () {
      this.$v.$touch()
      if (this.$v.submitData.$error || this.$v.submitData.classify_name.$error || this.$v.submitData.classify_desc.$error) {
        return false
      }
      if (!this.submitData.classify_logo) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '分类图片不能为空',
        })
        return false
      }
      this.isEdit === 1 ? this.setAddClass() : this.setEditClass()
    },

    // 添加分类
    async setAddClass () {
      let params = {
        inspect_id: this.inspect_id,
        parent_id: 0,
        name: this.submitData.classify_name,
        desc: this.submitData.classify_desc,
        icon: this.submitData.classify_logo,
      }
      try {
        const { result, response } = await this.getFirstClassApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '添加成功',
              resolve: () => {
                this.$emit('success', {})
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: `出错啦！${result.message}！错误码：${response.status}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '网络错误',
            content: '网络出小差了，请稍后再试',
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

    // 编辑分类
    async setEditClass () {
      let params = {
        id: this.inspect_id,
        name: this.submitData.classify_name,
        desc: this.submitData.classify_desc,
        icon: this.submitData.classify_logo,
      }
      try {
        const { result, response } = await this.editFirstClassApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑成功',
              resolve: () => {
                this.$emit('success', {})
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑失败',
              content: `出错啦！${result.message}！错误码：${response.status}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '网络错误',
            content: '网络出小差了，请稍后再试',
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

    // 获取分类详情
    async getClassDetail () {
      let params = {
        id: this.inspect_id,
      }
      try {
        const { result, response } = await this.getFirstDetailApi(params)
        if (response.status === 200) {
          if (result.code === 0) {
            this.submitData.classify_name = result.data.name
            this.submitData.classify_desc = result.data.desc
            this.submitData.classify_logo = result.data.icon
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取分类详情失败',
              content: `出错啦！${result.message}！错误码：${response.status}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '网络错误',
            content: '网络出小差了，请稍后再试',
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
    this.isEdit = this.isFirstEdit.type
    this.inspect_id = this.isFirstEdit.id
    if (this.isEdit === 2) {
      this.getClassDetail()
    }
  },
  validations: {
    submitData: {
      classify_desc: {
        required,
        validate (val) {
          return this.wordLength(val) <= 50
        },
      },
      classify_name: {
        required,
        validate (val) {
          return this.wordLength(val) <= 6
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';

.star-num {
  font-size: 13px;
  padding-left: 8px;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  height: 16px;
  line-height: 16px;
  color: primary;
}
</style>
