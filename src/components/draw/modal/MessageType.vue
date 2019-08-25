<template lang="pug">
.slide-layout
    .slide-title 推荐客户
    .list-checkbox
      .list-item(v-for="(item, index) in list")
        .checkbox
          input(type="checkbox", :id="'type' + index", v-model="item.checked")
          label(:for="'type' + index", v-text="item.name")
        .num(v-if="item.id === 1") {{info.all_store_boss ? info.all_store_boss.total : 0}}人
        .num(v-if="item.id === 2") {{info.all_boss_customer ? info.all_boss_customer.total : 0}}人
    .btn
      button.button.large.primary(@click="saveInfo" v-text="'确定'")
</template>

<script>
import Api from '@/mixins/modules/draw'
export default {
  name: 'MessageType',
  mixins: [Api],
  components: {
  },
  props: {
    id: {
      type: [String, Number],    // id = 3时，只展示小程序下单用户，小程序注册用户
    },
  },
  data () {
    return {
      list: [
        {
          name: '所有门店老板',
          checked: false,
          id: 1,
        },
        {
          name: '所有Boss平台客户',
          checked: false,
          id: 2,
        },
      ],
      info: {},
    }
  },
  methods: {
    // 获取分类id
    saveInfo () {
      let brandIds = []
      this.list.forEach(v => {
        if (v.checked) {
          if (v.id === 1) {
            brandIds.push({
              id: v.id,
              list: this.info.all_store_boss.data,
            })
          } else if (v.id === 2) {
            brandIds.push({
              id: v.id,
              list: this.info.all_boss_customer.data,
            })
          }
        }
      })
      if (brandIds.length === 0) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '温馨提示',
          content: '请选择推荐客户',
        })
        return false
      }
      this.$emit('success', brandIds)
    },
    // 获取分类数据
    async fetchCategory () {
      try {
        const {response, result} = await this.getSmsRecListApi()
        if (response.status === 200 && result.code === 0) {
          this.info = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取推荐客户失败',
            content: result.message,
          })
        }
      } catch (err) {
        console.log(err)
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取推荐客户失败',
          content: '服务异常，请稍后再试',
        })
      }
    },
  },
  mounted () {
    this.fetchCategory()
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
  .num
    float right 
    font-size 12px
    color #666
</style>
