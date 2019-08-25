<template lang="pug">
  .slide-layout
    .slide-title 车检详情
      .field-group
        .field
          .vehicle-info-section.car-logo
            .logo(v-if="info.logo")
              img(:src="scaleImage(info.logo, 1, 40, 40)")
            .logo(v-else)
              img(src="https://oss1.chedianai.com/images/assets/default_car.png?imageView2/1/w/40/h/40")
            .license(v-if="info.vehicle_name && info.vehicle_name.length >= 0", :title="info.vehicle_name", v-text="info.vehicle_name")
            .vehicle-model
              span {{info.license_plate}}
              span    已行驶{{info.mileage}}KM
        .field.text
          label.left 技师
          span.right {{info.technician_name}}
        .field.text
          label.left 商家
          span.right {{info.store_name}}
        .field.text
          label.left 检测日期
          span.right {{changeDateTime(info.inspect_time)}}
      feature-tabs.feature-tabs(v-model="currentTab", :tabs="tabs", @input="getTab", :fontSize="fontSize")
      .tab-content
        .tab-content-item(v-if="currentTab && currentTab.data")
          .tab-content-block(v-for="item in currentTab.data.category")
            .content-item-title {{item.name}}
            .item-content(v-for="category_item in item.category_item")
              .profiled.flex.between
                .labeltitle {{category_item.name}}
                .projectbox
                  .project(v-for="point in category_item.point") {{point.name}}
              .profiled.flex(v-if="currentTab.id === 'exception'")
                .labeltitle 异常问题:
                .question-list
                  .question-li(v-for="(v, cindex) in category_item.exception") {{cindex+1}}.{{v.name}}
              .profiled.flex(v-if="currentTab.id === 'exception'")
                .labeltitle 异常建议:
                .question-list
                  .question-li(v-for="(v,cindex) in category_item.exception_advice") {{cindex+1}}.{{v.name}}
              .profiled.flex(v-if="currentTab.id === 'exception'")
                .labeltitle 技师备注:
                .question-list
                  .question-li {{category_item.technician_comment}}
              .profiled.flex.between(v-if="currentTab.id === 'exception'")
                .labeltitle 详情图:
                .question-list 查看大图
              .profiled.flex.imgbox(v-if="currentTab.id === 'exception'")
                open-image(img-type="2",:img-url="category_item.exception_image",key-name="",mini-width="60",mini-height="60",margin-bottom="0", margin-right="5", border-radius="5")
              .profiled.flex.between(v-if="currentTab.id === 'exception'")
                .labeltitle 视频:
              .profiled.flex.imgbox(v-if="currentTab.id === 'exception'")
                video.video(:src="category_item.exception_video[0]", controls="controls", :poster="category_item.exception_video[0] + '?vframe/jpg/offset/1'")
</template>

<script>
  import imageScale from '@/mixins/utilities/imageScale'
  import FeatureTabs from '@/components/generics/FeatureTabs'
  import clientMixin from '@/mixins/modules/Customer'
  import OpenImage from '@/components/generics/OpenImage'
  export default {
    name: 'ClientCarModal',
    mixins: [imageScale, clientMixin],
    components: {
      FeatureTabs,
      OpenImage,
    },
    props: {
      id: [String, Number],
    },
    data () {
      return {
        info: {},
        fontSize: true,
        currentTab: {},
        tabs: [],
      }
    },
    computed: {
    },
    methods: {
        /**
       * 时间戳转年月日
       * @val  时间戳
       */
      changeDateTime (val) {
        if (!val) {
          return ''
        }
        let date = new Date(val * 1000)
        let Y = date.getFullYear() + '-'
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        let D = this.judgeTime(date.getDate()) + ' '
        let h = this.judgeTime(date.getHours()) + ':'
        let m = this.judgeTime(date.getMinutes())
        return Y + M + D + h + m
      },
      /**
       * 时 分 格式化
       * @t  时分
       */
      judgeTime (t) {
        if (t < 10) {
          return '0' + t
        } else {
          return t
        }
      },
      // 获取车检详情
      async fetchDetail () {
        try {
          const { response, result } = await this.fetchReportDetailApi({
            id: this.id,
          })
          if (response.status === 200) {
            if (result.code === 0) {
              this.info = result.data
            } else {
              this.$store.dispatch('showMessage', {
                type: 'failure',
                title: '获取车检报告详情失败',
                content: `出错啦！${result.message}`,
              })
            }
          } else {
            this.$store.dispatch('showMessage', {
              type: 'failure',
              title: '获取车检报告详情失败',
              content: `出错啦！${result.message}`,
            })
          }
        } catch (err) {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取客户详情失败',
            content: `服务异常，请稍后再试（${err.response ? err.response.status : err}${err.result && err.result.code ? ' ' + err.result.code : ''}）`,
          })
        }
      },
      // 初始化详情信息的tab
      initTab () {
        this.tabs = [
          {
            id: 'exception',
            title: '异常点' + this.info.exception_count,
            data: this.info.exception_data,
          },
          {
            id: 'pending',
            title: '待观察' + this.info.pending_count,
            data: this.info.pending_data,
          },
          {
            id: 'normal',
            title: '正常点' + this.info.normal_count,
            data: this.info.normal_data,
          },
          {
            id: 'noninspect',
            title: '未检测' + this.info.noninspect_count,
            data: this.info.noninspect_data,
          },
        ]
        this.currentTab = this.tabs[0]
      },
      // 车型信息格式化
      vehicleTypeName (vehicle) {
        return `${vehicle.brand_name} ${vehicle.series_name ? vehicle.series_name + '-' : vehicle.model_name} ${vehicle.product_year ? vehicle.product_year + '款' : ''} ${vehicle.vehicle_name}`
      },
      // tab切换
      getTab (data) {
        this.currentTab = data
      },
    },
    async mounted () {
      await this.fetchDetail()
      this.initTab()
    },
  }
</script>

<style lang="stylus" scoped>
  .vehicle-info-section {
    position: relative;
    padding: 16px 0 8px;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }

    &:last-of-type::after {
      display: none;
    }

    .logo {
      position: absolute;
      top: 16px;
      left: 0;
      width: 40px;
      height: 40px;
      background-color: #fafafa;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .license {
      font-size: 14px;
      line-height: 20px;
      color: darker;
      word-break:keep-all;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }

    .vehicle-model {
      margin: 2px 0 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .comment {
      margin-bottom: 8px;
      font-size: 12px;
      line-height: 16px;
      color: lightGrey;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
      line-height: 24px;
      color: darker;

      .info-content {
        text-align: right;
      }

      .tip-info {
        font-size: 12px;
        line-height: 16px;
        color: lightGrey;
      }
    }
  }

  .car-logo {
    padding-left: 48px;
    padding-right: 60px;
    &::after {
      border: none;
    }

    .car-edit {
      position: absolute;
      right: 10px;
      top: 50%;
      margin-top: -20px;
      line-height: 40px;
      color: #2FABDD;
      font-size: 13px;
      cursor: pointer;
      display: none;
    }
  }

  .car-logo:hover {
    .car-edit {
      display: block;
    }
  }
  .text{
    font-size 14px
    display flex
    margin-top 5px !important
    justify-content space-between
  }
  .tab-content-item{
    font-size 12px
    color #333
    padding: 10px 0 8px
    .imgbox{
      padding-top 5px
      img{
        width 80px
        height 80px
      }
    }
    .content-item-title{
      font-weight 500
    }
    .item-content{
      padding-left 10px
      padding-top 12px
      padding-bottom 6px
      border-bottom 1px solid #666
      &:first-child{
        padding-top 0
      }
      &:last-child{
        border-bottom 0
      }
    }
    .flex{
      display flex
      justify-content flex-start
    }
    .between{
      justify-content space-between
    }
    .projectbox{
      padding-left 10px
      .project{
        display: inline-block
        padding: 0 8px
        border:1px solid #888
        border-radius 4px
        height: 30px
        line-height 30px
        margin-left 6px
      }
    }
    .question-list{
      padding-left 10px
      width 240px
      word-break break-all
    }
  }
  .video{
    width: 100%;
    height: 260px;
  }

</style>

