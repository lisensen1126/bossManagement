<template lang="pug">
  custom-select(v-model="result", :list="snList", v-bind="{isNullable, candidateNull, placeholder, validator, errorInfo, isDisabled, nameField}")
</template>

<script>
import CustomSelect from '@/components/generics/form/CustomSelect'
import dataPickerMixin from '@/mixins/utilities/dataPicker'
import operationMixin from '@/mixins/modules/operation'
import { mapGetters } from 'vuex'

export default {
  name: 'SnPicker',
  mixins: [dataPickerMixin, operationMixin],
  components: {
    CustomSelect,
  },
  props: {
    // roleType: {
    //   type: String,
    //   default: '', // SALES_ASSISTANT; STORE_ADMIN; SYSTEM_ADMIN
    // },
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
  },
  data () {
    return {
      snList: [],
    }
  },
  computed: {
    ...mapGetters({
      currentStore: 'currentStore',
    }),
  },
  methods: {
    async fetchStationSn () {
      try {
        const {response, result} = await this.fetchStation()
        if (response.status === 200) {
          const array = []
          result.data.forEach((v, i) => {
            array.push({
              id: v.sn,
              name: v.sn,
            })
          })
          this.snList = array
        } else {
          this.$store.dispatch('showMessage', {
            type: 'failure',
            title: '获取工位失败',
            content: `出错啦！错误码：${response.status}`,
          })
        }
      } catch (err) {
        this.$store.dispatch('showMessage', {
          type: 'failure',
          title: '获取工位失败',
          content: `出错啦！错误码：${err}`,
        })
      }
    },
  },
  mounted () {
    // this.$watch('currentStore.id', (val) => {
    //   this.fetchStationSn()
    // })
    // this.$store.dispatch('synchronizeStaff')
    this.fetchStationSn()
  },
}
</script>
