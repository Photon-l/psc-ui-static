import request from '@/utils/request'

// 获取出入境信息
export function getCrjInfo(hujiId) {
  return request({
    url: '/psystem/huji/crj/info/' + hujiId,
    method: 'get'
  })
} 