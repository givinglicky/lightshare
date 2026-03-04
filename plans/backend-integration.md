# GSD 實作計劃：後端 API 整合

## Phase 1: 環境確認與基礎建設

### Tasks

- [ ] **1.1** 確認後端伺服器可啟動 (`npm run start`)
- [ ] **1.2** 確認資料庫連線正常
- [ ] **1.3** 設定環境變數 (.env.local)
- [ ] **1.4** 執行資料庫遷移 (schema.sql)
- [ ] **1.5** 執行資料庫種子 (seed.ts)

### 驗收標準

- [ ] 後端伺服器在 port 3000 啟動成功
- [ ] 資料庫表格建立完成
- [ ] 可以新增測試用戶

---

## Phase 2: 後端 API 開發

### Tasks

- [ ] **2.1** 實作 authRoutes - 註冊/登入/JWT
- [ ] **2.2** 實作 postsRoutes - CRUD + like + bookmark
- [ ] **2.3** 實作 usersRoutes - 個人資料
- [ ] **2.4** 實作 commentsRoutes - 留言 CRUD
- [ ] **2.5** 實作 notificationsRoutes - 通知
- [ ] **2.6** 實作 JWT middleware
- [ ] **2.7** 實作 errorHandler middleware

### 驗收標準

- [ ] 所有 API 端點可正常運作
- [ ] JWT 認證正確運作
- [ ] 錯誤處理正確

---

## Phase 3: 前端整合

### Tasks

- [ ] **3.1** 更新 api.ts 指向後端 API
- [ ] **3.2** 實作 authService (登入/註冊 API)
- [ ] **3.3** 更新 postService 使用真實 API
- [ ] **3.4** 更新 userService 使用真實 API
- [ ] **3.5** 更新 notificationService 使用真實 API
- [ ] **3.6** 更新 AuthContext 使用 JWT

### 驗收標準

- [ ] 可以註冊新用戶
- [ ] 可以登入/登出
- [ ] 可以發佈/瀏覽貼文
- [ ] 可以按讚/收藏
- [ ] 通知正常運作

---

## Phase 4: 驗證與除錯

### Tasks

- [ ] **4.1** 執行 `npm run lint` - 類型檢查
- [ ] **4.2** 執行 `npm run build` - 建置測試
- [ ] **4.3** 功能測試 - 所有核心流程
- [ ] **4.4** 除錯並修復問題

### 驗收標準

- [ ] 通過 TypeScript 檢查
- [ ] 建置成功
- [ ] 所有功能正常運作

---

## 優先順序

1. Phase 1 - 環境確認 (必須先完成)
2. Phase 2 - 後端 API
3. Phase 3 - 前端整合
4. Phase 4 - 驗證

---

*建立時間: 2026-03-04*
*方法論: GSD (Get Shit Done)*
