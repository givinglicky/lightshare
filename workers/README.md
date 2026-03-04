# LightShare API - Cloudflare Workers 版本

这是 LightShare 后端 API 的 Cloudflare Workers 版本，提供无服务器、全球分布式的 API 服务。

## 技术栈

- **Cloudflare Workers** - 无服务器边缘计算平台
- **D1 Database** - Cloudflare 的 SQLite 边缘数据库
- **Web Crypto API** - 用于 JWT 签名和密码哈希
- **TypeScript** - 类型安全的 JavaScript

## 文件结构

```
workers/
├── index.ts              # 主入口文件
├── router.ts             # 简化版路由实现
├── routes/
│   ├── auth.ts          # 认证路由
│   ├── posts.ts         # 贴文路由
│   ├── users.ts         # 用户路由
│   ├── comments.ts      # 评论路由
│   └── notifications.ts # 通知路由
└── utils/
    ├── auth.ts          # 认证工具（JWT、密码哈希）
    └── error.ts         # 错误处理
```

## 与 Express 版本的区别

| 功能 | Express (Node.js) | Cloudflare Workers |
|------|------------------|-------------------|
| **运行环境** | Node.js | V8 Isolate |
| **数据库** | better-sqlite3 | D1 (SQLite) |
| **密码哈希** | bcryptjs | Web Crypto PBKDF2 |
| **JWT** | jsonwebtoken | Web Crypto HMAC |
| **部署** | Zeabur/VPS | Cloudflare 边缘网络 |

## 部署步骤

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare

```bash
wrangler login
```

### 3. 创建 D1 数据库

```bash
wrangler d1 create lightshare-db
```

记录输出的 `database_id`，并更新 `wrangler.toml` 文件。

### 4. 初始化数据库表

```bash
wrangler d1 execute lightshare-db --file=./server/db/schema.sql
```

### 5. 设置密钥

```bash
wrangler secret put JWT_SECRET
# 输入你的 JWT 密钥
```

### 6. 部署

```bash
wrangler deploy
```

## 本地开发

```bash
# 安装依赖
npm install

# 本地开发服务器
wrangler dev
```

## API 端点

所有 API 端点与 Express 版本保持一致：

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 贴文
- `GET /api/posts` - 获取所有贴文
- `GET /api/posts/:id` - 获取单个贴文
- `POST /api/posts` - 创建贴文（需认证）
- `DELETE /api/posts/:id` - 删除贴文（需认证）

### 用户
- `GET /api/users/me` - 获取当前用户信息
- `PUT /api/users/me` - 更新用户信息

### 评论
- `GET /api/posts/:id/comments` - 获取评论
- `POST /api/posts/:id/comments` - 创建评论

### 通知
- `GET /api/notifications` - 获取通知
- `PUT /api/notifications/:id/read` - 标记已读
- `PUT /api/notifications/read-all` - 全部已读

## 优势

1. **全球分布** - 自动部署到 Cloudflare 全球 300+ 数据中心
2. **零冷启动** - 边缘计算，即时响应
3. **免费额度** - 每天 10 万次请求免费
4. **D1 数据库** - 边缘 SQLite，低延迟
5. **自动扩展** - 无需担心流量峰值

## 成本

- **Cloudflare Workers**: 每天 10 万次请求免费
- **D1 数据库**: 每天 500 万次查询免费
- **对于小型应用完全免费！**

## 注意事项

1. Workers 不支持 Node.js 内置模块（如 fs、path）
2. 使用 Web Crypto API 替代 Node.js crypto
3. 数据库操作是异步的（使用 D1 的 prepare/bind/run）
4. 文件上传需要用到 R2（Cloudflare 的对象存储）

## 故障排除

### 问题：D1 数据库绑定失败

确保 `wrangler.toml` 中的 `database_id` 正确：

```toml
[[d1_databases]]
binding = "D1_DATABASE"
database_name = "lightshare-db"
database_id = "your-actual-database-id"
```

### 问题：JWT 验证失败

检查 `JWT_SECRET` 是否已正确设置：

```bash
wrangler secret list
```

### 问题：CORS 错误

CORS 已在 `index.ts` 中配置，确保前端请求的 `origin` 被允许。

## 许可证

MIT License
