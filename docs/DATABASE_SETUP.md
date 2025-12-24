# 后端需要安装PostgreSQL数据库
# Windows用户可以通过以下方式安装PostgreSQL：
# 1. 从 https://www.postgresql.org/download/windows/ 下载安装
# 2. 使用 Chocolatey: choco install postgresql
# 3. 使用 Docker: docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres

# 数据库配置
# 默认配置:
# - 用户名: postgres
# - 密码: postgres
# - 数据库名: im_db
# - 端口: 5432

# 安装完成后，需要创建数据库
# 在 PostgreSQL 命令行或 pgAdmin 中执行:
# CREATE DATABASE im_db;

# 运行数据库迁移
cd backend
npx prisma migrate dev --name init

# 启动后端服务器
npm run start:dev
