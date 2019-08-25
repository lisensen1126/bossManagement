import * as types from './types'

export default {
  [types.SHOW_MESSAGE] ({stack}, message) {
    /**
     * message.type: 'success', 'warning' (default), 'failure'
     * You will provide either title or content, won't you?
     */
    stack.push({
      type: 'warning',
      title: '',
      content: '',
      primary: message.isRejectable === 1 ? '确认' : message.isRejectable === 2 ? '导出不合格' : '好的',
      secondary: '取消',
      isRejectable: 0,
      autoClose: false, // 控制弹框自动消失
      duration: 1000, // 弹框自动消失等待时长，autoClose=true时这个字段生效，默认1秒
      ...message,
    })
  },
  [types.HIDE_MESSAGE] ({stack}, message) {
    stack.splice(stack.indexOf(message), 1)
  },
}
