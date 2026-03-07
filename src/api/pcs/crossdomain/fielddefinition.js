import request from '@/utils/request'

// 查询字段定义列表
export function listFieldDefinition(query) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition/list',
    method: 'get',
    params: query
  })
}

// 查询所有字段定义（不分页）
export function listAllFieldDefinition(query) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition/listAll',
    method: 'get',
    params: query
  })
}

// 查询字段定义详细
export function getFieldDefinition(fieldId) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition/' + fieldId,
    method: 'get'
  })
}

// 新增字段定义
export function addFieldDefinition(data) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition',
    method: 'post',
    data: data
  })
}

// 修改字段定义
export function updateFieldDefinition(data) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition',
    method: 'put',
    data: data
  })
}

// 删除字段定义
export function delFieldDefinition(fieldId) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition/' + fieldId,
    method: 'delete'
  })
}

// 导出字段定义
export function exportFieldDefinition(query) {
  return request({
    url: '/pcs-system/crossdomain/fielddefinition/export',
    method: 'get',
    params: query
  })
} 