import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    // 配件分类列表
    fetchPartsCategories (query) {
      return $fetch('parts/categories', {query})
    },
    // 配件列表
    fetchParts (query) {
      return $fetch('parts', {query})
    },
    // 车型列表
    fetchVehicleModels (query) {
      return $fetch('vehicles/models', {query})
    },
    // 车型具体销售版本
    fetchVehicleTypes (query) {
      return $fetch('vehicles', {query})
    },
    // 车型具体销售版本详情
    fetchVehicleTypeDetail (query) {
      return $fetch('vehicles/detail', {query})
    },
  },
}
