<template  lang="pug">
  .slide-layout
    .cus-box
      .slide-title {{title_txt}}
        .field-group.is-horizontal
        .field
          label.label 名称
          custom-input(v-model="title", maxlength="10" placeholder="请输入名称", :validator="$v.title", error-info="请输入名称",)
        .field
          label.label 图标
          upload-pic(v-model="icon_img", :need-default="false")
        .field
          button.button.large.primary(@click="ensure") 确定
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import basicsAdminApi from '@/mixins/modules/basics'
import UploadPic from '@/components/generics/form/UploadPic'
export default {
  name: 'AdminAdd',
  mixins: [validationMixin, basicsAdminApi],
  components: {
    CustomInput,
    UploadPic,
  },
  props: {
    isFrom: {
      type: Object,
      default: {
        isEdit: false, // 打开模态框是否是编辑
        type: 1, // 1 认证 2服务
      },
    },
    itemInfo: null,
  },
  data () {
    return {
      title_txt: '添加服务信息', // 标题
      title: '',
      icon_img: '',
    }
  },
  methods: {
    // 确认按钮
    ensure () {
      this.$v.$touch()
      if (this.$v.$error) {
        return false
      }
      if (this.isFrom.isEdit) {
        this.update()
      } else {
        this.create()
      }
    },
    /**
     * 新增
     */
    async create () {
      try {
        const { response, result } = await this.settingCreate({
          title: this.title,
          icon_img: this.icon_img,
          setting_type: this.isFrom.type,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '添加成功',
            resolve: () => this.$emit('callBack'),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '添加失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '添加失败',
          content: `错误：${err}`,
        })
      }
    },

    /**
     * 新增
     */
    async update () {
      try {
        const { response, result } = await this.settingUpdate({
          title: this.title,
          icon_img: this.icon_img,
          setting_type: this.isFrom.type,
          setting_id: this.itemInfo.setting_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '编辑成功',
            resolve: () => this.$emit('callBack'),
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '编辑失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '编辑失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  watch: {},
  validations: {
    title: {
      required,
    },
  },
  mounted () {
    if (this.isFrom.isEdit && this.isFrom.type === 1) {
      this.title_txt = '编辑认证信息'
    } else if (this.isFrom.isEdit && this.isFrom.type === 2) {
      this.title_txt = '编辑服务信息'
    } else if (!this.isFrom.isEdit && this.isFrom.type === 1) {
      this.title_txt = '添加认证信息'
    } else {
      this.title_txt = '添加服务信息'
    }
    if (this.itemInfo) {
      this.title = this.itemInfo.title
      this.icon_img = this.itemInfo.icon_img
    }
  },
}
</script>

<style scoped>
</style>
