import request from '@/utils/request'

// 查询警务业务-字段权限映射列表
export function listMapping(query) {
  return request({
    url: '/pcs-system/crossdomain/mapping/list',
    method: 'get',
    params: query
  })
}

// 查询警务业务-字段权限映射详细
export function getMapping(id) {
  return request({
    url: '/pcs-system/crossdomain/mapping/' + id,
    method: 'get'
  })
}

// 根据警务类型编码查询字段权限映射
export function getMappingByTypeCode(policeTypeCode) {
  return request({
    url: '/pcs-system/crossdomain/mapping/type/' + policeTypeCode,
    method: 'get'
  })
}

// 根据警务类型编码获取已映射的字段ID列表
export function getFieldIdsByTypeCode(policeTypeCode) {
  return request({
    url: '/pcs-system/crossdomain/mapping/fieldids/' + policeTypeCode,
    method: 'get'
  })
}

// 新增警务业务-字段权限映射
export function addMapping(data) {
  return request({
    url: '/pcs-system/crossdomain/mapping',
    method: 'post',
    data: data
  })
}

// 修改警务业务-字段权限映射
export function updateMapping(data) {
  return request({
    url: '/pcs-system/crossdomain/mapping',
    method: 'put',
    data: data
  })
}

// 删除警务业务-字段权限映射
export function delMapping(id) {
  return request({
    url: '/pcs-system/crossdomain/mapping/' + id,
    method: 'delete'
  })
}

// 保存警务类型字段映射
export function saveMapping(policeTypeCode, fieldIds) {
  return request({
    url: '/pcs-system/crossdomain/mapping/save/' + policeTypeCode,
    method: 'post',
    data: fieldIds
  })
}

// 导出警务业务-字段权限映射
export function exportMapping(query) {
  return request({
    url: '/pcs-system/crossdomain/mapping/export',
    method: 'get',
    params: query
  })
}

// 获取所有警务类型选项
export function getPoliceTypes() {
  return request({
    url: '/pcs-system/crossdomain/mapping/policetypes',
    method: 'get'
  })
} 