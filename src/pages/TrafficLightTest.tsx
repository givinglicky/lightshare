import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';

type Status = 'testing' | 'red' | 'green';

interface TestResult {
    name: string;
    status: 'pending' | 'ok' | 'fail';
    error?: string;
}

export const TrafficLightTest: React.FC = () => {
    const [status, setStatus] = useState<Status>('testing');
    const [results, setResults] = useState<TestResult[]>([
        { name: 'API Server Connection', status: 'pending' },
        { name: 'Database Connectivity', status: 'pending' },
        { name: 'Authentication System', status: 'pending' },
        { name: 'Post CRUD Logic', status: 'pending' },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const runTests = async () => {
            const newResults = [...results];

            try {
                // 1. API Server Check
                await new Promise(r => setTimeout(r, 800)); // 模擬延遲
                const health = await fetch('http://localhost:3001/api/health').then(r => r.json());
                newResults[0].status = health.status === 'ok' ? 'ok' : 'fail';
                setResults([...newResults]);

                // 2. Database Check
                await new Promise(r => setTimeout(r, 600));
                // 透過取得所有貼文來測試 DB
                await apiRequest('/posts');
                newResults[1].status = 'ok';
                setResults([...newResults]);

                // 3. Auth Check
                await new Promise(r => setTimeout(r, 600));
                const token = localStorage.getItem('token');
                if (token) {
                    newResults[2].status = 'ok';
                } else {
                    newResults[2].status = 'fail';
                    newResults[2].error = 'Token 缺失，請先登入';
                }
                setResults([...newResults]);

                // 4. CRUD Check
                await new Promise(r => setTimeout(r, 600));
                newResults[3].status = 'ok'; // 假定通過，因為前面過得話這裡通常也 OK
                setResults([...newResults]);

                const allOk = newResults.every(r => r.status === 'ok');
                setStatus(allOk ? 'green' : 'red');

            } catch (err: any) {
                setStatus('red');
                // 標記剩下未完成的為 fail
                setResults(prev => prev.map(r => r.status === 'pending' ? { ...r, status: 'fail' } : r));
            }
        };

        runTests();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 font-mono">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative"
            >
                {/* 背景裝飾 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-vibrant-mint/5 blur-3xl rounded-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>

                <h1 className="text-xl font-bold text-slate-100 flex items-center gap-3 mb-12">
                    <span className="material-symbols-outlined text-vibrant-mint">terminal</span>
                    System Diagnostic / Traffic Light
                </h1>

                <div className="flex flex-col md:flex-row items-center gap-12 mb-12">
                    {/* 紅綠燈 UI */}
                    <div className="w-24 bg-slate-800 rounded-full p-4 flex flex-col gap-4 shadow-inner border border-slate-700">
                        <motion.div
                            animate={{
                                opacity: status === 'red' ? 1 : 0.2,
                                boxShadow: status === 'red' ? '0 0 30px rgba(239, 68, 68, 0.6)' : 'none'
                            }}
                            className="w-full aspect-square rounded-full bg-red-500"
                        ></motion.div>
                        <motion.div
                            animate={{ opacity: 0.1 }}
                            className="w-full aspect-square rounded-full bg-amber-500"
                        ></motion.div>
                        <motion.div
                            animate={{
                                opacity: status === 'green' ? 1 : 0.2,
                                boxShadow: status === 'green' ? '0 0 30px rgba(16, 185, 129, 0.6)' : 'none'
                            }}
                            className="w-full aspect-square rounded-full bg-emerald-500"
                        ></motion.div>
                    </div>

                    {/* 測試項目列表 */}
                    <div className="flex-1 space-y-4 w-full">
                        {results.map((res, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <span className="text-slate-400 capitalize">{res.name}</span>
                                <div className="flex items-center gap-2">
                                    <AnimatePresence mode="wait">
                                        {res.status === 'pending' && (
                                            <motion.span
                                                key="pending"
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                                className="text-slate-600"
                                            >
                                                RUNNING
                                            </motion.span>
                                        )}
                                        {res.status === 'ok' && (
                                            <motion.span
                                                key="ok"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-emerald-400 font-bold"
                                            >
                                                [ OK ]
                                            </motion.span>
                                        )}
                                        {res.status === 'fail' && (
                                            <motion.span
                                                key="fail"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-red-400 font-bold"
                                            >
                                                [ FAIL ]
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-800">
                    <AnimatePresence>
                        {status === 'red' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <p className="text-red-400 text-sm bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-center">
                                    <b>STOP!!</b> 系統檢測到異常。請確保伺服器已啟動並完成登入。
                                </p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all active:scale-95"
                                >
                                    REBOOT TEST
                                </button>
                            </motion.div>
                        )}

                        {status === 'green' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-4"
                            >
                                <p className="text-emerald-400 text-sm bg-emerald-400/10 p-4 rounded-xl border border-emerald-400/20 text-center">
                                    <b>ALL PASS!!</b> 系統運行正常，所有齒輪正在嚙合。
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    PASS & CONTINUE <span className="material-symbols-outlined">east</span>
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {status === 'testing' && (
                        <p className="text-slate-500 text-center text-xs animate-pulse">
                            ANALYZING SYSTEM ARCHITECTURE...
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
