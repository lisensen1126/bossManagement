<template lang="pug">
  .control
    el-amap.amap-box(vid="amap", :zoom="zoom", :amap-manager="amapManager", :center="center", :events="events")
      el-amap-marker(vid="component-marke", :position="position", v-if="hasMarker")
    a.button.reposition(@click="getLocation()") 重新定位
</template>

<script>
  import VueAMap from 'vue-amap'
  let amapManager = new VueAMap.AMapManager()
  export default {
    name: 'LocationMap',
    props: {
      address: {
        type: String,
        default: '',
      },
      radius: {
        type: Number,
        default: 500,
      },
      lng: {
        type: Number,
        default: 121.59996,
      },
      lat: {
        type: Number,
        default: 31.197646,
      },
    },
    data () {
      const self = this
      return {
        zoom: 12,
        amapManager,
        hasMarker: false,
        position: [self.lng || 121.59996, self.lat || 31.197646],
        center: [self.lng || 121.59996, self.lat || 31.197646],
        events: {
          click (e) {
            let { lng, lat } = e.lnglat
            self.position = [lng, lat]
            self.center = [lng, lat]
            self.lngChange(e)
            // 这里通过高德 SDK 完成。
            // var geocoder = new AMap.Geocoder({
            //   radius: this.radius,
            // })

            // geocoder.getAddress([lng, lat], function (status, result) {
            //   if (status === 'complete' && result.info === 'OK') {
            //     if (result && result.regeocode) {
            //       console.log(result.regeocode.formattedAddress)
            //     }
            //   }
            // })
          },
        },
      }
    },
    // watch: {
    //   address (val) {
    //     if (val !== '') {
    //       this.getLocation()
    //     } else {
    //       this.hasMarker = false
    //     }
    //   },
    // },
    methods: {
      getLocation (params) {
        const self = this
        let address = params ? params.address : this.address

        const geocoder = new AMap.Geocoder({
          radius: self.radius, // 范围，默认：500
        })
        // 地理编码,返回地理编码结果
        geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // this.markers[0].position = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
            this.position = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
            this.center = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
            this.hasMarker = true
            self.$emit('change', {lng: result.geocodes[0].location.lng, lat: result.geocodes[0].location.lat})
          } else {
            this.$store.dispatch('showMessage', {
              type: 'warning',
              title: '警告',
              content: '定位失败，请填写正确的地址信息',
            })
          }
        })
      },
      /**
       * 根据经纬度标记
       */
      lngLatLocation (params) {
        let self = this
        let lng = params.lng
        let lat = params.lat

        var geocoder = new AMap.Geocoder({
          radius: this.radius,
        })
        geocoder.getAddress([lng, lat], function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            if (result && result.regeocode) {
              self.position = [lng, lat]
              self.center = [lng, lat]
              self.hasMarker = true
            }
          }
        })
      },
      // 传给父组件数据
      lngChange (e) {
        this.$emit('change', {lng: e.lnglat.lng, lat: e.lnglat.lat})
      },
    },
    mounted () {
      // !!this.address && this.getLocation()
    },
  }
</script>

<style lang="stylus" scoped>
.amap-box
  width 400px
  height 200px
.reposition
  width 102px
  margin-top 8px
</style>