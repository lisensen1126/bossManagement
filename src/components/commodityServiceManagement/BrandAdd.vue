<template lang="pug">
  .slide-layout
    .slide-title(v-text="'品牌信息'")
    .field-group
      .field
        label.label 品牌名称
        custom-input(placeholder="品牌名称", v-model="submitData.brand_name", :validator="$v.submitData.brand_name", @input="filterBlank", error-info="品牌名称不能为空", maxlength="24")
      .field
        label.label 品牌英文名称
        custom-input(placeholder="品牌英文名称", v-model="submitData.english_name", :validator="$v.submitData.english_name", error-info="品牌英文名称不能为空")
      .field
        label.label 品牌LOGO
        upload-pic(v-model="submitData.brand_logo", :need-default="false")
      .field
        label.label 品牌介绍
        textarea.textarea(placeholder="请输入品牌介绍", v-model="submitData.content",)
      .field
        button.button.large.primary(@click="staffSave" v-text="'保存'")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import UploadPic from '@/components/generics/form/UploadPic'
import bossMixin from '@/mixins/modules/boss' // 接口文件
export default {
  name: 'BrandAdd',
  mixins: [validationMixin, bossMixin],
  components: {
    CustomInput,
    CustomSelect,
    UploadPic,
  },
  // 接收父组件传递过来的组件
  props: {
    isEdit: {},
  },
  // 数据初始化
  data () {
    const schema = {
      submitData: {
        brand_name: this.isEdit.brand_name || '',
        english_name: this.isEdit.english_name || '',
        brand_logo: this.isEdit.brand_logo || '',
        content: this.isEdit.content || '',
        brand_id: this.isEdit.brand_id || '',
      },
    }
    return schema
  },
  // 表单验证
  validations: {
    submitData: {
      brand_name: {
        required,
      },
      english_name: {
        required,
      },
    },
  },
  methods: {
    /**
    * 过滤空格
    * @value 当前输入框的值
    */
    filterBlank (value) {
      if (typeof value === 'string') {
        this.submitData.brand_name = value.replace(/\s+/g, '')
      }
    },
    emitDisable () {
      this.$emit('disableEvent', this.submitData.id)
    },

    emitEnable () {
      this.$emit('enableEvent', this.submitData.id)
    },

    // 保存数据时候的数据验证
    staffSave () {
      this.submitData.brand_name = this.submitData.brand_name.replace(/(^\s*)|(\s*$)/g, '')
      this.submitData.english_name = this.submitData.english_name.replace(/(^\s*)|(\s*$)/g, '')
      this.$v.$touch()
      if (this.$v.submitData.$error || this.$v.submitData.brand_name.$error || this.$v.submitData.english_name.$error) {
        return false
      }
      if (!this.submitData.brand_logo) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '品牌Logo不能为空',
        })
        return false
      }
      if (!this.submitData.content) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '品牌介绍不能为空',
        })
        return false
      }
      this.isEdit === '' ? this.setAddBrand() : this.setEditBrand()
    },

    // 添加品牌
    async setAddBrand () {
      try {
        const { result, response } = await this.brandAdd(this.submitData)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '添加成功',
              resolve: () => this.$emit('success'),
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

    // 编辑品牌
    async setEditBrand () {
      try {
        const { result, response } = await this.brandEdit(this.submitData)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '编辑成功',
              resolve: () => this.$emit('success'),
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
  },
  mounted () {},
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
