# 高校教材管理系统

基于 B/S 架构的高校教材管理系统，实现教材从选用、采购、入库、发放到结算的全生命周期管理。

## 技术栈

- **前端**: Vue 3 + Vite + Element Plus
- **后端**: Node.js + Express
- **数据库**: SQL Server
- **认证**: JWT Token

## 功能模块

### 1. 基础信息管理

- 院系信息管理
- 专业信息管理
- 班级信息管理
- 年级信息管理
- 课程信息管理
- 教师信息管理
- 学生信息管理

### 2. 教材信息管理

- 教材基础信息维护（书名、ISBN、作者、价格、出版社、版次）
- 教材搜索与版本管理
- 禁用/淘汰教材管理

### 3. 教材选用与征订计划

- 教师在线提交教材选用申请
- 管理员审核与汇总
- 征订计划生成

### 4. 系统管理

- 用户管理
- 角色权限分配
- 操作日志记录

## 项目结构

```
jiaocai/
├── backend/          # 后端服务
│   ├── config/       # 配置文件
│   ├── controllers/  # 控制器
│   ├── middleware/   # 中间件
│   ├── routes/       # 路由
│   ├── app.js        # 入口文件
│   └── package.json
├── frontend/         # 前端项目
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── router/      # 路由
│   │   ├── services/    # API服务
│   │   └── store/       # 状态管理
│   ├── package.json
│   └── vite.config.js
├── create_tables.sql     # 建表脚本
├── triggers.sql          # 触发器脚本
├── procedures.sql        # 存储过程脚本
└── README.md
```

## 环境要求

- Node.js >= 18.x
- SQL Server 2019+

## 安装与运行

### 1. 数据库配置

在 SQL Server 中创建数据库 `TextbookManagementSystem`，并执行以下脚本：

```sql
-- 依次执行
CREATE DATABASE TextbookManagementSystem;

-- 在 SSMS 中打开并执行
-- 1. create_tables.sql
-- 2. triggers.sql
-- 3. procedures.sql
-- 4. seed_data.sql
```

### 2. 后端启动

```bash
cd backend
npm install
npm start
```

后端服务运行在 http://localhost:3000

### 3. 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:5173

## 默认账号

- **管理员**: admin / 123

## 开发说明

### 后端 API

后端使用 Express 框架，提供 RESTful API。主要路由：

- `/api/auth` - 认证相关
- `/api/basic-info` - 基础信息管理
- `/api/books` - 教材管理
- `/api/book-selection` - 教材选用与征订

### 前端路由

前端使用 Vue Router，路由配置在 `src/router/index.js`。

## License

MIT
