# IM App - Instant Messaging Application

一个基于现代技术栈构建的实时即时通讯应用，支持单聊、群聊、文件传输等功能。

## 功能特性

### ✅ 已实现功能

- **用户认证**
  - 用户注册/登录
  - JWT令牌认证
  - 会话管理

- **单聊功能**
  - 创建私聊会话
  - 实时发送/接收消息
  - 消息历史记录

- **群聊功能**
  - 创建群聊
  - 群成员管理（添加/移除）
  - 群主和管理员权限

- **消息功能**
  - 文本消息
  - 文件传输
  - 消息已读/未读状态
  - 消息撤回
  - 消息编辑
  - 实时消息推送

- **文件传输**
  - 文件上传（最大10MB）
  - 文件下载
  - 文件类型验证

- **实时通信**
  - WebSocket连接
  - 实时消息更新
  - 在线状态

### 🚧 待实现功能

- 用户资料页面
- 消息搜索
- 表情包支持
- @提醒功能
- 消息引用回复
- 离线消息推送

## 技术栈

### 后端
- **框架**: NestJS
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **实时通信**: Socket.io
- **认证**: JWT + Passport
- **文件存储**: 本地文件系统（计划迁移到对象存储）

### 前端
- **框架**: React + TypeScript
- **路由**: React Router
- **状态管理**: React Context
- **UI组件库**: shadcn/ui
- **样式**: Tailwind CSS
- **HTTP客户端**: Axios
- **WebSocket客户端**: Socket.io Client

## 项目结构

```
im-app/
├── backend/              # NestJS后端
│   ├── src/
│   │   ├── auth/        # 认证模块
│   │   ├── user/        # 用户模块
│   │   ├── chat/        # 聊天模块
│   │   ├── file/        # 文件模块
│   │   ├── ws/          # WebSocket模块
│   │   └── common/      # 公共模块
│   ├── prisma/          # Prisma配置
│   └── uploads/         # 上传文件存储
├── frontend/            # React前端
│   ├── src/
│   │   ├── components/   # UI组件
│   │   ├── pages/       # 页面组件
│   │   ├── contexts/    # 上下文
│   │   ├── services/     # API服务
│   │   ├── types/       # 类型定义
│   │   └── lib/        # 工具函数
│   └── public/         # 静态资源
└── docs/               # 文档
```

## 快速开始

### 前置要求

- Node.js >= 20.14.0
- PostgreSQL
- npm 或 yarn

### 数据库配置

1. 安装并启动PostgreSQL
2. 创建数据库：

```sql
CREATE DATABASE im_db;
```

3. 配置环境变量（参考 `backend/.env`）

4. 运行数据库迁移：

```bash
cd backend
npx prisma migrate dev --name init
```

### 后端启动

```bash
cd backend
npm install
npm run start:dev
```

后端将在 `http://localhost:3001` 运行

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端将在 `http://localhost:5173` 运行

## 环境变量

### 后端 (.env)

```env
NODE_ENV=development
PORT=3001

DATABASE_URL="postgresql://username:password@localhost:5432/im_db?schema=public"

JWT_SECRET=your-super-secret-jwt-key-change-in-production

MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
```

### 前端 (.env)

```env
NODE_ENV=development
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## API文档

### 认证接口

- `POST /auth/register` - 用户注册
- `POST /auth/login` - 用户登录

### 用户接口

- `GET /users` - 获取所有用户
- `GET /users/me` - 获取当前用户信息

### 会话接口

- `POST /conversations` - 创建会话
- `GET /conversations` - 获取会话列表
- `GET /conversations/:id/messages` - 获取消息列表
- `POST /conversations/:id/messages` - 发送消息
- `PUT /conversations/messages/:id/read` - 标记消息已读
- `PUT /conversations/messages/:id/revoke` - 撤回消息
- `PUT /conversations/messages/:id/edit` - 编辑消息
- `POST /conversations/:id/members` - 添加成员
- `DELETE /conversations/:id/members/:memberId` - 移除成员

### 文件接口

- `POST /files/upload` - 上传文件

### WebSocket事件

- `joinConversation` - 加入会话
- `leaveConversation` - 离开会话
- `sendMessage` - 发送消息
- `typing` - 输入状态
- `newMessage` - 新消息
- `userTyping` - 用户输入状态

## 开发计划

详细的开发计划请查看 [PLAN.md](./PLAN.md)

## 贡献指南

欢迎提交Issue和Pull Request！

## 许可证

MIT

## 联系方式

如有问题，请通过GitHub Issues联系。
