import * as types from './types'

export default {
  // replace staff with the latest copy
  [types.REFRESH_STAFF] ({staff}, latest) {
    staff.splice(0, staff.length, ...latest)
  },
  [types.REFRESH_STORES] ({stores}, latest) {
    stores.splice(0, stores.length, ...latest)
  },
  [types.REFRESH_INSURANCES] ({insurances}, latest) {
    insurances.splice(0, insurances.length, ...latest)
  },
  [types.REFRESH_BRANDS] ({brands}, latest) {
    brands.splice(0, brands.length, ...latest)
  },
  [types.REFRESH_SALES_ASSISTANT] ({salesAssistants}, latest) {
    salesAssistants.splice(0, salesAssistants.length, ...latest)
  },
  [types.REFRESH_MECHANIC] ({mechanics}, latest) {
    mechanics.splice(0, mechanics.length, ...latest)
  },
  [types.REFRESH_SHOP_CATEGORIES] ({shopCategories}, latest) {
    shopCategories.splice(0, shopCategories.length, ...latest)
  },
}
