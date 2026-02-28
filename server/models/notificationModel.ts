import db from '../db/database';

export interface Notification {
    id: string;
    user_id: string;
    type: 'like' | 'comment' | 'support' | 'system';
    title: string;
    content: string;
    is_read: number;
    related_post_id?: string;
    created_at: string;
}

export const NotificationModel = {
    create: (notification: Omit<Notification, 'is_read' | 'created_at'>) => {
        const stmt = db.prepare(`
            INSERT INTO notifications (id, user_id, type, title, content, related_post_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            notification.id,
            notification.user_id,
            notification.type,
            notification.title,
            notification.content,
            notification.related_post_id || null
        );
    },

    findByUserId: (userId: string, limit: number = 20) => {
        const stmt = db.prepare(`
            SELECT * FROM notifications 
            WHERE user_id = ? 
            ORDER BY created_at DESC 
            LIMIT ?
        `);
        return stmt.all(userId, limit) as Notification[];
    },

    markAsRead: (id: string, userId: string) => {
        const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?');
        return stmt.run(id, userId);
    },

    markAllAsRead: (userId: string) => {
        const stmt = db.prepare('UPDATE notifications SET is_read = 1 WHERE user_id = ?');
        return stmt.run(userId);
    },

    getUnreadCount: (userId: string) => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0');
        const result = stmt.get(userId) as { count: number };
        return result.count;
    }
};
