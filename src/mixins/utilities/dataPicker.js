export default {
  props: {
    value: {
      type: Object,
    },
    isNullable: {
      type: Boolean,
      default: true,
    },
    candidateNull: {
      type: Object,
      default: () => ({
        name: '全部',
      }),
    },
    placeholder: {
      type: String,
      default: '请选择',
    },
    validator: {
      type: Object,
      default: null,
    },
    errorInfo: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    nameField: {
      type: String,
      default: 'name',
    },
  },
  data () {
    return {
      result: this.isNullable ? this.candidateNull : this.value,
    }
  },
  computed: {
    list () {
      return this.allCandidates
    },
  },
  watch: {
    result (newResult) {
      this.$emit('input', newResult)
    },
    value (val) {
      this.result = this.value || this.candidateNull
    },
  },
}
