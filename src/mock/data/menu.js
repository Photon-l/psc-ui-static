/**
 * 菜单路由静态数据
 */

// 菜单树结构数据
export const menuTree = [
  {
    name: 'Huji',
    path: '/huji',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '户籍管理',
      icon: 'peoples',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'HujiBasic',
        path: 'basic',
        hidden: false,
        component: 'huji/basic/index',
        meta: {
          title: '户籍信息',
          icon: 'user',
          noCache: false,
          link: null
        }
      }
    ]
  },
  {
    name: 'System',
    path: '/psystem',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '系统管理',
      icon: 'system',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'User',
        path: 'user',
        hidden: false,
        component: 'system/user/index',
        meta: {
          title: '用户管理',
          icon: 'user',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Role',
        path: 'role',
        hidden: false,
        component: 'system/role/index',
        meta: {
          title: '角色管理',
          icon: 'peoples',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Menu',
        path: 'menu',
        hidden: false,
        component: 'system/menu/index',
        meta: {
          title: '菜单管理',
          icon: 'tree-table',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Dept',
        path: 'dept',
        hidden: false,
        component: 'system/dept/index',
        meta: {
          title: '部门管理',
          icon: 'tree',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Post',
        path: 'post',
        hidden: false,
        component: 'system/post/index',
        meta: {
          title: '岗位管理',
          icon: 'post',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Dict',
        path: 'dict',
        hidden: false,
        component: 'system/dict/index',
        meta: {
          title: '字典管理',
          icon: 'dict',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Config',
        path: 'config',
        hidden: false,
        component: 'system/config/index',
        meta: {
          title: '参数设置',
          icon: 'edit',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Notice',
        path: 'notice',
        hidden: false,
        component: 'system/notice/index',
        meta: {
          title: '通知公告',
          icon: 'message',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Log',
        path: 'log',
        hidden: false,
        redirect: 'noRedirect',
        component: 'ParentView',
        alwaysShow: true,
        meta: {
          title: '日志管理',
          icon: 'log',
          noCache: false,
          link: null
        },
        children: [
          {
            name: 'Operlog',
            path: 'operlog',
            hidden: false,
            component: 'system/operlog/index',
            meta: {
              title: '操作日志',
              icon: 'form',
              noCache: false,
              link: null
            }
          },
          {
            name: 'Logininfor',
            path: 'logininfor',
            hidden: false,
            component: 'system/logininfor/index',
            meta: {
              title: '登录日志',
              icon: 'logininfor',
              noCache: false,
              link: null
            }
          }
        ]
      }
    ]
  },
  {
    name: 'Monitor',
    path: '/monitor',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '系统监控',
      icon: 'monitor',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'Online',
        path: 'online',
        hidden: false,
        component: 'monitor/online/index',
        meta: {
          title: '在线用户',
          icon: 'online',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Job',
        path: 'job',
        hidden: false,
        component: 'monitor/job/index',
        meta: {
          title: '定时任务',
          icon: 'job',
          noCache: false,
          link: null
        }
      }
    ]
  },
  {
    name: 'Tool',
    path: '/tool',
    hidden: false,
    redirect: 'noRedirect',
    component: 'Layout',
    alwaysShow: true,
    meta: {
      title: '系统工具',
      icon: 'tool',
      noCache: false,
      link: null
    },
    children: [
      {
        name: 'Build',
        path: 'build',
        hidden: false,
        component: 'tool/build/index',
        meta: {
          title: '表单构建',
          icon: 'build',
          noCache: false,
          link: null
        }
      },
      {
        name: 'Gen',
        path: 'gen',
        hidden: false,
        component: 'tool/gen/index',
        meta: {
          title: '代码生成',
          icon: 'code',
          noCache: false,
          link: null
        }
      }
    ]
  }
]

// 菜单管理页面使用的菜单列表数据
export const menuList = [
  {
    menuId: 1,
    menuName: '户籍管理',
    parentId: 0,
    orderNum: 1,
    path: '/huji',
    component: 'Layout',
    query: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'peoples',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '户籍管理目录',
    children: [
      {
        menuId: 101,
        menuName: '户籍信息',
        parentId: 1,
        orderNum: 1,
        path: 'basic',
        component: 'huji/basic/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'huji:basic:list',
        icon: 'user',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '户籍信息菜单'
      }
    ]
  },
  {
    menuId: 2,
    menuName: '系统管理',
    parentId: 0,
    orderNum: 2,
    path: '/psystem',
    component: 'Layout',
    query: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'system',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '系统管理目录',
    children: [
      {
        menuId: 201,
        menuName: '用户管理',
        parentId: 2,
        orderNum: 1,
        path: 'user',
        component: 'system/user/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:user:list',
        icon: 'user',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '用户管理菜单'
      },
      {
        menuId: 202,
        menuName: '角色管理',
        parentId: 2,
        orderNum: 2,
        path: 'role',
        component: 'system/role/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:role:list',
        icon: 'peoples',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '角色管理菜单'
      },
      {
        menuId: 203,
        menuName: '菜单管理',
        parentId: 2,
        orderNum: 3,
        path: 'menu',
        component: 'system/menu/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:menu:list',
        icon: 'tree-table',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '菜单管理菜单'
      },
      {
        menuId: 204,
        menuName: '部门管理',
        parentId: 2,
        orderNum: 4,
        path: 'dept',
        component: 'system/dept/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:dept:list',
        icon: 'tree',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '部门管理菜单'
      },
      {
        menuId: 205,
        menuName: '岗位管理',
        parentId: 2,
        orderNum: 5,
        path: 'post',
        component: 'system/post/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:post:list',
        icon: 'post',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '岗位管理菜单'
      },
      {
        menuId: 206,
        menuName: '字典管理',
        parentId: 2,
        orderNum: 6,
        path: 'dict',
        component: 'system/dict/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:dict:list',
        icon: 'dict',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '字典管理菜单'
      },
      {
        menuId: 207,
        menuName: '参数设置',
        parentId: 2,
        orderNum: 7,
        path: 'config',
        component: 'system/config/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:config:list',
        icon: 'edit',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '参数设置菜单'
      },
      {
        menuId: 208,
        menuName: '通知公告',
        parentId: 2,
        orderNum: 8,
        path: 'notice',
        component: 'system/notice/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'system:notice:list',
        icon: 'message',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '通知公告菜单'
      },
      {
        menuId: 209,
        menuName: '日志管理',
        parentId: 2,
        orderNum: 9,
        path: 'log',
        component: '',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'M',
        visible: '0',
        status: '0',
        perms: '',
        icon: 'log',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '日志管理菜单',
        children: [
          {
            menuId: 20901,
            menuName: '操作日志',
            parentId: 209,
            orderNum: 1,
            path: 'operlog',
            component: 'system/operlog/index',
            query: '',
            isFrame: '1',
            isCache: '0',
            menuType: 'C',
            visible: '0',
            status: '0',
            perms: 'system:operlog:list',
            icon: 'form',
            createBy: 'admin',
            createTime: '2025-01-01 10:00:00',
            updateBy: '',
            updateTime: null,
            remark: '操作日志菜单'
          },
          {
            menuId: 20902,
            menuName: '登录日志',
            parentId: 209,
            orderNum: 2,
            path: 'logininfor',
            component: 'system/logininfor/index',
            query: '',
            isFrame: '1',
            isCache: '0',
            menuType: 'C',
            visible: '0',
            status: '0',
            perms: 'system:logininfor:list',
            icon: 'logininfor',
            createBy: 'admin',
            createTime: '2025-01-01 10:00:00',
            updateBy: '',
            updateTime: null,
            remark: '登录日志菜单'
          }
        ]
      }
    ]
  },
  {
    menuId: 3,
    menuName: '系统监控',
    parentId: 0,
    orderNum: 3,
    path: '/monitor',
    component: 'Layout',
    query: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'monitor',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '系统监控目录',
    children: [
      {
        menuId: 301,
        menuName: '在线用户',
        parentId: 3,
        orderNum: 1,
        path: 'online',
        component: 'monitor/online/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:online:list',
        icon: 'online',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '在线用户菜单'
      },
      {
        menuId: 302,
        menuName: '定时任务',
        parentId: 3,
        orderNum: 2,
        path: 'job',
        component: 'monitor/job/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'monitor:job:list',
        icon: 'job',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '定时任务菜单'
      }
    ]
  },
  {
    menuId: 4,
    menuName: '系统工具',
    parentId: 0,
    orderNum: 4,
    path: '/tool',
    component: 'Layout',
    query: '',
    isFrame: '1',
    isCache: '0',
    menuType: 'M',
    visible: '0',
    status: '0',
    perms: '',
    icon: 'tool',
    createBy: 'admin',
    createTime: '2025-01-01 10:00:00',
    updateBy: '',
    updateTime: null,
    remark: '系统工具目录',
    children: [
      {
        menuId: 401,
        menuName: '表单构建',
        parentId: 4,
        orderNum: 1,
        path: 'build',
        component: 'tool/build/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:build:list',
        icon: 'build',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '表单构建菜单'
      },
      {
        menuId: 402,
        menuName: '代码生成',
        parentId: 4,
        orderNum: 2,
        path: 'gen',
        component: 'tool/gen/index',
        query: '',
        isFrame: '1',
        isCache: '0',
        menuType: 'C',
        visible: '0',
        status: '0',
        perms: 'tool:gen:list',
        icon: 'code',
        createBy: 'admin',
        createTime: '2025-01-01 10:00:00',
        updateBy: '',
        updateTime: null,
        remark: '代码生成菜单'
      }
    ]
  }
]
