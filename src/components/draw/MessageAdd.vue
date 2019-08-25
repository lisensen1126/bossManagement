<template lang="pug">
  .slide-layout
    .cus-box
      .slide-title(v-if="isEdit == 1") 新建模板短信
      .slide-title(v-if="isEdit == 2") 编辑模板短信
      .field-group.is-horizontal
        .field
          label.label 模板名称
          custom-input(placeholder="请输入模板名称(10字之内)", v-model="info.name", error-info="请输入模板名称(10字之内)", :validator="$v.info.name", maxlength=10)
      .field-group.is-horizontal
        .field
          label.label 模板分类
          custom-select(:list="typeList", v-model="info.getType", ref="typeSelect", error-info="请选择模板分类", :validator="$v.info.getType.id")
      .field-group.is-horizontal
        .field
          label.label 模板归属
          custom-select(:list="sence_list", v-model="info.sence", ref="typeSelect1",:is-disabled="is_disabled", error-info="请选择模板归属", :validator="$v.info.sence.id")
      .field-group.is-horizontal(style="margin-top: 26px")
        label.label 营销短信
          .switch(style='margin-left:10px')
            input(type="checkbox", id="nb", v-model="marketing")
            label(for="nb")
      .field-group.is-horizontal
        label.label(style='padding-left:58px') 注：营销短信会默认在短信结尾增加"退订回T"
      .field-group.is-horizontal
        .field
          label.label 模板内容
          custom-textarea.textarea(placeholder="请输入模板内容", v-model="info.content", :validator="$v.info.content", @keyEnter="fn" error-info="请输入模板内容", :is-disabled="false")
      .field-group.is-horizontal
        .field
          label.label 模板预览
          .textarea.box
            span {{info.content}}
            span(v-if="marketing") {{text}}
          .textarea-num 字符数: {{info.content.length + text.length}} / 70
          //- .textarea-num(v-if="isEdit === 2") 字符数: {{info.content.length + text.length}} / 70
      .field-group.is-horizontal
        .field
          label.label 温馨提示
          .tip 1.您可在短信中插入自定义变量，如%name%，注意变量不可是中文。
          .tip 2.短信内容中不可包括【】、[]、测试、test字符。
          .tip 3.您填写的链接首尾都需要包含一个空格，且以http://或https://格式开头。
          .tip 4.短信模板审核时间：工作日（周一到周五的9:00-18:00）每小时审核一次。
          .tip 5.非工作日每天上午和下午各审核一次，只有审核通过的短信模板才可以被使用。
          .tip 6.由于变量和签名等原因，实际发送短信字数与短信模板字数会有不一致，实际短信计费条数以运营商返回为准，请在大批量发送前做好测试。
    .field
      button.button.large.primary(@click="addMsg") 提交审核
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import CustomTextarea from '@/components/generics/form/CustomTextarea'
  import {validationMixin} from 'vuelidate'
  import {required} from 'vuelidate/lib/validators'
  import FilterTools from '@/mixins/utilities/filterTools'
  import DrawApi from '@/mixins/modules/draw'
  export default {
    name: 'messageAdd',
    mixins: [DrawApi, validationMixin, FilterTools],
    components: {
      CustomInput,
      CustomSelect,
      CustomTextarea,
    },
    validations: {
      info: {
        name: {
          required,
        },
        getType: {
          id: {
            required,
          },
        },
        sence: {
          id: {
            required,
          },
        },
        content: {
          required,
        },
      },
    },
    props: {
      isEdit: {
        type: Number,
        default: 1,
      },
      MsgId: {
        type: Number,
        default: 0,
      },
    },
    data () {
      return {
        typeList: [], // 模板分类
        marketing: false,
        info: {
          name: '', // 模板名称
          type: '', // 模板分类
          content: '', // 模板内容
          getType: {}, // 已选分类
          is_marketing: 1,
          sence: {},
        },
        text: '',
        sence_list: [
          {
            name: '门店',
            id: 1,
          },
          {
            name: '平台',
            id: 2,
          },
        ],
        is_disabled: false,
      }
    },
    watch: {
      'marketing': function (newVal) {
        newVal ? this.text = '退订回T' : this.text = ''
      },
    },
    methods: {
      // 提交审核操作
      addMsg () {
        this.info.content = this.info.content.replace(/\n/g, '')
        this.marketing ? this.info.is_marketing = 2 : this.info.is_marketing = 1
        this.$v.$touch()
        if (this.$v.$error) {
          document.getElementsByClassName('slide-layout')[0].scrollTo(0, 0)
          return
        }
        if (this.info.content.toLowerCase().indexOf('[') > -1 || this.info.content.toLowerCase().indexOf(']') > -1 || this.info.content.toLowerCase().indexOf('【') > -1 || this.info.content.toLowerCase().indexOf('】') > -1 || this.info.content.toLowerCase().indexOf('测试') > -1 || this.info.content.toLowerCase().indexOf('test') > -1) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '短信内容中不可包括【】、[]、测试、test字符',
          })
          return
        }
        // if (this.info.sence.id === 2 && this.info.content.toLowerCase().indexOf('%') > -1) {
        //   this.$store.dispatch('showMessage', {
        //     type: 'warning',
        //     title: '警告',
        //     content: '平台使用的短信不能包含变量',
        //   })
        //   return
        // }
        if (this.isEdit === 1) {
          this.addMessage() // 添加模板接口
        } else {
          this.editMessage() // 编辑模板接口
        }
      },
      /*
      * 添加模板接口
      * */
      async addMessage () {
        console.log(this.info.content)
        let self = this
        try {
          const {result, response} = await this.smsAddApi({
            name: self.info.name,
            content: self.info.content,
            template_type_id: self.info.getType.id,
            is_marketing: self.info.is_marketing,
            type: self.info.sence.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '新建成功',
              resolve: () => {
                this.$emit('success')
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '新建失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '新建失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      /*
      * 编辑模板接口
      * */
      async editMessage () {
        let self = this
        try {
          const {result, response} = await this.smsUpdateApi({
            name: self.info.name,
            content: self.info.content,
            template_type_id: self.info.getType.id,
            template_id: self.info.template_id,
            id: self.MsgId,
            is_marketing: self.info.is_marketing,
            type: self.info.sence.id,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '成功',
              content: '编辑成功',
              resolve: () => {
                this.$emit('success')
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
            title: '编辑失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      /*
      * 模板详情接口
      * */
      async messageDetail () {
        let self = this
        try {
          const {result, response} = await this.smsDetailApi({
            id: this.MsgId,
          })
          if (response.status === 200 && result.code === 0) {
            self.info = result.data
            self.info.content = self.info.content.replace('%storeName%退订回T', '')
            result.data.is_marketing - 0 === 1 ? self.marketing = false : self.marketing = true
            let type = self.typeList.find(item => self.info.template_type_id ? item.id === this.info.template_type_id : false) || {}
            let sence = self.sence_list.find(item => self.info.type ? item.id === this.info.type : false) || {}
            self.$refs.typeSelect.selectCandidate(type)
            self.$refs.typeSelect1.selectCandidate(sence)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取模板详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板详情失败',
            content: `出错啦！错误码：${err}`,
          })
        }
      },
      /**
       * 获取模板分类列表接口
       */
      async fetchTypeData () {
        try {
          const { response, result } = await this.smsTypeApi({})
          if (response.status === 200 && result.code === 0) {
            this.typeList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取模板分类列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板分类列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      fn () {
        console.log(2)
      },
    },
    mounted () {
      if (this.isEdit === 2) {
        this.is_disabled = true
        Promise.all([this.fetchTypeData()]).then(() => {
          this.messageDetail()
        })
      } else {
        this.is_disabled = false
        this.fetchTypeData() // 获取模板分类列表接口
      }
    },
  }
</script>

<style lang="stylus" scoped>
  .slide-layout .cus-box .field-group .field
    width 100% !important
  .tip
    font-size 12px
    line-height 18px
    color #ff0000
  .textarea-num
    font-size 12px
    color #888
    text-align right
    line-height 18px
  .box
    min-height 70px
    border 1px solid #c2c2c2
    border-radius 2px
    padding 7px 13px
    font-size 13px
    color #353535
</style>
