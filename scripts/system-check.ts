
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

async function checkHealth() {
    console.log(colors.bold + '\n🚥 LightShare 系統紅綠燈測試驗證中...\n' + colors.reset);

    const check = async (name: string, url: string) => {
        process.stdout.write(`測試項目: ${name.padEnd(20)} ... `);
        try {
            const resp = await fetch(url);
            if (resp.ok) {
                console.log(colors.green + '[ OK ]' + colors.reset);
                return true;
            } else {
                console.log(colors.red + '[ FAIL ]' + colors.reset);
                return false;
            }
        } catch (e) {
            console.log(colors.red + '[ DISCONNECTED ]' + colors.reset);
            return false;
        }
    };

    const results = [
        await check('API Server', 'http://localhost:3001/api/health'),
        await check('Database (Posts)', 'http://localhost:3001/api/posts'),
        await check('Frontend', 'http://localhost:3000/'),
    ];

    const allPassed = results.every(r => r === true);

    if (allPassed) {
        console.log(colors.green + colors.bold + '\n🟢 綠燈：系統一切正常，請繼續開發！' + colors.reset);
        console.log('    ┌─────┐');
        console.log('    │  ○  │');
        console.log('    │  ○  │');
        console.log(`    │  ${colors.green}●${colors.reset}  │  ${colors.green}PASS!!${colors.reset}`);
        console.log('    └─────┘\n');
    } else {
        console.log(colors.red + colors.bold + '\n🔴 紅燈：檢測到異常，請停止開發並修復錯誤。' + colors.reset);
        console.log('    ┌─────┐');
        console.log(`    │  ${colors.red}●${colors.reset}  │  ${colors.red}STOP!!${colors.reset}`);
        console.log('    │  ○  │');
        console.log('    │  ○  │');
        console.log('    └─────┘\n');
        process.exit(1);
    }
}

checkHealth();
