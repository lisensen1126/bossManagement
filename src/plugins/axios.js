import axios from 'axios'

axios.defaults.withCredentials = true
export let $axios = axios

export default {
  install (Vue) {
    Vue.prototype.$axios = axios
  },
}
