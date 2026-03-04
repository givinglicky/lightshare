/**
 * Cloudflare Workers 入口文件
 * 适配 Express 应用到 Cloudflare Workers 环境
 */

import { Router } from './router';
import { authRoutes } from './routes/auth';
import { postRoutes } from './routes/posts';
import { userRoutes } from './routes/users';
import { commentRoutes } from './routes/comments';
import { notificationRoutes } from './routes/notifications';

// 创建路由实例
const router = new Router();

// 注册路由
router.use('/api/auth', authRoutes);
router.use('/api/posts', postRoutes);
router.use('/api/users', userRoutes);
router.use('/api/comments', commentRoutes);
router.use('/api/notifications', notificationRoutes);

// 健康检查
router.get('/api/health', () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      message: 'LightShare API is running on Cloudflare Workers',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
});

// 主处理函数
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS 处理
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    try {
      const response = await router.handle(request, env, ctx);
      
      // 添加 CORS 头
      const corsHeaders = new Headers(response.headers);
      corsHeaders.set('Access-Control-Allow-Origin', '*');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('Error handling request:', error);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

// 环境变量类型定义
export interface Env {
  JWT_SECRET: string;
  D1_DATABASE: D1Database;
}
