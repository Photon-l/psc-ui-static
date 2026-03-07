/**
 * Dashboard 静态数据
 */

// 统计数据
export const statsData = {
  hujiTotal: 12345,
  todayCertificate: 28,
  crossdomainApply: 15,
  pending: 8,
  trends: {
    huji: '+2.3%',
    certificate: '+12%',
    crossdomain: '-5%',
    pending: '紧急'
  }
}

// 待办事项列表
export const todoList = [
  {
    id: 1,
    title: '身份证办理审批',
    time: '2小时前',
    count: 5,
    priority: 'high',
    icon: 'el-icon-postcard',
    type: 'approval'
  },
  {
    id: 2,
    title: '户籍迁移审核',
    time: '3小时前',
    count: 3,
    priority: 'high',
    icon: 'el-icon-user',
    type: 'review'
  },
  {
    id: 3,
    title: '居住证续签',
    time: '5小时前',
    count: 8,
    priority: 'medium',
    icon: 'el-icon-house',
    type: 'renewal'
  },
  {
    id: 4,
    title: '跨域协作申请',
    time: '1天前',
    count: 2,
    priority: 'medium',
    icon: 'el-icon-connection',
    type: 'cooperation'
  },
  {
    id: 5,
    title: '信息变更申请',
    time: '2天前',
    count: 6,
    priority: 'low',
    icon: 'el-icon-edit',
    type: 'change'
  }
]

// 通知公告列表
export const noticeList = [
  {
    id: 1,
    title: '关于优化户籍办理流程的通知',
    time: '2025-01-15',
    type: 'notice',
    icon: 'el-icon-bell',
    important: true
  },
  {
    id: 2,
    title: '系统维护公告',
    time: '2025-01-14',
    type: 'announcement',
    icon: 'el-icon-warning',
    important: false
  },
  {
    id: 3,
    title: '春节放假安排通知',
    time: '2025-01-13',
    type: 'notice',
    icon: 'el-icon-bell',
    important: true
  },
  {
    id: 4,
    title: '新功能上线说明',
    time: '2025-01-12',
    type: 'announcement',
    icon: 'el-icon-info',
    important: false
  },
  {
    id: 5,
    title: '安全提醒：定期修改密码',
    time: '2025-01-11',
    type: 'notice',
    icon: 'el-icon-lock',
    important: false
  }
]

// 业务办理趋势数据（周）
export const businessTrendWeek = {
  categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
  series: [
    {
      name: '身份证办理',
      data: [45, 52, 48, 56, 62, 38, 25]
    },
    {
      name: '居住证办理',
      data: [28, 32, 35, 30, 38, 22, 15]
    },
    {
      name: '户籍迁移',
      data: [12, 15, 18, 14, 16, 10, 8]
    }
  ]
}

// 业务办理趋势数据（月）
export const businessTrendMonth = {
  categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  series: [
    {
      name: '身份证办理',
      data: [320, 302, 341, 374, 390, 450, 420, 380, 410, 395, 420, 380]
    },
    {
      name: '居住证办理',
      data: [220, 182, 191, 234, 290, 330, 310, 280, 295, 285, 310, 280]
    },
    {
      name: '户籍迁移',
      data: [150, 132, 101, 134, 90, 130, 110, 95, 115, 105, 125, 95]
    }
  ]
}

// 业务办理趋势数据（年）
export const businessTrendYear = {
  categories: ['2020', '2021', '2022', '2023', '2024', '2025'],
  series: [
    {
      name: '身份证办理',
      data: [3200, 3800, 4200, 4500, 4800, 1200]
    },
    {
      name: '居住证办理',
      data: [2200, 2600, 2900, 3200, 3400, 850]
    },
    {
      name: '户籍迁移',
      data: [1200, 1400, 1300, 1500, 1600, 400]
    }
  ]
}

// 业务类型分布数据
export const businessDistribution = [
  { name: '身份证办理', value: 4800 },
  { name: '居住证办理', value: 3400 },
  { name: '户籍迁移', value: 1600 },
  { name: '信息变更', value: 2200 },
  { name: '其他业务', value: 1000 }
]

// 工作效率数据
export const efficiencyData = {
  avgProcessTime: '2.5小时',
  completionRate: '95.8%',
  satisfactionRate: '98.2%',
  onTimeRate: '96.5%',
  details: [
    {
      name: '平均办理时长',
      value: '2.5小时',
      target: '3小时',
      status: 'good',
      trend: 'down'
    },
    {
      name: '业务完成率',
      value: '95.8%',
      target: '95%',
      status: 'good',
      trend: 'up'
    },
    {
      name: '群众满意度',
      value: '98.2%',
      target: '95%',
      status: 'excellent',
      trend: 'up'
    },
    {
      name: '按时办结率',
      value: '96.5%',
      target: '95%',
      status: 'good',
      trend: 'stable'
    }
  ]
}

// 天气信息
export const weatherInfo = {
  condition: '晴',
  temperature: 22,
  humidity: 45,
  windSpeed: '3级',
  airQuality: '优',
  forecast: [
    { day: '今天', condition: '晴', tempHigh: 25, tempLow: 15 },
    { day: '明天', condition: '多云', tempHigh: 23, tempLow: 14 },
    { day: '后天', condition: '阴', tempHigh: 20, tempLow: 12 }
  ]
}

// 最近访问记录
export const recentVisits = [
  {
    id: 1,
    title: '户籍信息查询',
    path: '/huji/basic',
    time: '10分钟前',
    icon: 'el-icon-search'
  },
  {
    id: 2,
    title: '用户管理',
    path: '/psystem/user',
    time: '1小时前',
    icon: 'el-icon-user'
  },
  {
    id: 3,
    title: '角色管理',
    path: '/psystem/role',
    time: '2小时前',
    icon: 'el-icon-s-custom'
  },
  {
    id: 4,
    title: '系统监控',
    path: '/monitor/online',
    time: '3小时前',
    icon: 'el-icon-monitor'
  }
]

// 系统公告
export const systemAnnouncements = [
  {
    id: 1,
    title: '系统升级通知',
    content: '系统将于本周六凌晨2点进行升级维护，预计维护时间2小时',
    type: 'warning',
    publishTime: '2025-01-15 10:00:00',
    publisher: '系统管理员'
  },
  {
    id: 2,
    title: '新功能上线',
    content: '户籍管理模块新增批量导入功能，欢迎使用',
    type: 'info',
    publishTime: '2025-01-14 15:30:00',
    publisher: '系统管理员'
  },
  {
    id: 3,
    title: '安全提醒',
    content: '请定期修改密码，确保账号安全',
    type: 'danger',
    publishTime: '2025-01-13 09:00:00',
    publisher: '系统管理员'
  }
]
