import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

export const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('密碼與確認密碼不一致');
            return;
        }

        if (password.length < 6) {
            setError('密碼至少需要 6 個字元');
            return;
        }

        setLoading(true);

        try {
            const response = await authService.register({ name, email, password });
            login(response.token, response.user);
            navigate('/feed');
        } catch (err: any) {
            setError(err.message || '註冊失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-primary/20">
            <div className="hidden lg:flex flex-col justify-between p-12 bg-primary dark:bg-slate-800 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                        加入我們，<br /><span className="text-accent-mint">傳遞光芒</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xs">
                        Join our global community to share knowledge, inspiration, and light with others.
                    </p>
                </div>
                <div className="relative z-10 flex items-center gap-4 mt-8">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <img
                                key={i}
                                className="size-10 rounded-full border-2 border-white dark:border-slate-800"
                                alt={`Member ${i}`}
                                src={`https://picsum.photos/seed/member${i}/100/100`}
                            />
                        ))}
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Join 10k+ members</p>
                </div>
                <div className="absolute -bottom-20 -right-20 size-80 bg-amber-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -top-20 -left-20 size-60 bg-teal-400/30 rounded-full blur-3xl"></div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create your account</h2>
                    <p className="text-slate-600 dark:text-slate-400">今天就加入 陽光種子希望園，開啟您的溫暖旅程。</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">Full Name</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">person</span>
                            <input
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="Enter your full name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">Email Address</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">mail</span>
                            <input
                                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="example@lightshare.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">Password</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">lock</span>
                            <input
                                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="Create a strong password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200" type="button">
                                <span className="material-symbols-outlined">visibility</span>
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-slate-500">Minimum 6 characters.</p>
                    </div>
                    <div className="group">
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">Confirm Password</label>
                        <div className="relative flex items-center">
                            <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">lock</span>
                            <input
                                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                                placeholder="Confirm your password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-start gap-3 py-2">
                        <input className="mt-1 size-4 rounded border-slate-300 text-primary-vibrant focus:ring-primary-vibrant" id="terms" type="checkbox" required />
                        <label className="text-sm text-slate-600 dark:text-slate-400 leading-snug" htmlFor="terms">
                            I agree to the <a className="text-primary-vibrant hover:underline" href="#">Terms of Service</a> and <a className="text-primary-vibrant hover:underline" href="#">Privacy Policy</a>.
                        </label>
                    </div>
                    <button 
                        className="w-full py-4 px-6 bg-primary-vibrant hover:bg-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-vibrant/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? '註冊中...' : '註冊 (Register)'}
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Already have an account?
                        <Link className="text-primary-vibrant font-bold hover:underline ml-1" to="/login">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
