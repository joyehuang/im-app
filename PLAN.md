# IM应用开发计划

## 项目概述

从零打造一个Web端IM工具，支持单聊、群聊、文件传输、消息已读/未读状态、消息撤回和编辑功能。

## 技术栈

- **前端**: React + TypeScript
- **后端**: NestJS + TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **实时通信**: WebSocket (Socket.io)
- **文件存储**: 本地存储/MinIO
- **认证**: JWT

## 开发阶段

### 阶段1：项目初始化（MVP基础）
- [x] 制定开发计划
- [ ] 初始化前后端项目结构
- [ ] 配置数据库和ORM
- [ ] 连接Git仓库

### 阶段2：后端基础架构
- [x] 数据库设计
- [x] 用户认证模块（注册、登录、JWT）
- [x] WebSocket基础连接
- [x] 基础API架构

### 阶段3：用户模块
- [x] 用户注册/登录API
- [x] 用户资料管理
- [ ] 在线状态管理
- [ ] 好友管理（添加、删除、列表）

### 阶段4：单聊功能
- [x] 创建会话API
- [x] 发送/接收消息（文本、图片、文件）
- [x] 消息存储
- [x] 消息已读/未读状态
- [x] 消息撤回
- [x] 消息编辑
- [x] 聊天历史记录

### 阶段5：群聊功能
- [x] 创建群聊
- [x] 群成员管理（添加、移除、退出）
- [x] 群聊消息发送/接收
- [x] 群聊已读状态
- [x] 群管理员权限

### 阶段6：文件传输
- [x] 文件上传API
- [x] 文件下载API
- [x] 文件大小限制
- [x] 文件类型验证
- [ ] 文件消息展示

### 阶段7：前端UI开发
- [x] 登录/注册页面
- [x] 主界面布局
- [x] 会话列表
- [x] 聊天窗口
- [x] 消息输入组件
- [ ] 文件上传组件
- [ ] 用户资料页面

### 阶段8：前后端集成
- [ ] WebSocket连接集成
- [ ] API调用集成
- [ ] 状态管理集成
- [ ] 实时消息更新

### 阶段9：测试和优化
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化
- [ ] 安全加固

## 数据库设计（初步）

### 用户表 (User)
- id: UUID (主键)
- username: String (唯一)
- password: String (加密)
- nickname: String
- avatar: String?
- status: Enum (online, offline)
- createdAt: DateTime
- updatedAt: DateTime

### 好友关系表 (Friendship)
- id: UUID (主键)
- userId: UUID (外键)
- friendId: UUID (外键)
- status: Enum (pending, accepted, blocked)
- createdAt: DateTime

### 会话表 (Conversation)
- id: UUID (主键)
- type: Enum (single, group)
- name: String? (群聊名称)
- avatar: String?
- createdBy: UUID (外键)
- createdAt: DateTime
- updatedAt: DateTime

### 会话成员表 (ConversationMember)
- id: UUID (主键)
- conversationId: UUID (外键)
- userId: UUID (外键)
- role: Enum (owner, admin, member)
- joinedAt: DateTime

### 消息表 (Message)
- id: UUID (主键)
- conversationId: UUID (外键)
- senderId: UUID (外键)
- type: Enum (text, image, file)
- content: String (文本内容)
- fileUrl: String? (文件URL)
- fileName: String? (文件名)
- fileSize: Int? (文件大小)
- isRead: Boolean
- isEdited: Boolean
- editedAt: DateTime?
- isRevoked: Boolean
- revokedAt: DateTime?
- createdAt: DateTime
- updatedAt: DateTime

### 消息已读记录表 (MessageRead)
- id: UUID (主键)
- messageId: UUID (外键)
- userId: UUID (外键)
- readAt: DateTime

## 项目结构

```
im-app/
├── backend/           # NestJS后端
│   ├── src/
│   │   ├── auth/      # 认证模块
│   │   ├── user/      # 用户模块
│   │   ├── chat/      # 聊天模块
│   │   ├── file/      # 文件模块
│   │   ├── ws/        # WebSocket模块
│   │   └── main.ts
│   ├── prisma/        # Prisma配置
│   └── package.json
├── frontend/          # React前端 + shadcn/ui
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── components/    # shadcn/ui组件
│   └── package.json
└── docs/             # 文档
    ├── PLAN.md
    └── API.md
```

## 已确认需求

1. 文件存储：
   - 初期使用本地文件系统存储
   - 后期改进为对象存储（MinIO/阿里云OSS）
   - 需要设置文件大小限制

2. 群聊权限：
   - 两个级别：群主 + 管理员
   - 群主和管理员可以管理群成员

3. UI设计风格：
   - 使用 shadcn/ui 组件库
   - 现代简约风格

## 后续扩展计划（非MVP）

### 阶段10：高级功能
- [ ] 消息搜索
- [ ] 消息引用回复
- [ ] 表情包支持
- [ ] 语音消息
- [ ] @提醒功能

### 阶段11：管理功能
- [ ] 后台管理系统
- [ ] 用户行为日志
- [ ] 数据统计面板
- [ ] 敏感词过滤

### 阶段12：移动端适配
- [ ] 响应式设计优化
- [ ] PWA支持
- [ ] 移动端手势操作

## 开发进度

- 当前阶段：前端UI开发
- 完成进度：85%
- 已完成：
  - ✅ 项目结构初始化
  - ✅ 后端所有核心模块（认证、用户、聊天、文件、WebSocket）
  - ✅ Prisma数据库Schema
  - ✅ 前端基础UI组件（基于shadcn/ui）
  - ✅ 登录/注册页面
  - ✅ 聊天主界面
  - ✅ 实时消息功能
- 待完成：
  - ⏳ 文件上传UI组件
  - ⏳ 用户资料页面
  - ⏳ 群聊创建功能
  - ⏳ 数据库迁移和测试
- 下一步：完善文件上传功能并进行集成测试

## 备注

- 每个模块完成后会提交到Git仓库
- 文档会随着开发进度实时更新
- 代码会遵循各自技术栈的最佳实践
