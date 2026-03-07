/**
 * 菜单路由相关 Mock 接口
 */
import { registerMock, createSuccessResponse } from '../index'
import mockData from '../data'

// 注册获取路由接口
registerMock('get', '/dev-api/psystem/menu/getRouters', () => {
  return createSuccessResponse(mockData.menu.menuTree, '获取路由成功')
})

// 注册菜单列表接口
registerMock('get', '/dev-api/psystem/menu/list', () => {
  return createSuccessResponse(mockData.menu.menuList, '查询成功')
})

// 注册菜单详情接口
registerMock('get', '/dev-api/psystem/menu/.*', (config) => {
  const menuId = parseInt(config.url.split('/').pop())
  const findMenu = (menus) => {
    for (const menu of menus) {
      if (menu.menuId === menuId) {
        return menu
      }
      if (menu.children) {
        const found = findMenu(menu.children)
        if (found) return found
      }
    }
    return null
  }
  
  const menu = findMenu(mockData.menu.menuList)
  return createSuccessResponse(menu || {}, '查询成功')
})

// 注册新增菜单接口
registerMock('post', '/dev-api/psystem/menu', (config) => {
  console.log('[Mock] 新增菜单:', config.data)
  return createSuccessResponse(null, '新增成功')
})

// 注册修改菜单接口
registerMock('put', '/dev-api/psystem/menu', (config) => {
  console.log('[Mock] 修改菜单:', config.data)
  return createSuccessResponse(null, '修改成功')
})

// 注册删除菜单接口
registerMock('delete', '/dev-api/psystem/menu/.*', (config) => {
  console.log('[Mock] 删除菜单:', config.url)
  return createSuccessResponse(null, '删除成功')
})

console.log('[Mock] 菜单路由相关接口已注册')
