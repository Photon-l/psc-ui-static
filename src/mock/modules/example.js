/**
 * 示例 Mock 接口
 * 演示如何注册和使用 Mock 接口
 */
import { registerMock, createSuccessResponse, createPageResponse } from '../index'

/**
 * 注册示例接口
 */
export function setupExampleMock() {
  // 示例 1: 简单的 GET 请求
  registerMock('get', '/api/example/info', createSuccessResponse({
    id: 1,
    name: '示例数据'
  }))
  
  // 示例 2: 使用函数动态生成响应
  registerMock('post', '/api/example/list', (config) => {
    // 可以访问请求参数
    const { pageNum = 1, pageSize = 10 } = config.data || {}
    
    // 生成模拟数据
    const rows = Array.from({ length: pageSize }, (_, i) => ({
      id: (pageNum - 1) * pageSize + i + 1,
      name: `示例 ${(pageNum - 1) * pageSize + i + 1}`
    }))
    
    return createPageResponse(rows, 100)
  })
  
  // 示例 3: 使用正则匹配 URL
  registerMock('get', '/api/example/\\d+', (config) => {
    const id = config.url.match(/\/api\/example\/(\d+)/)[1]
    return createSuccessResponse({
      id: parseInt(id),
      name: `示例 ${id}`
    })
  })
}

export default {
  setup: setupExampleMock
}
