# LightShare 技術規格

## 1. 系統架構

### 1.1 整體架構

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │  Pages  │  │Components│  │ Context │  │ Services│       │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘       │
│       └────────────┴────────────┴────────────┘             │
│                         │                                   │
│                    API Calls                                │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                    Load Balancer                            │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                  Server (Express)                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐       │
│  │ Routes  │  │Controllers│ │ Models  │  │Middleware│      │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘       │
└─────────────────────────┼───────────────────────────────────┘
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                   Database (SQLite)                        │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │
│     │  Users  │  │  Posts  │  │Comments │  │  Likes  │     │
│     └─────────┘  └─────────┘  └─────────┘  └─────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 前端架構

```
src/
├── main.tsx                 # React 入口點
├── App.tsx                  # 路由設定
├── index.css                # Tailwind 主題
├── types.ts                 # 共用型別定義
├── constants.ts             # 常數/Mock 資料
│
├── components/              # 可重用 UI 元件
│   ├── Layout.tsx          # 導航 + Footer
│   ├── ProtectedRoute.tsx  # 路由守衛
│   ├── AdminRoute.tsx     # 管理員路由守衛
│   └── ...
│
├── pages/                   # 頁面元件
│   ├── Feed.tsx
│   ├── PostDetail.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Profile.tsx
│   ├── CreatePost.tsx
│   └── ...
│
├── contexts/                # React Context
│   ├── AuthContext.tsx     # 認證狀態
│   └── ...
│
├── hooks/                   # 自訂 Hooks
│   ├── useModeration.ts   # 審核 Hook
│   └── ...
│
├── services/                # API 呼叫層
│   ├── api.ts             # fetch 基礎配置
│   ├── postService.ts    # 貼文 API
│   ├── authService.ts    # 認證 API
│   ├── userService.ts    # 用戶 API
│   ├── notificationService.ts
│   └── moderationService.ts
│
└── lib/                     # 工具函式
    ├── utils.ts           # cn() 工具
    └── ...
```

### 1.3 後端架構

```
server/
├── index.ts                 # Express 入口
├── app.ts                   # App 設定
│
├── routes/                  # 路由定義
│   ├── auth.ts             # /api/auth
│   ├── posts.ts            # /api/posts
│   ├── users.ts            # /api/users
│   ├── comments.ts         # /api/comments
│   ├── notifications.ts    # /api/notifications
│   └── adminRoutes.ts      # /api/admin
│
├── models/                  # 資料存取層
│   ├── userModel.ts
│   ├── postModel.ts
│   ├── commentModel.ts
│   ├── likeModel.ts
│   ├── bookmarkModel.ts
│   └── notificationModel.ts
│
├── middleware/              # Express 中間件
│   ├── auth.ts             # JWT 驗證
│   └── errorHandler.ts     # 錯誤處理
│
├── db/                      # 資料庫
│   ├── database.ts         # SQLite 連線
│   ├── schema.sql          # 資料表定義
│   ├── migrate.ts          # 遷移腳本
│   └── seed.ts             # 種子資料
│
└── utils/                   # 工具函式
    └── auth.ts             # 認證工具
```

## 2. 技術選型

### 2.1 前端技術

| 類別 | 技術 | 版本 | 用途 |
|------|------|------|------|
| 框架 | React | 19.0.0 | UI 框架 |
| 語言 | TypeScript | ~5.8.2 | 型別安全 |
| 建構 | Vite | 6.2.0 | 開發/建置 |
| CSS | Tailwind CSS | 4.1.14 | 樣式 |
| 路由 | React Router | 7.13.1 | 客戶端路由 |
| 動畫 | Motion | 12.23.24 | 動畫效果 |
| HTTP | fetch | - | API 請求 |

### 2.2 後端技術

| 類別 | 技術 | 版本 | 用途 |
|------|------|------|------|
| 框架 | Express | 4.21.2 | Web 框架 |
| 資料庫 | better-sqlite3 | 12.4.1 | SQLite 驅動 |
| 認證 | jsonwebtoken | 9.0.3 | JWT token |
| 密碼 | bcryptjs | 3.0.3 | 密碼雜湊 |
| CORS | cors | 2.8.6 | 跨域請求 |
| 環境 | dotenv | 17.2.3 | 環境變數 |

### 2.3 開發工具

| 類別 | 技術 | 版本 | 用途 |
|------|------|------|------|
| 執行環境 | Node.js | 18+ | 執行環境 |
| 執行環境 | tsx | 4.21.0 | TypeScript 執行 |
| 型別 | @types/* | - | TypeScript 類型 |

## 3. API 設計

### 3.1 API 端點

#### 認證 API

| 方法 | 路徑 | 描述 | 權限 |
|------|------|------|------|
| POST | /api/auth/register | 註冊新用戶 | 公開 |
| POST | /api/auth/login | 使用者登入 | 公開 |
| GET | /api/auth/me | 取得當前用戶 | 需要 |

#### 貼文 API

| 方法 | 路徑 | 描述 | 權限 |
|------|------|------|------|
| GET | /api/posts | 取得貼文列表 | 公開 |
| GET | /api/posts/:id | 取得單篇貼文 | 公開 |
| POST | /api/posts | 發佈新貼文 | 需要 |
| PUT | /api/posts/:id | 更新貼文 | 需要 |
| DELETE | /api/posts/:id | 刪除貼文 | 需要 |
| POST | /api/posts/:id/like | 按讚 | 需要 |
| DELETE | /api/posts/:id/like | 取消按讚 | 需要 |
| POST | /api/posts/:id/bookmark | 收藏 | 需要 |
| DELETE | /api/posts/:id/bookmark | 取消收藏 | 需要 |

#### 用戶 API

| 方法 | 路徑 | 描述 | 權限 |
|------|------|------|------|
| GET | /api/users/:id | 取得用戶資料 | 公開 |
| PUT | /api/users/:id | 更新用戶資料 | 需要 |
| GET | /api/users/:id/posts | 取得用戶貼文 | 公開 |
| GET | /api/users/:id/bookmarks | 取得用戶收藏 | 需要 |

#### 留言 API

| 方法 | 路徑 | 描述 | 權限 |
|------|------|------|------|
| GET | /api/posts/:id/comments | 取得貼文留言 | 公開 |
| POST | /api/posts/:id/comments | 發佈留言 | 需要 |
| DELETE | /api/comments/:id | 刪除留言 | 需要 |

#### 通知 API

| 方法 | 路徑 | 描述 | 權限 |
|------|------|------|------|
| GET | /api/notifications | 取得通知列表 | 需要 |
| PUT | /api/notifications/settings | 更新通知設定 | 需要 |

### 3.2 資料模型

#### User

```typescript
interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
}
```

#### Post

```typescript
interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: 'help' | 'story';
  category: string;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
```

#### Comment

```typescript
interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
}
```

## 4. 安全性

### 4.1 認證

- JWT Token 認證
- Token 過期時間: 7 天
- 密碼使用 bcryptjs 雜湊 (salt rounds: 10)

### 4.2 驗證

- 輸入驗證: 必填欄位、格式檢查
- SQL Injection 防護: 使用參數化查詢
- XSS 防護: 輸出編碼

### 4.3 API 安全

- CORS 設定
- Rate Limiting (未來)
- HTTPS (部署時)

## 5. 部署

### 5.1 前端部署

- **平台**: Vercel / Zeabur
- **建置命令**: `npm run build`
- **輸出目錄**: `dist`

### 5.2 後端部署

- **平台**: Zeabur
- **執行命令**: `npm start` (tsx server/index.ts)
- **環境變數**: 參考 .env.example

## 6. 開發流程

### 6.1 環境設定

```bash
# 安裝依賴
npm install

# 複製環境變數
cp .env.example .env.local

# 執行開發伺服器 (前端)
npm run dev

# 執行後端伺服器
npm run start
```

### 6.2 指令

| 指令 | 描述 |
|------|------|
| `npm run dev` | 啟動開發伺服器 (前端) |
| `npm run build` | 建置生產版本 |
| `npm run preview` | 預覽建置結果 |
| `npm run lint` | TypeScript 類型檢查 |
| `npm run start` | 啟動後端伺服器 |

## 7. 環境變數

### 前端 (.env.local)

```
VITE_API_URL=http://localhost:3000
```

### 後端 (.env)

```
PORT=3000
JWT_SECRET=your-secret-key
DB_PATH=./database.sqlite
```
