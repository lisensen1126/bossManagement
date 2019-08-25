<template lang="pug">
  .slide-layout
    .slide-title(v-text="'关联品牌'")
    .list-checkbox
      .list-item(v-for="(item, index) in list")
        .checkbox
          input(type="checkbox", :id="'brand' + index", v-model="item.checked")
          label(:for="'brand' + index", v-text="item.brand_name")
    .btn
      button.button.large.primary(@click="saveInfo" v-text="'保存'")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import CustomSelect from '@/components/generics/form/CustomSelect'
  import {validationMixin} from 'vuelidate'
  import bossMixin from '@/mixins/modules/boss'  // 接口文件
  export default {
    mixins: [validationMixin, bossMixin],
    components: {
      CustomInput,
      CustomSelect,
    },
    // 接收父组件传递过来的组件 接收的参数不做类型校验
    props: {
      classType: '',    // 判断是商品分类or服务分类
      relationItem: null,     // 关联分类的id
    },
    // 数据初始化
    data () {
      return {
        list: [],
      }
    },
    methods: {
      // 获取品牌列表
      async getBrandList () {
        try {
          const {response, result} = await this.brandList({
            is_page: 2,
            source_type: 1,
          })
          if (response.status === 200) {
            let tempArr = this.relationItem
            this.list = result.data.map(function (item, index) {
              let hasBrand = tempArr.brands.some(brand => {
                return brand.brand_id === item.brand_id
              })
              if (hasBrand) {
                item.checked = true
              }
              return item
            })
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
      // 保存成功
      saveSuccess () {
        this.$emit('callback', this.submitData.id)
      },
      // 格式化数据
      formatData () {

      },
      // 统计选中的品牌
      statisticsData () {
        let tempArray = []
        this.list.forEach(item => {
          if (item.checked) {
            tempArray.push(item.brand_id)
          }
        })
        return tempArray
      },
      // 保存操作
      async saveInfo () {
        let hasChoosed, choosedArr
        hasChoosed = this.list.some(item => {
          return item.checked === true
        })
        if (!hasChoosed) {
          return
        }
        choosedArr = this.statisticsData()

        try {
          const {response, result} = await this.classifyRelationBrand({
            category_id: this.relationItem.category_id,
            brand_ids: choosedArr,
          })
          if (response.status === 200 && result.code === 0) {
            this.$store.dispatch('showMessage', {
              autoClose: true, // 控制弹框自动消失
              type: 'success',
              title: '关联成功',
              resolve: () => this.$emit('callback'),
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '关联品牌失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    mounted () {
      this.getBrandList()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins'
  .list-checkbox
    padding-bottom 30px
    .list-item
      height 30px
      line-height 30px
      .checkbox label
        padding-left 30px
</style>
