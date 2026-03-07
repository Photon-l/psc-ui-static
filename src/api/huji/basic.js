import request from '@/utils/request'

// 查询户籍列表
export function listHuji(query) {
  return request({
    url: '/psystem/huji/basic/list',
    method: 'get',
    params: query
  })
}

// 查询户籍基本信息
export function getHuji(hujiId) {
  return request({
    url: '/psystem/huji/basic/' + hujiId,
    method: 'get'
  })
}

// 查询户籍详细信息（包含所有关联信息）
export function getHujiDetail(hujiId) {
  return request({
    url: '/psystem/huji/detail/' + hujiId,
    method: 'get'
  })
}

// 新增户籍
export function addHuji(data) {
  return request({
    url: '/psystem/huji/detail',
    method: 'post',
    data: data
  })
}

// 修改户籍
export function updateHuji(data) {
  return request({
    url: '/psystem/huji/detail',
    method: 'put',
    data: data
  })
}

// 删除户籍
export function delHuji(hujiId) {
  return request({
    url: '/psystem/huji/basic/' + hujiId,
    method: 'delete'
  })
}

// 获取地区树状列表
export function getAreaList() {
  return request({
    url: '/psystem/huji/basic/area/list',
    method: 'get'
  })
}
