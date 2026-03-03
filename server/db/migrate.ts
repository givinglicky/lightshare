import db from './database.js';
console.log('Starting migration...');
try {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
    console.log('Migration successful: role column added.');
} catch (e: any) {
    if (e.message.includes('duplicate column name')) {
        console.log('Migration successful: role column already exists.');
    } else {
        console.error('Migration failed:', e.message);
    }
}
