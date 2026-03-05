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
    const category = url.searchParams.get('category');
    const offset = (page - 1) * limit;

    let query = `
      SELECT p.*, u.name as author_name, u.avatar as author_avatar,
      (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `;
    let params: any[] = [];

    if (category) {
      query += ` WHERE p.category = ?`;
      params.push(category);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const { results } = await env.D1_DATABASE.prepare(query).bind(...params).all();

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
    return new Response(
      JSON.stringify({ success: false, error: '获取贴文失败' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

/**
 * GET /api/posts/search
 * 搜索贴文（必须放在 /:id 之前）
 */
router.get('/search', async (request, env) => {
  try {
    const url = new URL(request.url);
    const queryStr = url.searchParams.get('q') || '';

    const { results } = await env.D1_DATABASE.prepare(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.title LIKE ? OR p.content LIKE ?
       ORDER BY p.created_at DESC`
    ).bind(`%${queryStr}%`, `%${queryStr}%`).all();

    return new Response(
      JSON.stringify({ success: true, data: results || [] }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
});

/**
 * GET /api/posts/me
 * 获取当前用户的贴文
 */
router.get('/me', async (request, env) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, '未提供认证凭证');
    }
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, '凭证无效');

    const { results } = await env.D1_DATABASE.prepare(
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.user_id = ?
       ORDER BY p.created_at DESC`
    ).bind(decoded.id).all();

    return new Response(
      JSON.stringify({ success: true, data: results || [] }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: error.status, headers: { 'Content-Type': 'application/json' } });
    }
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
      `SELECT p.*, u.name as author_name, u.avatar as author_avatar,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count
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
 * POST /api/posts/:id/like
 * 点赞贴文
 */
router.post('/:id/like', async (request, env, ctx, params) => {
  try {
    const { id: postId } = params!;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new ApiError(401, '未认证');
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, '凭证无效');

    const id = crypto.randomUUID();
    await env.D1_DATABASE.prepare(
      'INSERT OR IGNORE INTO likes (id, post_id, user_id) VALUES (?, ?, ?)'
    ).bind(id, postId, decoded.id).run();

    const count = await env.D1_DATABASE.prepare(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = ?'
    ).bind(postId).first();

    return new Response(
      JSON.stringify({ success: true, data: { likes_count: count?.count || 0, is_liked: 1 } }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: error.status, headers: { 'Content-Type': 'application/json' } });
    }
    throw error;
  }
});

/**
 * DELETE /api/posts/:id/like
 * 取消点赞
 */
router.delete('/:id/like', async (request, env, ctx, params) => {
  try {
    const { id: postId } = params!;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new ApiError(401, '未认证');
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, '凭证无效');

    await env.D1_DATABASE.prepare(
      'DELETE FROM likes WHERE post_id = ? AND user_id = ?'
    ).bind(postId, decoded.id).run();

    const count = await env.D1_DATABASE.prepare(
      'SELECT COUNT(*) as count FROM likes WHERE post_id = ?'
    ).bind(postId).first();

    return new Response(
      JSON.stringify({ success: true, data: { likes_count: count?.count || 0, is_liked: 0 } }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: error.status, headers: { 'Content-Type': 'application/json' } });
    }
    throw error;
  }
});

/**
 * POST /api/posts
 * 创建新贴文
 */
router.post('/', async (request, env) => {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, '未提供认证凭证');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      throw new ApiError(401, '无效或已过期的凭证');
    }

    const { title, content, category, privacy, location, image } = await request.json();

    if (!title || !content) {
      throw new ApiError(400, '标题和内容不能为空');
    }

    const postId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.D1_DATABASE.prepare(
      `INSERT INTO posts (id, user_id, title, content, category, privacy, location, image, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      postId,
      decoded.id,
      title,
      content,
      category || '情绪支持',
      privacy || 'public',
      location || '',
      image || '',
      now
    ).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '贴文发布成功',
        data: { id: postId, title, content, created_at: now },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: error.status, headers: { 'Content-Type': 'application/json' } });
    }
    throw error;
  }
});

/**
 * DELETE /api/posts/:id
 * 删除贴文
 */
router.delete('/:id', async (request, env, ctx, params) => {
  try {
    const { id } = params!;
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new ApiError(401, '未认证');
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, '凭证无效');

    const post = await env.D1_DATABASE.prepare('SELECT user_id FROM posts WHERE id = ?').bind(id).first();
    if (!post) throw new ApiError(404, '贴文不存在');
    if (post.user_id !== decoded.id) throw new ApiError(403, '无权操作');

    await env.D1_DATABASE.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

    return new Response(
      JSON.stringify({ success: true, message: '贴文已删除' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof ApiError) {
      return new Response(JSON.stringify({ success: false, error: error.message }), { status: error.status, headers: { 'Content-Type': 'application/json' } });
    }
    throw error;
  }
});

export { router as postRoutes };
