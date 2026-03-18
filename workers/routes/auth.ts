/**
 * 认证路由 - Cloudflare Workers 版本
 */

import { Router } from '../router';
import { generateToken, verifyToken, hashPassword, comparePassword } from '../utils/auth';
import { ApiError } from '../utils/error';

const router = new Router();

/**
 * POST /api/auth/register
 * 用户注册
 */
router.post('/register', async (request, env) => {
  try {
    const { name, email, password } = await request.json();

    // 基本验证
    if (!name || !email || !password) {
      throw new ApiError(400, '请提供完整注册信息');
    }

    // 检查用户是否已存在
    const existingUser = await env.D1_DATABASE.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    if (existingUser) {
      throw new ApiError(400, '该邮箱已被注册');
    }

    // 密码加密
    const passwordHash = await hashPassword(password);

    // 创建用户
    const userId = crypto.randomUUID();
    await env.D1_DATABASE.prepare(
      'INSERT INTO users (id, name, email, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, name, email, passwordHash, new Date().toISOString()).run();

    // 生成 Token
    const token = await generateToken(userId, env.JWT_SECRET);

    return new Response(
      JSON.stringify({
        success: true,
        message: '注册成功',
        data: {
          token,
          user: {
            id: userId,
            name,
            email,
            role: 'user',
          },
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
 * POST /api/auth/login
 * 用户登录
 */
router.post('/login', async (request, env) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      throw new ApiError(400, '请提供邮箱和密码');
    }

    // 查找用户
    const user = await env.D1_DATABASE.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      throw new ApiError(401, '邮箱或密码错误');
    }

    // 验证密码
    const isValid = await comparePassword(password, user.password_hash);
    if (!isValid) {
      throw new ApiError(401, '邮箱或密码错误');
    }

    // 生成 Token
    const token = await generateToken(user.id, env.JWT_SECRET);

    return new Response(
      JSON.stringify({
        success: true,
        message: '登录成功',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
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
 * POST /api/auth/google
 * Google 登录
 */
router.post('/google', async (request, env) => {
  try {
    const { credential } = await request.json();

    if (!credential) {
      throw new ApiError(400, '缺少 Google 认证信息');
    }

    // 验证 Google ID Token
    const response = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `id_token=${credential}`,
    });

    if (!response.ok) {
      throw new ApiError(401, '无效的 Google 认证信息');
    }

    const payload = await response.json();
    
    // 验证客户端 ID
    if (payload.aud !== env.GOOGLE_CLIENT_ID) {
      throw new ApiError(401, '无效的 Google 客户端 ID');
    }

    const { email, name, picture, sub: googleId } = payload;

    if (!email) {
      throw new ApiError(401, '无效的 Google 账户信息');
    }

    // 查找或创建用户
    let user = await env.D1_DATABASE.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user) {
      // 创建新用户
      const userId = crypto.randomUUID();
      const passwordHash = await hashPassword(crypto.randomUUID());
      
      await env.D1_DATABASE.prepare(
        'INSERT INTO users (id, name, email, password_hash, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(userId, name || 'Google User', email, passwordHash, picture || '', new Date().toISOString()).run();

      user = {
        id: userId,
        name: name || 'Google User',
        email,
        password_hash: passwordHash,
        avatar: picture || '',
        role: 'user',
      };
    }

    // 生成 Token
    const token = await generateToken(user.id, env.JWT_SECRET);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Google 登录成功',
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
          },
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
 * GET /api/auth/me
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

export { router as authRoutes };
