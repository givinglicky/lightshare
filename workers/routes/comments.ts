/**
 * 评论路由 - Cloudflare Workers 版本
 */

import { Router } from '../router';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../utils/error';

const router = new Router();

/**
 * GET /api/posts/:id/comments
 * 获取贴文的所有评论
 */
router.get('/', async (request, env, ctx, params) => {
  try {
    const { id: postId } = params!;

    const { results } = await env.D1_DATABASE.prepare(
      `SELECT c.*, u.name as author_name, u.avatar as author_avatar
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`
    ).bind(postId).all();

    return new Response(
      JSON.stringify({
        success: true,
        data: results || [],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
});

/**
 * POST /api/posts/:id/comments
 * 创建新评论（需要认证）
 */
router.post('/', async (request, env, ctx, params) => {
  try {
    const { id: postId } = params!;

    // 验证用户
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, '未提供认证凭证');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      throw new ApiError(401, '无效或已过期的凭证');
    }

    const { content } = await request.json();

    if (!content || !content.trim()) {
      throw new ApiError(400, '评论内容不能为空');
    }

    // 检查贴文是否存在
    const post = await env.D1_DATABASE.prepare(
      'SELECT id FROM posts WHERE id = ?'
    ).bind(postId).first();

    if (!post) {
      throw new ApiError(404, '贴文不存在');
    }

    const commentId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.D1_DATABASE.prepare(
      `INSERT INTO comments (id, post_id, user_id, content, created_at)
       VALUES (?, ?, ?, ?, ?)`
    ).bind(commentId, postId, decoded.id, content.trim(), now).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '评论发布成功',
        data: {
          id: commentId,
          post_id: postId,
          content: content.trim(),
          created_at: now,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: error.status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    throw error;
  }
});

export { router as commentRoutes };
