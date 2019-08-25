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
  import bossMixin from '@/mixins/modules/boss'  // 接口文件
  export default {
    mixins: [bossMixin],
    components: {
    },
    // 接收父组件传递过来的组件 接收的参数不做类型校验
    props: {
      classType: '',    // 判断是商品分类or服务分类
      relationItem: null,     // 关联分类的id
      category_id: {
        type: [String, Number],
      },
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
              item.is_select = false
              if (tempArr.brands.length && tempArr.brands.length > 0) {
                let hasBrand = tempArr.brands.some(brand => {
                  return brand.brand_id === item.brand_id
                })
                if (hasBrand) {
                  item.checked = true
                }
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
      // 保存操作
      async saveInfo () {
        let arr = [
          {
            brand_name: '全部',
            brand_id: 'all',
            is_select: true,
          },
        ]
        let brandIds = []
        this.list.forEach(v => {
          if (v.checked) {
            arr.push(v)
            brandIds.push(v.brand_id)
          }
        })
        try {
          const {response, result} = await this.setClassifyBrandListApi({
            category_id: this.category_id,
            brand_ids: brandIds,
          })
          if (response.status === 200 && result.code === 0) {
            this.$emit('success', arr)
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '错误',
              content: result.message,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '保存品牌失败',
            content: `出错啦！错误码：${err}`,
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
