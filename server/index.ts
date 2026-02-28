import app from './app';
import { initDB } from './db/database';

const PORT = process.env.PORT || 3001;

// 初始化資料庫
initDB();

app.listen(PORT, () => {
    console.log(`\n🚀 LightShare API Server is running`);
    console.log(`   Local:   http://localhost:${PORT}`);
    console.log(`   API:     http://localhost:${PORT}/api`);
    console.log(`   Health:  http://localhost:${PORT}/api/health\n`);
});
