import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const mockNotifications = [
  {
    id: 1,
    title: '新的溫暖',
    content: 'David Chen 為您的貼文送出了溫暖！',
    time: '5分鐘前',
    icon: 'sunny',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  {
    id: 2,
    title: '新留言',
    content: 'Elena Rodriguez 在您的貼文下留言了。',
    time: '1小時前',
    icon: 'chat_bubble',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 3,
    title: '社區動態',
    content: '您附近有新的求助貼文，去看看吧！',
    time: '3小時前',
    icon: 'campaign',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  }
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 md:px-10 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10">
              <div className="absolute inset-0 bg-amber-400/30 blur-lg rounded-full animate-pulse scale-125"></div>
              <span className="material-symbols-outlined text-amber-500 text-3xl z-20 animate-spin-slow fill-icon">sunny</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-amber-600 transition-colors">陽光種子希望園</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold hover:text-vibrant-mint transition-colors">首頁</Link>
            <Link to="/about" className="text-sm font-semibold hover:text-vibrant-mint transition-colors">關於我們</Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          <div className="hidden sm:flex relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-vibrant-mint text-sm"
              placeholder="搜尋請求或故事..."
              type="text"
            />
          </div>
          
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className={cn(
                "p-2 rounded-xl transition-colors relative",
                showNotifications 
                  ? "bg-primary text-vibrant-mint" 
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary"
              )}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold">通知中心</h3>
                    <button className="text-xs text-vibrant-mint font-bold hover:underline">全部標為已讀</button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <button 
                        key={notif.id}
                        className="w-full p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left border-b border-slate-50 dark:border-slate-800 last:border-0"
                      >
                        <div className={cn("size-10 rounded-full flex items-center justify-center shrink-0", notif.bg)}>
                          <span className={cn("material-symbols-outlined text-xl", notif.color)}>{notif.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{notif.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.content}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <Link 
                    to="/notifications" 
                    className="block p-3 text-center text-sm font-bold text-slate-500 hover:text-vibrant-mint bg-slate-50 dark:bg-slate-800/50 transition-colors"
                    onClick={() => setShowNotifications(false)}
                  >
                    查看所有通知
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/profile" className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ring-2 ring-vibrant-mint/20">
            <img
              className="h-full w-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnC9pkDkJcLlMMiUlDrz975Y54JGfMGZs1xVkSW2sMiv7mowZZBxExV9WBqQieFiYPld-EEqodfIVdpb57wY1WzIRpvT2ehbIMiKk8C5HJMG-yvUMj5XxqBdsLX-fSwZdGgB060xUK3ld6XTqpeP7HwrIpFOfvHuv2vo6ILLl6b0hiNN_g-2ylLntfHZMBfFee54rJp6XDKfawgxONSKxRgsSS4sUIC-uEhEFP_3Brv8OmKJFuXd0ad4T4g69nol2-bT0uzKoTwdA-"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export const Footer: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) return null;

  return (
    <footer className="py-10 px-4 text-center text-slate-500 text-sm">
      <div className="flex items-center justify-center gap-4 mb-4">
        <a className="hover:text-vibrant-mint" href="#">服務條款</a>
        <a className="hover:text-vibrant-mint" href="#">隱私權政策</a>
        <a className="hover:text-vibrant-mint" href="#">聯繫我們</a>
      </div>
      <p>© 2026 陽光種子希望園. 讓愛傳遞到每個角落。</p>
    </footer>
  );
};
