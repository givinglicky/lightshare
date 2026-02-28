import db from '../db/database';

export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    created_at?: string;
    author_name?: string;
    author_avatar?: string;
}

export const CommentModel = {
    findByPostId: (postId: string) => {
        const stmt = db.prepare(`
            SELECT c.*, u.name as author_name, u.avatar as author_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `);
        return stmt.all(postId) as Comment[];
    },

    findById: (id: string) => {
        const stmt = db.prepare(`
            SELECT c.*, u.name as author_name, u.avatar as author_avatar
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.id = ?
        `);
        return stmt.get(id) as Comment | undefined;
    },

    create: (comment: { id: string; post_id: string; user_id: string; content: string }) => {
        const stmt = db.prepare(`
            INSERT INTO comments (id, post_id, user_id, content)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(comment.id, comment.post_id, comment.user_id, comment.content);
    },

    delete: (id: string, userId: string) => {
        const stmt = db.prepare('DELETE FROM comments WHERE id = ? AND user_id = ?');
        return stmt.run(id, userId);
    }
};
