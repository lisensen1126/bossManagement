<!--门店同步页面-->
<template lang="pug">
  .section-layout
    .content-wrapper
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label  门店范围设置
            custom-input(v-model="distance", need-type='number', placeholder="请输入1~1000内的正整数", :validator="$v.distance", error-info="请输入1~1000内的正整数且必填")
            label.company KM
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="rangeData") 提交
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import Loading from '@/components/generics/Loading'
import EmptyPage from '@/components/generics/EmptyPage'
import Utils from '@/mixins/utilities/utils'
import storePayApi from '@/mixins/modules/StorePay'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
/**
 * @vue
 */
export default {
  name: 'checkStoreEdit',
  mixins: [validationMixin, Utils, storePayApi],
  components: {
    CustomInput,
    Loading,
    EmptyPage,
  },
  data () {
    return {
      distance: '', // 名称
    }
  },
  methods: {
    // 保存
    async rangeData (){
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      try {
        const { response, result } = await this.hubstorescopeSaveApi({scope: this.distance})
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取范围详情失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取范围详情失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取范围详情失败',
          content: `错误：${err}`,
        })
      }
    },
    // 查看详情
    async rangeDetail () {
      try {
        const { response, result } = await this.hubstorescopeDetailApi()
        if (response.status === 200) {
          if (result.code === 0) {
            this.distance = result.data.scope
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取范围详情失败',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取范围详情失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取范围详情失败',
          content: `错误：${err}`,
        })
      }
    }
  },
  mounted () {
    this.rangeDetail()
  },
  validations: {
    distance: {
      required,
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';
.company {
  margin-left 12px
  font-size: 12px;
  color: #666;
}
</style>
