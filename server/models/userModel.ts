import db from '../db/database';

export interface User {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    avatar?: string;
    bio?: string;
    location?: string;
    created_at?: string;
}

export const UserModel = {
    create: (user: User) => {
        const stmt = db.prepare(`
      INSERT INTO users (id, name, email, password_hash, avatar, bio, location)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        return stmt.run(
            user.id,
            user.name,
            user.email,
            user.password_hash,
            user.avatar || '',
            user.bio || '',
            user.location || ''
        );
    },

    findByEmail: (email: string): User | undefined => {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email) as User | undefined;
    },

    findById: (id: string): User | undefined => {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id) as User | undefined;
    }
};
