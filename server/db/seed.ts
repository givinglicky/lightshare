import db from './database';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const seed = async () => {
    console.log('🌱 Starting database seeding...');

    try {
        // 1. 清除舊資料 (可選)
        // db.exec('DELETE FROM users'); 
        // db.exec('DELETE FROM posts');

        // 2. 建立測試用戶
        const passwordHash = await bcrypt.hash('password123', 10);
        const userId = 'test-user-id';

        const existingUser = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
        if (!existingUser) {
            db.prepare(`
                INSERT INTO users (id, name, email, password_hash, avatar, bio, location)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                userId,
                '溫暖的小光',
                'test@example.com',
                passwordHash,
                'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
                '傳遞溫暖，分享正能量。',
                '台北市'
            );
            console.log('✅ Test user created');
        }

        // 3. 建立測試貼文
        const posts = [
            {
                id: crypto.randomUUID(),
                user_id: userId,
                title: '今天在街角看見鄰居互相幫忙，心裡暖暖的',
                content: '看到一位年輕人主動幫提著重物的長者過馬路。在這樣的城市裡，小小的善行真的能讓一天都亮起來。大家今天有遇到什麼暖心的小事嗎？',
                category: '情緒支持',
                location: '台北市'
            },
            {
                id: crypto.randomUUID(),
                user_id: userId,
                title: '尋找志同道合的小夥伴一起到淨灘',
                content: '本週末想在北海岸發起一場小型淨灘活動，有興趣的朋友歡迎留言或加入支持！讓我們一起為環境盡一份心力。',
                category: '環境生態',
                location: '新北市'
            }
        ];

        const insertPost = db.prepare(`
            INSERT INTO posts (id, user_id, title, content, category, location)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const post of posts) {
            const existingPost = db.prepare('SELECT id FROM posts WHERE title = ?').get(post.title);
            if (!existingPost) {
                insertPost.run(post.id, post.user_id, post.title, post.content, post.category, post.location);
                console.log(`✅ Post created: ${post.title}`);

                // 新增一條預設留言
                db.prepare(`
                    INSERT INTO comments (id, post_id, user_id, content)
                    VALUES (?, ?, ?, ?)
                `).run(crypto.randomUUID(), post.id, userId, '這是一個很棒的分享！');
                console.log(`✅ Default comment added to post: ${post.title}`);
            }
        }

        console.log('🌱 Seeding completed!');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    }
};

seed();
