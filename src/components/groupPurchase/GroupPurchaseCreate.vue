<template lang="pug">
  .section-layout
    .content-wrapper
      h2 新建团购活动
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 团购信息
          .field.is-horizontal
            label.label 团单名称
            custom-input(v-model="info.name", input-type="hasCount", placeholder="请输入团单名称", :validator="$v.info.name", error-info="团单名称必填并且小于十五位", :is-disabled="isLoading")
              span(slot="countInfo") {{wordLength(info.name)}}/15
          .field.is-horizontal
            label.label 团单分类
            custom-select(v-model="info.category", :list="categoryList", :validator="$v.info.category", error-info="请选择团单分类", nameField="name", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 服务项目
            .service-box
              .service-list(v-for="(serviceItem, index) in info.service")
                custom-input.service-input(v-model="serviceItem.title", input-type="normal", placeholder="请输入服务名称", :validator="$v.info.service.$each[index].title", error-info="请输入服务名称并且小于十五位", :is-disabled="isLoading")
                custom-input.service-price(input-type="hasUnit",need-type='float', :is-disabled="isLoading",placeholder="售卖价", v-model="serviceItem.sell_price", :validator="$v.info.service.$each[index].sell_price", error-info="请输入大于0小于99999的价格精确到小数点后2位", @input='numTotal')
                  span(slot="unitName") 元
                custom-input.service-price(input-type="hasUnit",need-type='float', :is-disabled="isLoading",placeholder="原价", v-model="serviceItem.original_price", :validator="$v.info.service.$each[index].original_price", error-info="请输入大于0小于99999的价格精确到小数点后2位")
                  span(slot="unitName") 元
                custom-input.service-price(input-type="hasUnit",need-type='float', :is-disabled="isLoading",placeholder="成本价", v-model="serviceItem.cost_price", :validator="$v.info.service.$each[index].cost_price", error-info="请输入大于0小于99999的价格精确到小数点后2位")
                  span(slot="unitName") 元
                span.button-delete.is-item(v-if="info.service.length>1", @click="deleteService(index)")
          .field.is-horizontal
            label.label
            .add-content(@click="addService")
              a.add-button.is-small
              span.select-item-title 添加项目
          .field.is-horizontal
            label.label 服务简介
            .control(:class="{'disabled': isLoading}")
              custom-textarea.textarea(placeholder="请输入服务简介", v-model="info.services_intro", :validator="$v.info.services_intro", error-info="请输入服务简介,60字内", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 平台售价
            .control
              custom-input.package-price(input-type="hasUnit", :is-disabled="'true'", v-model="num_sum",)
                span(slot="unitName") 元
          .field.is-horizontal
            label.label 发布渠道
            .control
              .switch
                input(type="checkbox", id="m", value="2", v-model="checkedNames")
                label(for="m")
              .radio.service-status 美团
              .switch
                input(type="checkbox", id="d", value="1", v-model="checkedNames")
                label(for="d")
              .radio.service-status 大众点评网
          .field.is-horizontal
            label.label 库存量
            .control
              custom-input.package-price(input-type="hasUnit",need-type='number', :is-disabled="isLoading", v-model="info.stock_qty", :validator="$v.info.stock_qty", error-info="请输入大于0小于99999的整数")
                span(slot="unitName") 份
          .field.is-horizontal
            label.label 个人最大可售量
            .control
              custom-input.package-price(input-type="hasUnit",need-type='number', :is-disabled="isLoading", v-model="info.max_sale_qty", :validator="$v.info.max_sale_qty", error-info="请输入大于0小于99999的整数")
                span(slot="unitName") 份
          .field.is-horizontal
            label.label-title 购买须知
          .field.is-horizontal
            label.label 售卖时间
            .control
              date-picker(type="range", placeholder="请选择售卖日期区间", v-model="info.saleDate", :validator="$v.info.saleDate", error-info="请选择售卖日期区间", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 服务有效期
            .control
              date-picker(type="range", placeholder="请选择服务有效期日期区间", v-model="info.effectiveDate", :validator="$v.info.effectiveDate", error-info="请选择服务有效期日期区间", :is-disabled="isLoading")
          .field.is-horizontal
            label.label 头图
            .control.image-wrapper
              .upload-pic(v-for="(item, index) in info.head_images")
                upload-img-model(v-model="info.head_images[index]", img-type="info", :has-second-action="true", @other="deleteHeadImage")
              .upload-pic(v-if="info.head_images.length < 5")
                upload-img-model(v-model="info.head_images[info.head_images.length]", img-type="info", :has-second-action="true", @other="deleteHeadImage")
          .field.is-horizontal
            label.label
            .picture-description 最多5张，上传图片像素至少为640×400，图片大小不超过5M
          .field.is-horizontal
            label.label 其他图片
            .control.image-wrapper
              .upload-pic(v-for="(item, index) in info.other_images")
                upload-img-model(v-model="info.other_images[index]", img-type="info", :has-second-action="true", @other="deleteOtherImage")
              .upload-pic(v-if="info.other_images.length < 5")
                upload-img-model(v-model="info.other_images[info.other_images.length]", img-type="info", :has-second-action="true", @other="deleteHeadImage")
          .field.is-horizontal
            label.label
            .picture-description 最多5张，上传图片像素至少为640×400，图片大小不超过5M
          .field.is-horizontal
            label.label 产品介绍
            .control(:class="{'disabled': isLoading}")
              custom-textarea(placeholder="请输入产品介绍", v-model="info.product_intro", :validator="$v.info.product_intro", error-info="请输入产品介绍,200字内", :is-disabled="isLoading",textarea-max=true)
          .field.is-horizontal
            label.label 商户介绍
            .control(:class="{'disabled': isLoading}")
              custom-textarea(placeholder="请输入商户介绍", v-model="info.customer_intro", :validator="$v.info.customer_intro", error-info="请输入商户介绍,200字内", :is-disabled="isLoading",textarea-max=true)
          .field.is-horizontal
            label.label-title 结算方式（点评平台结算，与聚骧平台无关）
          .field.is-horizontal
            label.label 结算方式
            .labelname(v-text="'统一结算'")
          .field.is-horizontal
            label.label 结算周期
            .labelname(v-text="'按照美团点评结算要求进行'")
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="inspectData", :class="{'disabled': isDisabled || isLoading}") 保存
          a.button.large(@click="goBack") 返回

</template>

<script>
  import {priceFormat, wordLength, quantityFormat} from '@/mixins/custom-validators/custom-validators'
  import fileUploader from '@/mixins/utilities/fileUploader'
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomTextarea from '@/components/generics/form/CustomTextarea'
  import DatePicker from '@/components/generics/form/DatePicker'
  import uploadImgModel from '@/components/store/modal/uploadImgModel'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import RichEditor from '@/components/generics/form/RichEditor'
  import UploadPic from '@/components/generics/form/UploadPic'
  import {validationMixin} from 'vuelidate'
  import {required, between} from 'vuelidate/lib/validators'
  import UploadImgBox from '@/components/generics/form/UploadImgModel'
  import bossApi from '@/mixins/modules/groupPurchase'

  /**
   * @vue
   */
  export default {
    name: 'GroupPurchaseCreate',
    mixins: [validationMixin, bossApi, fileUploader],
    components: {
      CustomInput,
      CustomTextarea,
      DatePicker,
      uploadImgModel,
      UploadPic,
      RichEditor,
      CustomSelect,
      UploadImgBox,
    },
    data () {
      return {
        new_pic: '',
        isDisabled: false,
        isLoading: false,
        showSelector: false,
        categoryList: [],
        checkedNames: [],
        num_sum: '',
        info: {
          name: '', // 名称
          category: {}, // 分类
          services_intro: '', // 服务简介
          stock_qty: '',   // 库存量
          max_sale_qty: '',   // 个人最大库存
          saleDate: '',   // 售卖日期区间
          effectiveDate: '',   // 服务有效区间
          head_images: [],   // 头图
          other_images: [],    // 详情图
          product_intro: '',    // 产品介绍
          customer_intro: '',    // 商户介绍
          service: [       // 服务列表
            {
              title: '',
              sell_price: '',
              original_price: '',
              cost_price: '',
            },
          ],
        },
      }
    },
    methods: {
      wordLength,
      // 添加服务项目
      addService () {
        let params = {
          title: '',
          sell_price: '',
          original_price: '',
          cost_price: '',
        }
        this.info.service.push(params)
      },
      // 平台售价求和
      numTotal () {
        let sum = 0
        this.info.service.forEach(ele => {
          sum += Number(ele.sell_price)
        })
        this.num_sum = sum.toFixed(2)
      },
      deleteService (index) {
        this.info.service.splice(index, 1)
      },
      // 删除头图
      deleteHeadImage (url) {
        const index = this.info.head_images.findIndex(val => val === url)
        this.info.head_images.splice(index, 1)
      },
      // 删除其他图片
      deleteOtherImage (url) {
        const index = this.info.other_images.findIndex(val => val === url)
        this.info.other_images.splice(index, 1)
      },
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      // 提交新美大审核
      async inspectData () {
        this.$v.$touch()
        if (this.$v.info.name.$error || this.$v.info.category.$error || this.$v.info.services_intro.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 0)
          return false
        }
        if (this.$v.info.stock_qty.$error || this.$v.info.max_sale_qty.$error || this.$v.info.saleDate.$error || this.$v.info.effectiveDate.$error) {
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 400)
          return false
        }
        if (this.$v.info.product_intro.$error || this.$v.info.customer_intro.$error) {
          return false
        }
        if (this.checkedNames.length <= 0) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '请选择发布渠道',
          })
          document.getElementsByClassName('content-wrapper')[0].scrollTo(0, 400)
          return false
        }
        if (parseInt(this.info.max_sale_qty) > parseInt(this.info.stock_qty)) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '个人最大可售量不能大于库存',
          })
          return false
        }
        if (this.info.saleDate.split(' 至 ').length === 2) {
          let start = Date.parse((this.info.saleDate.split(' 至 ')[0] + ' 00:00').replace(/-/g, '/')) / 1000
          let today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
          if (start < today) {
            this.$store.dispatch('showMessage', {
              title: '售卖时间开始时间不能小于今天',
            })
            return
          }
        }
        if (this.info.effectiveDate.split(' 至 ').length === 2) {
          let start = Date.parse((this.info.effectiveDate.split(' 至 ')[0] + ' 00:00').replace(/-/g, '/')) / 1000
          let today = new Date(new Date().setHours(0, 0, 0, 0)) / 1000
          if (start < today) {
            this.$store.dispatch('showMessage', {
              title: '服务有效期开始时间不能小于今天',
            })
            return
          }
        }
        if (this.info.effectiveDate.split(' 至 ').length === 2 && this.info.saleDate.split(' 至 ').length === 2) {
          let start = Date.parse((this.info.effectiveDate.split(' 至 ')[0] + ' 00:00').replace(/-/g, '/')) / 1000
          let saleDatestart = Date.parse((this.info.saleDate.split(' 至 ')[0] + ' 00:00').replace(/-/g, '/')) / 1000
          if (start < saleDatestart) {
            this.$store.dispatch('showMessage', {
              title: '服务有效时间不能小于服务售卖时间',
            })
            return
          }
        }
        if (this.info.effectiveDate.split(' 至 ').length === 2 && this.info.saleDate.split(' 至 ').length === 2) {
          let end = Date.parse((this.info.effectiveDate.split(' 至 ')[1] + ' 23:59:59').replace(/-/g, '/')) / 1000
          let saleDateend = Date.parse((this.info.saleDate.split(' 至 ')[1] + ' 23:59:59').replace(/-/g, '/')) / 1000
          if (end < saleDateend) {
            this.$store.dispatch('showMessage', {
              title: '服务有效时间不能小于服务售卖时间',
            })
            return
          }
        }
        if (!this.info.head_images.length) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '头图不能为空',
          })
          return false
        }
        if (!this.info.other_images.length) {
          this.$store.dispatch('showMessage', {
            type: 'warning',
            title: '警告',
            content: '其他图不能为空',
          })
          return false
        }
        if (this.checkedNames.length === 2) {
          this.info.publish_channel = 3
        } else {
          this.info.publish_channel = this.checkedNames[0]
        }
        if (this.checkedNames.length === 2) {
          this.info.publish_channel = 3
        } else {
          this.info.publish_channel = this.checkedNames[0]
        }
        let arr = []
        this.info.service.forEach(element => {
          arr.push({
            sell_price: element.sell_price * 100,
            original_price: element.original_price * 100,
            cost_price: element.cost_price * 100,
            title: element.title,
          })
        })
        this.info.service_list = [...arr]
        console.log(this.info.service)
        this.info.sale_begin_date = new Date(this.info.saleDate.split(' 至 ')[0] + ' 00:00').getTime() / 1000
        this.info.sale_end_date = new Date(this.info.saleDate.split(' 至 ')[1] + ' 23:59:59').getTime() / 1000
        this.info.effective_begin_date = new Date(this.info.effectiveDate.split(' 至 ')[0] + ' 00:00').getTime() / 1000
        this.info.effective_end_date = new Date(this.info.effectiveDate.split(' 至 ')[1] + ' 23:59:59').getTime() / 1000
        this.$store.dispatch('showMessage', {
          title: '提交确认',
          content: `确认提交团购活动${this.info.name}吗？`,
          isRejectable: 1,
          resolve: () => {
            this.createTuanGou()
          },
        })
      },
      async createTuanGou () {
        try {
          const {response, result} = await this.addTuanGouApi({
            name: this.info.name,
            category_id: this.info.category.category_id,
            service: [...this.info.service_list],
            services_intro: this.info.services_intro,
            publish_channel: this.info.publish_channel,
            max_sale_qty: this.info.max_sale_qty,
            stock_qty: this.info.stock_qty,
            sale_begin_date: this.info.sale_begin_date,
            sale_end_date: this.info.sale_end_date,
            effective_begin_date: this.info.effective_begin_date,
            effective_end_date: this.info.effective_end_date,
            head_images: [...this.info.head_images],
            other_images: [...this.info.other_images],
            product_intro: this.info.product_intro,
            customer_intro: this.info.customer_intro,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '创建团购活动成功',
                resolve: () => {
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '创建团购活动失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '创建团购活动失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '创建团购活动失败',
            content: `错误：${err}`,
          })
        }
      },
      // 获取分类列表
      async getClassifyList () {
        try {
          const {response, result} = await this.getTuanDanCatgortListApi()
          if (response.status === 200 && result.code === 0) {
            this.categoryList = result.data
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取分类失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch ({response, result}) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取分类列表失败',
            content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getClassifyList() // 获取分类列表
    },
    validations: {
      info: {
        name: {
          required,
          validate (val) {
            return this.wordLength(val) <= 15
          },
        },
        category: {
          required,
        },
        service: {
          $each: {
            title: {
              required,
              validate (val) {
                return this.wordLength(val) <= 15
              },
            },
            sell_price: {
              required,
              between: between(0.01, 99999),
              priceFormat,
            },
            original_price: {
              required,
              between: between(0.01, 99999),
              priceFormat,
            },
            cost_price: {
              required,
              between: between(0.01, 99999),
              priceFormat,
            },
          },
        },
        services_intro: {
          required,
          validate (val) {
            return this.wordLength(val) <= 60
          },
        },
        stock_qty: {
          quantityFormat,
          required,
          between: between(1, 99999),
        },
        max_sale_qty: {
          quantityFormat,
          required,
          between: between(1, 99999),
        },
        saleDate: {
          required,
        },
        effectiveDate: {
          required,
        },
        product_intro: {
          required,
          validate (val) {
            return this.wordLength(val) <= 200
          },
        },
        customer_intro: {
          required,
          validate (val) {
            return this.wordLength(val) <= 200
          },
        },
      },
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.section-layout
  height calc(100% - 56px)
.label-title
  font-size 15px
  font-weight bold
  border-left: 3px solid #ffbb29;
  padding-left: 6px;
  position relative
  left -9px
  line-height 1
.radio + .radio
  margin-left 28px
.picture-description
  font-size 12px
  line-height 16px
  color lightGrey
  white-space nowrap
  margin-top 8px
.service-status
  padding-left 7px
  font-size 13px
  color darker
  margin-right 20px
.radio + .radio
  margin-left 28px
.field.is-horizontal .label
  flex 0 0 95px
.image-wrapper
  display flex
  flex-direction row
  .upload-banner + .upload-banner
    margin-left 8px
.upload-pic
  width 88px
  height 88px
  margin-right 8px
.picture-description
  font-size 12px
  line-height 12px
  color lightGrey
  white-space nowrap
.labelname
  color #999
  font-size 13px
  line-height 29px
.service-list
  flex-direction row
  display flex
  margin-bottom 20px
  .service-input
    width 420px
    flex-grow inherit
  .service-price
    margin-left 20px
.service-list:last-child
  margin-bottom 0
.button-delete
  display block
  width 30px
  height 30px
  background center getImage('trash.svg') no-repeat
  margin-left 20px
  cursor pointer
  &:hover
    background-image getImage('trash-hover.svg')
  &.is-featured
    left 100%
    margin-left 16px
  &.is-item
    right 24px
.add-content
  margin 1px 0 0
  display inline-flex
  align-items center
  cursor pointer
  &:first-child
    margin-top 15px
  .add-button
    margin-right 8px
</style>
