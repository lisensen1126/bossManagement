<template lang="pug">
  .section-layout
    .content-wrapper
      h2 编辑团购
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label-title 门店信息
          .field.is-horizontal
            label.label 省份
            .store-list
              span(v-for='item in province_list_name',v-if='province_list_name.length > 0') {{item}}
              span(v-if='province_list_name.length === 0') 请选择省
          .field.is-horizontal
            label.label 城市
            .store-list
              span(v-for='item in city_list_name',v-if='city_list_name.length > 0') {{item}}
              span(v-if='city_list_name.length === 0') 请选择市
          .field.is-horizontal
            label.label 门店
            .store-list
              span(v-for='(item,index) in store_list_name',v-if='store_list_name.length > 0')
                span {{index<9 ? '0'+(index+1):index+1}} 、{{item.store_name}} &nbsp;
                span.text-gray(v-if="item.check_status == '0'") (审核中) <br/>
                span.text-gray(v-if="item.check_status == '1'") (待发布) <br/>
                span.text-gray(v-if="item.check_status == '2'") (团购中) <br/>
                span.text-gray(v-if="item.check_status == '3'") (已拒绝) <br/>
                span.text-gray(v-if="item.check_status == '4'") (已完成) <br/>
                span.text-gray(v-if="item.check_status == '5'") (已终止) <br/>
              span(v-if='store_list_name.length === 0') 请添加门店
          .field.is-horizontal.long-field
            label.label 新增门店
            span.field-title.m-l-0 省份
            custom-select(v-model="province", :list="provinceList", @input="changePrive")
            span.field-title 城市
            custom-select(:list="city_list", v-model="city_info", @input='changeCity',:is-disabled='city_disabled')
            span.field-title 门店
            custom-select(:list="store_list", v-model="store_info", @input="changeStore",:is-disabled='store_disabled')
            a.button.primary.m-l-10(@click="addStore")
              span.add-icon
              span 添加
      .btn-wrapper
        .button-group
          a.button.primary.large(@click="addData", :class="{'disabled': isDisabled || isLoading}") 提交审核
          a.button.large(@click="goBack") 返回

</template>

<script>
  import {wordLength} from '@/mixins/custom-validators/custom-validators'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  // import {required, between} from 'vuelidate/lib/validators'
  import drawApi from '@/mixins/modules/draw'
  import Api from '@/mixins/modules/groupPurchase'


  /**
   * @vue
   */
  export default {
    name: 'GroupPurchaseStoreList',
    mixins: [validationMixin, drawApi, Api],
    components: {
      CustomSelect,
    },
    data () {
      return {
        isDisabled: false,
        isLoading: false,
        provinceList: [],
        name: '',
        city_list: [],
        store_list: [],
        provinceId: '',
        province: null,
        city_info: null,
        store_info: null,
        city_disabled: true,
        store_disabled: true,
        store_list_name: [],
        city_list_name: [],
        province_list_name: [],
        store_id_list: [],
        detail: {},
      }
    },
    methods: {
      wordLength,
      // 返回操作
      goBack () {
        this.$router.go(-1)
      },
      /* 选择活动状态
      *  @ q 活动状态
      * */
      changeStatus (q) {
        this.getStatus = q
      },
      addStore () {
        if (!this.store_info) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '请选择门店',
          })
          return
        }
        if (this.store_id_list.includes(this.store_info.id)) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '该门店已存在',
          })
          return
        }
        this.province_list_name.push(this.province.name)
        this.province_list_name = Array.from(new Set(this.province_list_name))
        this.city_list_name.push(this.city_info.name)
        this.city_list_name = Array.from(new Set(this.city_list_name))
        this.store_id_list.push(this.store_info.id)
        let params = {
          store_name : this.store_info.name,
          check_status: ''
        }
        this.store_list_name.push(params)
        this.province = null
        this.city_info = null
        this.store_info = null
        this.provinceId = null
        this.city_disabled = true
        this.store_disabled = true
      },
      addData () {
        if (this.store_list_name.length === 0) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '请添加门店',
          })
          return
        }
        if (this.store_id_list.length === this.detail.store_ids.length) {
          this.$store.dispatch('showMessage', {
            autoClose: true,
            type: 'failure',
            title: '请添加门店',
          })
          return
        }
        this.$store.dispatch('showMessage', {
          title: '提交确认',
          content: `确认提交新美大审核活动${this.name}吗？`,
          isRejectable: 1,
          resolve: () => {
            this.inspectData()
          },
        })
      },
      // 提交新美大审核
      async inspectData () {
        try {
          const {response, result} = await this.setTuanGouStoreApi({
            id: this.$route.query.id,
            store_ids: this.store_id_list.join(','),
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.$store.dispatch('showMessage', {
                autoClose: true, // 控制弹框自动消失
                type: 'success',
                title: '成功',
                content: '关联门店成功',
                resolve: () => {
                  this.$router.go(-1)
                },
              })
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '关联门店失败',
                content: `${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '关联门店失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '关联门店失败',
            content: `错误：${err}`,
          })
        }
      },
      // 获取详情
      async getDetail () {
        try {
          const {response, result} = await this.getTuanGouDetailApi(this.$route.query.id)
          if (response.status === 200) {
            if (result.code === 0) {
              this.detail = result.data
              this.name = result.data.name
              this.store_id_list = [...result.data.store_ids]
              this.store_list_name = result.data.store
              this.city_list_name = result.data.city
              this.province_list_name = result.data.province
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取团购详情失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取团购详情失败',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取团购详情失败',
            content: '服务异常，请稍后再试',
          })
        }
        this.isInitiated = true
      },
      // 获取省份
      async getSheng () {
        // fetchRegions
        try {
          const {response, result} = await this.fetchRegions()
          if (response.status === 200) {
            if (result.code === 0) {
              let arr = this.provinceList
              result.data.forEach(item => {
                arr.push(item)
              })
              this.provinceList = arr
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取省列表失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取省列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取省列表失败',
            content: `错误：${err}`,
          })
        }
      },
      // 获取对应城市
      async getFullCity () {
        try {
          const {response, result} = await this.fetchRegions({
            parent_id: this.provinceId,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.city_list = [...result.data]
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取城市列表失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取城市列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取城市列表失败',
            content: `错误：${err}`,
          })
        }
      },
      // 获取对应门店
      async getFullStore () {
        try {
          const {response, result} = await this.getStoreListApi({
            city_id: this.city_info.id,
            province_id: this.provinceId,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.store_list = [...result.data]
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取门店列表失败',
                content: `${response.status} ${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取门店列表失败',
              content: `${response.status} ${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取门店列表失败',
            content: `错误：${err}`,
          })
        }
      },
      // 选择省
      changePrive (q) {
        this.province = q
        this.city_info = null
        this.store_info = null
        this.store_disabled = true
        this.city_disabled = false
        this.provinceId = this.province.id
        this.getFullCity()
      },
      // 选择城市
      changeCity (q) {
        this.city_info = q
        this.store_disabled = false
        this.store_info = null
        this.getFullStore()
        // this.itemCity = true
      },
      changeStore (q) {
        this.store_info = q
      },
    },
    mounted () {
      this.getSheng()
      this.getDetail()
    },
  }
</script>

<style lang="stylus" scoped>
@import '~@/stylus/modules/creation-modal'
.text-gray
  color #999999
.m-l-10
  margin-left 10px
.section-layout
  height calc(100% - 56px)
.store-list
  span
    margin-right 10px
    line-height 15px
    font-size 12px
.long-field
  width 950px !important
.field-title
  font-size 13px
  margin-right 8px
  margin-left 10px
.m-l-0
  margin-left 0
</style>
