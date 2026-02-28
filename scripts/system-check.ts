import http from 'http';

const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
};

async function checkHealth() {
    console.log(colors.bold + '\n🚥 LightShare 系統紅綠燈測試驗證中...\n' + colors.reset);

    const check = (name: string, url: string): Promise<boolean> => {
        process.stdout.write(`測試項目: ${name.padEnd(20)} ... `);
        return new Promise((resolve) => {
            const req = http.get(url, (res) => {
                if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                    console.log(colors.green + '[ OK ]' + colors.reset);
                    resolve(true);
                } else {
                    console.log(colors.red + `[ FAIL: HTTP ${res.statusCode} ]` + colors.reset);
                    resolve(false);
                }
            });
            req.on('error', (e) => {
                console.log(colors.red + `[ DISCONNECTED: ${e.message} ]` + colors.reset);
                resolve(false);
            });
            req.setTimeout(5000, () => {
                console.log(colors.red + '[ TIMEOUT ]' + colors.reset);
                req.destroy();
                resolve(false);
            });
        });
    };

    const results = [
        await check('API Server', 'http://127.0.0.1:3001/api/health'),
        await check('Database (Posts)', 'http://127.0.0.1:3001/api/posts'),
        await check('Frontend', 'http://127.0.0.1:3000/'),
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
