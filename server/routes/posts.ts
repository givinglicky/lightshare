import { Router, Request, Response } from 'express';
import { PostModel } from '../models/postModel';
import { CommentModel } from '../models/commentModel';
import { LikeModel } from '../models/likeModel';
import { BookmarkModel } from '../models/bookmarkModel';
import { SupporterModel } from '../models/supporterModel';
import { NotificationModel } from '../models/notificationModel';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();

/**
 * GET /api/posts
 * 取得所有貼文（支援分頁與分類篩選）
 */
router.get('/', optionalAuthenticate, async (req: Request, res: Response, next) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const category = req.query.category as string;
        const offset = (page - 1) * limit;

        const posts = PostModel.findAll(category, limit, offset, req.user?.id);

        res.json({
            success: true,
            data: posts,
            meta: {
                page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/posts/me
 * 取得當前用戶的貼文
 */
router.get('/me', authenticate, async (req: Request, res: Response, next) => {
    try {
        const posts = PostModel.findByUserId(req.user!.id);
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/posts/search
 * 搜尋貼文
 */
router.get('/search', optionalAuthenticate, async (req: Request, res: Response, next) => {
    try {
        const q = req.query.q as string;
        if (!q) {
            return res.json({ success: true, data: [] });
        }

        const posts = PostModel.search(q, req.user?.id);
        res.json({
            success: true,
            data: posts
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/posts/:id
 * 取得單篇貼文詳情
 */
router.get('/:id', optionalAuthenticate, async (req: Request, res: Response, next) => {
    try {
        const post = PostModel.findById(req.params.id, req.user?.id);
        if (!post) {
            throw new ApiError(404, '找不到該貼文');
        }

        // 同時取得留言
        const comments = CommentModel.findByPostId(req.params.id);

        res.json({
            success: true,
            data: {
                ...post,
                comments
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/posts/:id/comments
 * 取得貼文留言
 */
router.get('/:id/comments', async (req: Request, res: Response, next) => {
    try {
        const comments = CommentModel.findByPostId(req.params.id);
        res.json({
            success: true,
            data: comments
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/posts/:id/like
 * 點讚貼文
 */
router.post('/:id/like', authenticate, async (req: Request, res: Response, next) => {
    try {
        const post = PostModel.findById(req.params.id);
        if (!post) {
            throw new ApiError(404, '貼文不存在');
        }

        LikeModel.add(crypto.randomUUID(), req.params.id, req.user!.id);
        const count = LikeModel.countByPostId(req.params.id);

        // 發送通知給作者
        if (post.user_id !== req.user!.id) {
            NotificationModel.create({
                id: crypto.randomUUID(),
                user_id: post.user_id,
                type: 'like',
                title: '獲得了正能量',
                content: `${req.user!.name} 覺得您的貼文很有正能量！`,
                related_post_id: post.id
            });
        }

        res.json({
            success: true,
            message: '已點讚',
            data: { likes_count: count, is_liked: 1 }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/posts/:id/like
 * 取消點讚
 */
router.delete('/:id/like', authenticate, async (req: Request, res: Response, next) => {
    try {
        LikeModel.remove(req.params.id, req.user!.id);
        const count = LikeModel.countByPostId(req.params.id);

        res.json({
            success: true,
            message: '已取消點讚',
            data: { likes_count: count, is_liked: 0 }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/posts/:id/bookmark
 * 收藏貼文
 */
router.post('/:id/bookmark', authenticate, async (req: Request, res: Response, next) => {
    try {
        const post = PostModel.findById(req.params.id);
        if (!post) {
            throw new ApiError(404, '貼文不存在');
        }

        BookmarkModel.add(crypto.randomUUID(), req.params.id, req.user!.id);
        res.json({
            success: true,
            message: '已收藏貼文',
            data: { is_bookmarked: 1 }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/posts/:id/support
 * 加入支持者
 */
router.post('/:id/support', authenticate, async (req: Request, res: Response, next) => {
    try {
        const post = PostModel.findById(req.params.id);
        if (!post) {
            throw new ApiError(404, '貼文不存在');
        }

        SupporterModel.add(crypto.randomUUID(), req.params.id, req.user!.id);
        const count = SupporterModel.countByPostId(req.params.id);

        // 發送通知給作者
        if (post.user_id !== req.user!.id) {
            NotificationModel.create({
                id: crypto.randomUUID(),
                user_id: post.user_id,
                type: 'support',
                title: '獲得了支持',
                content: `${req.user!.name} 加入了您的支持者名單！`,
                related_post_id: post.id
            });
        }

        res.json({
            success: true,
            message: '已加入支持者',
            data: {
                supporters_count: count,
                is_supported: 1
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/posts/:id/bookmark
 * 取消收藏貼文
 */
router.delete('/:id/bookmark', authenticate, async (req: Request, res: Response, next) => {
    try {
        BookmarkModel.remove(req.params.id, req.user!.id);
        res.json({
            success: true,
            message: '已取消收藏',
            data: { is_bookmarked: 0 }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/posts/:id/comments
 * 新增留言
 */
router.post('/:id/comments', authenticate, async (req: Request, res: Response, next) => {
    try {
        const { content } = req.body;
        if (!content) {
            throw new ApiError(400, '留言內容不能為空');
        }

        const post = PostModel.findById(req.params.id);
        if (!post) {
            throw new ApiError(404, '貼文不存在');
        }

        const commentId = crypto.randomUUID();
        CommentModel.create({
            id: commentId,
            post_id: req.params.id,
            user_id: req.user!.id,
            content: req.body.content
        });

        // 發送通知給作者
        const postAuthorId = post.user_id;
        if (postAuthorId !== req.user!.id) {
            NotificationModel.create({
                id: crypto.randomUUID(),
                user_id: postAuthorId,
                type: 'comment',
                title: '有新的留言',
                content: `${req.user!.name} 在您的貼文下留言了。`,
                related_post_id: post.id
            });
        }

        const newComment = CommentModel.findById(commentId);

        res.status(201).json({
            success: true,
            message: '留言成功',
            data: newComment
        });
    } catch (error) {
        next(error);
    }
});

/**
 * POST /api/posts
 * 建立新貼文（需要認證）
 */
router.post('/', authenticate, async (req: Request, res: Response, next) => {
    try {
        const { title, content, image, category, privacy, location } = req.body;

        if (!title || !content) {
            throw new ApiError(400, '標題與內容為必填項目');
        }

        const postId = crypto.randomUUID();
        PostModel.create({
            id: postId,
            user_id: req.user!.id,
            title,
            content,
            image,
            category,
            privacy,
            location
        });

        const createdPost = PostModel.findById(postId);

        res.status(201).json({
            success: true,
            message: '貼文建立成功',
            data: createdPost
        });
    } catch (error) {
        next(error);
    }
});

/**
 * DELETE /api/posts/:id
 * 刪除貼文（需要認證，僅作者可刪除）
 */
router.delete('/:id', authenticate, async (req: Request, res: Response, next) => {
    try {
        const post = PostModel.findById(req.params.id);
        if (!post) {
            throw new ApiError(404, '貼文不存在');
        }

        if (post.user_id !== req.user!.id) {
            throw new ApiError(403, '您沒有權限刪除此貼文');
        }

        PostModel.delete(req.params.id, req.user!.id);

        res.json({
            success: true,
            message: '貼文已刪除'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
