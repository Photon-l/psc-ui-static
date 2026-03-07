import request from '@/utils/request'

// 查询跨域申请列表
export function listApply(query) {
  return request({
    url: '/pcs-system/crossdomain/apply/list',
    method: 'get',
    params: query
  })
}

// 查询跨域申请详细
export function getApply(id) {
  return request({
    url: '/pcs-system/crossdomain/apply/' + id,
    method: 'get'
  })
}

// 新增跨域申请
export function addApply(data) {
  return request({
    url: '/pcs-system/crossdomain/apply',
    method: 'post',
    data: data
  })
}

// 修改跨域申请
export function updateApply(data) {
  return request({
    url: '/pcs-system/crossdomain/apply',
    method: 'put',
    data: data
  })
}

// 删除跨域申请
export function delApply(id) {
  return request({
    url: '/pcs-system/crossdomain/apply/' + id,
    method: 'delete'
  })
}

// 导出跨域申请
export function exportApply(query) {
  return request({
    url: '/pcs-system/crossdomain/apply/export',
    method: 'get',
    params: query
  })
} 