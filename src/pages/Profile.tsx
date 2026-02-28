import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Post } from '../types';
import { postService } from '../services/postService';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        if (activeTab === 'bookmarks') {
          const data = await postService.getBookmarks();
          setBookmarks(data);
        } else {
          const data = await postService.getMyPosts();
          setMyPosts(data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">請先登入以查看個人檔案</p>
          <Link to="/login" className="text-primary-vibrant font-bold hover:underline">前往登入</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col max-w-[600px] mx-auto w-full pb-24">
      <div className="flex flex-col items-center py-8 px-6">
        <div className="relative">
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-sm"
            style={{ backgroundImage: `url("${user.avatar || 'https://lh3.googleusercontent.com/pw/AP1GczPrvN4_8pL7V2sS4v2E6kR0Xv1w5IuQ='}")` }}
          ></div>
          <div className="absolute bottom-1 right-1 bg-emerald-500 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[14px]">check</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{user.bio || '這個使用者很懶，什麼都沒留下...'}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>加入於 {user.joinDate || '2024/02/26'}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 px-6 mb-8">
        <div className="flex-1 flex flex-col items-center gap-2 rounded-2xl p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
          <span className="material-symbols-outlined text-amber-600">sunny</span>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">獲得的正能量</p>
          <p className="text-amber-700 dark:text-amber-400 text-2xl font-bold">128</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-2 rounded-2xl p-4 bg-primary/30 dark:bg-primary/10 border border-primary/50 dark:border-primary/20">
          <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">edit_note</span>
          <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">已發布貼文</p>
          <p className="text-slate-900 dark:text-slate-100 text-2xl font-bold">5</p>
        </div>
      </div>

      <div className="px-6 mb-6">
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={cn(
              "pb-3 text-sm font-bold transition-all relative",
              activeTab === 'posts' ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
            )}
          >
            我的貼文
            {activeTab === 'posts' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              "pb-3 text-sm font-bold transition-all relative",
              activeTab === 'bookmarks' ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400"
            )}
          >
            收藏
            {activeTab === 'bookmarks' && (
              <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
            )}
          </button>
        </div>
      </div>

      <div className="px-6 mb-10 min-h-[200px]">
        <AnimatePresence mode="wait">
          {activeTab === 'posts' ? (
            <motion.div
              key="posts"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="py-10 text-center text-slate-400 text-sm">載入中...</div>
              ) : myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary transition-all overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{post.title}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{new Date(post.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{post.content}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                        <span className="material-symbols-outlined text-xs">sunny</span> {post.likes_count}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span> {post.comments_count}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 text-sm">尚無貼文</div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {isLoading ? (
                <div className="py-10 text-center text-slate-400 text-sm">載入中...</div>
              ) : bookmarks.length > 0 ? (
                bookmarks.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary transition-all overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{post.title}</h3>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">{new Date(post.created_at || '').toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{post.content}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-slate-500 font-medium">@{post.author_name}</span>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                          <span className="material-symbols-outlined text-xs">sunny</span> {post.likes_count}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                          <span className="material-symbols-outlined text-xs">chat_bubble</span> {post.comments_count}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-10 text-center text-slate-400 text-sm">尚無收藏</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-6 space-y-1 mb-8">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">帳戶設定</h3>
        <Link to="/profile/edit" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500">person</span>
            <span className="font-medium">編輯個人資料</span>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </Link>
        <Link to="/profile/notifications" className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-500">notifications</span>
            <span className="font-medium">通知設定</span>
          </div>
          <span className="material-symbols-outlined text-slate-400">chevron_right</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-medium">登出</span>
          </div>
        </button>
      </div>
    </main>
  );
};
