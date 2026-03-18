import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const loginWithGoogle = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    skipBrowserRedirect: true // 獲取 URL 以手動開啟彈窗
                }
            });

            if (error) throw error;
            if (data?.url) {
                window.open(data.url, '_blank', 'width=500,height=600,left=100,top=100');
            }
        } catch (err: any) {
            setError(err.message || 'Google 登入失敗');
        } finally {
            setLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });
            login(response.token, response.user);
            navigate('/feed');
        } catch (err: any) {
            setError(err.message || '登入失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full max-w-[1200px] h-[800px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="hidden lg:flex flex-1 bg-primary dark:bg-primary/10 relative flex-col justify-center items-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_#4DB6AC_0%,_transparent_50%)]"></div>
                <div className="relative z-10 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-64 h-64 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-sm">
                            <img
                                className="w-full h-full object-contain"
                                alt="Illustration"
                                src="https://picsum.photos/seed/lightshare-login/600/600"
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">讓分享變得更簡單</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">陽光種子希望園 是一個充滿溫度的社區，我們相信每一份小小的分享都能照亮他人的生活。</p>
                </div>
            </div>
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 bg-white dark:bg-slate-900">
                <div className="max-w-md w-full mx-auto">
                    <Link
                        to="/"
                        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-primary-vibrant transition-colors group z-20"
                    >
                        <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">arrow_back</span>
                        <span className="font-medium">回上一頁</span>
                    </Link>

                    <div className="flex items-center gap-2 mb-8 mt-12 lg:mt-0">
                        <div className="bg-primary-vibrant text-white p-2 rounded-lg">
                            <span className="material-symbols-outlined text-2xl">wb_sunny</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">陽光種子希望園</span>
                    </div>
                    <div className="mb-10">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">歡迎來到陽光種子希望園</h1>
                        <p className="text-slate-500 dark:text-slate-400">登入您的帳戶以繼續探索社區的溫暖</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="relative">
                            <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">電子郵件</label>
                            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent transition-all px-4 py-3 group focus-within:border-primary-vibrant focus-within:ring-1 focus-within:ring-primary-vibrant">
                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary-vibrant mr-3">mail</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="example@email.com"
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">密碼</label>
                                <Link className="text-sm text-primary-vibrant hover:underline font-semibold" to="/forgot-password">忘記密碼？</Link>
                            </div>
                            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent transition-all px-4 py-3 group focus-within:border-primary-vibrant focus-within:ring-1 focus-within:ring-primary-vibrant">
                                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary-vibrant mr-3">lock</span>
                                <input
                                    className="bg-transparent border-none focus:ring-0 w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                                    placeholder="輸入您的密碼"
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input className="rounded border-slate-300 text-primary-vibrant focus:ring-primary-vibrant" id="remember" type="checkbox" />
                            <label className="text-sm text-slate-600 dark:text-slate-400" htmlFor="remember">記住我</label>
                        </div>
                        <button
                            className="w-full bg-primary-vibrant hover:bg-primary-vibrant/90 text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-primary-vibrant/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin material-symbols-outlined">sync</span>
                                    登入中...
                                </span>
                            ) : (
                                <>
                                    <span>登入</span>
                                    <span className="material-symbols-outlined">login</span>
                                </>
                            )}
                        </button>
                    </form>
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-slate-900 text-slate-500">或透過以下方式登入</span>
                        </div>
                    </div>
                    <button 
                        onClick={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        使用 Google 帳號登入
                    </button>
                    <p className="mt-8 text-center text-slate-600 dark:text-slate-400">
                        還沒有帳號嗎？
                        <Link className="text-primary-vibrant font-bold hover:underline ml-1" to="/register">立即註冊</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
