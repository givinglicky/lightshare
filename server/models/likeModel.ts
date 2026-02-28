import db from '../db/database';

export const LikeModel = {
    add: (id: string, postId: string, userId: string) => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO likes (id, post_id, user_id)
            VALUES (?, ?, ?)
        `);
        return stmt.run(id, postId, userId);
    },

    remove: (postId: string, userId: string) => {
        const stmt = db.prepare('DELETE FROM likes WHERE post_id = ? AND user_id = ?');
        return stmt.run(postId, userId);
    },

    isLiked: (postId: string, userId: string) => {
        const stmt = db.prepare('SELECT id FROM likes WHERE post_id = ? AND user_id = ?');
        return !!stmt.get(postId, userId);
    },

    countByPostId: (postId: string) => {
        const stmt = db.prepare('SELECT COUNT(*) as count FROM likes WHERE post_id = ?');
        const result = stmt.get(postId) as { count: number };
        return result.count;
    }
};
