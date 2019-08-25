<template lang="pug">
  .section-layout
    service-tab.top-nav(v-model="tab", :tabs="tabList", :have-icon="false", :have-quantity="false", @input="changePage")
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    .content-wrapper.list-wrapper(v-if='bannerList.length !== 0')
      .table-wrapper
        table.table
          thead
            tr
              td(width="150") 轮播图
              td(width="80") 排序
              td(width="130") 跳转类型
              td(width="100") 操作
          tbody
            tr(v-for="(item, index) in bannerList")
              td
                .simple-image(:class="default_value - 0 === 3 ? 'boss-image-up' : ''")
                  upload-pic.upload-pic-style(v-model="item.pic", img-type="item.pic",:img-id="index", is-original=true)
              td
                .icon-img
                  .up(v-if="index !== 0", @click="sortItem(index, 'up')")
                  .down(v-if="index !== bannerList.length-1", @click="sortItem(index, 'down')")
              td
                .simple-td(v-if="item.value_type === 1") 商品信息
                .simple-td(v-if="item.value_type === 2") 服务信息
                .simple-td(v-if="item.value_type === 3") 商品分类
                .simple-td(v-if="item.value_type === 4") 服务分类
                .simple-td(v-if="item.value_type === 5") 平台内容
                .simple-td(v-if="item.value_type === 6") 品牌馆
                .simple-td(v-if="item.value_type === 7") 评论
                //- .simple-td(v-if="item.value_type === 8") 抽奖
                .simple-td(v-if="item.value_type === 9") 商品分类列表
                .simple-td(v-if="item.value_type === 10") 服务分类列表
                //- .simple-td(v-if="item.value_type === 12") 敬请期待
              td
                .operation-td
                  a.operation-link.left(@click="addStore(index, item.value_type, item.id)", v-if="parseInt(default_value)===2") 选择门店
                  a.operation-link.left(@click="addStore(index, item.value_type, item.id)", v-if="parseInt(default_value)===3") 选择地域
                  a.operation-link.left(@click="openSetting(index, item.id)") 设置
                    ul.setting-block(v-if="item.setting_block === true", :class="parseInt(default_value)===2 ? 'set-width': ''")
                      li(v-for="setItem in (default_value - 0 === 3 ? boss_set : set_list)", @click.stop="goSettingBlock(setItem.type, index)", v-text="setItem.name")
                  a.operation-link(@click="deleteItem(index)") 删除
    // 空页面
    empty-page(v-if="is_empty && bannerList.length === 0", tip="当前没有轮播图")
    div.tip(v-text="'注：1.建议上传尺寸为' + (default_value - 0 === 3 ? '375x400': '750x340') + '的jpg/png格式文件，文件不能超过1M。'")
    div.tip-1(v-if="parseInt(default_value) === 2") 2.每个门店最多可投放5个轮播图
    div.tip-1(v-if="default_value - 0 === 3") 2.同一地域最多展现排序前6的轮播图。
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    choose-product(v-model="show_product", v-if="show_product", :id="setting_id", @resolve="getProduct", :choose-type="default_value")
    choose-service(v-model="show_service", v-if="show_service", :id="setting_id", @resolve="getService", :choose-type="default_value")
    first-product-category(v-model="pro_fir_cate", v-if="pro_fir_cate", @resolve="getProFirCate", :id="setting_id")
    second-product-category(v-model="pro_sec_cate", v-if="pro_sec_cate", @resolve="getProSecCate", :id="setting_id")
    first-service-category(v-model="ser_fir_cate", v-if="ser_fir_cate", @resolve="getSerFirCate", :id="setting_id")
    second-service-category(v-model="ser_sec_cate", v-if="ser_sec_cate", @resolve="getSerSecCate", :id="setting_id")
    choose-brand(v-model="show_brand", v-if="show_brand", :id="setting_id", @resolve="getBrand")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", :id="setting_id", @resolve="getContent")
    choose-lottery(v-model="choose_lottery", v-if="choose_lottery", @resolve="getChooseLottery", :id="setting_id")
    //- 选择门店
    choose-commodity(v-if='show_modal_store', v-model="show_modal_store", :array="this.bannerList[this.index].store", :cityList="this.bannerList[this.index].city" @resolve="addStoreTrue", :id="setting_id", :isEdit="this.bannerList[this.index].isEdit", :default-value="parseInt(default_value)")
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
  // 选择门店
  import ChooseCommodity from '@/components/basics/modal/ChooseCommodity'
  import ServiceTab from '@/components/generics/ServiceTab'
  import EmptyPage from '@/components/generics/EmptyPage'  // 空页面组件
  import UploadPic from '@/components/generics/form/UploadPic'    // 图片上传组建
  import AdminApi from '@/mixins/modules/basics'
  export default {
    name: 'bannerInitialization',
    mixins: [AdminApi],
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
      ChooseCommodity,
    },
    data () {
      return {
        title: '轮播图',
        setting_id: '',
        show_modal_store: false, // 选择门店弹框
        city_list: [], // 选择市的集合
        show_brand: false,      // 控制品牌馆显隐
        pro_fir_cate: false,    // 控制选择商品分类项显隐
        pro_sec_cate: false,    // 控制选择商品分类列表显隐
        ser_fir_cate: false,     // 控制选择服务分类项显隐
        ser_sec_cate: false,    // 控制选择服务分类列表显隐
        show_product: false,    // 控制商品显隐
        show_service: false,    // 控制服务显隐
        show_platform_content: false,     // 控制内容显隐
        choose_lottery: false,    // 控制抽奖显隐
        bannerList: [],
        is_empty: false,
        index: '', // 记录index
        set_list: [
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
          {
            name: '商品分类列表',
            type: 9,
          },
          {
            name: '服务分类列表',
            type: 10,
          },
          {
            name: '敬请期待',
            type: 12,
          },
        ],
        boss_set: [{
          name: '平台内容',
          type: 5,
        }, {
          name: '商品信息',
          type: 1,
        }, {
          name: '服务信息',
          type: 2,
        }],
        tabList: [
          {
            name: '初始化轮播图',
            type: '1',
          },
          {
            name: '指定投放轮播图',
            type: '2',
          },
          {
            name: '平台轮播图',
            type: '3',
          },
        ],
        current_index: 0, // 当前得index
        tab: {               // 默认选中tab
          name: '初始化轮播图',
          type: '1',
        },
        default_value: '1',  // 页面tab初始值
      }
    },
    methods: {
      // 获取平台轮播图
      async getBossBannerList () {
        try {
          const { response, result } = await this.bossBannerListApi()
          this.is_empty = true
          if (response.status === 200) {
            if (result.code === 0) {
              this.bannerList = result.data.map(item => {
                item.isEdit = 1
                item.setting_block = false
                item.city = item.city_id[0] ? [-1] : item.city_id
                return item
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取轮播图列表出错',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取轮播图列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取轮播图列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // tab切换
      changePage (params) {
        if (params.type === this.default_value) return   // 已是选中状态不再请求接口
        this.default_value = params.type
        this.bannerList.forEach(function (item) {
          item.setting_block = false
        })
        switch (parseInt(this.default_value)) {
          case 1:
            this.getBannerListData()
            break
          case 2:
            this.getAppointBannerListData()
            break
          case 3:
            this.getBossBannerList()
            break
        }
      },
      // 添加门店
      addStore (index, value_type, id) {
        this.index = index
        this.bannerList.forEach(function (item) {
          item.setting_block = false
        })
      // id为列表得id
        if (value_type) {
          this.show_modal_store = true
          if (id) {
            this.setting_id = id
          } else {
            this.setting_id = ''
          }
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '提示',
            content: '请先设置跳转类型',
          })
        }
      },
      // 选中门店
      addStoreTrue (list, city_list, type) {
        this.bannerList[this.index].isEdit = type
        this.bannerList[this.index].store = list
        this.bannerList[this.index].city = city_list
      },
      // 添加内容
      addItem () {
        this.bannerList.forEach(function (item) {
          item.setting_block = false
        })
        if (parseInt(this.default_value) === 1) {
          if (this.bannerList.length === 6) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '最多添加6个轮播图',
            })
            return
          }
        }
        let obj = {
          pic: '',
          value_type: '',
          new: true,
          value_content: {},
          setting_block: false,
        }

        if (this.default_value - 0 === 3) {
          obj.city = []
        }
        this.bannerList.unshift(obj)
      },
      /**
       * @event
       * @description 锁定单个品牌日
       * @param item {Object} 品牌日对象
       */
      async dolock (item) {
        let params = {}
        params.id = item.id
        params.locking = item.lock ? 2 : 1
        if (item.new) {
          return
        }
        try {
          const { response, result } = await this.doLock(params)
          if (response.status === 200) {
            if (result.code === 0) {
              if (params.locking === 1) {
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
                type: 'failure',
                title: '轮播图失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '轮播图失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '轮播图失败',
            content: `错误：${err}`,
          })
        }
      },
      /**
       * 设置
       * @ item
       */
      openSetting (index, id) {
        this.bannerList.forEach(function (item, i) {
          if (i === parseInt(index)) {
            item.setting_block = !item.setting_block
          } else {
            item.setting_block = false
          }
        })
        this.current_index = index
        this.setting_id = id
      },
      /**
       * 选择设置项
       * @ item
       */
      goSettingBlock (type, index) {
        switch (type) {
          case 1:
            this.show_product = true
            break
          case 2:
            this.show_service = true
            break
          case 3:
            this.pro_fir_cate = true
            break
          case 4:
            this.ser_fir_cate = true
            break
          case 5:
            this.show_platform_content = true
            break
          case 6:
            this.show_brand = true
            break
          case 8:
            this.choose_lottery = true
            break
          case 9:
            this.pro_sec_cate = true
            break
          case 10:
            this.ser_sec_cate = true
            break
        }
        this.bannerList.forEach(function (item) {
          item.setting_block = false
        })
        if (type === 12 || type === 7) {
          this.bannerList[index].value_type = type
        }
      },
      /**
       * 删除 item
       * @index {int} 序列号
       */
      deleteItem (index) {
        this.bannerList.splice(index, 1)
      },
      /**
       * 排序
       * @index {int} 序列号
       * @type {string} up or down
       */
      sortItem (index, type) {
        if (this.bannerList.length === 1) {
          return
        }
        let arr = [...this.bannerList]
        this.bannerList = []
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
        this.bannerList = [...arr]
      },
      // 保存数据
      saveData () {
        this.bannerList.forEach(item => {
          item.setting_block = false
        })
        if (this.bannerList.length !== 0) {
          let isImg = false
          this.bannerList.forEach(item => {
            if (!item.pic) {
              isImg = true
            }
          })
          if (isImg) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '轮播图图片必填',
            })
            return
          }
          let isType = false
          this.bannerList.forEach(item => {
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
        }
        this.saveAllData()
      },
      saveAllData () {
        let self = this
        let params = []
        if (parseInt(self.default_value) === 1) {
          self.bannerList.forEach(item => {
            let obj = {}
            obj.pic = item.pic
            obj.value_type = item.value_type
            obj.value_content = item.value_content
            obj.locking = item.lock ? 2 : 1
            params.push(obj)
          })
          self.saveBannerData(params)
        } else if (parseInt(self.default_value) === 2) {
          let pass = true
          // 门店id集合-城市id集合
          self.bannerList.forEach((item, i) => {
            let arr_city = []
            let arr_shop = []
            if (item.store) {
              item.store.forEach(e => {
                arr_shop.push(e.shop_id)
              })
            } else {
              arr_shop = item.shop_id ? item.shop_id : []
            }
            if (item.city) {
              item.city.forEach(e => {
                if (e.children) {
                  e.children.forEach(i => {
                    arr_city.push(i.id)
                  })
                } else {
                  arr_city.push(-1)
                }
              })
            } else {
              arr_city = item.city_id ? item.city_id : []
            }
            if (!arr_city.length && !arr_shop.length) {
              pass = false
            }
            let obj = {}
            obj.pic = item.pic
            obj.value_type = item.value_type
            obj.value_content = item.value_content
            obj.locking = item.lock ? 2 : 1
            obj.shop_id = arr_shop
            obj.city_id = arr_city
            params.push(obj)
          })
          if (!pass) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '指定门店或者城市必须存在一个值',
            })
            return
          }
          self.saveAppointBanner(params)
        } else {
          let params = []
          let isCity = false
          this.bannerList.forEach(item => {
            if (!item.city.length) {
              isCity = true
            }
            // 如果isEdit = 1 没有编辑
            if (item.isEdit && item.isEdit === 1) {
              params.push({
                id: item.id,
                pic: item.pic,
                value_type: item.value_type,
                value_content: item.value_content,
                city_id: item.city_id,
              })
            } else {
              // 新添加 编辑
              let city = []
              item.city.forEach(e => {
                if (e.children) {
                  e.children.forEach(i => {
                    city.push(i.id)
                  })
                } else {
                  if (item.isEdit === 1) {
                    city = item.city
                  } else {
                    city.push(-1)
                  }
                }
                params.push({
                  id: item.new ? 0 : item.id,
                  pic: item.pic,
                  value_type: item.value_type,
                  value_content: item.value_content,
                  city_id: city[0] === -1 ? [0] : city,
                })
              })
            }
          })
          if (isCity) {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '轮播图区域不能为空',
            })
            return
          }
          self.saveBannerData(params, 2)
        }
      },
      // 保存轮播图
      async saveBannerData (params, type = 1) {
        try {
          const { result, response } = type === 1 ? await this.saveBanner({data: params}) : await this.bossBannerSaveApi({data: params})
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
              type === 1 ? this.getBannerListData() : this.getBossBannerList()
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
      // 保存指定轮播图
      async saveAppointBanner (params) {
        try {
          const { result, response } = await this.saveAppointBannerApi({
            data: params,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.isEdit = 1
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存成功',
                resolve: () => {},
              })
              this.getAppointBannerListData()
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
      async getBannerListData () {
        try {
          const { response, result } = await this.getBannerList()
          this.is_empty = true
          if (response.status === 200) {
            if (result.code === 0) {
              this.bannerList = result.data.map(item => {
                item.setting_block = false
                item.locking === 1 ? item.lock = false : item.lock = true
                return item
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取轮播图列表出错',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取轮播图列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取轮播图列表失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 获取指定轮播图列表
      async getAppointBannerListData () {
        try {
          const { response, result } = await this.getAppointBannerListApi()
          this.is_empty = true
          if (response.status === 200) {
            if (result.code === 0) {
              this.bannerList = result.data.map(item => {
                item.isEdit = 1
                item.setting_block = false
                item.locking === 1 ? item.lock = false : item.lock = true
                return item
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取轮播图列表出错',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取轮播图列表失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取轮播图列表失败',
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 1
        this.bannerList[index].pic = params.product_pic
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].pic = params.product_pic
        this.bannerList[index].value_type = 2
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].pic = params.cover
        this.bannerList[index].value_type = 6
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 3
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 9
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 4
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 10
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].value_type = 8
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
        let index = this.current_index
        this.bannerList[index].value_content = arr
        this.bannerList[index].pic = params.cover
        this.bannerList[index].value_type = 5
      },
    },
    mounted () {
      this.getBannerListData()
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
    width: 250px;
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
  .tip {
    position: fixed;
    bottom: 60px;
    padding: 0 40px 0;
    white-space: nowrap;
    font-size: 14px;
    color: rgb(255, 0, 0);
  }
  .tip-1 {
    position: fixed;
    bottom: 35px;
    padding: 0 67px 0;
    white-space: nowrap;
    font-size: 14px;
    color: rgb(255, 0, 0);
  }
  .setting-block {
    position: absolute;
    top: 15px;
    left: 28px;
    max-height: calc(100% - 10px);
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
  .set-width{
    left: 90px;
  }
  .simple-td, .operation-td {
    margin-top: 38px;
  }

  .set-lock {
    padding-top: 50px;
  }
  .boss-image-up .upload-pic.is-normal {
    width: 99px;
    height: 113px;
    background-color: gray;
    display: block;
  }
</style>
