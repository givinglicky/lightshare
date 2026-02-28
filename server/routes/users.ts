import { Router, Request, Response } from 'express';
import { BookmarkModel } from '../models/bookmarkModel';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * GET /api/users/me
 * 取得當前用戶的個人檔案（需要認證）
 */
router.get('/me', authenticate, async (req: Request, res: Response, next) => {
    try {
        res.json({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/users/me
 * 更新個人檔案（需要認證）
 */
router.put('/me', async (req: Request, res: Response) => {
    // TODO: 實作更新個人檔案
    res.status(501).json({
        success: false,
        error: { message: '更新個人檔案功能尚未實作', statusCode: 501 },
    });
});

/**
 * GET /api/users/me/bookmarks
 * 取得用戶的收藏列表（需要認證）
 */
router.get('/me/bookmarks', authenticate, async (req: Request, res: Response, next) => {
    try {
        const bookmarks = BookmarkModel.findByUserId(req.user!.id);
        res.json({
            success: true,
            data: bookmarks
        });
    } catch (error) {
        next(error);
    }
});

export default router;
