<template lang="pug">
  .custom-select
    .custom-select-area(@click.stop="toggleDropdown", :class="{'is-disabled': isDisabled, 'is-error': validator && validator.$error}")
      input.custom-select-input(:placeholder="placeholder", readonly="readonly", type="text", :disabled="isDisabled", :title="value && value[nameField]", :value="value && value[nameField]")
      span.custom-select-arrow
      .error-icon(v-if="validator && validator.$error")
      .error-info(v-if="validator && validator.$error", v-text="errorInfo")
    .custom-select-list(v-if="isExpanded")
      input.custom-select-input.custom-select-search(v-if="showSearch", v-model="searchKey", :placeholder="'快速检索'", type="text",@focus="changeInputFlag(1)",@blur="changeInputFlag(0)")
      .custom-select-item(v-if="isNullable", :class="{'selected': value && value[nameField] === candidateNull[nameField]}", :title="candidateNull[nameField]", v-text="candidateNull[nameField]", @click="selectCandidate(candidateNull)")
      .custom-select-item(v-for="candidate in filterList", :class="{'selected': value === candidate}", :title="candidate[nameField]", v-text="candidate[nameField]", @click="selectCandidate(candidate)")
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    value: {
      type: Object,
    },
    isNullable: {
      type: Boolean,
      default: false,
    },
    showSearch: {
      type: Boolean,
      default: false,
    },
    candidateNull: {
      type: Object,
      default: () => ({
        name: '全部',
      }),
    },
    list: {
      type: Array,
      default: () => [],
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
      type: '',
      default: false,
    },
    nameField: {
      type: String,
      default: 'name',
    },
  },
  data () {
    return {
      // utils
      isExpanded: false,
      searchKey: '', // 输入的搜索关键字
      isInput: false, // 正在搜索框输入的标志位
    }
  },
  computed: {
    filterList: function () {
      let _this = this
      if (!_this.searchKey) {
        return _this.list
      } else {
        return _this.list.filter(function (item) {
          return item[_this.nameField].toLowerCase().indexOf(_this.searchKey.toLowerCase()) !== -1
        })
      }
    },
  },
  methods: {
    // 修改搜索框的标志位，为了防止点击输入框的时候下拉框隐藏
    changeInputFlag (flag) {
      if (flag) {
        this.isInput = true
      } else {
        this.isInput = false
      }
    },
    selectCandidate (candidate) {
      this.$emit('input', candidate)
    },
    findCandidateById (id) {
      return this.list.find(candidate => candidate.id === id)
    },
    expandDropdown () {
      this.$hub.$emit(this.$hub.events.collapseDataPickers, this)
      this.isExpanded = true
    },
    collapseDropdown () {
      this.isExpanded = false
      this.searchKey = '' // 清空输入的搜索关键字
    },
    toggleDropdown () {
      if (this.isDisabled) {
        return
      }
      if (this.isExpanded) {
        this.collapseDropdown()
      } else {
        this.expandDropdown()
      }
    },
  },
  mounted () {
    // collapse on body click
    this._onBodyClick = () => {
      if (this.isInput) {
        return false
      }
      this.collapseDropdown()
    }
    this.$hub.$on(this.$hub.events.bodyClick, this._onBodyClick)
    // collapse on hub event
    this._onCollapseDataPickers = (source) => {
      if (this !== source) {
        this.collapseDropdown()
      }
    }
    this.$hub.$on(this.$hub.events.collapseDataPickers, this._onCollapseDataPickers)
  },
  beforeDestroy () {
    this.$hub.$off(this.$hub.events.bodyClick, this._onBodyClick)
    this.$hub.$off(this.$hub.events.collapseDataPickers, this._onCollapseDataPickers)
  },
}
</script>
