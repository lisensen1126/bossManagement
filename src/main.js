// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import vueRouter from 'vue-router'
import Vuelidate from 'vuelidate'
import EventHub from './plugins/EventHub'
import FetchPlugin from './plugins/Fetch'
import NotifierPlugin from './plugins/Notifier'
import './stylus/app.styl'
import VueAMap from 'vue-amap'
import Element from 'element-ui'
import echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import CyFilter from './mixins/utilities/filter'

Vue.prototype.$echarts = echarts
require('./assets/detect/download-chrome-win7-1.jpg')
require('./assets/detect/download-chrome-win7-2.jpg')
require('./assets/detect/download-chrome-win8-1.jpg')
require('./assets/detect/download-chrome-win8-2.jpg')
require('./assets/detect/download-chrome-win8-3.jpg')
require('./assets/detect/download-chrome-win10-1.jpg')
require('./assets/detect/download-chrome-win10-2.jpg')
require('./assets/detect/download-chrome-win10-3.jpg')
require('./assets/detect/download-firefox-1.jpg')
require('./assets/detect/download-firefox-2.jpg')

// use vue router
Vue.use(vueRouter)

// use Vuelidate
Vue.use(Vuelidate)

// use event hub
Vue.use(EventHub)

// use map
Vue.use(VueAMap)

// use fetch plugin
Vue.use(FetchPlugin)

// use notifier plugin
Vue.use(NotifierPlugin)

// use element-tree
Vue.use(Element)

// 使用自定义过滤器
Vue.use(CyFilter)

VueAMap.initAMapApiLoader({
  key: '30c679791e3f25d86bb94b0b6d049a97',
  plugin: ['Geocoder'],
  // plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
})
