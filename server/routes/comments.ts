import { Router, Request, Response } from 'express';

const router = Router();

/**
 * DELETE /api/comments/:id
 * 刪除留言（需要認證，僅留言作者可刪除）
 *
 * 注意：新增留言和取得留言的路由掛在 posts 路由下：
 *   GET  /api/posts/:id/comments  → 取得貼文留言
 *   POST /api/posts/:id/comments  → 新增留言
 *   這些路由定義在 routes/posts.ts 中
 *
 * 這裡只處理需要用 comment ID 操作的端點
 */
router.delete('/:id', async (req: Request, res: Response) => {
    // TODO: 實作刪除留言
    res.status(501).json({
        success: false,
        error: { message: '刪除留言功能尚未實作', statusCode: 501 },
    });
});

export default router;
