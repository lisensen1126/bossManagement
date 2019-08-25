<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title 关联项目
      .field-group.is-horizontal
        .field
          label.label 从项目中选择
          custom-select(:list="type_list", :show-search="true", v-model="prize_info", :input="getType", error-info="请选择项目类型", :validator="$v.prize_info.name")
    .field
      button.button.large.primary(@click="successToast") 保存
</template>

<script>
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import FilterTools from '@/mixins/utilities/filterTools'
import ClassApi from '@/mixins/modules/FunctionSetting'
// import { quantityFormat } from '@/mixins/custom-validators/custom-validators'

export default {
  name: 'NewSecondLevel',
  mixins: [ClassApi, validationMixin, FilterTools],
  components: {
    CustomInput,
    CustomSelect,
  },
  validations: {
    prize_info: {
      name: {
        required,
      },
    },
  },
  props: {
    isSecondEdit: {
      id: '',
    },
  },
  data () {
    return {
      type: {},
      // 项目列表
      type_list: [],
      prize_info: {
        type: {},
        id: '',
      },
      category_id: '', // 分类id
      item_id: '', // 项目id
      is_uploading: true,
    }
  },
  computed: {
    /*
      * 切换项目类型
      * @ q 项目类型
      * */
    getType (q) {
      this.prize_info.type = q
    },
  },
  methods: {
    /*
      * 获取项目列表
      * */
    async addProject () {
      let params = {
        per_page: 999,
      }
      try {
        const { result, response } = await this.getArticleListApi(params)
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
      this.is_uploading = true
    },
    // 添加成功
    async successToast () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      let params = {
        category_id: this.category_id,
        item_id: this.prize_info.id,
      }
      try {
        const { result, response } = await this.getRelationApi(params)
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
      this.is_uploading = true
    },
  },
  mounted () {
    this.addProject()
    this.category_id = this.isSecondEdit.id
  },
}
</script>

<style lang="stylus" scoped>
.slide-layout .cus-box .field-group .field {
  width: 100% !important;
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
