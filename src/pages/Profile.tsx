import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { postService } from '../services/postService';
import { Post } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'bookmarks'>('posts');
  const { authUser, updateAuthUser, logout } = useAuth();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(authUser?.avatar || '');
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authUser?.id) {
      setAvatar(authUser.avatar || '');
      fetchUserPosts();
    }
  }, [authUser]);

  const fetchUserPosts = async () => {
    if (!authUser?.id) return;
    try {
      const response = await postService.getUserPosts(authUser.id);
      if (response && response.data) {
        setUserPosts(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user posts:', err);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && authUser) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Avatar = reader.result as string;
        try {
          setLoading(true);
          const updatedUser = await authService.updateUser({ avatar: base64Avatar });
          updateAuthUser(updatedUser);
          setAvatar(base64Avatar);
        } catch (err) {
          console.error('Failed to update avatar:', err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const myPosts = [
    {
      id: 'mp1',
      title: '今天看到了一道彩虹，心情真好',
      date: '2023/12/01',
      content: '分享一份微小的幸福，希望大家今天也都有好事發生...',
      likes: 24,
      comments: 3
    },
    {
      id: 'mp2',
      title: '感謝鄰居幫忙修剪樹枝',
      date: '2023/11/25',
      content: '社區的溫暖真的無處不在，謝謝王大哥！',
      likes: 15,
      comments: 1
    }
  ];

  const bookmarks = [
    {
      id: 'b1',
      title: '這週需要採購雜貨的幫助',
      author: 'Sarah Jenkins',
      content: '大家好，我叫 Sarah。最近因為身體不適且剛動完一個小手術...',
      likes: 12,
      comments: 2
    }
  ];

  return (
    <main className="flex-1 flex flex-col max-w-[600px] mx-auto w-full pb-24">
      <div className="flex flex-col items-center py-8 px-6">
        <div className="relative">
          <div
            onClick={handleAvatarClick}
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 border-4 border-primary shadow-sm cursor-pointer transition-all hover:brightness-75 group relative overflow-hidden"
            style={{ backgroundImage: `url("${avatar}")` }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white">
              <span className="material-symbols-outlined text-3xl">photo_camera</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
              <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
            </div>
          </div>
          <div className="absolute bottom-1 right-1 bg-emerald-500 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[14px]">check</span>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold">{authUser?.name || '匿名鄰居'}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{authUser?.bio || '這個人很懶，什麼都沒留下'}</p>
          <div className="flex items-center justify-center gap-1 mt-2 text-slate-400 text-sm">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>加入於 {authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString() : '最近'}</span>
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
              {userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <Link to={`/posts/${post.id}`} key={post.id} className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary transition-all">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{post.title}</h3>
                      <span className="text-xs text-slate-400">{post.created_at ? new Date(post.created_at).toLocaleDateString() : '最近'}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{post.content}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <span className="material-symbols-outlined text-xs">sunny</span> {post.likes_count || 0}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span> {post.comments_count || 0}
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
              {bookmarks.length > 0 ? (
                bookmarks.map((post) => (
                  <div key={post.id} className="group flex flex-col gap-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-primary transition-all">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">{post.title}</h3>
                      <span className="text-xs text-slate-400">{post.author}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{post.content}</p>
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <span className="material-symbols-outlined text-xs">sunny</span> {post.likes}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-xs">chat_bubble</span> {post.comments}
                      </div>
                    </div>
                  </div>
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
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-between p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-[0.98]"
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
