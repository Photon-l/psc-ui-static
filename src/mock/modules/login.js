/**
 * 登录相关 Mock 接口
 */
import { registerMock, createSuccessResponse } from '../index'
import mockData from '../data'

// 注册登录接口
registerMock('post', '/dev-api/pauth/login', (config) => {
  console.log('[Mock] 登录请求:', config.data)
  console.log('[Mock] 返回数据:', mockData.user.loginResponse)
  
  // 任意用户名密码都可以登录
  const response = createSuccessResponse(mockData.user.loginResponse, '登录成功')
  console.log('[Mock] 完整响应:', response)
  return response
})

// 注册验证码接口
registerMock('get', '/dev-api/code', () => {
  return createSuccessResponse(mockData.user.captchaResponse)
})

// 注册获取用户信息接口
registerMock('get', '/dev-api/psystem/user/getInfo', () => {
  return createSuccessResponse(mockData.user.userInfo)
})

// 注册退出登录接口
registerMock('delete', '/dev-api/pauth/logout', () => {
  return createSuccessResponse(null, '退出成功')
})

// 注册刷新token接口
registerMock('post', '/dev-api/pauth/refresh', () => {
  return createSuccessResponse({
    access_token: mockData.user.loginResponse.access_token,
    expires_in: mockData.user.loginResponse.expires_in
  }, '刷新成功')
})

console.log('[Mock] 登录相关接口已注册')
