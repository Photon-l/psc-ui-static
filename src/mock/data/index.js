/**
 * Mock 数据统一导出
 * 所有静态数据模块在此导出
 */

// 导入数据模块
import * as user from './user'
import * as menu from './menu'
import * as system from './system'
import * as huji from './huji'
import * as dashboard from './dashboard'
import * as dict from './dict'

// 导出所有数据模块
export default {
  user,
  menu,
  system,
  huji,
  dashboard,
  dict
}
