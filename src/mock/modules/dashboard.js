/**
 * Dashboard 相关 Mock 接口
 */
import { registerMock, createSuccessResponse } from '../index'
import mockData from '../data'

// 统计数据
registerMock('get', '/pcs-system/dashboard/stats', () => {
  return createSuccessResponse(mockData.dashboard.statsData)
})

// 图表数据
registerMock('get', '/pcs-system/dashboard/chart', (config) => {
  const params = config.params || {}
  const period = params.period || 'month'
  
  let data
  switch (period) {
    case 'week':
      data = mockData.dashboard.businessTrendWeek
      break
    case 'year':
      data = mockData.dashboard.businessTrendYear
      break
    case 'month':
    default:
      data = mockData.dashboard.businessTrendMonth
      break
  }
  
  return createSuccessResponse(data)
})

// 待办事项
registerMock('get', '/pcs-system/dashboard/todo', () => {
  return createSuccessResponse(mockData.dashboard.todoList)
})

// 通知公告
registerMock('get', '/pcs-system/dashboard/notices', () => {
  return createSuccessResponse(mockData.dashboard.noticeList)
})

// 工作效率
registerMock('get', '/pcs-system/dashboard/efficiency', () => {
  return createSuccessResponse(mockData.dashboard.efficiencyData)
})

// 天气信息
registerMock('get', '/pcs-system/dashboard/weather', () => {
  return createSuccessResponse(mockData.dashboard.weatherInfo)
})

// 业务类型分布
registerMock('get', '/pcs-system/dashboard/distribution', () => {
  return createSuccessResponse(mockData.dashboard.businessDistribution)
})

// 最近访问
registerMock('get', '/pcs-system/dashboard/recent-visits', () => {
  return createSuccessResponse(mockData.dashboard.recentVisits)
})

// 系统公告
registerMock('get', '/pcs-system/dashboard/announcements', () => {
  return createSuccessResponse(mockData.dashboard.systemAnnouncements)
})

console.log('[Mock] Dashboard 相关接口已注册')
