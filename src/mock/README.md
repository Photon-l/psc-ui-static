# Mock 数据系统

本目录包含用于静态 Demo 的 Mock 数据系统，可以在没有后端服务的情况下模拟 API 响应。

## 目录结构

```
src/mock/
├── index.js           # Mock 核心模块，提供拦截器和工具函数
├── data/              # 静态数据存储目录
│   ├── index.js       # 数据模块统一导出
│   ├── user.js        # 用户相关数据
│   ├── menu.js        # 菜单路由数据
│   ├── system.js      # 系统管理数据
│   ├── huji.js        # 户籍管理数据
│   ├── dashboard.js   # 仪表盘数据
│   └── dict.js        # 字典数据
├── modules/           # Mock 接口注册模块
│   └── example.js     # 示例模块
└── README.md          # 本文档
```

## 使用方法

### 1. 启用 Mock

Mock 系统在 `src/main.js` 中自动初始化：

```javascript
import { setupMock } from '@/mock'
setupMock()
```

### 2. 注册 Mock 接口

在 `src/mock/modules/` 目录下创建模块文件，使用 `registerMock` 函数注册接口：

```javascript
import { registerMock, createSuccessResponse } from '../index'

// 注册简单的 GET 请求
registerMock('get', '/api/user/info', createSuccessResponse({
  userId: 1,
  userName: 'admin'
}))

// 使用函数动态生成响应
registerMock('post', '/api/user/list', (config) => {
  const { pageNum = 1, pageSize = 10 } = config.data || {}
  
  // 生成数据
  const rows = [/* ... */]
  
  return createPageResponse(rows, 100)
})
```

### 3. 工具函数

#### `registerMock(method, url, response)`
注册 Mock 接口

- `method`: 请求方法 (get, post, put, delete)
- `url`: 请求 URL 或正则表达式字符串
- `response`: 响应数据对象或响应函数

#### `createSuccessResponse(data, msg)`
创建成功响应

```javascript
{
  code: 200,
  msg: '操作成功',
  data: { /* ... */ }
}
```

#### `createPageResponse(rows, total, msg)`
创建分页响应

```javascript
{
  code: 200,
  msg: '查询成功',
  rows: [/* ... */],
  total: 100
}
```

#### `createErrorResponse(msg, code)`
创建错误响应

```javascript
{
  code: 500,
  msg: '操作失败',
  data: null
}
```

## 特性

- ✅ 自动拦截 Axios 请求
- ✅ 支持精确 URL 匹配
- ✅ 支持正则表达式匹配
- ✅ 支持动态响应函数
- ✅ 模拟网络延迟（300ms）
- ✅ 标准响应格式
- ✅ 控制台日志输出

## 配置

在 `src/mock/index.js` 中可以配置：

```javascript
// 是否启用 Mock
const MOCK_ENABLED = true

// 模拟网络延迟（毫秒）
const MOCK_DELAY = 300
```

## 注意事项

1. Mock 拦截器会在请求发送前拦截匹配的请求
2. 未匹配的请求会正常发送到后端
3. 响应数据格式应与后端 API 保持一致
4. 建议为每个功能模块创建独立的 Mock 文件
