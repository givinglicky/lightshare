# 🚀 LightShare 后端部署指南（大白话版）

## 📋 准备工作

在开始之前，您需要：
- ✅ 一个 Cloudflare 账号（免费注册）
- ✅ 电脑上已安装 Node.js
- ✅ 项目代码已推送到 GitHub

---

## 第一步：安装 Wrangler 工具

**什么是 Wrangler？**
Wrangler 是 Cloudflare 官方的部署工具，就像一个搬运工，帮我们把代码上传到 Cloudflare。

**怎么安装？**
打开命令行（终端），输入：

```bash
npm install -g wrangler
```

**怎么知道安装成功了？**
输入这个命令：
```bash
wrangler --version
```
如果显示版本号（比如 `wrangler 3.x.x`），就成功了！

---

## 第二步：登录 Cloudflare

**为什么要登录？**
就像登录微信一样，登录后才能操作您的 Cloudflare 账号。

**怎么登录？**
在命令行输入：
```bash
wrangler login
```

**会发生什么？**
1. 会自动打开浏览器
2. 让您登录 Cloudflare 账号
3. 登录成功后，关闭浏览器即可

---

## 第三步：创建数据库

**什么是 D1 数据库？**
D1 是 Cloudflare 的数据库服务，就像一个云端的小本子，存数据用的。

**怎么创建？**
在命令行输入：
```bash
wrangler d1 create lightshare-db
```

**会发生什么？**
1. 命令行会问您是否要创建数据库
2. 输入 `y` 确认
3. 创建成功后，会显示一个很长的 ID，类似这样：
   ```
   ✅ Successfully created DB!
   📣 database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```

**重要！复制这个 ID！**
- 打开项目里的 `wrangler.toml` 文件
- 找到这一行：
  ```toml
  database_id = "your-database-id-here"
  ```
- 把 `"your-database-id-here"` 替换成刚才复制的 ID

---

## 第四步：初始化数据库表

**什么是初始化表？**
就像在笔记本上画格子，告诉数据库怎么存数据。

**怎么初始化？**
在命令行输入：
```bash
wrangler d1 execute lightshare-db --file=./server/db/schema.sql
```

**会发生什么？**
- 会执行 `server/db/schema.sql` 文件里的 SQL 语句
- 创建用户表、贴文表、评论表等
- 显示 `✅ Success` 就完成了

---

## 第五步：设置密钥

**什么是 JWT 密钥？**
就像一把钥匙，用来加密用户的登录信息，防止别人伪造。

**怎么设置？**
在命令行输入：
```bash
wrangler secret put JWT_SECRET
```

**会发生什么？**
1. 命令行会问您输入密钥
2. 输入一个复杂的字符串，比如：
   ```
   my-super-secret-key-2024-lightshare-please-dont-share
   ```
3. 确认后，密钥就保存到 Cloudflare 了

**注意：**
- 密钥要保密，不要告诉别人
- 不要用太简单的密钥（比如 "123456"）

---

## 第六步：部署到 Cloudflare

**什么是部署？**
就是把您的代码上传到 Cloudflare 的服务器，让全世界都能访问。

**怎么部署？**
在命令行输入：
```bash
wrangler deploy
```

**会发生什么？**
1. 会显示上传进度
2. 上传完成后，会显示一个网址，比如：
   ```
   🚀 Published lightshare-api
      https://lightshare-api.your-subdomain.workers.dev
   ```
3. **复制这个网址！** 这就是您的后端 API 地址

---

## 第七步：测试 API

**怎么测试？**
打开浏览器，访问这个网址：
```
https://lightshare-api.your-subdomain.workers.dev/api/health
```

**应该看到什么？**
```json
{
  "status": "ok",
  "message": "LightShare API is running on Cloudflare Workers",
  "timestamp": "2024-03-04T..."
}
```

如果看到这个，说明部署成功了！🎉

---

## 第八步：更新前端配置

**为什么要更新？**
前端需要知道后端的地址，才能调用 API。

**怎么更新？**
1. 打开项目里的 `.env.local` 文件（如果没有就创建一个）
2. 添加这一行：
   ```
   VITE_API_URL=https://lightshare-api.your-subdomain.workers.dev
   ```
   （把网址换成您刚才复制的）

**或者直接修改代码：**
打开 `src/services/api.ts`，找到这一行：
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
```
改成：
```typescript
const API_BASE_URL = 'https://lightshare-api.your-subdomain.workers.dev';
```

---

## 🔧 常见问题

### 问题 1：命令行显示 "wrangler 不是内部或外部命令"

**原因：** Wrangler 没有安装成功

**解决：**
```bash
npm install -g wrangler
```

### 问题 2：登录后浏览器没反应

**原因：** 网络问题或浏览器被阻止

**解决：**
- 检查网络连接
- 尝试换个浏览器
- 如果在中国大陆，可能需要科学上网

### 问题 3：数据库 ID 复制错了

**原因：** `wrangler.toml` 里的 ID 不对

**解决：**
1. 重新运行 `wrangler d1 list` 查看所有数据库
2. 找到正确的 ID
3. 更新 `wrangler.toml` 文件

### 问题 4：部署后访问 404

**原因：** 路径不对

**解决：**
- 确保访问的是 `/api/health` 而不是 `/health`
- 检查 `workers/index.ts` 里的路由配置

### 问题 5：API 返回 500 错误

**原因：** 代码有错误或数据库没初始化

**解决：**
1. 查看 Cloudflare Dashboard 的日志
2. 确保第四步（初始化数据库）已完成
3. 检查代码语法是否正确

---

## 📊 完整流程图

```
1️⃣ 安装 Wrangler
   ↓
2️⃣ 登录 Cloudflare
   ↓
3️⃣ 创建 D1 数据库
   ↓
4️⃣ 初始化数据库表
   ↓
5️⃣ 设置 JWT 密钥
   ↓
6️⃣ 部署代码
   ↓
7️⃣ 测试 API
   ↓
8️⃣ 更新前端配置
   ↓
   ✅ 完成！
```

---

## 💰 费用说明

**好消息：完全免费！**

| 项目 | 免费额度 | 足够用吗？ |
|------|---------|-----------|
| Cloudflare Workers | 每天 10 万次请求 | ✅ 足够 |
| D1 数据库 | 每天 500 万次查询 | ✅ 足够 |
| 带宽 | 无限 | ✅ 足够 |

**小型应用完全不用担心费用！**

---

## 🎯 下一步

部署完成后：

1. **测试注册功能**
   ```bash
   curl -X POST https://your-api.workers.dev/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"测试用户","email":"test@example.com","password":"123456"}'
   ```

2. **测试登录功能**
   ```bash
   curl -X POST https://your-api.workers.dev/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"123456"}'
   ```

3. **部署前端到 Vercel**
   - 访问 vercel.com
   - 连接 GitHub 仓库
   - 自动部署

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Cloudflare Dashboard 的日志
2. 检查 `workers/README.md` 文档
3. 搜索错误信息

---

**祝您部署顺利！🚀**
