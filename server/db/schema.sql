-- 用戶表
CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    avatar      TEXT DEFAULT '',
    bio         TEXT DEFAULT '',
    location    TEXT DEFAULT '',
    role        TEXT DEFAULT 'user',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 檢查 role 欄位是否存在，不存在則新增
ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';

-- 貼文表
CREATE TABLE IF NOT EXISTS posts (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    image       TEXT DEFAULT '',
    category    TEXT DEFAULT '情緒支持',
    privacy     TEXT DEFAULT 'public',
    location    TEXT DEFAULT '',
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 留言表
CREATE TABLE IF NOT EXISTS comments (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    content     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 按讚表（正能量）
CREATE TABLE IF NOT EXISTS likes (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 收藏表
CREATE TABLE IF NOT EXISTS bookmarks (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 支持者表
CREATE TABLE IF NOT EXISTS supporters (
    id          TEXT PRIMARY KEY,
    post_id     TEXT NOT NULL,
    user_id     TEXT NOT NULL,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id          TEXT PRIMARY KEY,
    user_id     TEXT NOT NULL,
    type        TEXT NOT NULL,             -- 'like' | 'comment' | 'support' | 'system'
    title       TEXT NOT NULL,
    content     TEXT NOT NULL,
    is_read     INTEGER DEFAULT 0,         -- 0=未讀, 1=已讀
    related_post_id TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_post_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- 通知設定表
CREATE TABLE IF NOT EXISTS notification_settings (
    user_id           TEXT PRIMARY KEY,
    new_comments      INTEGER DEFAULT 1,
    new_likes         INTEGER DEFAULT 1,
    direct_messages   INTEGER DEFAULT 1,
    community_updates INTEGER DEFAULT 0,
    email_digest      INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
