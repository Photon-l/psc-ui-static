/**
 * 户籍管理相关 Mock 接口
 */
import { registerMock, createSuccessResponse, createPageResponse } from '../index'
import mockData from '../data'

// 户籍信息列表
registerMock('get', '/huji/basic/list', (config) => {
  const params = config.params || {}
  const pageNum = parseInt(params.pageNum) || 1
  const pageSize = parseInt(params.pageSize) || 10
  
  let list = [...mockData.huji.hujiList]
  
  // 搜索过滤
  if (params.name) {
    list = list.filter(h => h.name.includes(params.name))
  }
  if (params.idCard) {
    list = list.filter(h => h.idCard.includes(params.idCard))
  }
  if (params.phone) {
    list = list.filter(h => h.phone.includes(params.phone))
  }
  if (params.gender) {
    list = list.filter(h => h.gender === params.gender)
  }
  if (params.status) {
    list = list.filter(h => h.status === params.status)
  }
  
  const total = list.length
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize
  const rows = list.slice(start, end)
  
  return createPageResponse(rows, total)
})

// 户籍信息详情
registerMock('get', '/huji/basic/.*', (config) => {
  const id = parseInt(config.url.split('/').pop())
  const huji = mockData.huji.hujiList.find(h => h.id === id)
  return createSuccessResponse(huji || {})
})

// 新增户籍信息
registerMock('post', '/huji/basic', (config) => {
  console.log('[Mock] 新增户籍信息:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 修改户籍信息
registerMock('put', '/huji/basic', (config) => {
  console.log('[Mock] 修改户籍信息:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 删除户籍信息
registerMock('delete', '/huji/basic/.*', (config) => {
  console.log('[Mock] 删除户籍信息:', config.url)
  return createSuccessResponse(null, '删除成功')
})

// 批量删除户籍信息
registerMock('delete', '/huji/basic', (config) => {
  console.log('[Mock] 批量删除户籍信息:', config.data)
  return createSuccessResponse(null, '删除成功')
})

// 导出户籍信息
registerMock('post', '/huji/basic/export', (config) => {
  console.log('[Mock] 导出户籍信息:', config.data)
  return createSuccessResponse(null, '导出成功')
})

console.log('[Mock] 户籍管理相关接口已注册')
