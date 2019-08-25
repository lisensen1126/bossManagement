<template lang="pug">
  .section-layout.content-box
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if="tips_list && tips_list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="200") 序号
              td(width="240") 小贴士内容
              td(width="200") 操作
          tbody(v-if="tips_list.length")
            tr(v-for="(item, index) in tips_list")
              td
                .simple-td {{index+1}}
              td
                .cuselct
                  custom-input(v-model.trim="item.content", placeholder="请输入小贴士内容", :validator="$v.tips_list.$each[index].content", error-info="小贴士内容必填且在16字以内")
              td
                .operation-td
                  a.operation-link(@click="deleteItem(index)")  删除
          .tfoot(v-if="tips_list.length")
    empty-page(v-if="tips_list.length<=0  && show_page", :tip="'当前没有小贴士'")
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
</template>

<script>
  import ImageScale from '@/mixins/utilities/imageScale'
  import EmptyPage from '@/components/generics/EmptyPage'
  import UploadPic from '@/components/generics/form/UploadPic'
  import AdminApi from '@/mixins/modules/basics'
  import { validationMixin } from 'vuelidate'
  import CustomInput from '@/components/generics/form/CustomInput'
  import { required } from 'vuelidate/lib/validators'
  import { wordLength } from '@/mixins/custom-validators/custom-validators'

  export default {
    name: 'tips',

    data () {
      return {
        tip_content: '哈哈',
        // 默认图片
        default_img_src: '',
        // 选择弹窗展示隐藏
        show_product: false,
        show_service: false,
        tips_list: [],
        // 当前项下标
        current_index: 0,
        // 当前项
        current_item: {},
        // 缺省页显示
        show_page: false,
        isEdit: 1, // 添加-修改
      }
    },
    mixins: [ImageScale, AdminApi],
    components: {
      EmptyPage,
      UploadPic,
      CustomInput,
    },
    validations: {
      tips_list: {
        $each: {
          content: {
            required,
            validate (val) {
              return this.wordLength(val) <= 16
            },
          },
        },
      },
    },
    // 业务代码
    methods: {
      wordLength,
      /**
       * 获取小贴士列表
       * @returns {Promise<void>}
       */
      async fetchData () {
        try {
          const {response, result} = await this.fetchTipListApi()
          if (response.status === 200 && result.code === 0) {
            this.tips_list = result.data
            this.show_page = true
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取小贴士列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
            this.show_page = false
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取小贴士列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
          this.show_page = false
        }
      },

      /**
       * 新增小贴士
       * @index {int} 序列号
       * @type {string} up or down
       */
      addItem () {
        if (this.tips_list.length > 7) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '最多添加8条小贴士',
          })
          return
        }
        let arr = [...this.tips_list]
        this.tips_list = []
        arr.push({
          content: '',
          id: '',
        })
        this.tips_list = [...arr]
      },
      /**
       * 删除小贴士
       * @ item  品牌馆对象
       */
      deleteItem (index) {
        this.tips_list.splice(index, 1)
      },
      /**
       * 保存操作
       * */
      async saveData () {
        let self = this
        let isCanSave = true
        self.$v.$touch()
        if (self.$v.$error) return
        self.tips_list.forEach(function (e, i) {
          if (!e.content) {
            isCanSave = false
          }
        })
        if (!isCanSave) {
          self.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '数据不合法',
          })
          return false
        }
        let params = []
        self.tips_list.forEach(function (item) {
          if (item.content) {
            params.push({
              id: item.id,
              content: item.content,
            })
          }
        })
        try {
          const {response, result} = await this.saveTipListApi({ data: params })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => this.$emit('success'),
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: `错误：${err}`,
          })
        }
      },
    },
    // 生命周期函数，置于代码底部
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .list-wrapper
    padding-bottom 120px!important
  .section-filter-none.is-horizontal
    height 0
    padding 0
  .section-filter .add-button
    bottom initial
  .section-layout
    position relative
    .add-button
      z-index 3
      position absolute
      right 40px
      top 0!important
  .operation-link
    position relative
  .setting-block
    position absolute
    top: 6px
    left 32px
    background #f0f1f2
    z-index 1000
    width 70px
    box-sizing border-box
    border-radius 2px
    li
      color: #999
      padding 10px
      line-height 12px
      font-size 12px
    li:hover
      background #ffc723
      color: white
  .content-box
    height: calc(100% - 48px)
  .cover-img img
    height 102px
  .section-filter
    display flex
    justify-content space-between
  .name_keyword-wrapper
    width 244px
  .button
    align-items center
  .give-icon
    display none
  .left
    margin-right 10px !important
  .add-icon
    display inline-flex
    width 16px
    height 16px
    background url('~@/assets/icons/button-add.svg') no-repeat center center
    background-size cover
    margin-right 6px
  .gray
    color #989ba1
  .justify-center
    justify-content center
  .operation-link
    margin-right 0
  .text-overflow
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  table td
    vertical-align middle
  .tr-p
    position relative
    .up
    .down
      position absolute
      top 40px
      width 20px
      height 30px
      opacity .5
      cursor pointer
      &.is-disable
        opacity .2
        pointer-events none
      &:hover
        opacity 1
    .up
      left 0
      background center no-repeat url('~@/assets/icons/move-up.svg')
      background-size 20px 30px
    .down
      left 25px
      background center no-repeat url('~@/assets/icons/move-down.svg')
      background-size 20px 30px
    .delete
      position absolute
      top 8px
      right 8px
      width 16px
      height 16px
      background center no-repeat url('~@/assets/icons/trash.svg')
      cursor pointer
  .btn-wrapper
    margin-top 20px
    padding-right 70px
    text-align right
    .large
      width 120px
  .btn-wrapper
    text-align right
    position fixed
    bottom 40px
    right 0
    padding 23px 40px 0
  .cuselct {
    width: 60%;
  }
</style>


