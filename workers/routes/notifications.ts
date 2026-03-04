/"**
 * 通知路由 - Cloudflare Workers 版本
 */

import { Router } from '../router';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../utils/error';

const router = new Router();

/**
 * GET /api/notifications
 * 获取用户通知列表
 */
router.get('/', async (request, env) => {
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

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    const { results } = await env.D1_DATABASE.prepare(
      `SELECT * FROM notifications
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    ).bind(decoded.id, limit, offset).all();

    // 获取未读通知数量
    const unreadResult = await env.D1_DATABASE.prepare(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0'
    ).bind(decoded.id).first();

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          notifications: results || [],
          unread_count: unreadResult?.count || 0,
        },
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
 * PUT /api/notifications/:id/read
 * 标记单个通知为已读
 */
router.put('/:id/read', async (request, env, ctx, params) => {
  try {
    const { id } = params!;

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, '未提供认证凭证');
    }

    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token, env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      throw new ApiError(401, '无效或已过期的凭证');
    }

    await env.D1_DATABASE.prepare(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?'
    ).bind(id, decoded.id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '通知已标记为已读',
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
 * PUT /api/notifications/read-all
 * 标记所有通知为已读
 */
router.put('/read-all', async (request, env) => {
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

    await env.D1_DATABASE.prepare(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0'
    ).bind(decoded.id).run();

    return new Response(
      JSON.stringify({
        success: true,
        message: '所有通知已标记为已读',
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

export { router as notificationRoutes };
