import request from '@/utils/request'

// 获取首页统计数据
export function getDashboardStats() {
  return request({
    url: '/pcs-system/dashboard/stats',
    method: 'get'
  })
}

// 获取待办事项列表
export function getTodoList() {
  return request({
    url: '/pcs-system/dashboard/todo',
    method: 'get'
  })
}

// 获取系统通知列表
export function getNoticeList() {
  return request({
    url: '/pcs-system/dashboard/notices',
    method: 'get'
  })
}

// 获取业务统计图表数据
export function getBusinessChartData(period = 'month') {
  return request({
    url: '/pcs-system/dashboard/chart',
    method: 'get',
    params: { period }
  })
}

// 获取工作效率数据
export function getEfficiencyData() {
  return request({
    url: '/pcs-system/dashboard/efficiency',
    method: 'get'
  })
}

// 获取天气信息
export function getWeatherInfo() {
  return request({
    url: '/pcs-system/dashboard/weather',
    method: 'get'
  })
}