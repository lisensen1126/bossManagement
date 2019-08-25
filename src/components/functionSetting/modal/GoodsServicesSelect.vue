<template>
  <div class="choose-tab">
    <el-cascader
      v-model="value"
      :options="options"
      @active-item-change="handleItemChange"
      :props="props"
      size="small"
      @change="changeValue"
    ></el-cascader>
  </div>
</template>

<script>
  import productServiceMixin from '@/mixins/modules/boss'
  export default {
    name: 'ChooseTab',
    mixins: [productServiceMixin],
    data () {
      return {
        value: [],
        options: [{
          label: '全部',
        }, {
          label: '商品',
          cities: [],
        }, {
          label: '服务',
          cities: [],
        }],
        props: {
          value: 'label',
          children: 'cities',
        },
        good_first: [], // 商品分类一级
        good_second: [], // 商品分类二级
        serve_first: [], // 服务分类一级
        serve_second: [], // 服务分类二级
      }
    },
    methods: {
      changeValue () {
        let _this = this
        let arr = []
        if (_this.value.length === 1) {
          arr = [0]
        }
        if (_this.value.length > 1) {
          if (_this.value[0] === '商品') {
            arr[0] = 1
            if (_this.value[1] === '全部') {
              arr[1] = 0
            } else {
              _this.good_first.forEach(item => {
                if (item.category_name === _this.value[1]) {
                  arr[1] = item.category_id
                }
              })
              if (_this.value.length === 3) {
                if (_this.value[2] === '全部') {
                  arr[2] = 0
                } else {
                  _this.good_second.forEach(item => {
                    if (item.category_name === _this.value[2]) {
                      arr[2] = item.category_id
                    }
                  })
                }
              }
            }
          } else {
            arr[0] = 2
            if (_this.value[1] === '全部') {
              arr[1] = 0
            } else {
              _this.serve_first.forEach(item => {
                if (item.category_name === _this.value[1]) {
                  arr[1] = item.category_id
                }
              })
              if (_this.value.length === 3) {
                if (_this.value[2] === '全部') {
                  arr[2] = 0
                } else {
                  _this.serve_second.forEach(item => {
                    if (item.category_name === _this.value[2]) {
                      arr[2] = item.category_id
                    }
                  })
                }
              }
            }
          }
        }
        this.$emit('success', arr)
      },
      parentMsg () {
        this.value = []
      },
      handleItemChange (val) {
        let length = val.length
        let _this = this
        if (val.indexOf('商品') > -1 && length === 1) {
          setTimeout(_ => {
            this.options[1].cities = _this.good_first
          }, 300)
        }
        if (val.indexOf('服务') > -1 && length === 1) {
          this.options[2].cities = _this.serve_first
        }
        if (val.indexOf('商品') > -1 && length === 2) {
          let name = val[1]
          let nowIndex = 0
          let parentId = 0
          this.good_first.forEach((item, index) => {
            if (name === item.category_name) {
              nowIndex = index
              parentId = item.category_id
            }
          })
          this.getGood(parentId)
          setTimeout(_ => {
            this.options[1].cities[nowIndex].cities = _this.good_second
          }, 500)
        }
        if (val.indexOf('服务') > -1 && length === 2) {
          let name = val[1]
          let nowIndex = 0
          let parentId = 0
          this.serve_first.forEach((item, index) => {
            if (name === item.category_name) {
              nowIndex = index
              parentId = item.category_id
            }
          })
          this.getSever(parentId)
          setTimeout(_ => {
            this.options[2].cities[nowIndex].cities = _this.serve_second
          }, 500)
        }
      },
      async getGood (parentId) {
        try {
          const {response, result} = await this.classifyList({
            type: 1,
            parent_id: parentId,
            hide_loading: true,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              let data = result.data
              data.forEach(item => {
                if (parentId - 0 === 0) {
                  item.cities = []
                }
                item.label = item.category_name
              })
              data.unshift({label: '全部'})
              if (parentId - 0 === 0) {
                this.good_first = data
              } else {
                this.good_second = data
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取商品分类失败',
                content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取商品分类失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取商品分类失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      async getSever (parentId) {
        try {
          const {response, result} = await this.classifyList({
            type: 2,
            parent_id: parentId,
            hide_loading: true,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              let data = result.data
              data.forEach(item => {
                if (parentId - 0 === 0) {
                  item.cities = []
                }
                item.label = item.category_name
              })
              data.unshift({label: '全部'})
              if (parentId - 0 === 0) {
                this.serve_first = data
              } else {
                this.serve_second = data
              }
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取服务分类失败',
                content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取服务分类失败',
              content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取服务分类失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
    },
    async mounted () {
      this.getGood(0)
      this.getSever(0)
    },
  }
</script>

<style lang="stylus">
  .choose-tab
    .el-cascader--small
      border: 1px solid #c2c2c2
      border-radius 0px
      line-height 30px
    .el-input__inner
      border: none
      line-height 30px
      height 30px
      border-radius 0px
    .el-input
      width: 320px
</style>
