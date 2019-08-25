<template lang="pug">
  .section-layout.contentss
    .section-filter.is-horizontal.section-filter-none
      span.add-button(@click="addItem()")
    empty-page(v-if="!(list && list.length) && showPage", :tip="'当前没有平台开屏'")
    .content-wrapper.list-wrapper.table-data(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(v-for="th in theadConfig", v-text="th.name", :width="th.width")
          tbody(v-if="list.length")
            tr(v-for="(customer, index) in list")
              td
                .field.is-horizontal.image-super
                  upload-pic(v-model="customer.pic", img-type="customer.pic", :img-id="index", is-original=true)
              td
                .simple-td(v-if="customer.value_type === 1") 商品信息
                .simple-td(v-if="customer.value_type === 2") 服务信息
                .simple-td(v-if="customer.value_type === 5") 平台内容
              td
                .operation-td
                  a.operation-link.left(@click="addCity(index, customer.value_type, customer.id)") 选择地域
                  a.operation-link.left(@click="openSetting(index, customer.id)") 设置
                    ul.setting-block(v-if="customer.setting_block === true")
                      li(v-for="setItem in setList", @click.stop="goSettingBlock(setItem.type,index)", v-text="setItem.name")
                  a.operation-link(@click="deleteItem(index)") 删除
    div.tip 注：1.建议上传尺寸为310x370的jpg/png格式文件，文件不能超过1M。
    .btn-wrapper
      .button-group
        a.button.primary.large(@click="saveData") 保存
    choose-product(v-model="show_product", v-if="show_product", :id="setting_id", @resolve="getProduct", :choose-type="4")
    choose-service(v-model="show_service", v-if="show_service", :id="setting_id", @resolve="getService", :choose-type="4")
    choose-platform-content(v-model="show_platform_content", v-if="show_platform_content", :id="setting_id", @resolve="getContent")
    choose-commodity(v-if='show_modal_city', v-model="show_modal_city", :cityList="this.list[this.index].city_id" @resolve="addCityTrue", :id="setting_id", :isEdit="this.list[this.index].isEdit", default-value="4")
</template>

<script>
  // 选择门店
  import ChooseCommodity from '@/components/basics/modal/ChooseCommodity'
  // 商品信息
  import ChooseProduct from '@/components/basics/modal/ChooseProduct'
  // 服务信息
  import ChooseService from '@/components/basics/modal/ChooseService'
  // 内容
  import ChoosePlatformContent from '@/components/basics/modal/ChoosePlatformContent'
  import EmptyPage from '@/components/generics/EmptyPage'
  import UploadPic from '@/components/generics/form/UploadPic'
  import AdminApi from '@/mixins/modules/basics'
  export default {
    name: 'SpuerBannersPage',
    mixins: [AdminApi],
    components: {
      EmptyPage,
      UploadPic,
      ChooseProduct,
      ChooseService,
      ChoosePlatformContent,
      ChooseCommodity,
    },
    data () {
      return {
        setting_id: '',
        show_modal_city: false, // 控制选择城市显隐
        show_product: false,              // 控制商品显隐
        show_service: false,              // 控制服务显隐
        show_platform_content: false,     // 控制内容显隐
        theadConfig: [{
          name: '开屏图',
          width: '345',
        }, {
          name: '跳转类型',
          width: '200',
        }, {
          name: '操作',
          width: '200',
        }],
        list: [],
        showPage: false,  // 缺省页控制
        // 设置浮层
        setting_block: false,
        index: '',    // 列表下标
        type: '',     // type
        setList: [
          {
            name: '商品信息',
            type: 1,
          },
          {
            name: '服务信息',
            type: 2,
          },
          {
            name: '平台内容',
            type: 5,
          },
        ],
      }
    },
    methods: {
      addCity (index, value, id) {
        this.index = index
        this.list.forEach(function (item) {
          item.setting_block = false
        })
        // id为列表得id
        if (value) {
          this.show_modal_city = true
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
      // 选中区域
      addCityTrue (item, city, type) {
        this.show_modal_city = false
        this.list[this.index].city_id = city
        this.list[this.index].isEdit = type
      },
      // 添加内容
      addItem () {
        this.list.forEach(function (item) {
          item.setting_block = false
        })
        let id = 1
        if (this.list.length > 0) {
          id = Number(this.list[this.list.length - 1].id) + 1
        }
        let obj = {
          id: id,
          pic: '',
          value_type: '',
          new: true,
          value_content: {},
          city_id: [],
          setting_block: false,
        }
        this.list.unshift(obj)
      },
      /**
       * 设置
       * @ item
       */
      openSetting (index, id) {
        let self = this
        for (var i = 0; i < this.list.length; i++) {
          if (i === parseInt(index)) {
            self.list[i].setting_block = !self.list[i].setting_block
          } else {
            self.list[i].setting_block = false
          }
        }
        this.setting_id = id
        this.index = index
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
          case 5:
            this.show_platform_content = true
            break
        }
        this.list.forEach(function (item) {
          item.setting_block = false
        })
        if (type === 12 || type === 7) {
          this.list[index].value_type = type
        }
      },
      /**
       * 删除 item
       * @index {int} 序列号
       */
      deleteItem (index) {
        this.list.splice(index, 1)
      },
      // 验证数据
      validateData () {
        let _this = this
        let pass = true
        for (let i = 0; i < _this.list.length; i++) {
          let item = _this.list[i]
          if (!item.pic) {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '开屏图不能为空',
            })
            pass = false
            return
          }
          if (!item.value_type) {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '跳转参数类型不能为空',
            })
            pass = false
            return
          }
          if (!item.city_id.length) {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '提示',
              content: '开屏区域不能为空',
            })
            pass = false
            return
          }
        }
        return pass
      },
      // 保存
      async saveData () {
        let res = this.validateData()
        if (!res) {
          return false
        }
        let params = []
        this.list.forEach(item => {
          let city = []
          item.city_id.forEach(e => {
            if (e.children) {
              e.children.forEach(i => {
                city.push(i.id)
              })
            } else {
              if (item.isEdit === 1) {
                city = item.city_id
              } else {
                city.push(-1)
              }
            }
          })
          params.push({
            id: item.new ? 0 : item.id,
            pic: item.pic,
            value_type: item.value_type,
            value_content: item.value_content,
            city_id: city[0] === -1 ? [0] : city,
          })
        })
        try {
          const { response, result } = await this.bossSaveOpenApi({
            data: params,
          })
          if (response.status === 200) {         // 分开判断
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存成功',
              })
              this.fetchData()
            } else {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '保存失败',
                content: `${response.status} ${result.message}`,
              })
            }
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
          const { response, result } = await this.bossOpenListApi()
          if (response.status === 200) {
            if (result.code === 0) {
              this.list = result.data.map(item => {
                item.isEdit = 1
                item.setting_block = false
                if (item.city_id[0] === 0) item.city_id = [-1]
                return item
              })
              this.showPage = true
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取平台开屏失败',
                content: `${response.status} ${result.message}`,
              })
              this.showPage = false
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取平台开屏失败',
              content: `${response.status} ${result.message}`,
            })
            this.showPage = false
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取平台开屏失败',
            content: `错误：${err}`,
          })
          this.showPage = false
        }
      },
      // 商品信息
      getProduct (params, id) {
        let arr = {
          id: '',
        }
        arr.id = params.product_id
        this.list[this.index].pic = params.product_pic
        this.list[this.index].value_type = 1
        this.list[this.index].value_content = arr
      },
      // 服务信息
      getService (params, id) {
        let arr = {
          id: '',
        }
        arr.id = params.product_id
        // this.list[this.index].brand_name = params.product_name
        this.list[this.index].pic = params.product_pic
        this.list[this.index].value_type = 2
        this.list[this.index].value_content = arr
      },
      // 内容
      getContent (params, id) {
        let arr = {
          id: params.id,
        }
        // this.list[this.index].brand_name = params.title
        this.list[this.index].pic = params.cover
        this.list[this.index].value_type = 5
        this.list[this.index].value_content = arr
      },
    },
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';

  .list-wrapper {
    padding-bottom: 120px !important;
  }

  .section-layout {
    padding: 0 !important;
  }

  .contentss {
    height: calc(100% - 30px);
  }

  .table-data {
    height: calc(100% - 50px) !important;
  }

  .section-filter-none.is-horizontal {
    height: 0;
    padding: 0;
  }

  .section-filter .add-button {
    bottom: initial;
  }

  .section-layout {
    position: relative;
    padding-top: 0;

    .add-button {
      position: absolute;
      right: 40px;
      top: 0;
      z-index: 22;
    }
  }

  table td {
    vertical-align: middle;
  }

  .cuselct {
    width: 345px;
    margin-top: 5px;
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
  .tip {
    position: fixed;
    bottom: 60px;
    padding: 0 40px 0;
    white-space: nowrap;
    font-size: 14px;
    color: rgb(255, 0, 0);
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

  .btn-wrapper {
    margin-top: 20px;
    padding-right: 70px;
    text-align: right;
    text-align: right;
    position: fixed;
    bottom: 40px;
    right: 0;
    padding: 23px 40px 0;

    .large {
      width: 120px;
    }
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

  .upload-pic.is-normal, .field.is-horizontal {
    width: 200px !important;
    height: 113px !important;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .tr-p {
    position: relative;
  }

  .up, .down {
    position: absolute;
    top: 100px;
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

  .delete {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 16px;
    height: 16px;
    background: center no-repeat url('~@/assets/icons/trash.svg');
    cursor: pointer;
  }

  .operation-link {
    position: relative;
    margin-right: 10px;
  }

  .setting-block {
    position: absolute;
    top: -28px;
    left: 30px;
    background: #f0f1f2;
    z-index: 1000;
    width: 110px;
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
</style>
