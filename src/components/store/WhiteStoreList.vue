<template lang="pug">
  .section-layout
    .section-filter
      .field-group.is-horizontal
        .field.name_keyword-wrapper
          label.label 门店名称
          custom-input(v-model="store_name", placeholder="请输入门店名称", @keyupEnter="addStore")
        .field
          a.button.primary.export(@click="addStore") 添加
    empty-page(v-if="!(list && list.length)", :tip="'当前没有白名单门店'")
    .content-wrapper.list-wrapper(v-if="list && list.length")
      .table-wrapper
        table.table
          thead
            tr
              td(width="60") 已添加门店名称
              td(width="60") 操作人
              td(width="40") 添加时间
          tbody(v-if="list.length")
            tr(v-for="(item, index) in list")
              td
                .simple-td {{item.store_name}}
              td
                .simple-td {{item.operator_name}}
              td
                .simple-td(v-text="formateDate(item.created_at)")
</template>

<script>
  import CustomInput from '@/components/generics/form/CustomInput'
  import enterpriseMixin from '@/mixins/modules/enterprise'
  import EmptyPage from '@/components/generics/EmptyPage'
  import formateDate from '@/mixins/utilities/formateDate'
  export default {
    name: 'WhiteStoreList',
    mixins: [enterpriseMixin, formateDate],
    components: {
      CustomInput,
      EmptyPage,
    },
    data () {
      return {
        list: [],
        store_name: '',
      }
    },
    methods: {
      // 添加门店按钮
      async addStore () {
        if (this.store_name === '') {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: '请输入门店名称',
          })
          return
        }
        let isExist = false
        this.list.forEach(item => {
          if (this.store_name === item.store_name) isExist = true
        })
        if (isExist) {
          this.$store.dispatch('showMessage', {
            title: '提示',
            content: '门店已存在',
          })
          return
        }
        try {
          const { response, result } = await this.addWhiteStoreApi({
            store_name: this.store_name,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.store_name = ''
              this.fetchData()
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '添加失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '添加失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '添加失败')
        }
      },
      // 门店列表
      async fetchData () {
        try {
          const { response, result } = await this.whiteStoreListApi({
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.list = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取白名单门店列表失败',
                content: result.message,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取白名单门店列表失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '白名单')
        }
      },
    },
    mounted () {
      this.fetchData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
</style>


