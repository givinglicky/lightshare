import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 路由
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import userRoutes from './routes/users';
import notificationRoutes from './routes/notifications';

// 載入環境變數
dotenv.config({ path: '.env.local' });

const app = express();

// ========================
// 中間件設定
// ========================

// CORS 設定 — 允許前端跨域請求
app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// JSON body parser — 解析請求中的 JSON body
app.use(express.json({ limit: '10mb' }));

// URL-encoded body parser — 解析表單提交
app.use(express.urlencoded({ extended: true }));

// 請求日誌（開發環境用）
app.use((req, _res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// ========================
// API 路由掛載
// ========================

// 健康檢查
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'LightShare API is running',
        timestamp: new Date().toISOString(),
    });
});

// 各模組路由
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// ========================
// 靜態檔案服務 (正式環境)
// ========================
if (process.env.NODE_ENV === 'production') {
    // 服務 Vite 編譯後的檔案
    const distPath = path.join(__dirname, '../dist');
    app.use(express.static(distPath));

    // SPA 路由支援 — 所有非 API 請求都導向 index.html
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// ========================
// 錯誤處理
// ========================

// 404 處理 — 未匹配到任何路由
app.use(notFoundHandler);

// 全域錯誤處理
app.use(errorHandler);

export default app;
