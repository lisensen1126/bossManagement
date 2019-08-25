import {$fetch} from '@/plugins/Fetch'

export default {
  methods: {
    fetchMaintenanceItems (query) {
      return $fetch('maintenance_items', {query})
    },
    setMaintenanceStateApi (id, query) {
      return $fetch(`maintenance_items/${id}/selling_state`, {
        method: 'PATCH',
        body: query,
      })
    },
    setMaintenancePriceApi (id, query) {
      return $fetch(`maintenance_items/${id}/sale_price`, {
        method: 'PATCH',
        body: query,
      })
    },
    fetchParts (query) {
      return $fetch('parts', {query})
    },
    fetchPartTypes (query) {
      return $fetch('parts/categories', {query})
    },
    updateTirePromotionStatus (id, status) {
      return $fetch(`parts/${id}/full_quantity_minus`, {
        method: 'PATCH',
        body: {is_within_range: status},
      })
    },
    updatePartSellingStatus (id, status) {
      return $fetch(`parts/${id}/selling_state`, {
        method: 'PATCH',
        body: {is_selling: status},
      })
    },
    updateMultiplePartSellingStatus (ids, status) {
      return $fetch('parts/selling_state', {
        method: 'PATCH',
        body: {
          ids,
          is_selling: status,
        },
      })
    },
    removePart (id) {
      return $fetch(`parts/${id}`, {
        method: 'DELETE',
      })
    },
    removeMultiplePart (ids) {
      return $fetch('parts/', {
        method: 'DELETE',
        body: {ids},
      })
    },
    updatePartPrice (id, salePrice) {
      return $fetch(`parts/${id}/sale_price`, {
        method: 'PATCH',
        body: {
          sale_price: salePrice,
        },
      })
    },
    updatePartPromotionPrice (id, price) {
      return $fetch(`parts/${id}/promotion_price`, {
        method: 'PATCH',
        body: {
          promotion_price: price,
        },
      })
    },
    // 配件列表
    fetchCarparts (document) {
      return $fetch('carparts', {
        body: {
          ...document,
        },
      })
    },
    // 配件品牌
    fetchPartBrands (category, query) {
      return $fetch(`part_brands/${category}`, {query})
    },
    // 送货上架
    selectToShelf (document) {
      return $fetch('parts/select_to_shelf', {
        method: 'POST',
        body: {
          ...document,
        },
      })
    },
  },
}
