export default {
  data () {
    return {
      rootFilterData: {},
    }
  },
  methods: {
    resetFilterData (data) {
      for (let prop in data) {
        data[prop] = undefined
      }
      this.switchFilterData(this.rootFilterData, this.filterData)
    },
    switchFilterData (from, to) {
      if (this.isEmptyObject(from)) {
        for (let prop in to) {
          to[prop] = undefined
        }
      } else {
        for (let prop in from) {
          to[prop] = from[prop]
        }
      }
    },
    getIdOfparams (params) {
      return params ? params.id : undefined
    },
    isEmptyObject (e) {
      for (let t in e) {
        return false
      }
      return true
    },
  },
  mounted () {
    this.switchFilterData(this.filterData, this.rootFilterData)
  },
}
