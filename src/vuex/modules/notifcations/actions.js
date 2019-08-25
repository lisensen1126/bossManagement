import * as types from './types'

const duration = 10000

export default {
  notify ({dispatch, commit}, messages, isPermanent) {
    /**
     * messages<T: String .OR. {
     *   content: String,
     *   time: Date?,
     * }>
     */
    commit(types.NOTIFY, messages.map(message => {
      const notification = typeof message === 'string'
        ? {content: message}
        : message
      if (!notification.time) {
        notification.time = new Date()
      }
      if (!isPermanent) {
        notification.removalTimeout = setTimeout(
          () => commit(types.REMOVE_NOTIFICATION, notification),
          duration
        )
      }
      notification.id = `${new Date().getTime()}${Math.random().toFixed(6).replace('0.', '|')}`
      return notification
    }))
  },
  removeNotification ({commit}, notification) {
    commit(types.REMOVE_NOTIFICATION, notification)
  },
  clearNotifications ({commit}) {
    commit(types.CLEAR_NOTIFICATIONS)
  },
  broadcast ({commit}, uris) {
    commit(types.BROADCAST, uris)
  },
  removeBroadcast ({commit}, uri) {
    commit(types.REMOVE_BROADCAST, uri)
  },
}
