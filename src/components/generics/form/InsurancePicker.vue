<template lang="pug">
  custom-select(v-model="result", v-bind="{isNullable, candidateNull, list, placeholder, validator, errorInfo, isDisabled, nameField}")
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import dataPickerMixin from '@/mixins/utilities/dataPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'InsurancePicker',
  mixins: [dataPickerMixin],
  components: {
    CustomSelect,
  },
  props: {
    isNullable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      allCandidates: 'insurances',
    }),
  },
  mounted () {
    !this.$store.getters.insurances.length && this.$store.dispatch('synchronizeInsurances')
  },
}
</script>
