<template lang="pug">
  .section-layout
    .nav-back-btn(@click="goBack")
    .content-wrapper
      h2 内容编辑
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 名称
            custom-input(v-model="info.title", maxlength=30, placeholder="请输入内容名称", :validator="$v.info.title", error-info="名称不能为空")
          .field.is-horizontal
            label.label 品牌
            custom-select(v-model="brand", :list="brand_list", nameField="brand_name", :show-search="true")
          .field.is-horizontal
            label.label 封面图
            upload-pic(v-model="info.cover", img-type="info.cover", :img-id="1")
          .field.is-horizontal
            label.label 内容简介
            textarea.textarea(v-model="info.description", maxlength=30, placeholder="内容简介")
          .field.is-horizontal
            label.label 内容
            .control
              rich-editor(v-model="info.content", ref="editor")
              //- u-editor(v-model.sync="info.content" ref="editor")
          .field.is-horizontal
            label.label 关联商品
            a.button.primary(@click="addGoods") 添加关联商品 
          .field.is-horizontal.long-field(v-if='info.product && info.product.length !== 0')
            label.label 
            .content
              .goods-item(v-for='item in info.product')
                .img 
                  img(:src='item.product_pic')
                .pro-name {{item.product_name}}
                .delete-btn(@click='deletePro(item.product_id)') 删除
          .field.is-horizontal
            label.label 关联养护卡
            a.button.primary(@click="addMaintenance") 添加关联养护卡
          .field.is-horizontal.long-field(v-if='info.upkeep && info.upkeep.length !== 0')
            label.label 
            .content
              .goods-item(v-for='(item, cindex) in info.upkeep')
                .img 
                  img(:src='item.image_url')
                .pro-name {{item.name}}
                .delete-btn(@click='deleteMain(cindex)') 删除
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
      choose-goods(v-if='show_choose_goods',v-model="show_choose_goods", @resolve="getContent", :array='info.product')
      choose-maintenance(v-if='show_choose_maintenance',v-model="show_choose_maintenance", @resolve="getMaintenance", :array='info.upkeep')
</template>

<script>
import Api from '@/mixins/modules/Content'
import upLoadApi from '@/mixins/utilities/fileUploader'
import CustomInput from '@/components/generics/form/CustomInput'
import CustomSelect from '@/components/generics/form/CustomSelect'
import uploadImgModel from '@/components/store/modal/uploadImgModel'
import UploadPic from '@/components/generics/form/UploadPic'
import RichEditor from '@/components/generics/form/RichEditor'
// import UEditor from '@/components/generics/form/UEditor'
import {validationMixin} from 'vuelidate'
import {required} from 'vuelidate/lib/validators'
import Utils from '@/mixins/utilities/utils'
import BossApi from '@/mixins/modules/boss'
import ChooseGoods from '@/components/content/modal/ChooseGoods'
import ChooseMaintenance from '@/components/content/modal/ChooseMaintenance'

/**
 * @vue
 */
export default {
  name: 'ContentCreate',
  mixins: [validationMixin, Api, BossApi, upLoadApi, Utils],
  components: {
    CustomInput,
    CustomSelect,
    uploadImgModel,
    UploadPic,
    RichEditor,
    ChooseGoods,
    ChooseMaintenance,
    // UEditor,
  },
  data () {
    return {
      info: {
        id: '',
        title: '',
        brand_id: '',
        brand_name: '',
        cover: '',
        description: '',
        content: '',
        product: [],
        upkeep: []
      },
      brand: null,
      show_choose_goods: false,
      show_choose_maintenance: false,
      brand_list: [],
    }
  },
  computed: {
  },
  watch: {
    brand: function (val) {
      this.info.brand_id = val.brand_id
      this.info.brand_name = val.brand_name
    },
    'info.title': function (val, oldval) {
      this.info.title = val.trim()
    },
    'info.description': function (val, oldval) {
      this.info.description = val.trim()
    },
    'info.content': function (val, oldval) {
      this.info.content = val.trim()
    },
  },
  methods: {
    // 返回
    goBack () {
      this.$router.push({
        name: 'contentList',
      })
    },
    // 获取品牌列表
    async getBrandList () {
      try {
        const {response, result} = await this.brandList({
          is_page: 2,
          source_type: 1,
        })
        if (response.status === 200) {
          this.brand_list = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取品牌列表出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 获取详情
    async getInfo () {
      try {
        const {response, result} = await this.ContentDetailApi({
          id: this.info.id,
        })
        if (response.status === 200) {
          this.info = result.data
          this.brand = {
            brand_id: result.data.brand_id,
            brand_name: result.data.brand_name,
          }
          this.info.product = [...result.data.product]
          this.$refs.editor.info(result.data.content)
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取详情出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取品牌列表失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    // 验证数据
    validateData () {
      let _this = this
      let pass = true
      if (!_this.info.brand_id) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: ' 品牌不能不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.cover) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '封面图不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.description) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '内容描述不能为空',
        })
        pass = false
        return pass
      }
      if (!_this.info.content) {
        _this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '内容不能为空',
        })
        pass = false
        return pass
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
        const {response, result} = await _this.ContentUpdateApi(_this.info)
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                // 返回上一级
                this.$router.replace({
                  name: 'contentList',
                  query: {
                    save: 1,
                  },
                })
              },
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存内容出错',
              content: `${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存内容出错',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '保存内容出错',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
    /**
     * 删除关联商品
     * @id 要删除的关联商品的id
     */
    deletePro (id) {
      this.info.product.splice(this.info.product.findIndex(item => item.product_id === id), 1)
    },
    /**
     * 删除关联养护卡
     * @id 要删除的关联商品的下标
     */
    deleteMain (index) {
      this.info.upkeep.splice(index, 1)
      this.$forceUpdate()
    },
    // 添加关联商品
    addGoods () {
      this.show_choose_goods = true
    },
    // 添加关联养护卡
    addMaintenance () {
      this.show_choose_maintenance = true
    },
    // 回调商品
    getContent (params, id) {
      this.info.product = params
    },
    // 回调养护卡
    getMaintenance (params) {
      this.info.upkeep = params
    },
  },
  mounted () {
    this.info.id = this.$route.query.id
    this.getBrandList()
    this.getInfo()
  },
  validations: {
    info: {
      title: {
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
.long-field
  width 750px !important
.goods-item
  border: 1px solid #c2c2c2
  padding 8px 10px
  border-radius 5px
  float left 
  margin-right 15px
  display flex
  justify-content space-between
  align-items center
  width 300px
  margin-bottom 10px
  .img
    width 50px
    height 50px
    img
      width 100%
      height 100%
  .pro-name
    font-size 13px
    width 180px
    color #333
  .delete-btn
    cursor pointer
    font-size 13px
    color red
</style>
