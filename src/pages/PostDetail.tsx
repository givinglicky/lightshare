import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Comment, Post } from '../types';
import { postService } from '../services/postService';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await postService.getPostById(id);
        setPost(data);
        setComments(data.comments || []);
      } catch (err: any) {
        setError(err.message || '無法取得貼文');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vibrant-mint"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold">{error || '找不到貼文'}</h2>
        <Link to="/" className="mt-4 text-vibrant-mint font-bold">返回首頁</Link>
      </div>
    );
  }

  return (
    <main className="flex-grow py-8 px-4">
      <div className="max-w-[720px] mx-auto space-y-6">
        <article className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  className="h-14 w-14 rounded-full border-2 border-primary object-cover"
                  alt={post.author_name}
                  src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name)}&background=random`}
                />
                <div>
                  <h3 className="font-bold text-lg">{post.author_name}</h3>
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    <span>{post.location}</span>
                    <span className="mx-1">•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    const result = post.is_bookmarked
                      ? await postService.unbookmarkPost(post.id)
                      : await postService.bookmarkPost(post.id);
                    setPost({ ...post, is_bookmarked: result.is_bookmarked });
                  } catch (err) {
                    console.error('Bookmark failed:', err);
                  }
                }}
                className={cn(
                  "p-2 rounded-full transition-all",
                  post.is_bookmarked ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <span className={cn("material-symbols-outlined", post.is_bookmarked && "fill-icon")}>bookmark</span>
              </button>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{post.title}</h1>
            {post.image && (
              <div className="aspect-video w-full rounded-xl overflow-hidden mb-6">
                <img className="w-full h-full object-cover" alt={post.title} src={post.image} />
              </div>
            )}
            <div className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
              {post.content}
            </div>
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-6">
              <button
                onClick={async () => {
                  try {
                    const result = post.is_liked
                      ? await postService.unlikePost(post.id)
                      : await postService.likePost(post.id);
                    setPost({ ...post, likes_count: result.likes_count, is_liked: result.is_liked });
                  } catch (err) {
                    console.error('Like failed:', err);
                  }
                }}
                className="flex items-center gap-2 group"
              >
                <div className={cn(
                  "h-12 w-12 rounded-full flex items-center justify-center transition-all group-hover:scale-110",
                  post.is_liked
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "bg-amber-50 dark:bg-amber-900/20 text-amber-500"
                )}>
                  <span className={cn("material-symbols-outlined text-2xl", post.is_liked && "fill-icon")}>sunny</span>
                </div>
                <span className={cn("font-bold", post.is_liked ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-200")}>
                  {post.likes_count} 份正能量
                </span>
              </button>
              <button className="flex items-center gap-2 group">
                <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">share</span>
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200">分享</span>
              </button>
            </div>
          </div>
        </article>

        <div className="bg-primary/50 dark:bg-vibrant-mint/10 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-vibrant-mint/20">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900"
                  alt={`Supporter ${i}`}
                  src={`https://picsum.photos/seed/supporter${i}/100/100`}
                />
              ))}
              {post.is_supported === 1 && (
                <motion.div
                  initial={{ scale: 0, x: -10 }}
                  animate={{ scale: 1, x: 0 }}
                  className="h-10 w-10 rounded-full border-2 border-vibrant-mint z-10 bg-white overflow-hidden"
                >
                  <img
                    className="w-full h-full object-cover"
                    alt="You"
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
                  />
                </motion.div>
              )}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">今天有 {post.supporters_count || 0} 人為 {post.author_name.split(' ')[0]} 加油</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">您的鼓勵對她很重要</p>
            </div>
          </div>
          <button
            onClick={async () => {
              if (post.is_supported !== 1) {
                try {
                  const result = await postService.supportPost(post.id);
                  setPost({ ...post, supporters_count: result.supporters_count, is_supported: result.is_supported });
                  setShowToast(true);
                  setTimeout(() => setShowToast(false), 3000);
                } catch (err) {
                  console.error('Support failed:', err);
                }
              }
            }}
            disabled={post.is_supported === 1}
            className={cn(
              "w-full sm:w-auto px-6 py-2.5 font-bold rounded-lg transition-all shadow-sm flex items-center justify-center gap-2",
              post.is_supported === 1
                ? "bg-slate-200 text-slate-500 cursor-default"
                : "bg-vibrant-mint text-white hover:brightness-110 active:scale-95"
            )}
          >
            {post.is_supported === 1 ? (
              <>
                <span className="material-symbols-outlined text-sm">check_circle</span>
                已加入
              </>
            ) : '加入他們'}
          </button>
        </div>

        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-vibrant-mint">volunteer_activism</span>
              <span className="text-sm font-bold">感謝您的加入！溫暖已傳遞。</span>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-6">
          <h2 className="text-xl font-bold px-2">正能量留言</h2>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex gap-4">
              <img
                className="h-10 w-10 rounded-full"
                alt="Current user"
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=random`}
              />
              <div className="flex-1 space-y-3">
                <textarea
                  className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-vibrant-mint focus:border-vibrant-mint placeholder:text-slate-400"
                  placeholder="想說點暖心的話分享嗎？"
                  rows={3}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                ></textarea>
                <div className="flex justify-end">
                  <button
                    onClick={async () => {
                      if (!commentText.trim() || !post) return;
                      try {
                        const newComment = await postService.createComment(post.id, commentText);
                        setComments([newComment, ...comments]);
                        setCommentText('');
                      } catch (err: any) {
                        alert(err.message || '留言失敗');
                      }
                    }}
                    disabled={!commentText.trim()}
                    className="px-6 py-2 bg-vibrant-mint text-white font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    發佈留言
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={comment.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800"
              >
                <div className="flex gap-4">
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    alt={comment.author_name}
                    src={comment.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author_name)}&background=random`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold">{comment.author_name}</h4>
                      <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mb-4">{comment.content}</p>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/40 text-vibrant-mint text-sm font-semibold hover:bg-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">auto_awesome</span>
                        送出溫暖
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};
