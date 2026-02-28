import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiRequest } from '../services/api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 取得來源路徑，預設回 /feed
  const from = location.state?.from?.pathname || '/feed';

  // 如果已經登入，直接導向首頁
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      login(data.token, data.user);
      // 跳回原本想去的頁面
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || '登入失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-[1200px] h-auto lg:h-[800px] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
      <div className="hidden lg:flex flex-1 bg-primary dark:bg-primary/10 relative flex-col justify-center items-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,_#4DB6AC_0%,_transparent_50%)]"></div>
        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-64 h-64 bg-white/50 dark:bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-sm">
              <img
                className="w-full h-full object-contain"
                alt="Illustration"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLavU6gUPDD5xzap7Pj025B3rEeIiGsRIYk3Us6TpRootBRa53VOkJlhYJer8jgPLoHEK-qWwCj0n1o_0HylsCoYVWNkxbWdCZlaXIUpBCk_zW5OkogO28B0v7z2r6DzKavinMks_qadtkGMtLcYR0Icsi9ePtl_aF4dnUWCPXrj6pwZPRKh-jgMXJIuhYwVihzdGNfJEbk5Qw3L0bzfSfLlEr2Fybz7qDIOPlaMzeQvUaIThmtk84AeTedjJKrvIoCo_hCZY6VS_k"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 leading-tight">讓分享變得更簡單</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-md">LightShare 是一個充滿溫度的社區，我們相信每一份小小的分享都能照亮他人的生活。</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-20 bg-white dark:bg-slate-900">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary-vibrant text-white p-2 rounded-lg">
              <span className="material-symbols-outlined text-2xl">wb_sunny</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">LightShare</span>
          </div>
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">歡迎回來</h1>
            <p className="text-slate-500 dark:text-slate-400">登入您的帳戶以繼續探索 LightShare</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
              <span className="material-symbols-outlined text-red-500">error</span>
              <p className="text-sm font-medium">{error}</p>
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
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">密碼</label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-vibrant hover:underline font-semibold"
                >
                  忘記密碼？
                </Link>
              </div>
              <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg bg-transparent transition-all px-4 py-3 group focus-within:border-primary-vibrant focus-within:ring-1 focus-within:ring-primary-vibrant">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary-vibrant mr-3">lock</span>
                <input
                  className="bg-transparent border-none focus:ring-0 w-full text-slate-900 dark:text-white placeholder:text-slate-400"
                  placeholder="輸入您的密碼"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
                >
                  {showPassword ? "visibility" : "visibility_off"}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="rounded border-slate-300 text-primary-vibrant focus:ring-primary-vibrant cursor-pointer"
                id="remember"
                type="checkbox"
              />
              <label className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer" htmlFor="remember">記住我</label>
            </div>
            <button
              className={`w-full bg-primary-vibrant hover:bg-primary-vibrant/90 text-white font-bold py-4 rounded-full transition-all shadow-lg shadow-primary-vibrant/20 flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>登入中...</span>
                </>
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
          <button className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-medium py-3 rounded-full transition-all flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span>使用 Google 帳號登入</span>
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
