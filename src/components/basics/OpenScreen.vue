<template lang="pug">
  .section-layout
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if='openScreenList.length !== 0')
      .table-wrapper
        table.table
          thead
            tr
              td(width="100") 图片
              td(width="150") 名称
              td(width="100") 启/停用
              td(width="130") 跳转类型
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in openScreenList")
              td
                .simple-image
                  upload-pic.upload-pic-style(v-model="item.pic", img-type="item.pic",:img-id="index", is-original=true)
              td
                .cuselct
                  custom-input(v-model="item.title", placeholder="请输入名称", :validator="$v.openScreenList.$each[index].title", error-info="名称必填")
              td.set-lock
                .switch
                  input(type="checkbox", :id="index", v-model="item.lock", @change="isEnabel(item)")
                  label(:for="index")
              td
                .simple-td(v-if="item.value_type === 1") 商品信息
                .simple-td(v-if="item.value_type === 2") 服务信息
                .simple-td(v-if="item.value_type === 3") 商品分类
                .simple-td(v-if="item.value_type === 4") 服务分类
                .simple-td(v-if="item.value_type === 5") 平台内容
                .simple-td(v-if="item.value_type === 6") 品牌馆
                .simple-td(v-if="item.value_type === 7") 评论
                .simple-td(v-if="item.value_type === 8") 抽奖
                .simple-td(v-if="item.value_type === 9") 商品分类列表
                .simple-td(v-if="item.value_type === 10") 服务分类列表
                .simple-td(v-if="item.value_type === 12") 敬请期待
                .simple-td(v-if="item.value_type === 13") 智能保养
                .simple-td(v-if="item.value_type === 14") 空跳转
                .simple-td(v-if="item.value_type === 15") 注册
              td
                .operation-td
                  a.operation-link.left(@click="openSetting(index, item.id)") 设置
                    ul.setting-block(v-if="item.setting_block === true")
                      li(v-for="setItem in set_list", @click.stop="goSettingBlock(setItem.type, index)", v-text="setItem.name")
                  a.operation-link(@click="deleteItem(index)") 删除
    // 空页面
    empty-page(v-if="is_empty && openScreenList.length === 0", tip="当前没有开机大屏")
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    choose-product(v-model="show_product", v-if="show_product", :id="setting_id", @resolve="getProduct")
    choose-service(v-model="show_service", v-if="show_service", :id="setting_id", @resolve="getService")
    first-product-category(v-model="pro_fir_cate", v-if="pro_fir_cate", @resolve="getProFirCate", :id="setting_id")
    second-product-category(v-model="pro_sec_cate", v-if="pro_sec_cate", @resolve="getProSecCate", :id="setting_id")
    first-service-category(v-model="ser_fir_cate", v-if="ser_fir_cate", @resolve="getSerFirCate", :id="setting_id")
    second-service-category(v-model="ser_sec_cate", v-if="ser_sec_cate", @resolve="getSerSecCate", :id="setting_id")
    choose-brand(v-model="show_brand", v-if="show_brand", :id="setting_id", @resolve="getBrand")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", :id="setting_id", @resolve="getContent")
    choose-lottery(v-model="choose_lottery", v-if="choose_lottery", @resolve="getChooseLottery", :id="setting_id")
</template>

<script>
// 品牌
import ChooseBrand from '@/components/basics/modal/ChooseBrand'
// 商品分类
import FirstProductCategory from '@/components/basics/modal/FirstProductCategory'
// 商品分类列表
import SecondProductCategory from '@/components/basics/modal/SecondProductCategory'
// 服务分类
import FirstServiceCategory from '@/components/basics/modal/FirstServiceCategory'
// 服务分类列表
import SecondServiceCategory from '@/components/basics/modal/SecondServiceCategory'
// 商品信息
import ChooseProduct from '@/components/basics/modal/ChooseProduct'
// 服务信息
import ChooseService from '@/components/basics/modal/ChooseService'
// 抽奖
import ChooseLottery from '@/components/basics/modal/ChooseLottery'
// 内容
import ChoosePlatformContent from '@/components/basics/modal/ChoosePlatformContent'
import ServiceTab from '@/components/generics/ServiceTab'
import EmptyPage from '@/components/generics/EmptyPage'  // 空页面组件
import UploadPic from '@/components/generics/form/UploadPic'    // 图片上传组建
import filterTools from '@/mixins/utilities/filterTools'
import CustomInput from '@/components/generics/form/CustomInput'
import AdminApi from '@/mixins/modules/basics'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { wordLength } from '@/mixins/custom-validators/custom-validators'
export default {
  name: 'BannersPage',
  mixins: [AdminApi, filterTools, validationMixin],
  components: {
    ServiceTab,
    EmptyPage,
    UploadPic,
    FirstProductCategory,
    SecondProductCategory,
    FirstServiceCategory,
    SecondServiceCategory,
    ChooseBrand,
    ChooseProduct,
    ChooseService,
    ChoosePlatformContent,
    ChooseLottery,
    CustomInput,
  },
  data () {
    return {
      title: '轮播图',
      setting_id: '',
      show_brand: false,      // 控制品牌馆显隐
      pro_fir_cate: false,    // 控制选择商品分类项显隐
      pro_sec_cate: false,    // 控制选择商品分类列表显隐
      ser_fir_cate: false,     // 控制选择服务分类项显隐
      ser_sec_cate: false,    // 控制选择服务分类列表显隐
      show_product: false,    // 控制商品显隐
      show_service: false,    // 控制服务显隐
      show_platform_content: false,     // 控制内容显隐
      choose_lottery: false,    // 控制抽奖显隐
      openScreenList: [],
      is_empty: false,
      set_list: [
        // {
        //   name: '注册',
        //   type: 15,
        // },
        {
          name: '商品信息',
          type: 1,
        },
        {
          name: '服务信息',
          type: 2,
        },
        {
          name: '商品分类',
          type: 3,
        },
        {
          name: '服务分类',
          type: 4,
        },
        {
          name: '平台内容',
          type: 5,
        },
        {
          name: '品牌馆',
          type: 6,
        },
        {
          name: '评论',
          type: 7,
        },
        // {
        //   name: '抽奖',
        //   type: 8,
        // },
        {
          name: '商品分类列表',
          type: 9,
        },
        {
          name: '服务分类列表',
          type: 10,
        },
        // {
        //   name: '敬请期待',
        //   type: 12,
        // },
        {
          name: '智能保养',
          type: 13,
        },
        {
          name: '不跳转',
          type: 14,
        },
      ],
    }
  },
  validations: {
    openScreenList: {
      $each: {
        title: {
          required,
          validate (val) {
            return this.wordLength(val) <= 20
          },
        },
      },
    },
  },
  methods: {
    wordLength,
    // 添加内容
    addItem () {
      this.openScreenList.forEach(function (item) {
        item.setting_block = false
      })
      let id = 1
      if (this.openScreenList.length > 0) {
        // id = Number(this.bannerList[0].id) - 1
        this.openScreenList.map(item => {
          id += Math.abs(Number(item.id))
        })
      }
      let obj = {
        id: 0 - id,
        pic: '',
        value_type: '',
        value_content: {},
        setting_block: false,
      }
      this.openScreenList.unshift(obj)
    },
    // 是否启用
    async isEnabel (item) {
      let tmp = JSON.parse(JSON.stringify(this.openScreenList))
      tmp.map(li => {
        if (li.id !== item.id) {
          li.lock = false
        }
      })
      this.openScreenList = tmp
      if (item.id > 0) {
        try {
          const { response, result } = await this.lockOpenScreen({
            id: Number(item.id),
            status: item.lock ? 2 : 1,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              if (!item.lock) {
                this.$store.dispatch('showMessage', {
                  autoClose: true, // 控制弹框自动消失
                  type: 'success',
                  title: '解锁成功',
                })
              } else {
                this.$store.dispatch('showMessage', {
                  autoClose: true, // 控制弹框自动消失
                  type: 'success',
                  title: '锁定成功',
                })
              }
            } else {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'failure',
                title: '轮播图失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'failure',
              title: '轮播图失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'failure',
            title: '轮播图失败',
            content: `错误：${err}`,
          })
        }
      }
    },
    /**
     * 设置
     * @ item
     */
    openSetting (index, id) {
      this.openScreenList.forEach(function (item) {
        if (item.id === id) {
          item.setting_block = !item.setting_block
        } else {
          item.setting_block = false
        }
      })
      this.setting_id = id
    },
    /**
     * 选择设置项
     * @ item
     */
    goSettingBlock (type, index) {
      switch (type) {
        case 1: // 商品信息
          this.show_product = true
          break
        case 2: // 服务信息
          this.show_service = true
          break
        case 3: // 商品分类
          this.pro_fir_cate = true
          break
        case 4: // 服务分类
          this.ser_fir_cate = true
          break
        case 5: // 平台内容
          this.show_platform_content = true
          break
        case 6: // 品牌馆
          this.show_brand = true
          break
        case 8: // 抽奖
          this.choose_lottery = true
          break
        case 9: // 商品分类列表
          this.pro_sec_cate = true
          break
        case 10: // 服务分类列表
          this.ser_sec_cate = true
          break
      }
      this.openScreenList.forEach(function (item) {
        item.setting_block = false
      })
      // 评论 && 敬请期待 && 注册 && 不跳转 && 智能保养
      if (type === 7 || type === 12 || type === 15 || type === 13 || type === 14) {
        this.openScreenList[index].value_type = type
      }
    },
    /**
     * 删除 item
     * @index {int} 序列号
     */
    deleteItem (index) {
      this.openScreenList.splice(index, 1)
    },
    // 保存数据
    saveData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      this.openScreenList.forEach(item => {
        item.setting_block = false
      })
      // if (this.openScreenList.length === 0) {
      //   this.$store.dispatch('showMessage', {
      //     type: 'failure',
      //     title: '提示',
      //     content: '请添加开屏设置',
      //   })
      //   return
      // }
      let isImg = false
      this.openScreenList.forEach(item => {
        if (!item.pic) {
          isImg = true
        }
      })
      if (isImg) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '图片必填',
        })
        return
      }
      let isType = false
      this.openScreenList.forEach(item => {
        if (!item.value_type) {
          isType = true
        }
      })
      if (isType) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: '跳转类型必填',
        })
        return
      }
      this.saveOpenScreenData()
    },
    // 保存接口
    async saveOpenScreenData () {
      let params = []
      this.openScreenList.forEach(item => {
        let obj = {}
        obj.image_url = item.pic
        obj.jump_name = item.title
        obj.jump_type = Number(item.value_type)
        obj.jump_value = JSON.stringify(item.value_content)
        obj.status = item.lock ? 2 : 1
        params.push(obj)
      })
      try {
        const { result, response } = await this.doSaveOpenScreen({
          data: params,
        })
        if (response.status === 200) {
          if (result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '保存成功',
              resolve: () => {
                // 返回上一级
                // this.$router.go(-1)
              },
            })
            this.getOpenScreenList()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '保存失败',
              content: `出错啦！错误码：${result.message}`,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存失败',
            content: '创建发生错误，请稍后再试',
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
    // 获取轮播图列表
    async getOpenScreenList () {
      try {
        const { response, result } = await this.fetchOpenScreenList()
        this.is_empty = true
        if (response.status === 200) {
          if (result.code === 0) {
            this.openScreenList = result.data.map(item => {
              // 重新赋值
              item.setting_block = false
              item.pic = item.image_url
              item.title = item.jump_name
              item.value_type = Number(item.jump_type)
              item.value_content = JSON.parse(item.jump_value)
              item.status === 1 ? item.lock = false : item.lock = true
              return item
            })
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取开屏列表出错',
              content: result.message,
            })
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取开屏列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取开屏列表失败',
          content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
        })
      }
    },
    /**
   * 选择商品弹框的回调处理
   * @param {Object} 已选商品的数据
   * @id {Number, String} 触发该弹框的id
   */
    getProduct (params, id) {
      let arr = {
        id: params.product_id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          // item.pic = params.product_pic
          item.value_content = arr
          item.value_type = 1
        }
      })
    },
    /**
   * 选择服务弹框的回调处理
   * @param {Object} 已选服务的数据
   * @id {Number, String} 触发该弹框的id
   */
    getService (params, id) {
      let arr = {
        id: params.product_id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          // item.pic = params.product_pic
          item.value_content = arr
          item.value_type = 2
        }
      })
    },
    /**
     * 选择品牌馆弹框的回调处理
     * @param {Object} 已选品牌馆的数据
     * @id {Number, String} 触发该弹框的id
     */
    getBrand (params, id) {
      let arr = {
        id: params.id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          // item.pic = params.cover
          item.value_content = arr
          item.value_type = 6
        }
      })
    },
    /**
     * 选择商品分类项数据（只获取一级分类）弹框的回调处理
     * @param {Object} 已选分类的数据
     * @id {Number, String} 触发该弹框的id
     */
    getProFirCate (params, id) {
      let arr = {
        id: params.category_id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 3
        }
      })
    },
    /**
     * 选择商品分类列表数据（获取一二级分类）弹框的回调处理
     * @param {Object} 已选分类的数据
     * @id {Number, String} 触发该弹框的id
     */
    getProSecCate (params, id) {
      let arr = {
        category_id: 0,
        parent_id: 0,
      }
      if (params.level === 2) {
        arr.category_id = params.category_id
      }
      if (params.level === 1) {
        arr.parent_id = params.category_id
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 9
        }
      })
    },
    /**
     * 选择服务分类项数据（只获取一级分类）弹框的回调处理
     * @param {Object} 已选分类的数据
     * @id {Number, String} 触发该弹框的id
     */
    getSerFirCate (params, id) {
      let arr = {
        id: params.category_id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 4
        }
      })
    },
    /**
     * 获取服务分类列表数据（获取一二级分类）
     * @param {Object} 已选分类的数据
     * @id {Number, String} 触发该弹框的id
     */
    getSerSecCate (params, id) {
      let arr = {
        category_id: 0,
        parent_id: 0,
      }
      if (params.level === 2) {
        arr.category_id = params.category_id
      }
      if (params.level === 1) {
        arr.parent_id = params.category_id
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 10
        }
      })
    },
    /**
   * 获取抽奖数据回调处理
   * @param {Object} 已选数据
   * @id {Number, String} 第二参数
   */
    getChooseLottery (params, id) {
      let arr = {
        id: params.activity_id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          item.value_content = arr
          item.value_type = 8
        }
      })
    },
    /**
   * 选择内容弹框的回调处理
   * @param {Object} 已选内容的数据
   * @id {Number, String} 触发该弹框的id
   */
    getContent (params, id) {
      let arr = {
        id: params.id,
      }
      this.openScreenList.forEach(item => {
        if (item.id === id) {
          // item.pic = params.cover
          item.value_content = arr
          item.value_type = 5
        }
      })
    },
  },
  mounted () {
    this.getOpenScreenList()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal';

.section-layout {
  height: calc(100% - 48px);
}

.table-data {
  height: calc(100% - 90px) !important;
}

.content-wrapper {
  background: initial;
  margin-top: 0;
  margin-bottom: 0;
  height: calc(100% - 90px);
}

.section-filter-none.is-horizontal {
  height: 0;
  padding: 0;
}

.empty-page-wrapper {
  padding: 30px 0;
}

.simple-image .upload-pic.is-normal {
  width: 200px;
  height: 113px;
  background-color: gray;
  display: block;
}

.section-filter .add-button {
  bottom: initial;
}

.up, .down {
  position: absolute;
  top: 55px;
  width: 20px;
  height: 30px;
  opacity: 0.5;
  cursor: pointer;

  &.is-disable {
    opacity: 0.2;
    pointer-events: none;
  }

  &:hover {
    opacity: 1;
  }
}

.up {
  left: 0;
  background: center no-repeat url('~@/assets/icons/move-up.svg');
  background-size: 20px 30px;
}

.down {
  left: 25px;
  background: center no-repeat url('~@/assets/icons/move-down.svg');
  background-size: 20px 30px;
}

.btn-wrapper {
  text-align: right;
  position: fixed;
  bottom: 40px;
  right: 0;
  padding: 23px 40px 0;
}

.setting-block {
  position: absolute;
  top: 15px;
  left: 28px;
  height: calc(100% - 10px);
  overflow-y: auto;
  background: #f0f1f2;
  width: 100px;
  z-index: 3;
  box-sizing: border-box;
  border-radius: 2px;

  li {
    color: #999;
    padding: 10px;
    line-height: 12px;
    font-size: 12px;
  }

  li:hover {
    background: #ffc723;
    color: white;
  }
}

.simple-td, .operation-td {
  margin-top: 38px;
}

.set-lock {
  padding-top: 50px;
}

.cuselct {
  width: 60%;
  margin-top: 40px;
}
</style>


