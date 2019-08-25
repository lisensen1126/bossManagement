<template lang="pug">
  .section-layout
    .content-wrapper
      h2 报表生成
      .form-wrapper
        .field-group
          .field.is-horizontal
            label.label 小程序数据
            date-picker(type="single", placeholder="选择开始时间", v-model="start_time", @input="changeStart")
            span.margin 至
            date-picker(type="single", placeholder="选择结束时间", v-model="end_time", @input="changeEnd")
            a.button.primary.import(target="_blank", :href="`${root}/excel/export?start=${start_time}&end=${end_time}`", v-if="start_time && end_time && is_true") 导出
            a.button.import.no-click(v-else) 导出
        .field-group
          .field.is-horizontal
            label.label 小程序及ERP
            .button 选择文件
              input.file-input(type="file", name="file", @change="getFile($event)")
            .con(v-if="up_file") 已上传
            .con(v-else) 未选择文件
            a.button.margin-20(v-if="up_file", @click="upFile") 上传导出
            a.button.margin-20.no-click(v-else) 上传导出
            a.button.primary(target="_blank", :href="`${root}/excel/download`") 下载模板
</template>

<script>
  import BasicsApi from '@/mixins/modules/basics'
  import DatePicker from '@/components/generics/form/DatePicker'
  import {root} from '@/plugins/Fetch'
  import DataPicker from '../../mixins/utilities/dataPicker'

  export default {
    name: 'ReportForm',
    mixins: [BasicsApi],
    components: {
      DataPicker,
      DatePicker,
    },
    data () {
      return {
        root,
        start_time: '', // 开始时间
        end_time: '', // 结束时间
        is_true: false, // 开始是否大于结束
        up_file: '', // 上传的文件
        is_up: false, // 是否上传
      }
    },
    methods: {
      // 上传文件
      async upFile () {
        if (this.is_up) {
          return
        }
        let _this = this
        try {
          this.is_up = true
          this.allImport({
            file: this.up_file,
          }).then(function (res) {
            if (res.status === 200) {
              _this.is_up = false
              // console.log(res.data.data)
              // window.open(_this.root + res.data.data.creat_url + '?date=' + res.data.data.date)
              if (res.data.code !== 0) {
                _this.$store.dispatch('showMessage', {
                  type: 'failure',
                  title: '导出失败',
                  content: `出错啦!${res.data.message}`,
                })
              } else {
                window.open(_this.root + res.data.data.creat_url + '?date=' + res.data.data.date)
              }
            }
          }, function (err) {
            _this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '导出失败',
              content: `出错啦!${err.message}`,
            })
          })
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '导出失败',
            content: `出错啦！错误码：${err}`,
          })
        }
        _this.is_up = false
      },
      /*
       * 上传文件
       * @event 文件对象
       * */
      getFile (event) {
        let file = event.target.files[0]
        event.target.value = ''
        this.up_file = file
      },
      /*
      * 结束时间
      * @time 时间
      * */
      changeEnd (time) {
        this.end_time = time
        if (this.start_time !== '') {
          let start = this.start_time.replace(/-/g, '')
          let end = this.end_time.replace(/-/g, '')
          if (start <= end) {
            this.is_true = true
          } else {
            this.is_true = false
          }
        }
      },
      /*
      * 开始时间
      * @time 时间
      * */
      changeStart (time) {
        this.start_time = time
        if (this.end_time !== '') {
          let start = this.start_time.replace(/-/g, '')
          let end = this.end_time.replace(/-/g, '')
          if (start <= end) {
            this.is_true = true
          } else {
            this.is_true = false
          }
        }
      },
    },
    mounted () {
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/modules/creation-modal'
  .form-wrapper
    border-bottom none
  .field-group
    border-bottom none
  .margin
    margin 0 20px
    font-size 14px
  .import
    margin-left 20px
  .no-click
    cursor: not-allowed
  .file-input
    width 100%
    height 100%
    position absolute
    top 0
    left 0
    opacity 0
  .margin-20
    margin 0 20px
  .con
    width 80px
    font-size 14px
    color #ddd
    vertical-align bottom
    margin-left 10px
</style>
