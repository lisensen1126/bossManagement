<template lang="pug">
  .slide-layout
    .slide-title {{is_edit == 1 ? "添加场景" : "编辑场景"}}
    .field-group
      .field
        label.label 场景名称
        custom-input(placeholder="请输入场景名称，最多6个字符", maxlength="6" v-model.trim="submit_data.name", input-type="hasCount",  :validator="$v.submit_data.name", error-info="场景名称不能为空，且不能超过6个字符",)
          span(slot="countInfo") {{submit_data.name.length}}/6
      .field
        label.label 场景介绍
        custom-input(v-model.trim="submit_data.desc", input-type="hasCount", placeholder="请输入场景介绍，最多50个字符", maxlength="50" :validator="$v.submit_data.desc", error-info="场景介绍不能为空，且不能超过50个字符")
          span(slot="countInfo") {{submit_data.desc.length}}/50
      .field
        label.label 上传场景图
        upload-pic(v-model="submit_data.icon", :need-default="false")
      .field
        button.button.large.primary(@click="save" v-text="'保存'")
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import UploadPic from '@/components/generics/form/UploadPic'
export default {
  name: 'NewFirstLevel',
  mixins: [validationMixin],
  components: {
    CustomInput,
    UploadPic,
  },
  // 接收父组件传递过来的组件
  props: {
    params: {
      type: Object,
      default: {},
    },
    is_edit: {
      type: [String, Number],
      default: 1
    }
  },
  // 数据初始化
  data () {
    return {
      submit_data: {
        name: '',
        desc: '',
        icon: '',
      },
      isEdit: '',
      inspect_id: '', // 一级分类id
      isDisabled: false,
      isLoading: false,
    }
  },
  methods: {
    // 保存
    save () {
      this.$v.$touch()
      if (this.$v.submit_data.$error || this.$v.submit_data.name.$error || this.$v.submit_data.desc.$error) {
        return false
      }
      if (!this.submit_data.icon) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '警告',
          content: '请上传场景图',
        })
        return false
      }
      this.$emit('sceneSuccess', this.submit_data)
    }
  },
  mounted () {
    // 编辑数据初始化
    if (this.is_edit === 2 && this.params.id !== '') {
      this.submit_data = {
        name: this.params.name,
        desc: this.params.desc,
        icon: this.params.icon,
        id: this.params.id,
      }
    }
  },
  validations: {
    submit_data: {
      desc: {
        required,
        validate (val) {
          return val.length <= 50
        },
      },
      name: {
        required,
        validate (val) {
          return val.length <= 6
        },
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'
.star-num
  font-size 13px
  padding-left 8px
  border-left 1px solid rgba(0, 0, 0, 0.06)
  height 16px
  line-height 16px
  color primary
.fl
  float left
</style>
