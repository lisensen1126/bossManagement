<template lang="pug">
  .slide-layout
    .slide-title(v-text="'分类信息'")
    .field-group
      .field
        label.label 分类名称
        custom-input(placeholder="分类名称,最多十个字符", @input="changeInput" v-model="submitData.category_name", :validator="$v.submitData.category_name", error-info="分类名称不能为空且长度不能大于10")
      .field
        label.label 分类icon
        upload-pic(v-model="submitData.category_logo", :need-default="false")
      .field
        button.button.large.primary(@click="staffSave" v-text="'保存'")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  import bossMixin from '@/mixins/modules/boss'  // 接口   文件
  export default {
    mixins: [validationMixin, bossMixin],
    components: {
      CustomInput,
      CustomSelect,
      UploadPic,
    },
    // 接收父组件传递过来的组件 接收的参数不做类型校验
    props: {
      isAdd: {},   // 判断是否是添加参数
      classType: '',    // 判断是商品分类or服务分类
      parantId: '',     // 添加分类时的父类id
    },
    // 数据初始化
    data () {
      const schema = {
        submitData: {                   // 编辑分类所需参数
          category_name: this.isAdd.category_name || '',  // 分类名称
          category_logo: this.isAdd.category_logo || '',  // 分类logo
          type: this.isAdd.type || this.classType,        // 分类类型 1.商品分类   2.服务分类
          category_id: this.isAdd.category_id || '',
          parent_id: this.parantId || 0,
        },
      }
      return schema
    },
    // 表单验证
    validations: {
      submitData: {
        category_name: {
          required,
          validate (val) {
            return this.wordLength(val.replace(/(^\s*)|(\s*$)/g, '')) <= 10
          },
        },
      },
    },
    methods: {
      wordLength,
      emitDisable () {
        this.$emit('disableEvent', this.submitData.id)
      },
      emitEnable () {
        this.$emit('enableEvent', this.submitData.id)
      },
      changeInput () {
        // this.addParams.category_name = this.submitData.category_name
      },
      // 保存操作
      staffSave () {
        this.submitData.category_name = this.submitData.category_name.replace(/(^\s*)|(\s*$)/g, '')
        this.$v.submitData.$touch()
        if (this.$v.submitData.$error || this.$v.submitData.category_name.$error) {
          return false
        }
        // isAdd为空表示是添加
        if (this.isAdd === '') {
          this.setAddClassify()
        } else {
          this.setEditClassify()
        }
      },
      // 添加分类
      async setAddClassify () {
        try {
          const {response, result} = await this.addClassify(this.submitData)
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
                content: `出错啦！${result.message}！`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: `出错啦！${result.message}！错误码：${response.status}`,
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
      async setEditClassify () {
        try {
          const {result, response} = await this.editClassify(this.submitData)
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
                content: `出错啦！${result.message}！`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '编辑失败',
              content: `出错啦！${result.message}！错误码：${response.status}`,
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
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .star-num
    font-size 13px
    padding-left 8px
    border-left 1px solid rgba(0,0,0,0.06)
    height 16px
    line-height 16px
    color primary
</style>
