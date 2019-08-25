export const ALL = ''// 全部
export const NOT_START = 'NOT_START' // 待服务
export const SERVING = 'SERVING' // 进行中
export const FINISHED = 'FINISHED' // 已完成
export const CANCELED = 'CANCELED' // 已关闭

export const TICKET_STATUS_LIST = [{ // 服务状态列表
  type: '',
  name: '全部',
}, {
  type: 'NOT_START',
  name: '待服务',
}, {
  type: 'SERVING',
  name: '进行中',
}, {
  type: 'FINISHED',
  name: '已完成',
}, {
  type: 'CANCELED',
  name: '已关闭',
}]
