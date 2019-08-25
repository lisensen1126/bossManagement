// import modalSupervisor from './modalSupervisor'

/**
 * # modal
 *
 * [props]
 * - value: Boolean  Modal visibility status
 */
export default {
  // data: modalSupervisor.data,
  props: {
    value: Boolean,
  },
  methods: {
    modalClose () {
      this.$emit('input', false)
    },
    modalResolve () {
      this.modalClose()
      this.$emit('resolve', ...arguments)
    },
    modalReject () {
      this.modalClose()
      this.$emit('reject', ...arguments)
    },
    modalUpdate () {
      this.$emit('update', ...arguments)
    },
  },
  // mounted: modalSupervisor.mounted,
  // destroyed: modalSupervisor.destroyed,
}
