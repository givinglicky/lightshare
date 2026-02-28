import { Router, Request, Response, NextFunction } from 'express';
import { NotificationModel } from '../models/notificationModel';
import { authenticate } from '../middleware/auth';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/notifications
 * 取得當前用戶的通知列表
 */
router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = NotificationModel.findByUserId(req.user!.id);
        const unreadCount = NotificationModel.getUnreadCount(req.user!.id);

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/notifications/read-all
 * 將所有通知標記為已讀
 */
router.put('/read-all', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        NotificationModel.markAllAsRead(req.user!.id);
        res.json({
            success: true,
            message: '所有通知已標記為已讀'
        });
    } catch (error) {
        next(error);
    }
});

/**
 * PUT /api/notifications/:id/read
 * 將單個通知標記為已讀
 */
router.put('/:id/read', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = NotificationModel.markAsRead(req.params.id, req.user!.id);
        if (result.changes === 0) {
            throw new ApiError(404, '通知不存在或不屬於此用戶');
        }
        res.json({
            success: true,
            message: '通知已標記為已讀'
        });
    } catch (error) {
        next(error);
    }
});

export default router;
