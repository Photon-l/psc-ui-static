/**
 * 系统管理相关 Mock 接口
 */
import { registerMock, createSuccessResponse, createPageResponse } from '../index'
import mockData from '../data'

// ==================== 用户管理 ====================

// 用户列表
registerMock('get', '/psystem/user/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.user.userList]

  // 简单的搜索过滤
  if (params.userName) {
    list = list.filter(u => u.userName.includes(params.userName))
  }
  if (params.phonenumber) {
    list = list.filter(u => u.phonenumber.includes(params.phonenumber))
  }
  if (params.status) {
    list = list.filter(u => u.status === params.status)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 用户详情
registerMock('get', '/psystem/user/.*', (config) => {
  const userId = parseInt(config.url.split('/').pop())
  const user = mockData.user.userList.find(u => u.userId === userId)
  return createSuccessResponse(user || {})
})

// 新增用户
registerMock('post', '/psystem/user', (config) => {
  console.log('[Mock] 新增用户:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改用户
registerMock('put', '/psystem/user', (config) => {
  console.log('[Mock] 修改用户:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除用户
registerMock('delete', '/psystem/user/.*', (config) => {
  console.log('[Mock] 删除用户:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// 用户状态修改
registerMock('put', '/psystem/user/changeStatus', (config) => {
  console.log('[Mock] 修改用户状态:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 重置密码
registerMock('put', '/psystem/user/resetPwd', (config) => {
  console.log('[Mock] 重置密码:', config.data)
  return createSuccessResponse(null, '重置成功')
})

// ==================== 角色管理 ====================

// 角色列表
registerMock('get', '/psystem/role/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.system.roleList]

  if (params.roleName) {
    list = list.filter(r => r.roleName.includes(params.roleName))
  }
  if (params.roleKey) {
    list = list.filter(r => r.roleKey.includes(params.roleKey))
  }
  if (params.status) {
    list = list.filter(r => r.status === params.status)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 角色详情
registerMock('get', '/psystem/role/.*', (config) => {
  const roleId = parseInt(config.url.split('/').pop())
  const role = mockData.system.roleList.find(r => r.roleId === roleId)
  return createSuccessResponse(role || {})
})

// 新增角色
registerMock('post', '/psystem/role', (config) => {
  console.log('[Mock] 新增角色:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改角色
registerMock('put', '/psystem/role', (config) => {
  console.log('[Mock] 修改角色:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除角色
registerMock('delete', '/psystem/role/.*', (config) => {
  console.log('[Mock] 删除角色:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// 角色状态修改
registerMock('put', '/psystem/role/changeStatus', (config) => {
  console.log('[Mock] 修改角色状态:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// ==================== 部门管理 ====================

// 部门列表
registerMock('get', '/psystem/dept/list', () => {
  return createSuccessResponse(mockData.system.deptList)
})

// 部门树
registerMock('get', '/psystem/dept/treeselect', () => {
  return createSuccessResponse(mockData.system.deptList)
})

// 部门详情
registerMock('get', '/psystem/dept/.*', (config) => {
  const deptId = parseInt(config.url.split('/').pop())
  const dept = mockData.system.deptList.find(d => d.deptId === deptId)
  return createSuccessResponse(dept || {})
})

// 新增部门
registerMock('post', '/psystem/dept', (config) => {
  console.log('[Mock] 新增部门:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改部门
registerMock('put', '/psystem/dept', (config) => {
  console.log('[Mock] 修改部门:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除部门
registerMock('delete', '/psystem/dept/.*', (config) => {
  console.log('[Mock] 删除部门:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// ==================== 岗位管理 ====================

// 岗位列表
registerMock('get', '/psystem/post/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.system.postList]

  if (params.postCode) {
    list = list.filter(p => p.postCode.includes(params.postCode))
  }
  if (params.postName) {
    list = list.filter(p => p.postName.includes(params.postName))
  }
  if (params.status) {
    list = list.filter(p => p.status === params.status)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 岗位详情
registerMock('get', '/psystem/post/.*', (config) => {
  const postId = parseInt(config.url.split('/').pop())
  const post = mockData.system.postList.find(p => p.postId === postId)
  return createSuccessResponse(post || {})
})

// 新增岗位
registerMock('post', '/psystem/post', (config) => {
  console.log('[Mock] 新增岗位:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改岗位
registerMock('put', '/psystem/post', (config) => {
  console.log('[Mock] 修改岗位:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除岗位
registerMock('delete', '/psystem/post/.*', (config) => {
  console.log('[Mock] 删除岗位:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// ==================== 字典管理 ====================

// 字典类型列表
registerMock('get', '/psystem/dict/type/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.system.dictTypeList]

  if (params.dictName) {
    list = list.filter(d => d.dictName.includes(params.dictName))
  }
  if (params.dictType) {
    list = list.filter(d => d.dictType.includes(params.dictType))
  }
  if (params.status) {
    list = list.filter(d => d.status === params.status)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 字典类型详情
registerMock('get', '/psystem/dict/type/.*', (config) => {
  const dictId = parseInt(config.url.split('/').pop())
  const dict = mockData.system.dictTypeList.find(d => d.dictId === dictId)
  return createSuccessResponse(dict || {})
})

// 字典数据列表
registerMock('get', '/psystem/dict/data/type/.*', (config) => {
  const dictType = config.url.split('/').pop()
  const data = mockData.dict.getDictData(dictType)
  return createSuccessResponse(data)
})

// 新增字典类型
registerMock('post', '/psystem/dict/type', (config) => {
  console.log('[Mock] 新增字典类型:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改字典类型
registerMock('put', '/psystem/dict/type', (config) => {
  console.log('[Mock] 修改字典类型:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除字典类型
registerMock('delete', '/psystem/dict/type/.*', (config) => {
  console.log('[Mock] 删除字典类型:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// ==================== 参数配置 ====================

// 参数列表
registerMock('get', '/psystem/config/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.system.configList]

  if (params.configName) {
    list = list.filter(c => c.configName.includes(params.configName))
  }
  if (params.configKey) {
    list = list.filter(c => c.configKey.includes(params.configKey))
  }
  if (params.configType) {
    list = list.filter(c => c.configType === params.configType)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 参数详情
registerMock('get', '/psystem/config/.*', (config) => {
  const configId = parseInt(config.url.split('/').pop())
  const cfg = mockData.system.configList.find(c => c.configId === configId)
  return createSuccessResponse(cfg || {})
})

// 根据参数键名查询参数值
registerMock('get', '/psystem/config/configKey/.*', (config) => {
  const configKey = config.url.split('/').pop()
  const cfg = mockData.system.configList.find(c => c.configKey === configKey)
  return createSuccessResponse(cfg ? cfg.configValue : '')
})

// 新增参数
registerMock('post', '/psystem/config', (config) => {
  console.log('[Mock] 新增参数:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改参数
registerMock('put', '/psystem/config', (config) => {
  console.log('[Mock] 修改参数:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除参数
registerMock('delete', '/psystem/config/.*', (config) => {
  console.log('[Mock] 删除参数:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// ==================== 通知公告 ====================

// 通知公告列表
registerMock('get', '/psystem/notice/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10

  let list = [...mockData.system.noticeList]

  if (params.noticeTitle) {
    list = list.filter(n => n.noticeTitle.includes(params.noticeTitle))
  }
  if (params.noticeType) {
    list = list.filter(n => n.noticeType === params.noticeType)
  }
  if (params.status) {
    list = list.filter(n => n.status === params.status)
  }

  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)

  return createPageResponse(rows, total)
})

// 通知公告详情
registerMock('get', '/psystem/notice/.*', (config) => {
  const noticeId = parseInt(config.url.split('/').pop())
  const notice = mockData.system.noticeList.find(n => n.noticeId === noticeId)
  return createSuccessResponse(notice || {})
})

// 新增通知公告
registerMock('post', '/psystem/notice', (config) => {
  console.log('[Mock] 新增通知公告:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改通知公告
registerMock('put', '/psystem/notice', (config) => {
  console.log('[Mock] 修改通知公告:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除通知公告
registerMock('delete', '/psystem/notice/.*', (config) => {
  console.log('[Mock] 删除通知公告:', config.url)
  return createSuccessResponse(null, '删除成功')
})

console.log('[Mock] 系统管理相关接口已注册')
