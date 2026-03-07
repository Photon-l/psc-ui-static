/**
 * 字典数据
 */

// 字典数据映射
export const dictData = {
  // 用户性别
  sys_user_sex: [
    { label: '男', value: '0', dictCode: 1, dictSort: 1, listClass: 'default', cssClass: '', isDefault: 'Y', status: '0', remark: '性别男' },
    { label: '女', value: '1', dictCode: 2, dictSort: 2, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '性别女' },
    { label: '未知', value: '2', dictCode: 3, dictSort: 3, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '性别未知' }
  ],
  
  // 菜单状态
  sys_show_hide: [
    { label: '显示', value: '0', dictCode: 4, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '显示菜单' },
    { label: '隐藏', value: '1', dictCode: 5, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '隐藏菜单' }
  ],
  
  // 系统开关
  sys_normal_disable: [
    { label: '正常', value: '0', dictCode: 6, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '正常状态' },
    { label: '停用', value: '1', dictCode: 7, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '停用状态' }
  ],
  
  // 任务状态
  sys_job_status: [
    { label: '正常', value: '0', dictCode: 8, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '正常状态' },
    { label: '暂停', value: '1', dictCode: 9, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '停用状态' }
  ],
  
  // 任务分组
  sys_job_group: [
    { label: '默认', value: 'DEFAULT', dictCode: 10, dictSort: 1, listClass: 'default', cssClass: '', isDefault: 'Y', status: '0', remark: '默认分组' },
    { label: '系统', value: 'SYSTEM', dictCode: 11, dictSort: 2, listClass: 'primary', cssClass: '', isDefault: 'N', status: '0', remark: '系统分组' }
  ],
  
  // 系统是否
  sys_yes_no: [
    { label: '是', value: 'Y', dictCode: 12, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '系统默认是' },
    { label: '否', value: 'N', dictCode: 13, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '系统默认否' }
  ],
  
  // 通知类型
  sys_notice_type: [
    { label: '通知', value: '1', dictCode: 14, dictSort: 1, listClass: 'warning', cssClass: '', isDefault: 'Y', status: '0', remark: '通知' },
    { label: '公告', value: '2', dictCode: 15, dictSort: 2, listClass: 'success', cssClass: '', isDefault: 'N', status: '0', remark: '公告' }
  ],
  
  // 通知状态
  sys_notice_status: [
    { label: '正常', value: '0', dictCode: 16, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '正常状态' },
    { label: '关闭', value: '1', dictCode: 17, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '关闭状态' }
  ],
  
  // 操作类型
  sys_oper_type: [
    { label: '其他', value: '0', dictCode: 18, dictSort: 1, listClass: 'info', cssClass: '', isDefault: 'N', status: '0', remark: '其他操作' },
    { label: '新增', value: '1', dictCode: 19, dictSort: 2, listClass: 'primary', cssClass: '', isDefault: 'N', status: '0', remark: '新增操作' },
    { label: '修改', value: '2', dictCode: 20, dictSort: 3, listClass: 'success', cssClass: '', isDefault: 'N', status: '0', remark: '修改操作' },
    { label: '删除', value: '3', dictCode: 21, dictSort: 4, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '删除操作' },
    { label: '授权', value: '4', dictCode: 22, dictSort: 5, listClass: 'primary', cssClass: '', isDefault: 'N', status: '0', remark: '授权操作' },
    { label: '导出', value: '5', dictCode: 23, dictSort: 6, listClass: 'warning', cssClass: '', isDefault: 'N', status: '0', remark: '导出操作' },
    { label: '导入', value: '6', dictCode: 24, dictSort: 7, listClass: 'warning', cssClass: '', isDefault: 'N', status: '0', remark: '导入操作' },
    { label: '强退', value: '7', dictCode: 25, dictSort: 8, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '强退操作' },
    { label: '生成代码', value: '8', dictCode: 26, dictSort: 9, listClass: 'warning', cssClass: '', isDefault: 'N', status: '0', remark: '生成操作' },
    { label: '清空数据', value: '9', dictCode: 27, dictSort: 10, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '清空操作' }
  ],
  
  // 系统状态
  sys_common_status: [
    { label: '成功', value: '0', dictCode: 28, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'N', status: '0', remark: '正常状态' },
    { label: '失败', value: '1', dictCode: 29, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '停用状态' }
  ],
  
  // 数据范围
  sys_data_scope: [
    { label: '全部数据权限', value: '1', dictCode: 30, dictSort: 1, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '全部数据权限' },
    { label: '自定数据权限', value: '2', dictCode: 31, dictSort: 2, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '自定义数据权限' },
    { label: '本部门数据权限', value: '3', dictCode: 32, dictSort: 3, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '部门数据权限' },
    { label: '本部门及以下数据权限', value: '4', dictCode: 33, dictSort: 4, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '部门及以下数据权限' },
    { label: '仅本人数据权限', value: '5', dictCode: 34, dictSort: 5, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '仅本人数据权限' }
  ],
  
  // 菜单类型
  sys_menu_type: [
    { label: '目录', value: 'M', dictCode: 35, dictSort: 1, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '目录' },
    { label: '菜单', value: 'C', dictCode: 36, dictSort: 2, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '菜单' },
    { label: '按钮', value: 'F', dictCode: 37, dictSort: 3, listClass: 'default', cssClass: '', isDefault: 'N', status: '0', remark: '按钮' }
  ],
  
  // 是否缓存
  sys_is_cache: [
    { label: '缓存', value: '0', dictCode: 38, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '缓存' },
    { label: '不缓存', value: '1', dictCode: 39, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '不缓存' }
  ],
  
  // 是否外链
  sys_is_frame: [
    { label: '是', value: '0', dictCode: 40, dictSort: 1, listClass: 'primary', cssClass: '', isDefault: 'Y', status: '0', remark: '是外链' },
    { label: '否', value: '1', dictCode: 41, dictSort: 2, listClass: 'danger', cssClass: '', isDefault: 'N', status: '0', remark: '不是外链' }
  ]
}

// 获取字典数据的函数
export function getDictData(dictType) {
  return dictData[dictType] || []
}

// 根据字典类型和值获取标签
export function getDictLabel(dictType, value) {
  const dict = dictData[dictType]
  if (!dict) return value
  
  const item = dict.find(d => d.value === value)
  return item ? item.label : value
}

// 根据字典类型和标签获取值
export function getDictValue(dictType, label) {
  const dict = dictData[dictType]
  if (!dict) return label
  
  const item = dict.find(d => d.label === label)
  return item ? item.value : label
}
