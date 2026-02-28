# 📋 LightShare 開發筆記

> **最後更新：** 2026-02-26
> **專案描述：** LightShare — 社區互助平台，讓用戶分享故事、發起求助、給予鄰居正能量支持。

---

## 📐 技術棧總覽

| 類別 | 技術 | 版本 | 備註 |
|------|------|------|------|
| **前端框架** | React | 19 | |
| **語言** | TypeScript | ~5.8.2 | |
| **建構工具** | Vite | ^6.2.0 | |
| **CSS 框架** | TailwindCSS | v4.1.14 | 使用 `@tailwindcss/vite` 插件 |
| **路由** | React Router DOM | ^7.13.1 | |
| **動畫** | Motion (Framer Motion) | ^12.23.24 | |
| **樣式工具** | clsx + tailwind-merge | | `cn()` 工具函式 |
| **字體** | Public Sans | | Google Fonts |
| **圖標** | Material Symbols Outlined | | Google Fonts CDN |
| **後端框架** | Express | ^4.21.2 | ⚠️ 已安裝但未使用 |
| **資料庫** | better-sqlite3 | ^12.4.1 | ⚠️ 已安裝但未使用 |
| **認證** | bcryptjs + jsonwebtoken | | ⚠️ 已安裝但未使用 |
| **AI** | @google/genai | ^1.29.0 | ⚠️ 已安裝但未使用 |
| **其他** | cors, dotenv | | ⚠️ 已安裝但未使用 |

---

## 📁 專案結構（前後端完整架構）

### 總覽

```
lightshare/
├── index.html                         # 前端入口 HTML
├── package.json                       # 依賴配置（前後端共用）
├── vite.config.ts                     # Vite + Tailwind 配置
├── tsconfig.json                      # TypeScript 配置
├── .env.example                       # 環境變數範例
├── .env.local                         # 環境變數（本地，不進 Git）
├── metadata.json                      # 應用元數據（名稱、描述）
├── DEVELOPMENT_NOTES.md               # 📌 本文件
│
├── src/                               # ===== 前端程式碼 =====
│   ├── main.tsx                       # React 入口點
│   ├── App.tsx                        # 路由設定
│   ├── index.css                      # Tailwind 主題 + 全域樣式
│   ├── types.ts                       # 前端共用型別定義
│   ├── constants.ts                   # Mock 資料（過渡期用）
│   │
│   ├── components/                    # 🧩 可重用元件
│   │   ├── Layout.tsx                 # ✅ Navbar + Footer（含通知面板）
│   │   ├── PostCard.tsx               # 📌 待建立：貼文卡片元件
│   │   ├── CommentItem.tsx            # 📌 待建立：留言項目元件
│   │   ├── Avatar.tsx                 # 📌 待建立：頭像元件
│   │   ├── Toast.tsx                  # 📌 待建立：全域 Toast 通知元件
│   │   ├── LoadingSpinner.tsx         # 📌 待建立：載入中動畫
│   │   ├── ProtectedRoute.tsx         # 📌 待建立：路由守衛
│   │   └── SearchBar.tsx              # 📌 待建立：搜尋列元件
│   │
│   ├── pages/                         # 📄 頁面元件（每個路由一個）
│   │   ├── Feed.tsx                   # ✅ 社群動態列表
│   │   ├── PostDetail.tsx             # ✅ 貼文詳情（含留言、支持）
│   │   ├── Login.tsx                  # ✅ 登入頁
│   │   ├── Register.tsx               # ✅ 註冊頁
│   │   ├── Profile.tsx                # ✅ 個人檔案（貼文/收藏）
│   │   ├── EditProfile.tsx            # ✅ 編輯個人資料
│   │   ├── NotificationSettings.tsx   # ✅ 通知設定
│   │   ├── CreatePost.tsx             # ✅ 發佈貼文（3 步驟）
│   │   ├── Success.tsx                # ✅ 發佈成功
│   │   ├── About.tsx                  # 📌 待建立：關於我們
│   │   ├── Notifications.tsx          # 📌 待建立：完整通知列表
│   │   └── SearchResults.tsx          # 📌 待建立：搜尋結果頁
│   │
│   ├── contexts/                      # 🌐 React Context（全域狀態）
│   │   ├── AuthContext.tsx            # 📌 待建立：用戶認證狀態
│   │   └── ThemeContext.tsx           # 📌 待建立：深/淺色主題切換
│   │
│   ├── hooks/                         # 🪝 自訂 React Hooks
│   │   ├── useAuth.ts                 # 📌 待建立：認證相關 Hook
│   │   ├── usePosts.ts               # 📌 待建立：貼文 CRUD Hook
│   │   ├── useNotifications.ts        # 📌 待建立：通知 Hook
│   │   └── useDebounce.ts            # 📌 待建立：防抖 Hook（搜尋用）
│   │
│   ├── services/                      # 🔌 API 呼叫層
│   │   ├── api.ts                     # 📌 待建立：Axios/fetch 基礎配置
│   │   ├── authService.ts            # 📌 待建立：認證 API 呼叫
│   │   ├── postService.ts            # 📌 待建立：貼文 API 呼叫
│   │   ├── commentService.ts         # 📌 待建立：留言 API 呼叫
│   │   ├── notificationService.ts    # 📌 待建立：通知 API 呼叫
│   │   └── userService.ts            # 📌 待建立：用戶 API 呼叫
│   │
│   └── lib/                           # 🛠️ 工具函式
│       ├── utils.ts                   # ✅ cn() 工具函式
│       ├── validators.ts             # 📌 待建立：表單驗證函式
│       └── formatters.ts             # 📌 待建立：日期/文字格式化
│
└── server/                            # ===== 後端程式碼 =====
    ├── index.ts                       # 📌 待建立：Express 入口（啟動伺服器）
    ├── app.ts                         # 📌 待建立：Express app 設定（middleware、路由掛載）
    │
    ├── routes/                        # 🛤️ API 路由定義
    │   ├── auth.ts                    # 📌 待建立：POST /api/auth/login, /register
    │   ├── posts.ts                   # 📌 待建立：GET/POST/DELETE /api/posts
    │   ├── comments.ts                # 📌 待建立：GET/POST /api/posts/:id/comments
    │   ├── users.ts                   # 📌 待建立：GET/PUT /api/users
    │   └── notifications.ts           # 📌 待建立：GET/PUT /api/notifications
    │
    ├── controllers/                   # 🎮 業務邏輯控制器
    │   ├── authController.ts          # 📌 待建立：認證邏輯（登入/註冊/驗證）
    │   ├── postController.ts          # 📌 待建立：貼文邏輯（CRUD、按讚、收藏）
    │   ├── commentController.ts       # 📌 待建立：留言邏輯
    │   ├── userController.ts          # 📌 待建立：用戶邏輯（個人檔案、設定）
    │   └── notificationController.ts  # 📌 待建立：通知邏輯
    │
    ├── models/                        # 📊 資料存取層（操作 SQLite）
    │   ├── userModel.ts               # 📌 待建立：用戶 CRUD 查詢
    │   ├── postModel.ts               # 📌 待建立：貼文 CRUD 查詢
    │   ├── commentModel.ts            # 📌 待建立：留言查詢
    │   ├── likeModel.ts               # 📌 待建立：點讚查詢
    │   ├── bookmarkModel.ts           # 📌 待建立：收藏查詢
    │   └── notificationModel.ts       # 📌 待建立：通知查詢
    │
    ├── middleware/                     # 🔒 Express 中間件
    │   ├── auth.ts                    # 📌 待建立：JWT 驗證中間件
    │   ├── errorHandler.ts            # 📌 待建立：全域錯誤處理
    │   └── validator.ts               # 📌 待建立：請求參數驗證
    │
    ├── db/                            # 🗄️ 資料庫相關
    │   ├── database.ts                # 📌 待建立：SQLite 連線管理（Singleton）
    │   ├── schema.sql                 # 📌 待建立：完整資料表定義
    │   └── seed.ts                    # 📌 待建立：初始種子資料（測試用）
    │
    ├── utils/                         # 🔧 後端工具函式
    │   └── helpers.ts                 # 📌 待建立：通用工具函式
    │
    └── types.ts                       # 📌 待建立：後端型別定義
```

### 前端分層說明

| 層級 | 資料夾 | 職責 | 備註 |
|------|--------|------|------|
| **視圖層** | `pages/` | 每個路由對應一個頁面元件，組合多個 components | 不直接呼叫 API |
| **元件層** | `components/` | 可重用 UI 元件，接受 props 渲染 | 保持「笨元件」（Presentational） |
| **狀態層** | `contexts/` | React Context 管理全域狀態（認證、主題） | 搭配 `hooks/` 使用 |
| **邏輯層** | `hooks/` | 自訂 Hook 封裝業務邏輯與副作用 | 呼叫 `services/` |
| **服務層** | `services/` | 封裝所有 API 呼叫，統一 HTTP 請求格式 | 是前端唯一跟後端溝通的層 |
| **工具層** | `lib/` | 純函式工具，無副作用 | cn()、validator、formatter |

> **資料流向：** `pages/ → hooks/ → services/ → [後端 API]`

### 後端分層說明

| 層級 | 資料夾 | 職責 | 備註 |
|------|--------|------|------|
| **路由層** | `routes/` | 定義 API 端點，將請求轉發給 Controller | 只做路由定義，不含邏輯 |
| **控制層** | `controllers/` | 處理請求/回應邏輯，驗證輸入，呼叫 Model | 業務邏輯的入口 |
| **模型層** | `models/` | 直接操作 SQLite 資料庫，執行 SQL 查詢 | 資料存取的唯一介面 |
| **中間件層** | `middleware/` | 請求前處理（認證、驗證、錯誤攔截） | JWT 驗證、統一錯誤處理 |
| **資料庫層** | `db/` | 資料庫連線管理、Schema 定義、種子資料 | Singleton 模式管理連線 |

> **請求流向：** `Client → routes/ → middleware/ → controllers/ → models/ → [SQLite DB]`

### API 端點規劃

| 方法 | 路徑 | 說明 | 認證 |
|------|------|------|------|
| `POST` | `/api/auth/register` | 註冊新用戶 | ❌ |
| `POST` | `/api/auth/login` | 用戶登入 | ❌ |
| `GET` | `/api/auth/me` | 取得當前登入用戶資訊 | ✅ |
| `GET` | `/api/posts` | 取得所有貼文（支援分頁、篩選） | ❌ |
| `GET` | `/api/posts/:id` | 取得單篇貼文詳情 | ❌ |
| `POST` | `/api/posts` | 建立新貼文 | ✅ |
| `PUT` | `/api/posts/:id` | 編輯貼文 | ✅ |
| `DELETE` | `/api/posts/:id` | 刪除貼文 | ✅ |
| `POST` | `/api/posts/:id/like` | 對貼文按讚 | ✅ |
| `DELETE` | `/api/posts/:id/like` | 取消按讚 | ✅ |
| `POST` | `/api/posts/:id/bookmark` | 收藏貼文 | ✅ |
| `DELETE` | `/api/posts/:id/bookmark` | 取消收藏 | ✅ |
| `POST` | `/api/posts/:id/support` | 加入支持者 | ✅ |
| `GET` | `/api/posts/:id/comments` | 取得貼文留言 | ❌ |
| `POST` | `/api/posts/:id/comments` | 新增留言 | ✅ |
| `DELETE` | `/api/comments/:id` | 刪除留言 | ✅ |
| `GET` | `/api/posts/search` | 搜尋貼文（`?q=關鍵字`） | ❌ |
| `GET` | `/api/users/me` | 取得個人檔案 | ✅ |
| `PUT` | `/api/users/me` | 更新個人檔案 | ✅ |
| `GET` | `/api/users/me/bookmarks` | 取得用戶收藏 | ✅ |
| `GET` | `/api/notifications` | 取得通知列表 | ✅ |
| `PUT` | `/api/notifications/:id/read` | 標記單則通知已讀 | ✅ |
| `PUT` | `/api/notifications/read-all` | 全部標記已讀 | ✅ |

### 資料庫 Schema（SQLite）

```sql
-- 用戶表
CREATE TABLE users (
    id          TEXT PRIMARY KEY,         -- UUID
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar      TEXT DEFAULT '',
    bio         TEXT DEFAULT '',
    location    TEXT DEFAULT '',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 貼文表
CREATE TABLE posts (
    id          TEXT PRIMARY KEY,         -- UUID
    user_id     TEXT NOT NULL,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    image       TEXT DEFAULT '',
    category    TEXT DEFAULT '情緒支持',
    privacy     TEXT DEFAULT 'public',    -- 'public' | 'anonymous'
    location    TEXT DEFAULT '',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 留言表
CREATE TABLE comments (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 按讚表（正能量）
CREATE TABLE likes (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 收藏表
CREATE TABLE bookmarks (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 支持者表
CREATE TABLE supporters (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 通知表
CREATE TABLE notifications (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    type        TEXT NOT NULL,             -- 'like' | 'comment' | 'support' | 'system'
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    is_read     INTEGER DEFAULT 0,         -- 0=未讀, 1=已讀
    related_post_id TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- 通知設定表
CREATE TABLE notification_settings (
    user_id           TEXT PRIMARY KEY,
    new_comments      INTEGER DEFAULT 1,
    new_likes         INTEGER DEFAULT 1,
    direct_messages   INTEGER DEFAULT 1,
    community_updates INTEGER DEFAULT 0,
    email_digest      INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## ✅ 已完成功能

### 前端頁面（UI 層面）

| # | 功能 | 路由 | 檔案 | 狀態 |
|---|------|------|------|------|
| 1 | 社群動態牆 | `/feed` | `Feed.tsx` | ✅ UI 完成，使用 mock 資料 |
| 2 | 貼文詳情 | `/post/:id` | `PostDetail.tsx` | ✅ 含留言、正能量、加入支持者、toast |
| 3 | 登入 | `/login` | `Login.tsx` | ✅ UI 完成，含 Google 登入按鈕 |
| 4 | 註冊 | `/register` | `Register.tsx` | ✅ UI 完成，含表單驗證提示 |
| 5 | 個人檔案 | `/profile` | `Profile.tsx` | ✅ 含「我的貼文」與「收藏」分頁 |
| 6 | 編輯個人資料 | `/profile/edit` | `EditProfile.tsx` | ✅ 可修改姓名/簡介，模擬儲存 |
| 7 | 通知設定 | `/profile/notifications` | `NotificationSettings.tsx` | ✅ 5 個 toggle 開關 |
| 8 | 發佈貼文 | `/create` | `CreatePost.tsx` | ✅ 3 步驟流程 |
| 9 | 發佈成功 | `/success` | `Success.tsx` | ✅ 含動畫效果 |
| 10 | 導覽列 | 全站 | `Layout.tsx` | ✅ 含搜尋框 + 通知下拉面板 |
| 11 | 頁尾 | 全站 | `Layout.tsx` | ✅ 含連結（目前為 #） |

### 後端與資料庫基礎

- ✅ **Express 伺服器**：已建立 `server/` 架構，含 CORS、JSON 解析、錯誤處理機制。
- ✅ **SQLite 資料庫**：已建立 `database.sqlite` 並完成 8 張資料表初始化。
- ✅ **API 骨架**：完成 Auth, Posts, Comments, Users, Notifications 路由結構分配。
- ✅ **開發指令**：新增 `npm run dev:server` 支援後端熱重載開發。
- ✅ **註冊 API**：實作 `POST /api/auth/register`，支援密碼加密與 JWT 簽發。
- ✅ **登入 API**：實作 `POST /api/auth/login`，驗證用戶並回傳 JWT。
- ✅ **JWT 中間件**：實作 `authenticate` 中間件，用於保護受限 API 端點。
- ✅ **AuthContext**：建立前端 Context 管理登入狀態與自動初始化。

### 設計系統

- ✅ 自訂色彩主題（`index.css` 中的 `@theme`）
  - `--color-primary: #eaf6f5`
  - `--color-vibrant-mint: #00A67E`
  - `--color-amber-warm: #FFF8E1`
  - `--color-primary-vibrant: #4DB6AC`
- ✅ 深色模式支援（Dark mode class）
- ✅ 響應式設計（Mobile-first）
- ✅ 頁面轉場動畫（Motion/Framer Motion）

---

## ❌ 待開發項目

### 🔴 P0 — 核心功能（必須完成）

#### 1. 後端 API 建立
- ✅ 建立 Express Server 入口檔案（如 `server/index.ts`）
- ✅ 設定 CORS、JSON body parser
- ✅ 建立 API 路由結構
- ✅ 錯誤處理中間件

**建議檔案結構：**
```
server/
├── index.ts              # Express 入口
├── db/
│   ├── schema.sql        # 資料庫 Schema
│   └── database.ts       # SQLite 連線管理
├── routes/
│   ├── auth.ts           # 認證相關 API
│   ├── posts.ts          # 貼文 CRUD API
│   ├── comments.ts       # 留言 API
│   └── users.ts          # 用戶 API
├── middleware/
│   └── auth.ts           # JWT 認證中間件
└── types.ts              # 後端型別定義
```

#### 2. 資料庫設計（SQLite）
- ✅ `users` 表 — id, name, email, password_hash, avatar, bio, location, created_at
- ✅ `posts` 表 — id, user_id, title, content, image, category, privacy, location, created_at
- ✅ `comments` 表 — id, post_id, user_id, content, created_at
- ✅ `likes` 表 — id, post_id, user_id, created_at
- ✅ `bookmarks` 表 — id, post_id, user_id, created_at
- ✅ `notifications` 表 — id, user_id, type, content, is_read, created_at
- ✅ `supporters` 表 — id, post_id, user_id, created_at

#### 3. 認證系統
- ✅ 註冊 API (`POST /api/auth/register`) — bcryptjs 加密密碼
- ✅ 登錄 API (`POST /api/auth/login`) — 返回 JWT token
- ✅ JWT 認證中間件 — 驗證 token、保護路由
- ✅ 前端：建立 AuthContext（全域用戶狀態管理）
- ✅ 前端：登入表單 submit 邏輯連接 API
- ✅ 前端：註冊表單 submit 邏輯連接 API
- ✅ 前端：登出功能（Profile 頁面的登出按鈕）
- ✅ 前端：路由守衛（未登入用戶自動導向 `/login`）

### ✅ 已完成功能（更新）

- ✅ **後端認證**：註冊、登入、JWT 中間件、/auth/me。
- ✅ **前端認證**：Login、Register 頁面已完全串接後端並實作中文化、Loading 狀態與錯誤處理。
- ✅ **全域狀態**：`AuthContext` 提供真正的用戶資料與登入權限。
- ✅ **安全性**：實作 `ProtectedRoute` 路由守衛，全面保護私有頁面。
- ✅ **使用者體驗**：實作 Redirect Back 功能，使用者登入後會自動跳轉回原本想訪問的頁面。

#### 4. 貼文 CRUD
- ✅ 取得所有貼文 API (`GET /api/posts`)
- ✅ 取得單篇貼文 API (`GET /api/posts/:id`)
- ✅ 建立貼文 API (`POST /api/posts`)
- ✅ 刪除貼文 API (`DELETE /api/posts/:id`)
- ✅ 前端：Feed 頁面改為從 API 取得資料
- ✅ 前端：CreatePost 頁面連接 API，提交真實資料

#### 5. 留言功能
- ✅ 建立留言 API (`POST /api/posts/:id/comments`)
- ✅ 取得貼文留言 API (`GET /api/posts/:id/comments`)
- ✅ 前端：PostDetail 留言表單連接 API

---

### 🟡 P1 — 重要功能（應該完成）

#### 6. 點讚 / 正能量系統
- ✅ 點讚 API (`POST /api/posts/:id/like`)
- ✅ 取消點讚 API (`DELETE /api/posts/:id/like`)
- ✅ 前端：正能量按鈕連接 API，顯示真實數量
- ✅ 前端：已點讚狀態的視覺變化

#### 7. 收藏功能
- ✅ 收藏 API (`POST /api/posts/:id/bookmark`)
- ✅ 取消收藏 API (`DELETE /api/posts/:id/bookmark`)
- ✅ 取得用戶收藏 API (`GET /api/users/me/bookmarks`)
- ✅ 前端：Profile 收藏分頁改為從 API 取得資料

#### 8. 加入支持者功能
- ✅ 加入支持者 API (`POST /api/posts/:id/support`)
- ✅ 前端：PostDetail 的「加入他們」按鈕連接 API

#### 9. 通知系統
- ✅ 取得通知 API (`GET /api/notifications`)
- ✅ 標記已讀 API (`PUT /api/notifications/:id/read`)
- ✅ 全部標記已讀 API (`PUT /api/notifications/read-all`)
- ✅ 前端：Navbar 通知面板改為從 API 取得資料
- ✅ 前端：「全部標為已讀」功能實現

#### 10. 搜尋功能
- ✅ 搜尋貼文 API (`GET /api/posts/search?q=xxx`)
- ✅ 前端：Navbar 搜尋框連接 API
- ✅ 前端：搜尋結果頁面

---

### 🟢 P2 — 加分功能（後續可做）

#### 11. 缺失頁面補齊
- ✅ `/about` — 關於我們頁面
- ✅ `/notifications` — 完整通知列表頁面
- ✅ 忘記密碼流程
- ✅ 服務條款頁面
- ✅ 隱私權政策頁面

---

## 🚀 雲端部署指南 (Deployment Guide)

本專案已準備好進行雲端部署。建議使用 **Render** 或 **Railway**，因為它們支援 SQLite 持久化儲存。

### 1. 部署準備
*   **前端服務**：已實作自動偵測環境，正式環境將使用相對路徑 `/api`。
*   **後端服務**：已實作正式環境下的靜態檔案服務（Express 會主動載入 `/dist` 內容）。

### 2. 在 Zeabur 部署步驟 (推薦)：
Zeabur 對於全校專案非常友善，且部署過程非常簡單。

1.  **推送到 GitHub**：
    開啟終端機並執行：
    ```bash
    git init
    git add .
    git commit -m "Initialize LightShare"
    # 前往 GitHub 建立新儲存庫，然後執行：
    git remote add origin <您的_GITHUB_URL>
    git push -u origin main
    ```

2.  **在 Zeabur 建立服務**：
    *   登入 [Zeabur](https://zeabur.com/) 並建立新專案。
    *   選擇 **"Deploy Service"** 並連結您的 GitHub 儲存庫。

3.  **設定環境變數**：
    在 Zeabur 的服務設定中新增：
    *   `NODE_ENV`: `production`
    *   `JWT_SECRET`: (長度建議 32 字元以上的隨機字串)
    *   `PORT`: `3000` (Zeabur 預設通常會抓取，但設定一下更穩)

4.  **設定持久化磁碟 (Volume)**：
    **這一步對於 SQLite 非常重要**，否則每次重啟資料都會消失：
    *   在服務的 **"Storage"** 或 **"Volumes"** 標籤中。
    *   新增一個 Volume。
    *   **掛載路徑 (Mount Path)**：`/app/database.sqlite` (因為 SQLite 檔案是在專案根目錄)。

### 3. 在 Render 部署步驟：
1.  **建立 Web Service** 並連結 GitHub 儲存庫。
2.  **Runtime**: Node
3.  **Build Command**: `npm run build`
4.  **Start Command**: `npm start`
5.  **環境變數 (Environment Variables)**:
    *   `NODE_ENV`: `production`
    *   `JWT_SECRET`: (請輸入一段隨機字串)
6.  **持久化磁碟 (Disks)**:
    *   由於專案使用 SQLite，請在 Render 設置中新增一個 Disk（如 1GB）。
    *   掛載路徑需對應至資料庫所在位置（預設為專案根目錄）。

---

#### 12. UI 完善
- [ ] 密碼顯示/隱藏功能（Login + Register）
- [ ] CreatePost 增加更多分類（目前只有「情緒支持」）
- [ ] CreatePost 增加圖片上傳
- [ ] CreatePost 內容字數計數器（目前寫死 0 / 2000）
- [ ] 分享功能（Web Share API 或複製連結）
- [ ] 貼文詳情的「更多」按鈕（舉報、刪除等）
- [ ] 下拉刷新 / 無限滾動

#### 13. Gemini AI 整合
- [ ] AI 推薦貼文（基於用戶興趣）
- [ ] AI 智慧分類（自動分析貼文內容建議分類）
- [ ] AI 內容摘要（長貼文自動生成摘要）
- [ ] AI 情緒分析（分析貼文情緒給予適當回應建議）
- [ ] AI 聊天助手（社區問答機器人）

#### 14. 進階功能
- [ ] Google OAuth 登入
- [ ] 即時通知（WebSocket）
- [ ] 私訊系統
- [ ] 用戶之間的關注/追蹤
- [ ] 地理位置功能（顯示附近的求助）
- [ ] 圖片上傳與儲存（本地或雲端）
- [ ] SEO 優化（加入 meta tags）

---

## 🐛 已知問題 & Bug

| # | 問題 | 嚴重度 | 說明 |
|---|------|--------|------|
| 1 | `/about` 路由 404 | ✅ 已修復 | 已建立 About 頁面並配置路由 |
| 2 | `/notifications` 路由 404 | ✅ 已修復 | 已建立 Notifications 頁面並配置路由 |
| 3 | Footer 連結全部為 `#` | ✅ 已修復 | 已連結至 About、TOS、Privacy 與 Contact |
| 4 | 忘記密碼連結為 `#` | ✅ 已修復 | 已新增提示訊息與測試帳號資訊 |
| 5 | Register 頁面中英混雜 | ✅ 已修復 | 全面中文化（包含側邊欄與表單說明） |
| 6 | 密碼顯隱按鈕無功能 | ✅ 已修復 | 已實作 `showPassword` 切換邏輯 |
| 7 | CreatePost 字數計數器固定為 0 | ✅ 已修復 | 已綁定 `formData.content.length` 動態更新 |

---

## 🎨 設計規範

### 色彩系統
```css
--color-primary:          #eaf6f5    /* 淺薄荷綠（卡片/區塊背景） */
--color-vibrant-mint:     #00A67E    /* 薄荷綠（主要 CTA、強調色） */
--color-background-light: #f6f7f7    /* 淺色模式背景 */
--color-background-dark:  #151d1c    /* 深色模式背景 */
--color-amber-warm:       #FFF8E1    /* 暖黃色（正能量按鈕背景） */
--color-primary-vibrant:  #4DB6AC    /* 亮薄荷（表單焦點、按鈕） */
```

### 圓角規範
```css
--radius-lg:  1rem       /* 16px */
--radius-xl:  1.5rem     /* 24px */
--radius-2xl: 1.75rem    /* 28px */
```

### 字體
- **主字體：** Public Sans (Google Fonts)
- **圖標：** Material Symbols Outlined (Google Fonts CDN)
- 填充圖標使用 `.fill-icon` class（`font-variation-settings: 'FILL' 1`）

---

## 🔧 開發指引

### 啟動開發伺服器
```bash
npm install        # 安裝依賴
npm run dev        # 啟動開發伺服器（port 3000）
```

### 🚥 系統診斷 (紅綠燈測試)
為了確保開發邏輯正確，我們建立了紅綠燈自動化測試：
- **Web 端**：造訪 `/test` 路由可查看視覺化診斷介面。
- **CLI 端**：執行 `npx ts-node scripts/system-check.ts` 進行環境檢查。
- **規則**：
  - 🔴 **紅燈/FAIL**：表示 API 未連線、DB 異常或權限缺失，請停止開發並按提示修復。
  - 🟢 **綠燈/PASS**：表示系統一切正常，可以繼續後續開發。

### 環境變數
將 `.env.example` 複製為 `.env.local` 並填入值：
```env
GEMINI_API_KEY="your_gemini_api_key"
APP_URL="http://localhost:3000"
```

### 現有 Mock 資料說明
- `constants.ts` 中的 `currentUser` — 模擬當前登入用戶（溫暖的小光）
- `constants.ts` 中的 `mockPosts` — 2 則模擬貼文（含留言）
- `Layout.tsx` 中的 `mockNotifications` — 3 則模擬通知

> ⚠️ 後端完成後，應逐步以 API 資料替代所有 mock 資料。

---

## 📝 開發歷程

### 2026-02-26
- 完成專案全面分析
- 建立本開發筆記文件
- 辨識出所有待開發項目與已知問題
