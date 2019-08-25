<template lang="pug">
  custom-select(v-model="result", v-bind="{isNullable, candidateNull, list, placeholder, validator, errorInfo, isDisabled, nameField}")
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import dataPickerMixin from '@/mixins/utilities/dataPicker'
import { mapGetters } from 'vuex'

export default {
  name: 'StaffPicker',
  mixins: [dataPickerMixin],
  components: {
    CustomSelect,
  },
  props: {
    roleType: {
      type: String,
      default: '', // SALES_ASSISTANT; STORE_ADMIN; SYSTEM_ADMIN; MECHANIC;
    },
    isNullable: {
      type: Boolean,
      default: false,
    },
    candidateNull: {
      type: Object,
      default: () => ({
        name: '不指定',
      }),
    },
    filterByStore: {
      type: Boolean,
      default: false,
    },
    assginStoreId: {
      type: Number,
    },
  },
  computed: {
    ...mapGetters({
      currentStore: 'currentStore',
      allCandidates: 'staff',
      sa: 'salesAssistants',
      mechanics: 'mechanics',
    }),
    list () {
      if (this.roleType !== 'SALES_ASSISTANT' && this.roleType !== 'MECHANIC') {
        let basicList = this.allCandidates.filter(candidate => candidate.status === 'NORMAL')
        let finalList = this.roleType ? basicList.filter(candidate => candidate.role_name === this.roleType) : basicList
        return this.filterByStore ? finalList.filter(candidate => candidate.store_id === this.currentStore.id) : finalList
      } else if (this.roleType === 'SALES_ASSISTANT') {
        let finalList = this.sa.filter(candidate => candidate.status === 'NORMAL')
        if (this.assginStoreId) {
          return finalList.filter(candidate => candidate.store_id === this.assginStoreId)
        } else {
          return this.filterByStore ? finalList.filter(candidate => candidate.store_id === this.currentStore.id) : finalList
        }
      } else if (this.roleType === 'MECHANIC') {
        return this.mechanics
      }
    },
  },
  mounted () {
    this.$store.dispatch('synchronizeStaff')
    if (this.roleType === 'SALES_ASSISTANT') {
      this.$store.dispatch('synchronizeSalesAssistant')
    } else if (this.roleType === 'MECHANIC') {
      this.$store.dispatch('synchronizeMechanic')
    }
  },
}
</script>
