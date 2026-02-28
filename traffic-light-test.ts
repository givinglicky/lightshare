
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
};

function drawLight(color: 'red' | 'green' | 'off') {
    const redSymbol = color === 'red' ? colors.red + '●' : '○';
    const greenSymbol = color === 'green' ? colors.green + '●' : '○';

    console.log('    ┌─────┐');
    console.log(`    │  ${redSymbol}${colors.reset}  │  ${color === 'red' ? colors.red + 'STOP!!' : ''}${colors.reset}`);
    console.log('    │  ○  │');
    console.log(`    │  ${greenSymbol}${colors.reset}  │  ${color === 'green' ? colors.green + 'PASS!!' : ''}${colors.reset}`);
    console.log('    └─────┘');
}

async function runTest(name: string, fn: () => void | Promise<void>) {
    process.stdout.write(`Testing: ${name}... `);
    try {
        await fn();
        console.log(colors.green + 'OK' + colors.reset);
        return true;
    } catch (error) {
        console.log(colors.red + 'FAIL' + colors.reset);
        console.error(colors.red + 'Error: ' + (error as Error).message + colors.reset);
        return false;
    }
}

async function main() {
    console.log(colors.bold + '\n🚦 紅綠燈測試系統啟動中...\n' + colors.reset);

    const tests = [
        {
            name: '基礎數學測試 (1 + 1 === 2)',
            fn: () => {
                if (1 + 1 !== 2) throw new Error('數學崩潰了！');
            }
        },
        {
            name: '字串處理測試 ("hello".toUpperCase() === "HELLO")',
            fn: () => {
                if ("hello".toUpperCase() !== "HELLO") throw new Error('字串轉大寫失敗');
            }
        },
        {
            name: '修復後的程式測試 (邏輯正確)',
            fn: () => {
                // 現在我們讓它通過
                const codeIsCorrect = true;
                if (!codeIsCorrect) {
                    throw new Error('程式碼邏輯有誤！');
                }
            }
        }
    ];

    for (const test of tests) {
        const passed = await runTest(test.name, test.fn);
        if (!passed) {
            console.log(colors.red + colors.bold + '\n❌ 測試失敗！程式停止運行。' + colors.reset);
            drawLight('red');
            process.exit(1);
        }
    }

    console.log(colors.green + colors.bold + '\n✅ 所有測試通過！繼續執行。' + colors.reset);
    drawLight('green');
    console.log('\n🚀 正在準備進入下一個階段...\n');
}

main();
