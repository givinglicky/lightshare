import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // 模擬 API 請求
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <main className="flex-1 w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-[70vh]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
            >
                {!isSubmitted ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="size-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl">key</span>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">忘記密碼？</h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">別擔心，輸入您的電子郵件，我們將為您發送重設連結。</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">電子郵件</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    '發送重設郵件'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="size-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">郵件已發送！</h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                我們已將重設密碼的指令發送至 <span className="font-bold text-slate-900 dark:text-slate-100">{email}</span>。請檢查您的收件匣。
                            </p>
                        </div>
                        <p className="text-sm text-slate-500">
                            沒收到郵件？請檢查垃圾郵件匣，或<button onClick={() => setIsSubmitted(false)} className="text-emerald-500 font-bold hover:underline mx-1">稍後重試</button>。
                        </p>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-emerald-500 flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-sm">arrow_back</span>
                        返回登入
                    </Link>
                </div>
            </motion.div>
        </main>
    );
};
