import db from '../db/database';

export interface Post {
    id: string;
    user_id: string;
    title: string;
    content: string;
    image?: string;
    category?: string;
    privacy?: 'public' | 'anonymous';
    location?: string;
    created_at?: string;
    author_name?: string;
    author_avatar?: string;
    likes_count?: number;
    comments_count?: number;
    supporters_count?: number;
    is_liked?: number;
    is_bookmarked?: number;
    is_supported?: number;
}

export const PostModel = {
    findAll: (category?: string, limit: number = 20, offset: number = 0, currentUserId?: string) => {
        let query = `
            SELECT p.*, u.name as author_name, u.avatar as author_avatar,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            (SELECT COUNT(*) FROM supporters WHERE post_id = p.id) as supporters_count
            ${currentUserId ? ', (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id AND user_id = ?) as is_bookmarked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM supporters WHERE post_id = p.id AND user_id = ?) as is_supported' : ''}
            FROM posts p
            JOIN users u ON p.user_id = u.id
        `;

        const params: any[] = [];
        if (currentUserId) {
            params.push(currentUserId, currentUserId, currentUserId);
        }

        if (category) {
            query += ' WHERE p.category = ?';
            params.push(category);
        }

        query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = db.prepare(query);
        return stmt.all(...params) as Post[];
    },

    findById: (id: string, currentUserId?: string) => {
        const query = `
            SELECT p.*, u.name as author_name, u.avatar as author_avatar,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            (SELECT COUNT(*) FROM supporters WHERE post_id = p.id) as supporters_count
            ${currentUserId ? ', (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id AND user_id = ?) as is_bookmarked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM supporters WHERE post_id = p.id AND user_id = ?) as is_supported' : ''}
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = ?
        `;
        const stmt = db.prepare(query);
        const params = currentUserId ? [currentUserId, currentUserId, currentUserId, id] : [id];
        return stmt.get(...params) as Post | undefined;
    },

    create: (post: Omit<Post, 'created_at' | 'author_name' | 'author_avatar' | 'likes_count' | 'comments_count'>) => {
        const stmt = db.prepare(`
            INSERT INTO posts (id, user_id, title, content, image, category, privacy, location)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            post.id,
            post.user_id,
            post.title,
            post.content,
            post.image || '',
            post.category || '情緒支持',
            post.privacy || 'public',
            post.location || ''
        );
    },

    delete: (id: string, userId: string) => {
        const stmt = db.prepare('DELETE FROM posts WHERE id = ? AND user_id = ?');
        return stmt.run(id, userId);
    },

    search: (searchTerm: string, currentUserId?: string) => {
        const query = `
            SELECT p.*, u.name as author_name, u.avatar as author_avatar,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            (SELECT COUNT(*) FROM supporters WHERE post_id = p.id) as supporters_count
            ${currentUserId ? ', (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id AND user_id = ?) as is_bookmarked' : ''}
            ${currentUserId ? ', (SELECT COUNT(*) FROM supporters WHERE post_id = p.id AND user_id = ?) as is_supported' : ''}
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.title LIKE ? OR p.content LIKE ?
            ORDER BY p.created_at DESC
        `;
        const pattern = `%${searchTerm}%`;
        const params = currentUserId ? [currentUserId, currentUserId, currentUserId, pattern, pattern] : [pattern, pattern];
        const stmt = db.prepare(query);
        return stmt.all(...params) as Post[];
    },

    findByUserId: (userId: string) => {
        const stmt = db.prepare(`
            SELECT p.*, u.name as author_name, u.avatar as author_avatar,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likes_count,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
            (SELECT COUNT(*) FROM supporters WHERE post_id = p.id) as supporters_count,
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id AND user_id = ?) as is_liked,
            (SELECT COUNT(*) FROM bookmarks WHERE post_id = p.id AND user_id = ?) as is_bookmarked,
            (SELECT COUNT(*) FROM supporters WHERE post_id = p.id AND user_id = ?) as is_supported
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC
        `);
        return stmt.all(userId, userId, userId, userId) as Post[];
    }
};
