<!--选择商品分类项-->
<template lang="pug">
  modal-dialog(modal-scale="large")
    .modal-card(slot="card")
      .modal-header
        .modal-card-title(v-if="all === 'all'") 新增参数
        .modal-card-title(v-if="all === 'on'") 选择参数
        .close-button(@click="modalClose")
      .modal-body(v-if="all === 'all'")
        .modal-header
          input(type="text" placeholder="请输入属性值" v-model.trim="input_text" class="input" @keyup.enter="addAttr(attr_items)")
          button.button.large.primary.reset(v-text="'添加'" @click="addAttr(attr_items)")
        .modal-box
          .checkbox(v-for="(attr, index) in all_list")
            input(type="checkbox", :id="index+'n'", v-model.trim="attr.is_check", maxlength="20")
            label(:for="index+'n'", v-text="attr.attribute_item_value")
      .modal-body(v-if="all === 'on'")
        .modal-box
          .checkbox(v-for="(attr, index) in list")
            input(type="checkbox", :id="index+'n'", v-model.trim="attr.is_check", maxlength="20")
            label(:for="index+'n'", v-text="attr.attribute_item_value")
      .modal-footer.level
        .level-left
        .level-right
          a.button.large(@click="modalClose") 取消
          a.button.large.primary(@click="complete") 确定
</template>

<script>
  import ModalDialog from '@/components/generics/ModalDialog'
  import ModalInteractions from '@/mixins/utilities/modalInteractions'
  import BossMixin from '@/mixins/modules/boss'

  export default {
    name: 'SecondProductCategory',
    components: {
      ModalDialog,
    },
    mixins: [BossMixin, ModalInteractions],
    props: {
      sku: {
        type: [String],
      },
      all: {
        type: [String],
      },
      category_id: {
        type: [String, Number],
      },
    },
    data () {
      return {
        attr_items: {},      // 给父组件传递的回调数据
        is_initiated: true,
        list: [],
        all_list: [],
        attribute_id: '',
        input_text: '',
      }
    },
    methods: {
      /**
       * 添加属性值
       * @param {obj} item传入当前需操作的对象
       * @param {obj} e回车事件targit
       */
      addAttr (item) {
        let _this = this
        if (_this.input_text === '') return
        let isSave = false
        // 检测现在添加的数据是否在原有数据中
        item.attribute_items.forEach(cell => {
          if (cell.attribute_item_value === _this.input_text) {
            isSave = true
          }
        })
        // 检测现在添加的数据是否在现有数组中
        this.all_list.forEach(cell => {
          if (cell.attribute_item_value === _this.input_text) {
            isSave = true
          }
        })
        if (isSave) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '属性已经存在',
          })
          _this.input_text = ''
          return
        }
        let newAttr = {}
        newAttr.attribute_item_value = _this.input_text
        newAttr.is_used = 0
        newAttr.is_edit = false
        newAttr.is_check = true
        _this.all_list.push(newAttr)
        _this.input_text = ''
      },

      // 完成
      complete () {
        if (this.all_list.length > 0) {
          this.all_list.forEach(v => {
            this.list.push(v)
          })
        }
        let tempArr = []
        this.list.map(v => {
          if (v.is_check) {
            tempArr.push(v)
          }
        })
        this.attr_items.attribute_items = tempArr
        this.modalResolve(this.attr_items)
      },

      // 请求全部中的sku值
      async fetchData () {
        let _this = this
        try {
          const {response, result} = await this.classifyAttrList({'category_id': this.category_id})
          if (response.status === 200) {
            if (result.data.length > 0) {
              result.data.forEach(v => {
                if (v.attribute_name === _this.attr_items.attribute_name) {
                  _this.attr_items.attribute_id = v.attribute_id
                  _this.list = v.attribute_items
                  v.attribute_items.forEach(v1 => {
                    v1.is_check = false
                    _this.attr_items.attribute_items.forEach(v2 => {
                      if (v1.attribute_item_id === v2.attribute_item_id) {
                        v1.is_check = true
                      }
                    })
                  })
                }
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取品牌列表出错',
              content: response.status,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表失败',
            content: err,
          })
        }
      },
    },
    mounted () {
      this.attr_items = JSON.parse(this.sku)
      if (this.all === 'on') {
        this.fetchData()
      } else {
        this.list = this.attr_items.attribute_items
      }
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .modal-header
    padding 20px 24px
  .modal-footer
    padding 12px 16px
  .modal-body
    position relative
    height 420px
    display flex
    flex-direction column
    padding-bottom 36px
    overflow-y auto
  .tfoot
    z-index 3
  .modal-box
    padding-right 20px
  .checkbox
    margin-top 10px
    margin-left 20px
  .input
    width 270px
  .button.large.primary.reset
    height 32px
    line-height 32px
    margin-left 20px
</style>
