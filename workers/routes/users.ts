/"**
 * 用户路由 - Cloudflare Workers 版本
 */

import { Router } from '../router';
import { verifyToken } from '../utils/auth';
import { ApiError } from '../utils/error';

const router = new Router();

/**
 * GET /api/users/me
 * 获取当前用户信息
 */
router.get('/me', async (request, env) => {
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

    const user = await env.D1_DATABASE.prepare(
      'SELECT id, name, email, avatar, bio, location, role, created_at FROM users WHERE id = ?'
    ).bind(decoded.id).first();

    if (!user) {
      throw new ApiError(404, '用户不存在');
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: user,
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
 * PUT /api/users/me
 * 更新当前用户信息
 */
router.put('/me', async (request, env) => {
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

    const { name, bio, location, avatar } = await request.json();

    await env.D1_DATABASE.prepare(
      `UPDATE users 
       SET name = COALESCE(?, name), 
           bio = COALESCE(?, bio), 
           location = COALESCE(?, location),
           avatar = COALESCE(?, avatar)
       WHERE id = ?`
    ).bind(name, bio, location, avatar, decoded.id).run();

    const updatedUser = await env.D1_DATABASE.prepare(
      'SELECT id, name, email, avatar, bio, location, role, created_at FROM users WHERE id = ?'
    ).bind(decoded.id).first();

    return new Response(
      JSON.stringify({
        success: true,
        message: '用户信息已更新',
        data: updatedUser,
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

export { router as userRoutes };
