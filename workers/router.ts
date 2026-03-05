/**
 * 简化的 Router 实现
 * 适配 Cloudflare Workers 环境
 */

export type Handler = (request: Request, env: Env, ctx: ExecutionContext, params?: Record<string, string>) => Promise<Response> | Response;

interface Route {
  method: string;
  path: string;
  handler: Handler;
  regex: RegExp;
  paramNames: string[];
}

export class Router {
  private routes: Route[] = [];
  private middlewares: Handler[] = [];

  /**
   * 添加中间件
   */
  use(path: string, handler: Handler | Router): void {
    if (handler instanceof Router) {
      // 子路由
      const subRouter = handler;
      subRouter.routes.forEach((route) => {
        const fullPath = path + route.path;
        this.addRoute(route.method, fullPath, route.handler);
      });
    } else {
      this.addRoute('ALL', path, handler);
    }
  }

  /**
   * GET 路由
   */
  get(path: string, handler: Handler): void {
    this.addRoute('GET', path, handler);
  }

  /**
   * POST 路由
   */
  post(path: string, handler: Handler): void {
    this.addRoute('POST', path, handler);
  }

  /**
   * PUT 路由
   */
  put(path: string, handler: Handler): void {
    this.addRoute('PUT', path, handler);
  }

  /**
   * DELETE 路由
   */
  delete(path: string, handler: Handler): void {
    this.addRoute('DELETE', path, handler);
  }

  /**
   * PATCH 路由
   */
  patch(path: string, handler: Handler): void {
    this.addRoute('PATCH', path, handler);
  }

  /**
   * 添加路由
   */
  private addRoute(method: string, path: string, handler: Handler): void {
    const paramNames: string[] = [];

    // 转换路径参数 :id 为正则表达式
    const regexPath = path.replace(/:([^/]+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    }).replace(/\/$/, ''); // 移除最後的斜線

    // 匹配路徑，讓末尾斜線變成選擇性
    const regex = new RegExp(`^${regexPath}/?$`);

    this.routes.push({
      method,
      path,
      handler,
      regex,
      paramNames,
    });
  }

  /**
   * 处理请求
   */
  async handle(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method;

    // 查找匹配的路由
    for (const route of this.routes) {
      const match = pathname.match(route.regex);

      if (match && (route.method === 'ALL' || route.method === method)) {
        // 提取路径参数
        const params: Record<string, string> = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        // 执行处理函数
        return await route.handler(request, env, ctx, params);
      }
    }

    // 404 响应
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Not Found',
        message: `Route ${method} ${pathname} not found`,
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
