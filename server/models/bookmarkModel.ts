import db from '../db/database';
import { Post } from './postModel';

export const BookmarkModel = {
    add: (id: string, postId: string, userId: string) => {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO bookmarks (id, post_id, user_id)
            VALUES (?, ?, ?)
        `);
        return stmt.run(id, postId, userId);
    },

    remove: (postId: string, userId: string) => {
        const stmt = db.prepare('DELETE FROM bookmarks WHERE post_id = ? AND user_id = ?');
        return stmt.run(postId, userId);
    },

    isBookmarked: (postId: string, userId: string) => {
        const stmt = db.prepare('SELECT id FROM bookmarks WHERE post_id = ? AND user_id = ?');
        return !!stmt.get(postId, userId);
    },

    findByUserId: (userId: string) => {
        const stmt = db.prepare(`
            SELECT p.*, u.name as author_name, u.avatar as author_avatar,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
            1 as is_bookmarked
            FROM posts p
            JOIN bookmarks b ON p.id = b.post_id
            JOIN users u ON p.user_id = u.id
            WHERE b.user_id = ?
            ORDER BY b.created_at DESC
        `);
        return stmt.all(userId, userId) as (Post & { is_liked: number; is_bookmarked: number })[];
    }
};
