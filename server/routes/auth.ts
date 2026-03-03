import { Router, Request, Response } from 'express';
import { UserModel } from '../models/userModel';
import { hashPassword, generateToken, comparePassword } from '../utils/auth';
import { ApiError } from '../middleware/errorHandler';
import crypto from 'crypto';

const router = Router();

/**
 * POST /api/auth/register
 * 註冊新用戶
 */
router.post('/register', async (req: Request, res: Response, next) => {
    try {
        const { name, email, password } = req.body;

        // 1. 基本驗證
        if (!name || !email || !password) {
            throw new ApiError(400, '請提供完整註冊資訊（名稱、信箱、密碼）');
        }

        // 2. 檢查用戶是否已存在
        const existingUser = UserModel.findByEmail(email);
        if (existingUser) {
            throw new ApiError(400, '該信箱已被註冊');
        }

        // 3. 密碼加密
        const password_hash = await hashPassword(password);

        // 4. 建立用戶
        const userId = crypto.randomUUID();
        UserModel.create({
            id: userId,
            name,
            email,
            password_hash
        });

        // 5. 產生 Token
        const token = generateToken(userId);

        // 6. 回傳結果
        res.status(201).json({
            success: true,
            message: '註冊成功',
            data: {
                token,
                user: {
                    id: userId,
                    name,
                    email,
                    role: 'user'
                }
            }
        });
    } catch (error) {
        next(error);
    }
});



/**
 * POST /api/auth/login
 * 用戶登入
 */
router.post('/login', async (req: Request, res: Response, next) => {
    try {
        const { email, password } = req.body;

        // 1. 基本驗證
        if (!email || !password) {
            throw new ApiError(400, '請提供電子信箱與密碼');
        }

        // 2. 尋找用戶
        const user = UserModel.findByEmail(email);
        if (!user) {
            // 為了安全，不區分「用戶不存在」或「密碼錯誤」，統一回傳 401
            throw new ApiError(401, '信箱或密碼錯誤');
        }

        // 3. 驗證密碼
        const isPasswordValid = await comparePassword(password, user.password_hash);
        if (!isPasswordValid) {
            throw new ApiError(401, '信箱或密碼錯誤');
        }

        // 4. 產生 Token
        const token = generateToken(user.id);

        // 5. 回傳結果
        res.json({
            success: true,
            message: '登入成功',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

import { authenticate } from '../middleware/auth';

/**
 * GET /api/auth/me
 * 取得當前登入用戶資訊（需要認證）
 */
router.get('/me', authenticate, async (req: Request, res: Response, next) => {
    try {
        // 中間件已經幫我們在 req.user 中設定好用戶資訊了
        const user = UserModel.findById(req.user!.id);

        if (!user) {
            throw new ApiError(404, '找不到用戶資料');
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                location: user.location,
                role: user.role,
                created_at: user.created_at
            }
        });
    } catch (error) {
        next(error);
    }
});

import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /api/auth/google
 * Google OAuth 登入/註冊
 */
router.post('/google', async (req: Request, res: Response, next) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            throw new ApiError(400, '缺少 Google 驗證資訊');
        }

        // 1. 驗證 Google ID Token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new ApiError(401, '無效的 Google 帳戶資訊');
        }

        const { email, name, picture, sub: googleId } = payload;

        // 2. 尋找或建立用戶
        let user = UserModel.findByEmail(email);

        if (!user) {
            // 如果不存在，建立新用戶
            const userId = crypto.randomUUID();
            // Google 用戶沒有密碼，我們可以用隨機字串代替
            const password_hash = await hashPassword(crypto.randomBytes(16).toString('hex'));

            user = {
                id: userId,
                name: name || 'Google User',
                email: email,
                password_hash,
                avatar: picture || '',
                bio: '來自 Google 的新朋友',
                location: '',
                created_at: new Date().toISOString()
            };

            UserModel.create(user);
        }

        // 3. 產生本地 Token
        const token = generateToken(user.id);

        // 4. 回傳結果
        res.json({
            success: true,
            message: 'Google 登入成功',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    role: user.role
                }
            }
        });

    } catch (error) {
        next(error);
    }
});

export default router;
