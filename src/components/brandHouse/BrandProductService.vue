<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 品牌商品服务设置
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 品牌服务
            custom-input(v-model="info.product_title", maxlength=15, placeholder="请输入标题名称", :validator="$v.info.product_title", error-info="标题名称不能为空",)
          .field.is-horizontal
            label.label 商品服务设置
            .br-content
              .field-group(v-for="(item, index) in info.data")
                .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                .down(v-if="index !== info.data.length-1", @click="sortItem(index, 'down')")
                .delete(@click="deleteItem(index)")
                .field.is-horizontal
                  label.label 商品服务
                  .control
                    .chose-item(v-if="item.item")
                      img.img(:src="item.item.product_pic")
                      span(v-text="item.item.product_name")
                    .button(@click="openModal(item, index)") 选择商品
                .field.is-horizontal
                  label.label 封面图
                  upload-pic(v-model="item.product_cover", img-type="item.product_cover", :img-id="index")
              .button(@click="addItem") 添加内容
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
      choose-modal(v-model="item_info", v-if="show_modal", @callback="selectedSuccess")
</template>

<script>
import Api from '@/mixins/modules/BrandHouse'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import UploadPic from '@/components/generics/form/UploadPic'
import RichEditor from '@/components/generics/form/RichEditor'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import ChooseModal from '@/components/brandHouse/modal/ChooseModal'

/**
 * @vue
 */
export default {
  name: 'StoreCreate',
  mixins: [validationMixin, Api, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    uploadImgModel,
    UploadPic,
    RichEditor,
    ChooseModal,
  },
  data () {
    return {
      info: {
        product_title: '品牌套餐',
        brand_house_id: '',
        data: [],
      },
      selected_item_index: 0,
      item_info: null, // modal 选中服务|商品
      show_modal: false, // 显隐
    }
  },
  computed: {
  },
  methods: {
    // 返回
    goBack () {
      this.$router.push({
        name: 'brandHouseList',
      })
    },
    // 获取数据详情
    async getDataInfo () {
      try {
        const {response, result} = await this.getHouseProducts({
          brand_house_id: this.info.brand_house_id,
        })
        if (response.status === 200 && result.code === 0) {
          this.info.product_title = result.data.product_title
          this.info.data = result.data.list
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取内容出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取内容失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 添加内容
    addItem () {
      let obj = {
        item: null,
        product_id: '',
        product_cover: '', // 封面
      }
      this.info.data.push(obj)
    },
    /**
     * 删除 item
     * @index {int} 序列号
     */
    deleteItem (index) {
      this.info.data.splice(index, 1)
    },
    /**
     * 排序
     * @index {int} 序列号
     * @type {string} up or down
     */
    sortItem (index, type) {
      let arr = [...this.info.data]
      this.info.data = []
      let temp = arr[index]
      // 向上移动
      if (type === 'up') {
        arr[index] = arr[index - 1]
        arr[index - 1] = temp
      }
      // 向下移动
      if (type === 'down') {
        arr[index] = arr[index + 1]
        arr[index + 1] = temp
      }
      this.info.data = [...arr]
    },

    /**
     * 打开modal
     * @item {object} 选中的商品|服务对象
     * @index {int} 选中的 index
     */
    openModal (item, index) {
      this.item_info = item
      this.selected_item_index = index
      this.toggleModal()
    },
    /**
     * 选中商品后，隐藏 modal
     * @item {object} 选中的商品|服务对象
    */
    selectedSuccess (item) {
      if (item) {
        let obj = {
          product_pic: item.product_pic,
          product_name: item.product_name,
        }
        this.info.data[this.selected_item_index].item = obj
        this.info.data[this.selected_item_index].product_id = item.product_id
      }
      this.toggleModal()
    },
    // 显示隐藏 modal
    toggleModal () {
      this.show_modal = !this.show_modal
    },
    // 验证数据
    validateData () {
      let _this = this
      let pass = true
      // if (!_this.info.data || !_this.info.data.length) {
      //   _this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '商品服务设置不能为空',
      //     content: '商品服务设置不能为空',
      //   })
      //   pass = false
      //   return pass
      // }
      for (let i = 0; i < _this.info.data.length; i++) {
        let item = _this.info.data[i]
        if (!item.product_id) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品服务不能为空',
            content: '商品服务不能为空',
          })
          pass = false
          return
        }
        if (!item.product_cover) {
          _this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '商品服务封面图不能为空',
            content: '商品服务封面图不能为空',
          })
          pass = false
          return
        }
      }
      return pass
    },
    // 保存数据
    async saveData () {
      let _this = this
      _this.$v.$touch()
      if (_this.$v.$error) return
      // 验证数据
      let res = this.validateData()
      if (!res) {
        return false
      }

      try {
        const {response, result} = await _this.saveHouseProducts(_this.info)
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '保存成功',
            resolve: () => {
              // 返回上一级
              this.$router.go(-1)
            },
          })
          // this.goBack()
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    // 获取服务列表
    this.info.brand_house_id = this.$route.query.brand_id
    this.getDataInfo()
  },
  validations: {
    info: {
      product_title: {
        required,
      },
    },
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.nav-back-btn
  position absolute
  top 36px
  left 16px
  width 32px
  height 32px
  border-radius 100%
  background #CED3DC center no-repeat url('~@/assets/back.svg')
  background-size 16px
  box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
  cursor pointer
  z-index 2
label.label
  font-size 13px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.form-wrapper .field
  width 520px
.form-wrapper .field.full-width
  width 100%

.br-content
  display flex
  flex-direction: column
  .field-group
    position relative
    margin-bottom 15px
    background #f6f6f6
    padding-left: 40px
    padding-right: 60px
  .button
    width 150px
.up
.down
  position absolute
  right -14px
  width 14px
  height 14px
  opacity .5
  cursor pointer
  &.is-disable
    opacity .2
    pointer-events none
  &:hover
    opacity 1
.up
  top 0
  background center no-repeat url('~@/assets/icons/move-up.svg')
.down
  top 14px
  background center no-repeat url('~@/assets/icons/move-down.svg')
.delete
  position absolute
  top 8px
  right 8px
  width 16px
  height 16px
  background center no-repeat url('~@/assets/icons/trash.svg')
  cursor pointer
.chose-item
  padding-bottom 15px
  .img
    width 32px
    height 32px
    margin-right 10px
    vertical-align middle
  span
    font-size 14px
    line-height 32px
</style>
