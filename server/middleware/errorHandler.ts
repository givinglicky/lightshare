import { Request, Response, NextFunction } from 'express';

/**
 * 自訂 API 錯誤類別
 * 可在 controller 中拋出帶有 HTTP 狀態碼的錯誤
 *
 * 使用範例：
 *   throw new ApiError(404, '找不到該貼文');
 *   throw new ApiError(401, '請先登入');
 */
export class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'ApiError';
    }
}

/**
 * 404 Not Found 處理
 * 當請求的路由不存在時觸發
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
    const error = new ApiError(404, `找不到路由: ${req.method} ${req.originalUrl}`);
    next(error);
};

/**
 * 全域錯誤處理中間件
 * 統一捕獲所有錯誤並回傳一致的 JSON 格式
 *
 * 回傳格式：
 * {
 *   success: false,
 *   error: {
 *     message: "錯誤訊息",
 *     statusCode: 400
 *   }
 * }
 */
export const errorHandler = (
    err: Error | ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    // 判斷是否為自訂的 ApiError
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    const message = err.message || '伺服器內部錯誤';

    // 在開發環境中印出錯誤堆疊
    if (process.env.NODE_ENV !== 'production') {
        console.error(`\n❌ [Error] ${statusCode} - ${message}`);
        if (statusCode === 500) {
            console.error(err.stack);
        }
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            statusCode,
        },
    });
};
