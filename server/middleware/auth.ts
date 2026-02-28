import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { ApiError } from './errorHandler';
import { UserModel } from '../models/userModel';

/**
 * 擴充 Express Request 型別，增加 user 屬性
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
            };
        }
    }
}

/**
 * JWT 認證中間件
 * 用於保護需要登入的路由
 * 
 * 預期 Header: Authorization: Bearer <token>
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        // 1. 從 Header 取得 Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, '未提供認證憑證 (Token)');
        }

        const token = authHeader.split(' ')[1];

        // 2. 驗證 Token
        const decoded = verifyToken(token);
        if (!decoded || !decoded.id) {
            throw new ApiError(401, '無效或已過期的憑證');
        }

        // 3. 檢查用戶是否依然存在於資料庫中
        const user = UserModel.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, '用戶不存在');
        }

        // 4. 將用戶資訊存入 req，供後續路由使用
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        next();
    } catch (error) {
        next(error);
    }
};

/**
 * 可選的 JWT 認證中間件
 * 如果有 Token 則驗證，沒有或無效則跳過（不報錯）
 */
export const optionalAuthenticate = async (req: Request, _res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);
            if (decoded && decoded.id) {
                const user = UserModel.findById(decoded.id);
                if (user) {
                    req.user = {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    };
                }
            }
        }
        next();
    } catch (error) {
        // 可選驗證中出錯也不要中斷請求
        next();
    }
};
