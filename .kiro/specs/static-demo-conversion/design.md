# 设计文档

## 概述

本设计文档描述如何将若依管理系统前端项目改造为静态文本展示的 demo。改造的核心思路是：保留原有的 UI 组件和页面结构，但将所有后端 API 调用替换为静态数据模拟，使系统能够在没有后端服务的情况下独立运行。

## 架构

### 当前架构分析

若依系统采用以下技术栈和架构：
- Vue 2.6.12 + Vue Router + Vuex
- Element UI 组件库
- Axios 进行 HTTP 请求
- 动态路由机制（基于后端返回的权限数据）
- 权限控制系统（基于角色和权限）

### 改造后架构

改造后的系统将采用以下架构：
- 保留 Vue + Vue Router + Vuex 核心框架
- 保留 Element UI 组件库
- 移除 Axios 实际请求，使用 Mock 适配器或静态数据返回
- 使用静态路由配置替代动态路由
- 简化权限控制，允许访问所有功能

## 组件和接口

### 1. API Mock 层

创建一个统一的 Mock 层来拦截所有 API 请求并返回静态数据。

#### 1.1 Mock 适配器


**位置：** `src/mock/index.js`

**职责：**
- 拦截 Axios 请求
- 根据请求 URL 和方法返回对应的静态数据
- 模拟网络延迟以提供真实体验

**实现方式：**
使用 axios-mock-adapter 库或自定义拦截器来实现请求拦截。

```javascript
// 伪代码示例
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios, { delayResponse: 300 })

// 拦截登录请求
mock.onPost('/pauth/login').reply(200, {
  code: 200,
  msg: '登录成功',
  data: {
    access_token: 'mock-token-12345',
    expires_in: 7200
  }
})
```

#### 1.2 静态数据管理

**位置：** `src/mock/data/`

**结构：**
```
src/mock/data/
├── user.js          # 用户相关数据
├── menu.js          # 菜单路由数据
├── huji.js          # 户籍管理数据
├── system.js        # 系统管理数据
├── dashboard.js     # 仪表盘数据
└── index.js         # 统一导出
```

**职责：**
- 存储所有模拟数据
- 提供数据生成函数
- 确保数据结构与后端 API 返回格式一致

### 2. 路由系统改造

#### 2.1 静态路由配置

**修改文件：** `src/router/index.js`

**改造内容：**
- 将所有动态路由转换为静态路由
- 在 `constantRoutes` 中添加完整的菜单路由
- 移除权限检查逻辑

**静态路由示例：**
```javascript
{
  path: '/huji',
  component: Layout,
  redirect: '/huji/basic',
  name: 'Huji',
  meta: { title: '户籍管理', icon: 'peoples' },
  children: [
    {
      path: 'basic',
      component: () => import('@/views/huji/basic/index'),
      name: 'HujiBasic',
      meta: { title: '户籍信息', icon: 'user' }
    }
  ]
}
```

#### 2.2 权限控制简化

**修改文件：** `src/permission.js`

**改造内容：**
- 简化路由守卫逻辑
- 移除 `GetInfo` 和 `GenerateRoutes` 的异步调用
- 登录后直接允许访问所有路由

### 3. Store 模块改造

#### 3.1 User 模块

**修改文件：** `src/store/modules/user.js`

**改造内容：**
- `Login` action：移除真实 API 调用，直接设置 token
- `GetInfo` action：返回静态用户信息
- `LogOut` action：仅清除本地状态

**静态用户信息：**
```javascript
{
  user: {
    userId: 1,
    userName: 'admin',
    nickName: '管理员',
    avatar: '/static/avatar.jpg'
  },
  roles: ['admin'],
  permissions: ['*:*:*']
}
```

#### 3.2 Permission 模块

**修改文件：** `src/store/modules/permission.js`

**改造内容：**
- `GenerateRoutes` action：不再调用 `getRouters` API
- 直接使用静态路由配置
- 移除权限过滤逻辑

### 4. 登录系统

#### 4.1 登录页面

**修改文件：** `src/views/login.vue`

**改造内容：**
- 保留登录表单 UI
- 接受任意用户名和密码
- 验证码校验改为始终通过
- 登录成功后跳转到首页

#### 4.2 验证码处理

**改造方式：**
- 使用静态图片或随机生成的验证码图片
- 不进行实际验证，任意输入都视为正确

### 5. 数据展示页面

#### 5.1 表格页面通用改造

**适用页面：**
- 用户管理 (`src/views/system/user/index.vue`)
- 角色管理 (`src/views/system/role/index.vue`)
- 菜单管理 (`src/views/system/menu/index.vue`)
- 户籍管理 (`src/views/huji/basic/index.vue`)
- 等所有包含表格的页面

**改造内容：**
1. 列表查询：返回静态数据数组
2. 分页功能：基于静态数据实现前端分页
3. 搜索过滤：基于静态数据实现前端过滤
4. 新增操作：显示对话框，提交时仅显示成功提示
5. 编辑操作：显示对话框并填充数据，提交时仅显示成功提示
6. 删除操作：显示确认对话框，确认后仅显示成功提示

**数据结构示例（用户管理）：**
```javascript
{
  code: 200,
  msg: '查询成功',
  rows: [
    {
      userId: 1,
      userName: 'admin',
      nickName: '管理员',
      email: 'admin@example.com',
      phonenumber: '13800138000',
      sex: '0',
      status: '0',
      createTime: '2025-01-01 10:00:00'
    },
    // ... 更多数据
  ],
  total: 50
}
```

#### 5.2 Dashboard 页面

**修改文件：** `src/views/index.vue`

**改造内容：**
- 统计卡片：使用静态数值
- 图表数据：使用静态数据渲染 ECharts
- 待办事项：显示静态列表
- 通知公告：显示静态列表

**已有实现：**
该页面已经包含了降级到静态数据的逻辑（在 API 调用失败时），可以直接使用这些静态数据。

### 6. 表单操作模拟

#### 6.1 新增/编辑对话框

**改造策略：**
- 保留表单验证逻辑
- 提交时不发送真实请求
- 显示成功提示消息
- 关闭对话框并刷新列表（使用静态数据）

**实现方式：**
```javascript
// 伪代码
submitForm() {
  this.$refs.form.validate(valid => {
    if (valid) {
      // 不发送真实请求
      this.$message.success('操作成功')
      this.open = false
      this.getList() // 重新加载静态数据
    }
  })
}
```

#### 6.2 删除操作

**改造策略：**
- 显示确认对话框
- 确认后显示成功提示
- 刷新列表（使用静态数据）

### 7. 字典数据处理

**修改文件：** `src/components/DictData/index.vue` 和相关 API

**改造内容：**
- 字典数据使用静态配置
- 常用字典类型：用户状态、性别、菜单类型等

**静态字典数据结构：**
```javascript
{
  'sys_user_sex': [
    { label: '男', value: '0' },
    { label: '女', value: '1' },
    { label: '未知', value: '2' }
  ],
  'sys_normal_disable': [
    { label: '正常', value: '0' },
    { label: '停用', value: '1' }
  ]
}
```

## 数据模型

### 用户数据模型

```javascript
{
  userId: Number,        // 用户ID
  userName: String,      // 用户名
  nickName: String,      // 昵称
  email: String,         // 邮箱
  phonenumber: String,   // 手机号
  sex: String,           // 性别（0男 1女 2未知）
  avatar: String,        // 头像路径
  status: String,        // 状态（0正常 1停用）
  createTime: String,    // 创建时间
  remark: String         // 备注
}
```

### 菜单路由数据模型

```javascript
{
  menuId: Number,        // 菜单ID
  menuName: String,      // 菜单名称
  parentId: Number,      // 父菜单ID
  orderNum: Number,      // 显示顺序
  path: String,          // 路由地址
  component: String,     // 组件路径
  isFrame: String,       // 是否外链（0是 1否）
  isCache: String,       // 是否缓存（0缓存 1不缓存）
  menuType: String,      // 菜单类型（M目录 C菜单 F按钮）
  visible: String,       // 显示状态（0显示 1隐藏）
  status: String,        // 菜单状态（0正常 1停用）
  perms: String,         // 权限标识
  icon: String,          // 菜单图标
  children: Array        // 子菜单
}
```

### 户籍数据模型

```javascript
{
  id: Number,            // 记录ID
  name: String,          // 姓名
  idCard: String,        // 身份证号
  gender: String,        // 性别
  birthDate: String,     // 出生日期
  address: String,       // 地址
  phone: String,         // 联系电话
  status: String,        // 状态
  createTime: String,    // 创建时间
  updateTime: String     // 更新时间
}
```

## 错误处理

### 1. API 错误处理

**策略：**
- 所有 Mock API 默认返回成功响应
- 可选：添加随机失败模拟以测试错误处理

### 2. 路由错误处理

**策略：**
- 保留 404 和 401 错误页面
- 简化权限检查，避免触发 401 错误

### 3. 表单验证

**策略：**
- 保留所有表单验证逻辑
- 确保用户体验与真实系统一致

## 测试策略

### 1. 功能测试

**测试项：**
- 登录流程：任意用户名密码能否登录
- 菜单导航：所有菜单项能否正常跳转
- 表格展示：数据能否正常显示
- 分页功能：分页切换是否正常
- 搜索过滤：搜索功能是否有效
- 表单操作：新增、编辑、删除操作是否正常

### 2. UI 测试

**测试项：**
- 样式一致性：与原系统对比
- 响应式布局：不同屏幕尺寸下的表现
- 组件交互：按钮、对话框、提示等

### 3. 性能测试

**测试项：**
- 页面加载速度
- 路由切换流畅度
- 大数据量表格渲染性能

## 实现优先级

### 高优先级
1. Mock 层基础架构
2. 登录系统改造
3. 路由系统静态化
4. 用户和权限 Store 改造
5. Dashboard 页面数据静态化

### 中优先级
6. 系统管理模块（用户、角色、菜单）
7. 户籍管理模块
8. 字典数据静态化
9. 表单操作模拟

### 低优先级
10. 监控管理模块
11. 工具模块
12. 其他辅助功能

## 技术决策

### 1. Mock 方案选择

**方案 A：使用 axios-mock-adapter**
- 优点：成熟的库，易于使用
- 缺点：需要安装额外依赖

**方案 B：自定义 Axios 拦截器**
- 优点：无需额外依赖，更灵活
- 缺点：需要手动实现更多功能

**决策：** 采用方案 B（自定义拦截器），因为项目已经有 Axios，且改造范围可控。

### 2. 数据存储方式

**方案 A：所有数据存储在 JS 文件中**
- 优点：简单直接
- 缺点：数据量大时文件臃肿

**方案 B：使用 JSON 文件存储数据**
- 优点：数据与代码分离，易于维护
- 缺点：需要额外的加载逻辑

**决策：** 采用方案 A，因为 demo 数据量不大，且 JS 文件更灵活。

### 3. 路由改造方式

**方案 A：完全移除动态路由逻辑**
- 优点：代码简洁
- 缺点：改动较大

**方案 B：保留动态路由逻辑，但使用静态数据**
- 优点：改动较小，保留原有架构
- 缺点：代码冗余

**决策：** 采用方案 B，保留动态路由逻辑但使用静态数据，减少改动风险。

## 部署考虑

### 1. 构建配置

**修改文件：** `vue.config.js`

**改造内容：**
- 确保 Mock 代码只在开发和 demo 模式下加载
- 配置静态资源路径

### 2. 环境变量

**新增文件：** `.env.demo`

**内容：**
```
NODE_ENV=production
VUE_APP_TITLE=若依管理系统 Demo
VUE_APP_BASE_API=/mock
```

### 3. 打包优化

- 移除不必要的依赖
- 优化静态资源
- 启用代码压缩

## 维护性考虑

### 1. 代码组织

- Mock 代码独立于业务代码
- 使用清晰的目录结构
- 添加必要的注释

### 2. 数据更新

- 静态数据集中管理
- 提供数据生成工具（可选）
- 文档化数据结构

### 3. 扩展性

- 预留添加新模块的接口
- Mock 层支持动态注册
- 支持按需加载数据
