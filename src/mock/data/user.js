/**
 * 用户相关静态数据
 */

// 用户列表数据
export const userList = [
  {
    userId: 1,
    userName: 'admin',
    nickName: '管理员',
    email: 'admin@example.com',
    phonenumber: '13800138000',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2025-01-15 10:30:00',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '管理员账号',
    dept: {
      deptId: 103,
      deptName: '研发部门'
    },
    roles: [
      {
        roleId: 1,
        roleName: '超级管理员',
        roleKey: 'admin',
        roleSort: 1,
        status: '0'
      }
    ]
  },
  {
    userId: 2,
    userName: 'zhangsan',
    nickName: '张三',
    email: 'zhangsan@example.com',
    phonenumber: '13800138001',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2025-01-14 15:20:00',
    createBy: 'admin',
    createTime: '2025-01-02 09:00:00',
    updateBy: 'admin',
    updateTime: '2025-01-10 14:30:00',
    remark: '普通用户',
    dept: {
      deptId: 105,
      deptName: '测试部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 3,
    userName: 'lisi',
    nickName: '李四',
    email: 'lisi@example.com',
    phonenumber: '13800138002',
    sex: '1',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.100',
    loginDate: '2025-01-13 09:15:00',
    createBy: 'admin',
    createTime: '2025-01-03 11:20:00',
    updateBy: '',
    updateTime: null,
    remark: '测试用户',
    dept: {
      deptId: 105,
      deptName: '测试部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 4,
    userName: 'wangwu',
    nickName: '王五',
    email: 'wangwu@example.com',
    phonenumber: '13800138003',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.101',
    loginDate: '2025-01-12 16:45:00',
    createBy: 'admin',
    createTime: '2025-01-04 13:10:00',
    updateBy: 'admin',
    updateTime: '2025-01-11 10:20:00',
    remark: '开发人员',
    dept: {
      deptId: 103,
      deptName: '研发部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 5,
    userName: 'zhaoliu',
    nickName: '赵六',
    email: 'zhaoliu@example.com',
    phonenumber: '13800138004',
    sex: '1',
    avatar: '',
    status: '1',
    delFlag: '0',
    loginIp: '192.168.1.102',
    loginDate: '2025-01-10 08:30:00',
    createBy: 'admin',
    createTime: '2025-01-05 14:00:00',
    updateBy: 'admin',
    updateTime: '2025-01-12 09:00:00',
    remark: '已停用账号',
    dept: {
      deptId: 108,
      deptName: '市场部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 6,
    userName: 'sunqi',
    nickName: '孙七',
    email: 'sunqi@example.com',
    phonenumber: '13800138005',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.103',
    loginDate: '2025-01-11 11:20:00',
    createBy: 'admin',
    createTime: '2025-01-06 15:30:00',
    updateBy: '',
    updateTime: null,
    remark: '产品经理',
    dept: {
      deptId: 102,
      deptName: '产品部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 7,
    userName: 'zhouba',
    nickName: '周八',
    email: 'zhouba@example.com',
    phonenumber: '13800138006',
    sex: '1',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.104',
    loginDate: '2025-01-09 14:10:00',
    createBy: 'admin',
    createTime: '2025-01-07 16:40:00',
    updateBy: 'admin',
    updateTime: '2025-01-13 11:15:00',
    remark: '设计师',
    dept: {
      deptId: 106,
      deptName: '设计部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 8,
    userName: 'wujiu',
    nickName: '吴九',
    email: 'wujiu@example.com',
    phonenumber: '13800138007',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.105',
    loginDate: '2025-01-08 10:50:00',
    createBy: 'admin',
    createTime: '2025-01-08 09:20:00',
    updateBy: '',
    updateTime: null,
    remark: '运维工程师',
    dept: {
      deptId: 103,
      deptName: '研发部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 9,
    userName: 'zhengshi',
    nickName: '郑十',
    email: 'zhengshi@example.com',
    phonenumber: '13800138008',
    sex: '1',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.106',
    loginDate: '2025-01-07 13:25:00',
    createBy: 'admin',
    createTime: '2025-01-09 10:10:00',
    updateBy: 'admin',
    updateTime: '2025-01-14 15:40:00',
    remark: '人事专员',
    dept: {
      deptId: 107,
      deptName: '人事部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  },
  {
    userId: 10,
    userName: 'chenyi',
    nickName: '陈一',
    email: 'chenyi@example.com',
    phonenumber: '13800138009',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '192.168.1.107',
    loginDate: '2025-01-06 12:35:00',
    createBy: 'admin',
    createTime: '2025-01-10 11:50:00',
    updateBy: '',
    updateTime: null,
    remark: '财务人员',
    dept: {
      deptId: 109,
      deptName: '财务部门'
    },
    roles: [
      {
        roleId: 2,
        roleName: '普通角色',
        roleKey: 'common',
        roleSort: 2,
        status: '0'
      }
    ]
  }
]

// 登录响应数据
export const loginResponse = {
  access_token: 'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjEyMzQ1Njc4LTkwYWItY2RlZi0xMjM0LTU2Nzg5MGFiY2RlZiJ9.mock_token_signature',
  expires_in: 7200
}

// 用户信息响应数据
export const userInfo = {
  user: {
    userId: 1,
    userName: 'admin',
    nickName: '管理员',
    email: 'admin@example.com',
    phonenumber: '13800138000',
    sex: '0',
    avatar: '',
    status: '0',
    delFlag: '0',
    loginIp: '127.0.0.1',
    loginDate: '2025-01-15 10:30:00',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '管理员账号',
    dept: {
      deptId: 103,
      deptName: '研发部门',
      leader: '若依'
    }
  },
  roles: ['admin'],
  permissions: ['*:*:*']
}

// 验证码响应数据
export const captchaResponse = {
  uuid: 'mock-uuid-' + Date.now(),
  img: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  captchaEnabled: true
}

// 退出登录响应
export const logoutResponse = {
  code: 200,
  msg: '退出成功'
}
