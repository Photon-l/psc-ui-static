import request from '@/utils/request'

// 查询部门关联的地区代码
export function getDeptAreaCodes(deptId) {
  return request({
    url: '/psystem/dept/area/' + deptId,
    method: 'get'
  })
}

// 保存部门关联的地区代码
export function saveDeptAreaCodes(data) {
  return request({
    url: '/psystem/dept/area',
    method: 'post',
    data: data
  })
} 