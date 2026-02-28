import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notificationRef = useRef<HTMLDivElement>(null);
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Polling for notifications every minute
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

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
          <Link to="/" className="flex items-center gap-2 text-vibrant-mint">
            <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">LightShare</h2>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold hover:text-vibrant-mint transition-colors">首頁</Link>
            <Link to="/about" className="text-sm font-semibold hover:text-vibrant-mint transition-colors">關於我們</Link>
          </nav>
        </div>
        <div className="flex flex-1 justify-end items-center gap-4">
          <form onSubmit={handleSearch} className="hidden sm:flex relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-vibrant-mint text-sm"
              placeholder="搜尋請求或故事..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

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
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
              )}
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
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-vibrant-mint font-bold hover:underline"
                      >
                        全部標為已讀
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <button
                          key={notif.id}
                          onClick={() => handleMarkAsRead(notif.id)}
                          className={cn(
                            "w-full p-4 flex gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left border-b border-slate-50 dark:border-slate-800 last:border-0",
                            notif.is_read === 0 && "bg-emerald-50/30 dark:bg-emerald-900/5"
                          )}
                        >
                          <div className={cn(
                            "size-10 rounded-full flex items-center justify-center shrink-0",
                            notif.type === 'like' && "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
                            notif.type === 'comment' && "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
                            notif.type === 'support' && "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500",
                            notif.type === 'system' && "bg-slate-50 dark:bg-slate-800 text-slate-500"
                          )}>
                            <span className="material-symbols-outlined text-xl">
                              {notif.type === 'like' && 'sunny'}
                              {notif.type === 'comment' && 'chat_bubble'}
                              {notif.type === 'support' && 'volunteer_activism'}
                              {notif.type === 'system' && 'info'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{notif.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">{notif.content}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                          </div>
                          {notif.is_read === 0 && (
                            <div className="size-1.5 rounded-full bg-vibrant-mint shrink-0 self-center"></div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">暫無通知</div>
                    )}
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
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
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
      <div className="flex items-center justify-center gap-6 mb-4">
        <Link className="hover:text-vibrant-mint transition-colors" to="/about">關於我們</Link>
        <Link className="hover:text-vibrant-mint transition-colors" to="/tos">服務條款</Link>
        <Link className="hover:text-vibrant-mint transition-colors" to="/privacy">隱私權政策</Link>
        <Link className="hover:text-vibrant-mint transition-colors" to="/contact">聯繫我們</Link>
      </div>
      <p>© 2024 LightShare. 讓愛傳遞到每個角落。</p>
    </footer>
  );
};
