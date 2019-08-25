import {events, hub} from '@/plugins/EventHub'

// modal supervisor
export default (() => {
  let counter = 2100
  return {
    data () {
      return {
        zIndex: 'auto',
        isTopmost: true,
      }
    },
    methods: {
      onModalChange (currentCounter) {
        this.isTopmost = this.zIndex === currentCounter
      },
    },
    mounted () {
      this.zIndex = ++counter
      hub.$emit(events.modalChange, counter)
      hub.$on(events.modalChange, this.onModalChange)
    },
    destroyed () {
      --counter
      hub.$emit(events.modalChange, counter)
      hub.$off(events.modalChange, this.onModalChange)
    },
  }
})()
