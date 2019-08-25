<template lang="pug">
  .section-layout
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(cell, index) in list")
              td
                upload-pic(v-model="cell.icon_pic", img-type="cell.icon_pic",:img-id="index")
              td
                .cuselct
                  custom-input(v-model="cell.title", maxlength=4, placeholder="请输入ICON名称", :validator="$v.list.$each[index].title", error-info="ICON名称必填")
              td
                .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                .down(v-if="index !== list.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td(v-if="cell.type === 3") 商品分类
                .simple-td(v-if="cell.type === 4") 服务分类
                .simple-td(v-if="cell.type === 5") 平台内容
                .simple-td(v-if="cell.type === 6") 品牌馆
                .simple-td(v-if="cell.type === 7") 评论
                .simple-td(v-if="cell.type === 9") 商品分类列表
                .simple-td(v-if="cell.type === 10") 服务分类列表
                .simple-td(v-if="cell.type === 12") 缺省页
                .simple-td(v-if="cell.type === 13") 智能保养
              td
                .cuselct
                  .operation-td
                    a.operation-link.left(@click="openSetting(cell, index)") 设置
                      ul.setting-block(v-if="cell.setting_block === true")
                        li(v-for="(setItem, index) in typeList", @click.stop="goSettingBlock(setItem.id, cell)", v-text="setItem.name")
      div.tip 建议上传尺寸为38x38的png格式文件，文件不能超过50k。
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="saveData") 保存
    first-product-category(v-model="pro_fir_cate", v-if="pro_fir_cate", @resolve="getProFirCate", :id="choose_id")
    second-product-category(v-model="pro_sec_cate", v-if="pro_sec_cate", @resolve="getProSecCate", :id="choose_id")
    first-service-category(v-model="ser_fir_cate", v-if="ser_fir_cate", @resolve="getSerFirCate", :id="choose_id")
    second-service-category(v-model="ser_sec_cate", v-if="ser_sec_cate", @resolve="getSerSecCate", :id="choose_id")
    choose-brand(v-model="show_brand", v-if="show_brand", :id="choose_id", @resolve="getBrand")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", :id="choose_id", @resolve="getContent")
</template>

<script>
import ChoosePlatformContent from '@/components/basics/modal/ChoosePlatformContent'
import ChooseBrand from '@/components/basics/modal/ChooseBrand'
import FirstProductCategory from '@/components/basics/modal/FirstProductCategory'
import SecondProductCategory from '@/components/basics/modal/SecondProductCategory'
import FirstServiceCategory from '@/components/basics/modal/FirstServiceCategory'
import SecondServiceCategory from '@/components/basics/modal/SecondServiceCategory'
import CustomInput from '@/components/generics/form/CustomInput'
import StaffPicker from '@/components/generics/form/StaffPicker'
import filterTools from '@/mixins/utilities/filterTools'
import imageScale from '@/mixins/utilities/imageScale'
import basicsApi from '@/mixins/modules/basics'
import UploadPic from '@/components/generics/form/UploadPic'
import CustomSelect from '../generics/form/CustomSelect'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { wordLength } from '@/mixins/custom-validators/custom-validators'
export default {
  name: 'IndexGuide',
  mixins: [basicsApi, filterTools, imageScale, validationMixin],
  components: {
    CustomSelect,
    CustomInput,
    StaffPicker,
    UploadPic,
    FirstProductCategory,
    SecondProductCategory,
    FirstServiceCategory,
    SecondServiceCategory,
    ChooseBrand,
    ChoosePlatformContent,
  },
  data () {
    return {
      is_begin: false, // 是否第一次设置ICON
      choose_id: 0, // 选择id
      isInitiated: true,
      show_brand: false, // 控制选择品牌馆显隐
      show_platform_content: false, // 控制选择内容项显隐
      pro_fir_cate: false,    // 控制选择商品分类项显隐
      pro_sec_cate: false,    // 控制选择商品分类列表显隐
      ser_fir_cate: false,     // 控制选择服务分类项显隐
      ser_sec_cate: false,    // 控制选择服务分类列表显隐
      theadConfig: [{ // head头对象
        name: 'ICON',
        width: '100',
      }, {
        name: '名称',
        width: '100',
      }, {
        name: '排序',
        width: '100',
      }, {
        name: '跳转类型',
        width: '100',
      }, {
        name: '跳转设置',
        width: '100',
      }],
      list: [{ // 首页引导图列表
        id: 1,
        icon_pic: '',
        title: 'icon1',
        type: 3,
        lock: false,
      }, {
        id: 2,
        icon_pic: '',
        title: 'icon2',
        type: 4,
        lock: false,
      }, {
        id: 3,
        icon_pic: '',
        title: 'icon3',
        type: 6,
        lock: false,
      }, {
        id: 4,
        icon_pic: '',
        title: 'icon4',
        type: 7,
        lock: false,
      }, {
        id: 5,
        icon_pic: '',
        title: 'icon5',
        type: 12,
        lock: false,
      }, {
        id: 6,
        icon_pic: '',
        title: 'icon6',
        type: 9,
        lock: false,
      }, {
        id: 7,
        icon_pic: '',
        title: 'icon7',
        type: 10,
        lock: false,
      }, {
        id: 8,
        icon_pic: '',
        title: 'icon8',
        type: 6,
        lock: false,
      }
      // , {
      //   id: 9,
      //   icon_pic: '',
      //   title: 'icon9',
      //   type: 10,
      //   lock: false,
      // }, {
      //   id: 10,
      //   icon_pic: '',
      //   title: 'icon10',
      //   type: 12,
      //   lock: false,
      // }
      ],
      typeList: [
        { // 设置列表
          id: 3,
          name: '商品分类',
        }, {
          id: 4,
          name: '服务分类',
        }, {
          id: 5,
          name: '平台内容',
        }, {
          id: 6,
          name: '品牌馆',
        }, {
          id: 7,
          name: '评论',
        }, {
          id: 9,
          name: '商品分类列表',
        }, {
          id: 10,
          name: '服务分类列表',
        }, {
          id: 13,
          name: '智能保养',
        }, {
          id: 12,
          name: '缺省页',
        }
      ],
    }
  },
  validations: {
    list: {
      $each: {
        title: {
          required,
          validate (val) {
            return this.wordLength(val) <= 4
          },
        },
      },
    },
  },
  methods: {
    wordLength,
    /**
     * 选择内容弹框的回调处理
     * @param {Object} 已选内容的数据
     * @id {Number, String} 触发该弹框的id
     */
    getContent (params, id) {
      let arr = {
        id: params.id,
      }
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 5
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
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 6
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
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 3
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
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 9
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
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 4
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
      this.list.forEach(item => {
        if (item.id === id) {
          item.type_value = arr
          item.type = 10
        }
      })
    },
    /**
     * 设置
     * @ items 此次选择ICON 对象
     */
    openSetting (items, index) {
      let _self = this
      this.list.forEach(function (item) {
        if (item.id === items.id) {
          item.setting_block = !item.setting_block
          _self.choose_id = item.id
        } else {
          item.setting_block = false
        }
      })
      let arr = this.list
      this.list = []
      this.list = arr
      // if (index === 9) {
      //   document.getElementsByClassName('table-wrapper')[0].scrollTo(0, 1510)
      // }
    },
    /**
     * 选择设置项
     * @ type 所选择的的类型
     * @ cell 改变的对象
     */
    goSettingBlock (type, cell) {
      if (type === 3) {
        this.pro_fir_cate = true
      }
      if (type === 9) {
        this.pro_sec_cate = true
      }
      if (type === 4) {
        this.ser_fir_cate = true
      }
      if (type === 10) {
        this.ser_sec_cate = true
      }
      if (type === 6) {
        this.show_brand = true
      }
      if (type === 5) {
        this.show_platform_content = true
      }
      this.list.forEach(function (item) {
        item.setting_block = false
        if (item === cell) {
          if (type === 12 || type === 7 || type === 13) {
            item.type = type
          }
        }
      })
      let arr = this.list
      this.list = []
      this.list = arr
    },
    /**
     * 排序
     * @index {int} 序列号
     * @type {string} up or down
     */
    sortItem (index, type) {
      let arr = [...this.list]
      this.list = []
      let temp = arr[index]
      // 向上移动
      if (type === 'up') {
        arr[index] = arr[index - 1]
        arr[index - 1] = temp
      }
      // // 向下移动
      if (type === 'down') {
        arr[index] = arr[index + 1]
        arr[index + 1] = temp
      }
      this.list = [...arr]
    },
    // 保存
    saveData () {
      this.$v.$touch()
      if (this.$v.$error) {
        return
      }
      let img = false
      this.list.forEach((item, index) => {
        item.sort = index + 1
        if (item.icon_pic === undefined) {
          img = item
        }
      })
      if (img) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '提示',
          content: `${img.title}的ICON图片必填`,
        })
        return
      }
      this.saveApi()
    },
    // 保存API
    async saveApi () {
      let _self = this
      this.list.forEach(item => {
        if (item.type === 12 || item.type === 7 || item.type === 13) {
          item.type_value = {}
        }
      })
      let params = this.list
      if (this.is_begin) {
        params = []
        this.list.forEach(item => {
          let obj = {}
          obj.icon_pic = item.icon_pic
          obj.title = item.title
          obj.type = item.type
          obj.type_value = item.type_value
          obj.sort = item.sort
          params.push(obj)
        })
      }
      try {
        const { response, result } = await this.updateIndex({
          data: params,
        })
        if (response.status === 200 && result.code === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true, // 控制弹框自动消失
            type: 'success',
            title: '保存成功',
          })
          _self.fetchData()
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
    // 获取列表信息
    async fetchData () {
      try {
        const { response, result } = await this.indexList()
        if (response.status === 200 && result.code === 0) {
          // this.list = result.data
          if (result.data.length > 0) {
            this.list = result.data
          } else {
            this.is_begin = true
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取列表失败',
            content: `${response.status} ${result.message}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取列表失败',
          content: `错误：${err}`,
        })
      }
    },
  },
  mounted () {
    this.list.forEach(function (item) {
      item.title = ''
      item.icon_pic = ''
      item.setting_block = false
      item.type = 12
      item.type_value = {}
    })
    this.fetchData()
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins';
@import '~@/stylus/modules/creation-modal';

.section-layout {
  height: calc(100% - 48px);
}
.operation-link {
  position: relative;
}

.setting-block {
  position: absolute;
  top: -30px;
  left: 28px;
  background: #f0f1f2;
  width: 110px;
  height: 116px;
  overflow-x: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  border-radius: 2px;
  z-index: 99999;

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

.table-data {
  height: calc(100% - 90px) !important;
}

.section-filter-none.is-horizontal {
  height: 0;
  padding: 0;
}
.content-wrapper {
  background: initial;
  margin-top: 0;
  margin-bottom: 0;
  height: calc(100% - 90px);
}
.emp {
  margin-top: 40px;
}

.upc {
  width: 73px;
  height: 32px;
}

.content {
  display: flex;
  justify-content: start;
}

.pp {
  position: relative;
}

.haha, .add-icon, .category-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
  background: url('~@/assets/icons/button-add.svg') no-repeat center center;
  background-size: cover;
  margin-right: 6px;
  margin-top: 8px;
}

.category-icon {
  background-image: url('~@/assets/icons/button-catrgory.svg');
}

.page-selector {
  label {
    z-index: 5;
  }
}

.right-box {
  display: flex;
  position: absolute;
  bottom: 20px;
  right: 30px;
}

.xi {
  align-self: flex-end;
}

.bian {
  height: 16px;
  font-size: 13px;
  font-family: MicrosoftYaHei;
  color: rgba(47, 171, 221, 1);
  line-height: 16px;
  padding-right: 17px;
  margin-right: 0;
}

.del {
  padding-left: 17px;
  color: rgba(235, 78, 56, 1) !important;
  border-left: 1px solid rgba(0, 0, 0, 0.08);
}

.button {
  padding: 0 10px;
}

.username {
  line-height: 36px;
}

.button-import:hover a {
  position: relative;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.05);
  color: #121212;
  top: -1px;
}

.subFile {
  width: 74px;
  height: 32px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
}

.position-relative {
  position: relative;
}

.up, .down {
  position: absolute;
  top: 40px;
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

.cuselct {
  width: 60%;
  margin-top: 20px;
}

.btn-wrapper {
  text-align: right;
  position: fixed;
  bottom: 40px;
  right: 0;
  padding: 23px 40px 0;
}

.tip {
  position: fixed;
  bottom: 40px;
  padding: 23px 40px 0;
  padding-left: 0;
  white-space: nowrap;
  font-size: 14px;
  color: rgb(255, 0, 0);
}

.simple-td {
  margin-top: 20px !important;
}

.set-lock {
  padding-top: 35px;
}
</style>
