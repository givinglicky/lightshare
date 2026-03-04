import db from './server/db/database';

try {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
    console.log('✅ Added role column to users table');
} catch (e: any) {
    if (e.message.includes('duplicate column name')) {
        console.log('ℹ️  role column already exists');
    } else {
        console.error('❌ Error:', e.message);
    }
}

process.exit(0);
