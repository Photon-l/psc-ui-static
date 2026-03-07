import request from '@/utils/request'

// 查询需本系统审批的跨域申请列表
export function listPendingApproval(query) {
  return request({
    url: '/pcs-system/crossdomain/approve/list',
    method: 'get',
    params: query
  })
}

// 审批跨域申请
export function approveApply(data) {
  return request({
    url: '/pcs-system/crossdomain/approve',
    method: 'put',
    data: data
  })
}

// 同意审批
export function approveTargetAgree(data) {
    return request({
        url: '/pcs-system/crossdomain/approve/target/agree',
        method: 'post',
        data: data
    })
}

// 拒绝审批
export function approveTargetReject(data) {
    return request({
        url: '/pcs-system/crossdomain/approve/target/reject',
        method: 'post',
        data: data
    })
}

// 查询待审批列表（保留原有接口，以防后端未更新）
export function listPendingApprovalOld(query) {
  return request({
    url: '/pcs-system/crossdomain/approve/pending/list',
    method: 'get',
    params: query
  })
}

// 查询本系统审批列表
export function listLocalApprove(query) {
  return request({
    url: '/pcs-system/crossdomain/approve/local/list',
    method: 'get',
    params: query
  })
}

// 查询目标系统审批列表
export function listTargetApprove(query) {
  return request({
    url: '/pcs-system/crossdomain/approve/target/list',
    method: 'get',
    params: query
  })
}

// 本系统同意审批
export function approveLocalAgree(data) {
  return request({
    url: '/pcs-system/crossdomain/approve/local/agree',
    method: 'put',
    data: data
  })
}

// 本系统拒绝审批
export function approveLocalReject(data) {
  return request({
    url: '/pcs-system/crossdomain/approve/local/reject',
    method: 'put',
    data: data
  })
} 