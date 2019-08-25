<template lang="pug">
  custom-select.custom-select(v-model="result", nameField="title" v-bind="{isNullable, candidateNull, list, placeholder, validator, errorInfo, isDisabled, nameField}")
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import dataPickerMixin from '@/mixins/utilities/dataPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'ShopCategoryPicker',
  mixins: [dataPickerMixin],
  components: {
    CustomSelect,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isNullable: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    candidateNull: {
      type: Object,
      default: () => ({
        title: '全部分类',
      }),
    },
  },
  data () {
    const result = {
      ...this.value,
    }
    return {
      result,
    }
  },
  computed: {
    allCandidates () {
      return this.shopCategories.map(candidate => {
        return {
          ...candidate,
        }
      })
    },
    ...mapGetters({
      shopCategories: 'shopCategories',
    }),
  },
  mounted () {
    this.$store.dispatch('synchronizeShopCategories')
  },
}
</script>
