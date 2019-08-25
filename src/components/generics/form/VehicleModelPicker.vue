<template lang="pug">
  .field-group.is-horizontal
    .field
      label.label 车辆品牌
      .custom-select
        .custom-select-area
          input.custom-select-input(placeholder="请选择品牌", readonly="readonly", type="text", :value="value.brand_name", @click.stop="toggleBrandList")
          span.custom-select-arrow
        .brand-list-wrapper(v-show="brandListExpanded", @click.stop="")
          ol.data-picker-alphabet(@mouseleave.self="endBrowse")
            li.data-picker-letter(v-if="!shortcut.isAbsent", v-for="shortcut in alphabet", :class="{'is-absent': shortcut.isAbsent, 'is-active': seekingIn === shortcut.letter}", v-text="shortcut.letter", @mousedown.left="startBrowse(shortcut)", @mousemove="seekIn(shortcut)", @mouseup.left="endBrowse")
          dl.brand-list(ref="candidates")
            template(v-for="(candidate, index) in filteredCandidates")
              dt.data-item-initial(:ref="'candidate' + getInitial(candidate)", v-if="isFirstOfGroup(index)", v-text="getInitial(candidate)")
              dd.data-item.selected(v-text="candidate.name", :title="candidate.name", :class="{'is-selected': value.brand_name === candidate.name}", @click="selectBrand(candidate)")
    .field
      label.label 所属车系
      .custom-select
        .custom-select-area(:class="{'is-disabled': !value.brand_name, 'is-error': validator && validator.$error}")
          input.custom-select-input(placeholder="请选择车系", readonly="readonly", type="text", :value="value.model_name", :disabled="!value.brand_name", @click.stop="toggleModelList")
          span.custom-select-arrow
          .error-icon(v-if="validator && validator.$error")
          .error-info(v-if="validator && validator.$error") 所属车系需补充完整
        .brand-list-wrapper(v-if="modelListExpanded", @click.stop="")
          dl.brand-list
            template(v-for="(model, index) in modelList")
              dt.data-item-initial(v-if="isFirstOfFactory(model, index)", v-text="model.factory")
              dd.data-item(:class="{'is-selected': value.model_name === model.name}", v-text="model.name", @click="selectModel(model)")
</template>

<script>
import clientMixin from '@/mixins/modules/client'
import { mapGetters } from 'vuex'

export default {
  name: 'VehicleModelPicker',
  mixins: [clientMixin],
  props: {
    value: {
      type: Object,
    },
    validator: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      normalPattern: /[A-Z]/,
      isBrowsing: false,
      seekingIn: 'A',
      brandListExpanded: false,
      modelListExpanded: false,
      modelList: [],
    }
  },
  computed: {
    ...mapGetters({
      candidates: 'brands',
    }),
    filteredCandidates () {
      return this.candidates
    },
    filteredInitials () {
      const initials = this.filteredCandidates.reduce((list, value, index) => {
        if (this.isFirstOfGroup(index)) {
          list.push(this.getInitial(value))
        }
        return list
      }, [])
      return [...initials]
    },
    alphabet () {
      const charCodeA = 'A'.charCodeAt(0)
      const alphabetLetters = Array.apply(null, Array(26)).map((value, index) => {
        const letter = String.fromCharCode(charCodeA + index)
        return {
          letter,
          isAbsent: !this.filteredInitials.includes(letter),
        }
      })
      return [...alphabetLetters]
    },
    // selectedBrand () {
    //   return this.value.brand_name ? this.filteredCandidates.filter(brand => {
    //     return brand.name === this.value.brand_name
    //   })[0] : undefined
    // },
  },
  watch: {
    'value.brand_name': {
      handler (val) {
        if (val) {
          const selectedBrand = this.filteredCandidates.filter(brand => {
            return brand.name === val
          })[0]
          this.vehicleModelList(selectedBrand)
        }
      },
      immediate: true,
    },
  },
  methods: {
    startBrowse (shortcut) {
      this.isBrowsing = true
      this.seekIn(shortcut)
    },
    seekIn (shortcut) {
      if (shortcut && this.isBrowsing && !shortcut.isAbsent) {
        this.seekingIn = shortcut.letter
      }
    },
    endBrowse () {
      this.isBrowsing = false
    },
    getInitial (candidate) {
      if (candidate && candidate.pinyin) {
        const initial = candidate.pinyin.charAt(0).toUpperCase()
        return initial
      }
    },
    isFirstOfGroup (index) {
      const initial = this.getInitial(this.filteredCandidates[index])
      return !index || initial !== this.getInitial(this.filteredCandidates[index - 1])
    },
    isFirstOfFactory (model, index) {
      return !index || model.factory !== this.modelList[index - 1].factory
    },
    getInitialAnchor (letter) {
      const anchor = this.$refs[`candidate${letter}`]
      return Array.isArray(anchor) ? anchor[0] : anchor
    },
    scrollTo () {
      if (this.isBrowsing && this.seekingIn) {
        if (this.filteredInitials.includes(this.seekingIn)) {
          this.$refs.candidates.scrollTop = this.getInitialAnchor(this.seekingIn).offsetTop
        } else {
          this.seekingIn = ''
          this.$refs.candidates.scrollTop = 0
        }
      }
    },
    toggleBrandList () {
      this.brandListExpanded = !this.brandListExpanded
    },
    toggleModelList () {
      this.modelListExpanded = !this.modelListExpanded
    },
    selectBrand (brand) {
      if (this.value.brand_name !== brand.name) {
        this.value.model_name = ''
        this.value.vehicle_model_id = undefined
      }
      this.modelListExpanded = false
      this.value.brand_name = brand.name
      this.toggleBrandList()
      this.$emit('input', this.value)
    },
    selectModel (model) {
      if (this.value.model_name !== model.name) {
        this.value.model_name = model.name
        this.value.vehicle_model_id = model.id
      }
      this.toggleModelList()
      this.$emit('input', this.value)
    },
    async vehicleModelList (brand) {
      try {
        const {response, result} = await this.fetchVehicleModels({
          vehicle_brand_id: brand.id,
        })
        if (response.status === 200) {
          this.modelList = result.data
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取车系列表失败',
            content: `出错啦！${result.message}`,
          })
        }
      } catch ({response, result}) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取车系列表失败',
          content: `服务异常，请稍后再试（${response.status}${result && result.code ? ' ' + result.code : ''}）`,
        })
      }
    },
  },
  mounted () {
    this.$watch('seekingIn', this.scrollTo)
    this._onBodyClick = () => {
      this.brandListExpanded = false
      this.modelListExpanded = false
    }
    document.body.addEventListener('click', this._onBodyClick, false)
    !this.$store.getters.brands.length && this.$store.dispatch('synchronizeBrands')
  },
  destroyed () {
    document.body.removeEventListener('click', this._onBodyClick)
  },
}
</script>

<style lang="stylus" scoped>
@import '~@/stylus/mixins'

.brand-list-wrapper
  width 100%
  background-color #fff
  box-shadow 0 4px 12px 0 rgba(0, 0, 0, .10)
  box-sizing border-box
  position absolute
  left 0
  top 100%
  z-index 2
  height 376px
  display flex

.data-picker-alphabet
  flex 0 0 32px
  width 32px
  padding 22px 0
  background #FCFCFC
  box-shadow 1px 0 0 0 rgba(0, 0, 0, .05)
.data-picker-letter
  width 100%
  height 16px
  text-align center
  font-size 12px
  line-height 16px
  color lightGrey
  cursor pointer
  user-select none
  &.is-active
    color primary
  &.is-absent
    color rgba(lightGrey, .5)
    cursor default

.brand-list
  flex 1 1 auto
  overflow-y auto
.data-item-initial
.data-item
  position relative
  padding-left 16px
  font-size 12px
  line-height 32px
.data-item-initial
  color #b2b2b2
  height 32px
  display flex
  &::after
    content ''
    flex 1 0 auto
    display block
    margin 16px 0 0 8px
    border-top 1px solid rgba(0, 0, 0, .08)
.data-item
  padding-right 32px
  color #121212
  white-space nowrap
  overflow hidden
  text-overflow ellipsis
  cursor pointer
  &::after
    display block
    content ''
    position absolute
    width 3px
    height 6px
    border 2px solid #ffbb29
    border-top none
    border-left none
    top 11px
    right 14px
    transform rotate(45deg)
    display none
  &.is-selected
    &::after
      display block
  &:hover
    background #f5f5f7
</style>
