export const ALL = ''// 全部
export const SALES_ASSISTANT = 'SALES_ASSISTANT' // 客户经理
export const MECHANIC = 'MECHANIC' // 技工
export const STORE_ADMIN = 'STORE_ADMIN'// 店铺管理员
export const SYSTEM_ADMIN = 'SYSTEM_ADMIN' // 系统管理员

export const BOSS = 'BOSS' // 老板
export const MANAGER = 'MANAGER' // 店长

export const ROLE_NAME_LIST = [{ // 系统角色列表
  id: '',
  name: '不指定',
}, {
  id: 'SALES_ASSISTANT',
  name: '客户经理',
}, {
  id: 'STORE_ADMIN',
  name: '店铺管理员',
}, {
  id: 'SYSTEM_ADMIN',
  name: '系统管理员',
}]

export const POSITION_LIST = [{ // 职位列表
  id: '',
  name: '不指定',
}, {
  id: 'BOSS',
  name: '老板',
}, {
  id: 'MANAGER',
  name: '店长',
}, {
  id: 'SALES_ASSISTANT',
  name: '客户经理',
}]

export const ROLE_STATUS = [{
  id: '',
  name: '全部',
}, {
  id: 'NORMAL',
  name: '可用',
}, {
  id: 'LOCKED',
  name: '停用',
}]

export const STAFF_LIST = [{
  id: '',
  name: '全部',
}, {
  id: MECHANIC,
  name: '技工',
}, {
  id: SALES_ASSISTANT,
  name: '客户经理',
}]
