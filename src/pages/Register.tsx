import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { User } from '../types';

interface RegisterResponse {
  token: string;
  user: User;
}

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('請勾選同意服務條款與隱私政策');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const data = await apiRequest<RegisterResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      login(data.token, data.user);
      navigate('/feed');
    } catch (err: any) {
      setError(err.message || '註冊失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-primary/20">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary dark:bg-slate-800 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            加入我們，<br /><span className="text-primary-vibrant">傳遞光芒</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xs">
            加入我們的全球社群，分享知識、靈感與溫暖給身邊的每一個人。
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
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">已有 10k+ 成員加入</p>
        </div>
        <div className="absolute -bottom-20 -right-20 size-80 bg-amber-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 size-60 bg-teal-400/30 rounded-full blur-3xl"></div>
      </div>
      <div className="p-8 md:p-12 flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">建立您的帳戶</h2>
          <p className="text-slate-600 dark:text-slate-400">今天就開始您的 LightShare 旅程。</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">全名</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">person</span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="輸入您的真實姓名"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">電子郵件</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">mail</span>
              <input
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="example@lightshare.com"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-primary-vibrant transition-colors">密碼</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-4 text-slate-400 group-focus-within:text-primary-vibrant">lock</span>
              <input
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:ring-2 focus:ring-primary-vibrant/20 focus:border-primary-vibrant transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                placeholder="設定高強度密碼"
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility' : 'visibility_off'}</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-slate-500">建議至少 6 個字元以上。</p>
          </div>
          <div className="flex items-start gap-3 py-2">
            <input
              className="mt-1 size-4 rounded border-slate-300 text-primary-vibrant focus:ring-primary-vibrant cursor-pointer"
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              disabled={isLoading}
            />
            <label className="text-sm text-slate-600 dark:text-slate-400 leading-snug cursor-pointer" htmlFor="terms">
              我同意 <a className="text-primary-vibrant hover:underline" href="#">服務條款</a> 與 <a className="text-primary-vibrant hover:underline" href="#">隱私權政策</a>。
            </label>
          </div>
          <button
            className={`w-full py-4 px-6 bg-primary-vibrant hover:bg-teal-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary-vibrant/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 ${isLoading || !agreeToTerms ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>註冊中...</span>
              </>
            ) : (
              '立即註冊'
            )}
          </button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            已經有帳號了嗎？
            <Link className="text-primary-vibrant font-bold hover:underline ml-1" to="/login">登入</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
