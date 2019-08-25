<template lang="pug">
  .section-layout
    slide-out-modal(@input="toggleSidePannel" v-if="show_mode")
      message-type(:id="'1'" @success="seleckType")
    .content-wrapper
      .section-setting
        .level.level-content
          .level-left
            .form-wrapper

              .field-group
                .field.is-horizontal
                  label.label 推送目标
                  .field-content.clearfix
                    .button.primary.fl(@click="toggleSidePannel") 推荐客户
                    .button.primary.m-l-20.fl.file 导入客户
                      input(type="file" value="导入客户" name="file", @change="importPhone($event)" style='opacity: 0; width: 80px; height:32px; position: absolute; top: 0; left: 0px; cursor: pointer')
                    .check-but.fl.link(@click="down") （下载模板）

              .field-group
                .field.is-horizontal
                  label.label
                  .field-content
                    custom-input.fl.phone-input(maxlength='11' @keyupEnter="enterPhone" v-model="phone" placeholder="请输入手机号" :validator="$v.phone" error-info="请输入正确的手机号", need-type="number")
                    p.fl.p-tip （输入手机号码，回车添加）

              .field-group
                .field.is-horizontal
                  label.label
                  .field-content.border
                    .phone.fl(v-for="(item, index) in phone_list")
                      .text.fl(v-text="item")
                      .close.fr.delete-icon(@click="delPhone(index)")

              .field-group.clear-phone
                .field.is-horizontal
                  label.label
                  .field-content.clearfix
                    .clear.fl(@click="clearAll") 清空
                    .num.fr 当前共有{{phone_list.length}}个电话号码

              .field-group
                .field.is-horizontal
                  label.label 模板选择
                  .field-content.clearfix
                    custom-select.moban.fl(placeholder='请选择模板分类' v-model="type" :list="template_type")
                    custom-select.moban.fl(placeholder='请选择模板名称' v-model="name" :list="template_name")

              .field-group(v-if="temp.length>0")
                .field.is-horizontal
                  label.label 短信内容
                  .field-content
                    form(id="refForm")
                      p.sms#ref
                        input(type="text", style="display: none")
                        span(v-for="(item, index) in temp")
                          input(v-if='(index+1)%2 == 0' type="text" :data-value="temp[index]" class="smsref" placeholder="请输入" @change="inputChange($event, index)")
                          span(v-else v-text="item")

              .field-group(v-if="temp.length>0")
                .field.is-horizontal
                  label.label 内容预览
                  .field-content.border.msg-text {{identification}}{{views}}

              .field-group.clear-phone(v-if="temp.length>0")
                .field.is-horizontal
                  label.label
                  .field-content.clearfix
                    .num.fr 字符数：{{views.length + identification.length}}/70，共 {{Math.ceil((views.length + identification.length)/70)}} 条短信

              .field-group
                .field.is-horizontal
                  label.label 发送数量
                  .field-content
                    p.sms {{count}}条 = {{phone_list.length}}（号码数） x {{Math.ceil((views.length-0 + identification.length-0)/70)}}（单条短信数）

              .field-group
                .field.is-horizontal
                  label.label
                  .field-content
                    p.sms.f-12 温馨提示 <br>1、短信发送成功与对方手机安全隐私设置相关，因此并不是100%成功，此为正常现象；<br>2、系统发送失败的号码，我们将会退回至短信余额账户；<br>3、涉及诈骗，黄赌毒，反政治言论的短信内容都不会发送成功。最终解释权归畅移（上海）信息科技有限公司所有。

              .field-group
                .field.is-horizontal
                  label.label
                  .field-content
                    a.button.m-r-20(@click="goBack()") 返回
                    a.button.primary(@click="save") 发送
    loading(v-if="is_loading")
</template>

<script>
import { mapGetters } from 'vuex'
import CustomSelect from '@/components/generics/form/CustomSelect'
import CustomInput from '@/components/generics/form/CustomInput'
import SlideOutModal from '@/components/generics/SlideOutModal'
import MessageType from '@/components/draw/modal/MessageType'
import {validationMixin} from 'vuelidate'
import {root} from '@/plugins/Fetch'
import drawApi from '@/mixins/modules/draw'
import Loading from '@/components/generics/Loading'
export default {
  name: 'MessageSend',
  mixins: [drawApi, validationMixin],
  components: {
    CustomSelect,
    CustomInput,
    SlideOutModal,
    MessageType,
    Loading,
  },
  validations: {
    phone: {
      validate (val) {
        if (val === '') {
          return true
        } else {
          return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val)
        }
      },
    },
  },
  data () {
    return {
      root,
      show_mode: false,
      phone_list: [],
      phone: '',
      send_data: {},
      template_type: [],
      template_name: [],
      type: {},
      name: {},
      temp: [],
      key_word: [],
      views: '',
      variable_arr: [],
      count: 0, // 短信总数
      identification: '【壳保养智慧门店】',
      is_loading: false,
      vars_obj: {},   // 关键词 eg: %storeName% ...
    }
  },
  computed: {
    ...mapGetters({
      currentStore: 'currentStore',
    }),
  },
  watch: {
    'type': function (newVal) {
      this.fetchTemplateList(newVal.id)
      this.name = {}
      this.temp = []
      this.views = ''
    },
    'name': function (newVal, oldVal) {
      this.variable_arr = []
      this.temp = []
      if (newVal.content && newVal.content !== '') {
        let str = newVal.content
        // 判断是否是匹配小程序名的短信，并且添加关键字
        if (str.indexOf('%MiniProgramName%') > -1) {
          str = str.replace('%MiniProgramName%', `${this.currentStore.mini_program_name}`)
          this.vars_obj.MiniProgramName = this.currentStore.mini_program_name
        }
        let temp = []
        this.temp = str.split('%')
        this.temp.forEach((v, index) => {
          if ((index + 1) % 2 !== 0) {
            temp.push(v)
          }
        })
        this.views = temp.join('')
        this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
      }
      if (document.getElementsByClassName('smsref') && document.getElementsByClassName('smsref')[0]) {
        document.getElementById('refForm').reset()
      }
    },
    'count': function (newVal) {
      if (newVal.length > 20000) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '因受短信通道限制，单次发送上限最多为20000条，请重新调整客户数量分批次创建发送任务。',
        })
      }
    },
  },
  methods: {
    toggleSidePannel () {
      this.show_mode = !this.show_mode
    },

    // 回车添加手机号码
    enterPhone () {
      if (this.phone === '') return
      if (this.$v.phone.$error) return
      this.phone_list.unshift(this.phone)
      this.phone_list = this.uniq(this.phone_list)
      this.phone = ''
      this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
    },

    // 删除手机号码
    delPhone (index) {
      this.phone_list.splice(index, 1)
      this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
    },

    // input的输入事件
    inputChange (e, index) {
      let arr = []
      if (this.variable_arr.length === 0) {
        // this.variable_arr = this.temp.toString().split(',')
        let str = ''
        this.temp.forEach(v => {
          str = str + v + '【'
        })
        this.variable_arr = str.split('【')
        this.variable_arr.forEach((v, index) => {
          if ((index + 1) % 2 === 0) {
            v = ''
          }
          arr.push(v)
          this.variable_arr = arr
        })
      }
      this.variable_arr[index] = e.target.value
      this.views = this.variable_arr.join('')
      this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
    },

    // 数组去重
    uniq (array) {
      let temp = []
      let index = []
      let l = array.length
      for (let i = 0; i < l; i++) {
        for (let j = i + 1; j < l; j++) {
          if (array[i] - 0 === array[j] - 0) {
            i++
            j = i
          }
        }
        temp.push(array[i])
        index.push(i)
      }
      return temp
    },

    // 清空所有手机号码
    clearAll () {
      this.phone_list = []
      this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
    },

    // 下载模板
    down () {
      window.open(`${this.root}/sms/download`)
    },

    /**
     * 模态框回调的数据 获取推荐客户手机号列表 并且获取手机号码
     * params {Array} 推荐客户分类数组
     */
    async seleckType (params) {
      let data = params
      let allList = []
      data.forEach(ele => {
        allList = [...allList, ...ele.list]
      })
      this.phone_list.push.apply(this.phone_list, allList)  // 合并数组
      this.phone_list = this.uniq(this.phone_list)  // 数组去重
      this.toggleSidePannel()   // 获取数据成功后关掉侧边栏
      this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
    },

    // 导入客户 exportPhoneApi
    async importPhone (event) {
      let file = event.target.files[0]
      this.is_loading = true
      try {
        const {status, data} = await this.exportPhoneApi({
          excel: file,
        })
        if (status === 200 && data.code === 0) {
          if (data.data.notMatchNum !== 0) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '部分手机号不合格',
              content: `该文件包含${data.data.notMatchNum}个不合格手机号，可能存在手机号格式不正确、非手机号、手机号前后含有空格等问题，请调整后重新导入。`,
              isRejectable: 2,
              resolve: () => {
                window.open(`${this.root}/sms/down_fail?redisKey=${data.data.redisKey}`)
              },
            })
          }
          this.phone_list.push.apply(this.phone_list, data.data.result)  // 合并数组
          this.phone_list = this.uniq(this.phone_list)  // 数组去重
          this.count = Math.ceil((this.views.length + this.identification.length) / 70) * this.phone_list.length
          this.is_loading = false
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导入客户失败',
            content: data.message,
          })
          this.is_loading = false
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '导入客户失败',
          content: err,
        })
      }
      this.is_loading = false
      event.target.value = null
    },

    // 获取模板分类 getSmsTemplateApi
    async fetchTemolateType () {
      try {
        const {response, result} = await this.smsTypeApi()
        if (response.status === 200 && result.code === 0) {
          this.template_type = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板分类失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取模板分类失败',
          content: '服务异常，请稍后再试',
        })
      }
    },

    /**
     * 获取模板列表
     * id {Number} 模板分类id
     */
    async fetchTemplateList (id) {
      try {
        const {response, result} = await this.smsListApi({
          template_type_id: id,
          type: 2,
          audit_status: 1,
        })
        if (response.status === 200 && result.code === 0) {
          this.template_name = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取模板列表失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取模板列表失败',
          content: '服务异常，请稍后再试',
        })
      }
    },

    // 保存
    async save () {
      let vars = document.getElementsByClassName('smsref')
      let isPerfect = true
      // this.vars_obj.storeName = `(${this.currentStore.store_name})`
      if (vars.length > 0) {
        for (let i = 0; i < vars.length; i++) {
          this.vars_obj[vars[i].dataset.value] = vars[i].value
          if (vars[i].value === '') {
            isPerfect = false
          }
        }
      }
      this.send_data.vars = this.vars_obj
      if (this.phone_list.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请填入推送目标',
        })
        return false
      }
      if (!this.name.id) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请选择短信模板分类及短信模板名称',
        })
        return false
      }
      if (!isPerfect && vars.length > 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '请填写短信内容',
        })
        return false
      }
      if (this.count > 20000) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '因受短信通道限制，单次发送上限最多为20000条，请重新调整客户数量分批次创建发送任务。',
        })
        return false
      }
      this.send_data.mobile = this.phone_list
      this.send_data.module_category_id = this.type.id
      this.send_data.module_category_name = this.type.name
      this.send_data.module_id = this.name.id
      this.send_data.module_name = this.name.name
      this.send_data.content = this.views
      this.send_data.number_of_bars = Math.ceil((this.views.length + this.identification.length) / 70)
      this.$store.dispatch('showMessage', {
        title: '提示',
        content: `确定给${this.phone_list.length}个号码发送短信消息？`,
        isRejectable: 1,
        resolve: () => {
          this.sendMsm()
        },
      })
    },
    // 发送短信接口函数
    async sendMsm () {
      try {
        const {response, result} = await this.sendMsmApi(this.send_data)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '成功',
            content: '短信发送成功',
          })
        } else if (response.status === 200 && result.code === 190130) {
          let _this = this
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: '你的短信账户余额不足，请立即充值短信',
            primary: '立即充值',
            secondary: '再看看',
            isRejectable: 1,
            resolve: () => {
              _this.$router.push({
                name: 'messagePay',
              })
            },
          })
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '发送短信失败',
            content: result.message,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '发送短信失败',
          content: '服务异常，请稍后再试',
        })
      }
    },
    // 返回
    goBack () {
      this.$router.back()
    },
  },
  mounted () {
    this.fetchTemolateType()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
.form-wrapper .field
  min-width 680px
  font-size 12px
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.clearfix:after{
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden
}
.fl{
  float: left;
}
.fr{
  float: right ;
}
.f-12
  font-size 12px
  color red
.field-content
  width 650px
.section-layout
  height calc(100% - 56px)
  overflow-y auto
.section-setting
  + .section-setting
    margin-top 16px
  background #ffffff
  padding-bottom 24px
.header-wrapper
  height 56px
  align-items center
  border-bottom 1px solid line
.header-title
  font-size 18px
  line-height 24px
  color darker
  position relative
.level-left
  align-items center
.switch-title
  margin-left 8px
  font-size 13px
  line-height 18px
  word-break keep-all
.form-wrapper
  padding 0
  padding-left 24px
  padding-top 32px
  width 280px
  &.disabled
    opacity .5
.field-group
  + .field-group
    margin-top 24px
  + .clear-phone
    margin-top 0
.m-l-20
  margin-left 20px
.check-but
  padding 4px 6px
  cursor pointer
  border 1px solid #dddddd
  border-radius 3px
  color #666
.link
  font-size 12px
  cursor pointer
  color #5E7BFF
  padding 16px 0 0 0
  border none
  margin-left 10px
.link:hover
  text-decoration underline
.phone-input
  width 300px
.p-tip
  font-size 12px
  color #666
  padding 16px 0 0 4px
.border
  width 650px
  height 200px
  overflow-y auto
  border 1px solid #dddddd
  padding 10px
  .phone
    width 120px
    height 26px
    line-height 24px
    border 1px solid #dddddd
    margin-right 10px
    margin-bottom 6px
    .text
      padding-left 4px
      font-size 12px
    .delete-icon
      width 26px
      height 24px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
      background-size 12px
.clear-phone
  .field-content
    padding-top 10px
    color #666
    .clear
      color #5E7BFF
      cursor pointer
    .clear:hover
      text-decoration underline
    .num
      font-size 12px
.moban
  width 250px
  margin-right 10px
.sms
  line-height 20px
.sms>>>input
  width 100px
  border none
  border-bottom 1px solid #dddddd
  font-size 12px
  text-align center
.msg-text
  height 150px
  line-height 1.4
.file
  position relative
.m-r-20
  margin-right 20px
</style>
