# 派出所管理系统 - 静态 Demo

这是一个基于若依框架的派出所管理系统前端项目，已配置为静态 Demo 模式，无需后端服务即可运行。

## 项目说明

本项目是一个纯前端演示版本，使用 Mock 数据模拟所有后端接口，可以独立运行并展示完整的系统功能。

## 环境要求

- Node.js 12.x 或更高版本
- npm 6.x 或更高版本

## 快速开始

### 1. 安装依赖

```bash
# 进入项目目录
cd pcs-ui

# 安装项目依赖
npm install

# 如果 npm 下载速度慢，可以使用国内镜像
npm install --registry=https://registry.npmmirror.com
```

### 2. 启动开发服务器

```bash
npm run dev
```

启动成功后，浏览器会自动打开 http://localhost:80/

### 3. 登录系统

在登录页面使用以下账号登录：

- **账号**: `admin`
- **密码**: `admin123`

> 注意：静态 Demo 模式下，验证码已禁用，直接点击"登录"按钮即可进入系统。

## 功能说明

### 可用功能

✅ **登录功能** - 使用固定账号密码登录  
✅ **首页 Dashboard** - 显示统计数据、图表、待办事项  
✅ **户籍管理** - 户籍信息查询、新增、编辑、删除（20 条示例数据）  
✅ **系统管理** - 用户、角色、部门、岗位、菜单、字典、参数、通知管理  
✅ **系统监控** - 在线用户、定时任务  
✅ **系统工具** - 表单构建、代码生成  

### 功能限制

⚠️ 所有数据修改操作仅在前端模拟，刷新页面后恢复初始状态  
⚠️ 文件上传、下载功能仅显示提示，不实际执行  
⚠️ 部分需要后端支持的功能可能无法完整演示  

## 项目结构

```
pcs-ui/
├── src/
│   ├── api/              # API 接口定义
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── layout/           # 布局组件
│   ├── mock/             # Mock 数据系统
│   │   ├── data/         # 静态数据
│   │   │   ├── user.js       # 用户数据
│   │   │   ├── menu.js       # 菜单数据
│   │   │   ├── system.js     # 系统管理数据
│   │   │   ├── huji.js       # 户籍数据
│   │   │   ├── dashboard.js  # Dashboard 数据
│   │   │   └── dict.js       # 字典数据
│   │   ├── modules/      # Mock 接口注册
│   │   │   ├── login.js      # 登录接口
│   │   │   ├── menu.js       # 菜单接口
│   │   │   ├── system.js     # 系统管理接口
│   │   │   ├── huji.js       # 户籍接口
│   │   │   └── dashboard.js  # Dashboard 接口
│   │   ├── index.js      # Mock 核心模块
│   │   └── README.md     # Mock 系统说明
│   ├── router/           # 路由配置
│   ├── store/            # Vuex 状态管理
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── public/               # 公共资源
├── .env.development      # 开发环境配置
├── package.json          # 项目配置
└── README.md             # 本文档
```

## Mock 数据系统

### 数据位置

所有静态数据存储在 `src/mock/data/` 目录下：

- `user.js` - 10 条用户数据
- `menu.js` - 完整的系统菜单树
- `system.js` - 角色、部门、岗位、字典、参数、通知数据
- `huji.js` - 20 条户籍信息数据
- `dashboard.js` - Dashboard 统计和图表数据
- `dict.js` - 系统字典数据

### 接口注册

Mock 接口在 `src/mock/modules/` 目录下注册：

- `login.js` - 登录、验证码、用户信息接口
- `menu.js` - 菜单路由接口
- `system.js` - 系统管理相关接口
- `huji.js` - 户籍管理接口
- `dashboard.js` - Dashboard 数据接口

### 如何修改数据

1. 打开对应的数据文件（如 `src/mock/data/user.js`）
2. 修改或添加数据
3. 保存文件，开发服务器会自动重新加载

### 如何禁用 Mock

如需连接真实后端，修改 `src/mock/index.js`：

```javascript
// 将 MOCK_ENABLED 设置为 false
const MOCK_ENABLED = false
```

## 构建部署

### 构建生产版本

```bash
# 构建生产环境
npm run build:prod

# 构建测试环境
npm run build:stage
```

构建完成后，生成的文件在 `dist/` 目录下，可以部署到任何静态服务器。

### 部署到 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 常见问题

### 1. 安装依赖失败

**问题**: npm install 报错或速度很慢

**解决方案**:
```bash
# 使用国内镜像
npm install --registry=https://registry.npmmirror.com

# 或者使用 cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 2. 端口被占用

**问题**: 启动时提示端口 80 被占用

**解决方案**:
修改 `vue.config.js` 中的端口配置，或者关闭占用 80 端口的程序。

### 3. 登录后白屏

**问题**: 登录成功但页面空白

**解决方案**:
1. 打开浏览器控制台查看错误信息
2. 确认 Mock 数据已正确加载
3. 清除浏览器缓存后重试

### 4. 数据不显示

**问题**: 页面加载但没有数据

**解决方案**:
1. 检查浏览器控制台是否有 `[Mock]` 日志
2. 确认 Mock 系统已启用（`src/mock/index.js` 中 `MOCK_ENABLED = true`）
3. 检查对应的 Mock 数据文件是否存在

## 技术栈

- Vue 2.6.12
- Vue Router 3.4.9
- Vuex 3.6.0
- Element UI 2.15.6
- Axios 0.24.0
- ECharts 5.x

## 开发说明

### 添加新的 Mock 接口

1. 在 `src/mock/data/` 下创建或修改数据文件
2. 在 `src/mock/modules/` 下创建接口注册文件
3. 在 `src/main.js` 中引入新的 Mock 模块

示例：

```javascript
// src/mock/modules/example.js
import { registerMock, createSuccessResponse } from '../index'
import mockData from '../data'

registerMock('get', '/dev-api/example/list', () => {
  return createSuccessResponse(mockData.example.list)
})
```

```javascript
// src/main.js
import '@/mock/modules/example'
```

## 许可证

本项目基于若依框架开发，遵循相应的开源协议。

## 联系方式

如有问题或建议，请联系项目维护者。

---
