# LightShare 後台管理系統 (Admin Dashboard) 開發筆記

## 緣起
在此檔案紀錄有關 LightShare 後台管理面板的開發過程與相關設定，系統已順利將管理介面與 API 直接整合於現有的專案結構中（選項 A）。

## 功能概覽
後台系統目前涵蓋以下三大模組：
1.  **Dashboard (總覽儀表板)**：顯示總用戶數、總貼文數、總互動評論數等即時系統概況。
2.  **用戶管理 (User Management)**：檢視所有用戶的信箱、註冊時間；並具備安全機制以「升級一般用戶為管理員 / 取消管理員權限」。
3.  **內容管理 (Post Management)**：檢視全站貼文與作者資訊，對於違規內容能直接進行永久刪除。

## 技術實作細節

### 1. 後端架構
- **資料庫擴充**：於 `users` 表格中新增了 `role` 欄位（預設值為 `user`，可晉升為 `admin`）。
- **認證 Middleware**：
  - 更新了原有的 `authenticate` 去攜帶用戶的 `role` 資訊。
  - 新增 `authorizeAdmin` 攔截器，確保只有帶有 `role: 'admin'` 的憑證可以通過進入 `/api/admin/*` 的路由。
- **後台 API (`server/routes/adminRoutes.ts`)**：
  - `GET /api/admin/stats`：利用 SQL COUNT 計算並回傳系統整體數據。
  - `GET /api/admin/users`：拉取完整的用戶清單與其角色。
  - `PUT /api/admin/users/:id/role`：賦予與褫奪管理員權限的功能。
  - `GET /api/admin/posts`：拉取全站貼文（包含關聯的發文者名稱）。
  - `DELETE /api/admin/posts/:id`：刪除指定貼文紀錄。

### 2. 前端開發
- **共用型別更新**：於 `src/types.ts` 和 `middleware/auth.ts` 中確保 User 介面正確補上 `role?: string` 的屬性。
- **路由保護 (`src/components/AdminRoute.tsx`)**：
  - 新增專為管理員設計的路由守衛。若用戶未登入或是非管理員，將直接導向 `/login` 或 `/` 首頁。
- **介面入口 (`src/components/Layout.tsx`)**：
  - 在導覽列 Navbar 的選單動態加入了檢查機制，僅針對 `user.role === 'admin'` 的用戶顯示紅色的「管理後台」按鈕。
- **操作面板 (`src/pages/AdminDashboard.tsx`)**：
  - 將上述的三大功能化為 Tab 切換，配有清晰的對話框警告（刪除不可逆或升級管理權限），以防管理員誤觸。

## 部署與使用說明

### 系統遷移
因為這項更新對既有資料庫表結構進行了更動，更新程式碼後請務必先執行 Migration 給 DB 加上 `role` 欄位。指令已經被我新增到了 `scripts` 裡：
\`\`\`bash
npm run migrate
\`\`\`

### 如何成為第一個管理員
系統預設任何人註冊後都是 `user`。要在終端機 / 開發模式下手動把自己的帳號升級為管理員：
\`\`\`bash
# 請替換自己的信箱！
npx tsx -e "import db from './server/db/database.ts'; db.prepare(\"UPDATE users SET role = 'admin' WHERE email = 'your_email@example.com'\").run(); console.log('更新成功！');"
\`\`\`
升級完畢後，在前端重新整理或重新登入，您就能在右上角看見「管理後台」的閃亮按鈕了！
