<template lang="pug">
  .section-layout
    .content-wrapper
      .form-wrapper
        //- 时间筛选
        .time()
          date-picker.picker(type="range", placeholder="请选择日期范围", v-model="sale_picker_time")
          .searchBtn
            a.button.primary(@click="saleCheckTime") 搜索
          .searchBtn
            a.button(@click="reset") 重置

        //- 图表展示
        div.cartogram-chart
          .chart-title
            div.tab-content.trend 走势图
          div.my-chart(id="my-chart-sale")
</template>

<script>
  import Api from '@/mixins/modules/reportForm'
  import DatePicker from '@/components/generics/form/DatePicker'
  export default {
    name: 'EcharReport',
    mixins: [Api],
    components: {
      DatePicker,
    },
    data () {
      return {
        sale_check_type: 1,   // 销量统计 筛选type
        sale_picker_time: '',     // 销量统计时间区间
        customColor: '#EB8705',   // 进度条颜色
        chart_data: {},  // 图表数据
        spike_name: '',   // 养护卡/商品名称
        good_type: this.$route.query.good_type - 0,
      }
    },
    methods: {
      // 销量统计走势图
      drawSale () {
        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('my-chart-sale'))
        // 图表参数
        let option = {
          // color: ['#89cfdc', '#003c88'],
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['实收金额', '订单数量', '交易门店数']
          },
          toolbox: [
            {
              show: true,
              feature: {
                mark: {show: true},
                dataView: {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                restore: {show: true},
                saveAsImage: {show: true}
              }
            }
          ],
          calculable: true,
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.getKeys(this.chart_data.daily_amount),
              // axisPointer: {
              //   type: 'shadow',
              // },
            },
          ],
          yAxis: [
            {
              type: 'value',
              // name: '收入/元',
            },
          ],
          series: [
            {
              name: '实收金额',
              type: 'line',
              data: this.getValuesNew(this.chart_data.daily_amount),
            },
            {
              name: '订单数量',
              type: 'line',
              data: this.getValues(this.chart_data.daily_order_count),
            },
            {
              name: '交易门店数',
              type: 'line',
              data: this.getValues(this.chart_data.daily_store_count),
            },
          ],
        }
        // 绘制图表
        myChart.setOption(option, true)
      },
      /**
       * 时间切换
       * @type 1 本日 2 本月 0 时间区间
       */
      saleCheckTime () {
        this.getChartsData()
        console.log(this.sale_check_type)
      },
      reset () {
        this.sale_picker_time = ''
        this.saleCheckTime()
      },
      // 获取图表数据
      async getChartsData () {
        try {
          const { response, result } = await this.GetEcharReportSumApi({
            end_time: this.sale_picker_time ? new Date(this.sale_picker_time.split(' 至 ')[1] + ' 23:59:59').getTime() / 1000 : '',
            start_time: this.sale_picker_time ? new Date(this.sale_picker_time.split(' 至 ')[0] + ' 00:00').getTime() / 1000 : '',
          })
          if (response.status === 200 && result.code === 0) {
            this.chart_data = result.data
            this.drawSale()
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取海报数据失败',
              content: result.message,
            })
          }
        } catch (err) {
          console.error(err, '数据统计')
        }
      },
      // 取对象的key值
      getKeys (obj) {
        let arr = []
        arr = Object.keys(obj)
        return arr
      },
      // 取对象的键值
      getValues (obj) {
        let arr = []
        arr = Object.values(obj)
        return arr
      },
      // 取对象的键值
      getValuesNew (obj) {
        let arr = []
        arr = Object.values(obj)
        arr.forEach((v, i) => {
          arr[i] = v / 100
        })
        return arr
      },
      // 计算图表进度条
      getProgress (length) {
        return (10 / length) * 100
      },
    },
    mounted () {
      this.spike_name = this.$route.query.spike_name
      this.getChartsData()
    },
  }
</script>

<style lang="stylus" scoped>
  @import '~@/stylus/mixins';
  .section-layout{
    background: #ffffff;
    height: calc(100% - 48px)
    margin: 10px 25px;
    border-radius: 5px;
    padding-bottom: 60px;
  }
  .content-wrapper{
    margin: 0;
    padding 20px 16px 16px;
    overflow-y auto;
    max-height 100%;
  }
  .section-filter{
    padding: 20px 0 20px;
    background: #ffffff;
    height: auto;
  }
  .nav-back-btn{
    position absolute
    top -49px
    left 16px
    width 32px
    height 32px
    border-radius 100%
    background #CED3DC center no-repeat url('~@/assets/back.svg')
    background-size 16px
    box-shadow 0 2px 6px 0 rgba(0, 0, 0, .08)
    cursor pointer
    z-index 21
  }
  .order-data{
    height: auto;
    border: 1px solid #eeeeee;
    width: 290px;
    height: 195px;
  }
  .order-data-title{
    border-bottom 1px solid #eeeeee
    display flex
    justify-content space-between
    align-items flex-end
    padding 10px 10px
    .label{
      margin 0
    }
    .label-title{
      font-weight bold
      font-size 14px
    }
  }
  .order-data-content{
    display flex
    justify-content space-between
    align-items center
    padding 0 15px
    .order-data-left, .order-data-right{
      width 135px
      text-align center
    }
    .all-order, .all-order-num{
      color #404040
      font-weight 600
      font-size 16px
      margin-top 10px
    }
    .all-order-num{
      margin-top 8px
    }
    .all-order-per{
      font-size 14px
      color #666
      margin-top 14px
    }
  }
  .order-progress{
    padding 0 15px
    margin-top 16px
    .progress-title{
      font-size 12px
      color #666
      margin-top 10px
      text-align center
    }
  }
  .cartogram-chart{
    width 100%
    height auto
    border 1px solid #eeeeee
    padding 16px
  }
  .my-chart{
    width: 100%
    height: 350px
  }
  .chart-title{
    display flex
    justify-content space-between
    align-items center
    .trend{
      font-weight 600
      margin-left 10px
    }
  }
  .time {
    border-radius: 3px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .time .day, .time .month{
    width: 78px;
    height: 32px;
    border: 1px solid #D9D9D9;
    line-height: 32px;
    text-align: center;
    font-size: 14px;
    border-radius: 3px;
    background: #D9D9D9;
    color: #9A9B9A;
    cursor: pointer;
    margin-right: 8px;
  }
  .time .searchBtn {
    margin-left 30px;
  }
  .active {
    color: #121212!important;
    background: #FFFFFF!important;
  }
  .chart-order{
    margin-top 10px
  }
  .picker{
    width 255px !important
  }
</style>
