<template lang="pug">
  custom-select(v-model="result", v-bind="{isNullable, candidateNull, list, placeholder, validator, errorInfo, isDisabled, nameField}")
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import dataPickerMixin from '@/mixins/utilities/dataPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'StorePicker',
  mixins: [dataPickerMixin],
  components: {
    CustomSelect,
  },
  props: {
    candidateNull: {
      type: Object,
      default: () => ({
        name: '全部门店',
      }),
    },
  },
  computed: {
    ...mapGetters({
      allCandidates: 'stores',
    }),
  },
  mounted () {
    this.$store.dispatch('synchronizeStores')
  },
}
</script>
