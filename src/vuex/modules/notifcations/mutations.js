import * as types from './types'

const removeNotification = (stack, notification) => {
  clearTimeout(notification.removalTimeout)
  stack.splice(stack.indexOf(notification), 1)
}

export default {
  [types.NOTIFY] ({stack}, notifications) {
    /**
     * messages<T: {
     *   content: String,
     *   time: Date?,
     *   removalTimeout: Integer?,
     * }>
     */
    stack.splice(stack.length, 0, ...notifications)
  },
  [types.REMOVE_NOTIFICATION] ({stack}, notification) {
    removeNotification(stack, notification)
  },
  [types.CLEAR_NOTIFICATIONS] ({stack}) {
    while (stack.length) {
      removeNotification(stack, stack[0])
    }
  },
  [types.BROADCAST] ({playlist}, uris) {
    playlist.splice(playlist.length, 0, ...uris)
  },
  [types.REMOVE_BROADCAST] ({playlist}, uri) {
    playlist.splice(playlist.indexOf(uri), 1)
  },
}
