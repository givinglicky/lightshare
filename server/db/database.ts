import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 資料庫檔案路徑（放在專案根目錄）
const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const schemaPath = path.resolve(__dirname, 'schema.sql');

// 建立資料庫連線
// 這裡省略 verbose: console.log 以避免日誌過多，除錯時可加入
const db = new Database(dbPath);

// 啟用外鍵約束 (SQLite 預設是關閉的)
db.pragma('foreign_keys = ON');

// 初始化資料庫 (執行 schema.sql)
export const initDB = () => {
    try {
        if (fs.existsSync(schemaPath)) {
            const schema = fs.readFileSync(schemaPath, 'utf-8');
            db.exec(schema);
            console.log('✅ SQLite 資料庫初始化成功');
        } else {
            console.warn('⚠️ 找不到 schema.sql');
        }
    } catch (error) {
        console.error('❌ 初始化資料庫失敗:', error);
        process.exit(1);
    }
};

// 導出 db 實例供 Models 使用
export default db;
