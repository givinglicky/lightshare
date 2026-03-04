/**
 * 贴文路由 - Cloudflare Workers 版本
 */

import { Router } from '../router';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../utils/error';

const router = new Router();

/**
 * GET /api/posts
 * 获取所有贴文
 */
router.get('/', async (request, env) => {
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    const { results } = await env.D1_DATABASE.prepare(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

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
    console.error('Error fetching posts:', error);
    throw error;
  }
});

/**
 * GET /api/posts/:id
 * 获取单个贴文详情
 */
router.get('/:id', async (request, env, ctx, params) => {
  try {
    const { id } = params!;

    const post = await env.D1_DATABASE.prepare(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`
    ).bind(id).first();

    if (!post) {
      throw new ApiError(404, '贴文不存在');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: post,
      }),
      {
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

/**
 * POST /api/posts
 * 创建新贴文（需要认证）
 */
router.post('/', async (request, env) => {
  try {
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

    const { title, content, category, privacy, location } = await request.json();

    if (!title || !content) {
      throw new ApiError(400, '标题和内容不能为空');
    }

    const postId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.D1_DATABASE.prepare(
      `INSERT INTO posts (id, user_id, title, content, category, privacy, location, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      postId,
      decoded.id,
      title,
      content,
      category || '情绪支持',
      privacy || 'public',
      location || '',
      now
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '贴文发布成功',
        data: {
          id: postId,
          title,
          content,
          category,
          privacy,
          location,
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

/**
 * DELETE /api/posts/:id
 * 删除贴文（需要认证）
 */
router.delete('/:id', async (request, env, ctx, params) => {
  try {
    const { id } = params!;

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

    // 检查贴文是否存在且属于当前用户
    const post = await env.D1_DATABASE.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(id).first();

    if (!post) {
      throw new ApiError(404, '贴文不存在');
    }

    if (post.user_id !== decoded.id) {
      throw new ApiError(403, '无权删除此贴文');
    }

    await env.D1_DATABASE.prepare(
      'DELETE FROM posts WHERE id = ?'
    ).bind(id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '贴文已删除',
      }),
      {
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

export { router as postRoutes };
