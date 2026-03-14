# 派出所管理系统 - 静态 Demo

## 快速启动（前端 + 后端）

### 后端
```bash
cd D:\woskspace\pcs-ui\watermark_service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

服务地址：`http://127.0.0.1:5001`

### 前端（开发）
```bash
cd D:\woskspace\pcs-ui
npm run dev
```

打开：`http://127.0.0.1:80`

如果后端不是默认端口：
```bash
set VUE_APP_WATERMARK_API=http://127.0.0.1:5001
```

---

## 项目说明

这是一个基于若依框架的前端静态演示版本，使用 Mock 数据模拟后端接口，可独立运行并展示系统功能。

## 环境要求

- Node.js 12.x 或更高版本
- npm 6.x 或更高版本

## 登录说明

- 账号：`admin`
- 密码：`admin123`

静态 Demo 模式下验证码已禁用，直接点击“登录”即可进入系统。
