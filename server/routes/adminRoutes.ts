import express from 'express';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import db from '../db/database';

const router = express.Router();

// 確保所有 admin 路由都需要登入並具有管理員權限
router.use(authenticate, authorizeAdmin);

/**
 * @route GET /api/admin/users
 * @desc 獲取所有使用者列表
 */
router.get('/users', (req, res, next) => {
    try {
        const stmt = db.prepare('SELECT id, name, email, avatar, bio, location, role, created_at FROM users ORDER BY created_at DESC');
        const users = stmt.all();
        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
});

/**
 * @route PUT /api/admin/users/:id/role
 * @desc 更改使用者角色 (設為 admin/user)
 */
router.put('/users/:id/role', (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            throw new ApiError(400, '無效的角色');
        }

        const stmt = db.prepare('UPDATE users SET role = ? WHERE id = ?');
        const result = stmt.run(role, id);

        if (result.changes === 0) {
            throw new ApiError(404, '找不到該用戶');
        }

        res.status(200).json({ message: '角色更新成功' });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/admin/posts
 * @desc 獲取所有貼文列表
 */
router.get('/posts', (req, res, next) => {
    try {
        // 包含發文者名稱
        const stmt = db.prepare(`
            SELECT p.*, u.name as user_name 
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `);
        const posts = stmt.all();
        res.status(200).json({ posts });
    } catch (error) {
        next(error);
    }
});

/**
 * @route DELETE /api/admin/posts/:id
 * @desc (管理員) 刪除特定貼文
 */
router.delete('/posts/:id', (req, res, next) => {
    try {
        const { id } = req.params;
        const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
        const result = stmt.run(id);

        if (result.changes === 0) {
            throw new ApiError(404, '找不到該貼文');
        }

        res.status(200).json({ message: '貼文已刪除' });
    } catch (error) {
        next(error);
    }
});

/**
 * @route GET /api/admin/stats
 * @desc 獲取儀表板統計數據
 */
router.get('/stats', (req, res, next) => {
    try {
        const usersStmt = db.prepare('SELECT COUNT(*) as count FROM users');
        const usersCount = (usersStmt.get() as any).count;

        const postsStmt = db.prepare('SELECT COUNT(*) as count FROM posts');
        const postsCount = (postsStmt.get() as any).count;

        const commentsStmt = db.prepare('SELECT COUNT(*) as count FROM comments');
        const commentsCount = (commentsStmt.get() as any).count;

        res.status(200).json({
            stats: {
                totalUsers: usersCount,
                totalPosts: postsCount,
                totalComments: commentsCount
            }
        });
    } catch (error) {
        next(error);
    }
});

export default router;
