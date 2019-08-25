import store from '../../vuex/store'
import {$fetch} from '@/plugins/Fetch'

const methods = {
  /* APIs */
  fetchUserInfo () {
    return $fetch('auth/user', {
      forceResolve: true,
    })
  },
  fetchproductorizations (query) {
    return $fetch('product/open_platform_info', {query})
  },
  fetchServiceproductorization (query) {
    return $fetch('product/mp', {query})
  },
  fetchCorpproductorization () {
    return $fetch('product/work')
  },
  fetchMechanicproductorization () {
    return $fetch('product/mechanic')
  },
  fetchMaintenanceproductorization (query) {
    return $fetch('product/ai_maintenance', {query})
  },
  fetchInspectionproductorization (query) {
    return $fetch('product/car_inspection', {query})
  },
  fetchShopproductorization (query) {
    return $fetch('product/shop', {query})
  },
  fetchWashingproductorization (query) {
    return $fetch('product/washing', {query})
  },
  login (query) {
    return $fetch('auth/login', {
      method: 'POST',
      body: query,
    })
  },
  logout () {
    return $fetch('auth/logout')
  },
  settings (name, body) {
    return $fetch(`settings/${name}`, {
      method: 'PUT',
      body,
    })
  },
  /* utilities */
  async updateUserInfo () {
    try {
      const {response, result} = await methods.fetchUserInfo()
      if (response.status === 200) {
        store.dispatch('updateUser', result.data)
      }
      return {response, result}
    } catch (err) {
      console.error('updateUserInfo Error:', err)
      throw err
    }
  },
  async switchStore (storeID) {
    try {
      const switchOutcome = await $fetch('stores/switch', {
        method: 'PATCH',
        body: {
          store_id: storeID,
        },
      })
      if (switchOutcome.response.status === 200) {
        const userOutcome = await methods.updateUserInfo()
        if (userOutcome.response.status === 200) {
          return switchOutcome
        } else {
          throw userOutcome
        }
      } else {
        throw switchOutcome
      }
    } catch (err) {
      console.error('switchStore Error:', err)
      throw err
    }
  },
}

export default {
  methods,
}
