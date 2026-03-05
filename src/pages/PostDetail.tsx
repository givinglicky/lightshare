import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Post, Comment } from '../types';
import { EnergyButton } from '../components/EnergyButton';

export const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user: authUser, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supporterCount, setSupporterCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        const [postData, commentsData] = await Promise.all([
          postService.getPostById(id),
          postService.getComments(id).catch(() => [])
        ]);

        if (postData) {
          setPost(postData);
          setComments(commentsData || []);
          setSupporterCount(postData.supporters_count || 0);
          setIsJoined(Boolean(postData.is_supported));
        } else {
          setError('找不到貼文資料');
        }
      } catch (err: any) {
        console.error('無法載入貼文數據', err);
        setError(err.message || '載入貼文時發生錯誤');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleJoinToggle = async () => {
    if (!id) return;
    if (!isAuthenticated) {
      setToastMessage('請先登入後再進行支持喔！');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    try {
      if (!isJoined) {
        const response = await postService.supportPost(id);
        if (response) {
          setIsJoined(true);
          setSupporterCount(response.supporters_count);
          setToastMessage('感謝您的加入！溫暖已傳遞。');
          setShowToast(true);
        }
      } else {
        setToastMessage('您已經支持過這份溫暖囉！');
        setShowToast(true);
      }
    } catch (err) {
      console.error('支持失敗', err);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  const handlePostComment = async () => {
    if (!id || !commentText.trim() || isSubmitting) return;

    if (!isAuthenticated) {
      setToastMessage('請先登入後再發佈留言喔！');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      // 增加一點點人工延遲感，讓 UI 反應更自然
      await new Promise(resolve => setTimeout(resolve, 600));

      const response = await postService.createComment(id, commentText);
      if (response) {
        const newComment = {
          id: response.id || Date.now().toString(),
          author_name: authUser?.name || '匿名鄰居',
          author_avatar: authUser?.avatar || '',
          content: commentText,
          created_at: new Date().toISOString(),
        };
        setComments([newComment, ...comments]);
        setCommentText('');
        setToastMessage('留言發布成功！感謝您的正能量 ✨');
        setShowToast(true);
      }
    } catch (err: any) {
      console.error('發布留言失敗', err);
      setToastMessage(err.message || '發布留言失敗，請稍後再試');
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
    setTimeout(() => setShowToast(false), 3000);
  };

  const toggleCommentLike = (commentId: string) => {
    setLikedComments(prev => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId);
      else next.add(commentId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full">
        <span className="material-symbols-outlined text-6xl text-vibrant-mint animate-spin">sync</span>
        <p className="mt-6 text-slate-500 font-bold animate-pulse">正在開啟溫暖貼文...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] w-full px-4">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-4xl text-red-500">error</span>
        </div>
        <h2 className="text-2xl font-black mb-2">{error || '找不到貼文'}</h2>
        <p className="text-slate-500 mb-8 text-center italic">這份溫暖可能暫時迷路了，請稍後再試</p>
        <Link to="/feed" className="px-8 py-3 bg-vibrant-mint text-white font-black rounded-xl shadow-lg hover:scale-105 transition-all">
          回社區動態
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full flex-grow py-8 px-4 bg-background-light dark:bg-background-dark sm:px-6">
      <div className="max-w-[720px] mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-vibrant-mint transition-colors px-2 py-1 group mb-2"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="font-bold">回上一頁</span>
        </button>

        <article className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <img
                  className="h-16 w-16 rounded-full border-2 border-vibrant-mint object-cover shadow-sm"
                  alt={post.author_name}
                  src={post.author_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author_name || 'U')}&background=00A67E&color=fff`}
                />
                <div>
                  <h3 className="font-black text-xl text-slate-900 dark:text-slate-50">{post.author_name}</h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{post.location || '地球村'}</span>
                    <span className="mx-1">•</span>
                    <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : '剛剛'}</span>
                  </div>
                </div>
              </div>
              <button className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <h1 className="text-3xl md:text-4xl font-black mb-6 leading-tight text-slate-900 dark:text-slate-50 tracking-tight">
              {post.title}
            </h1>

            {post.image ? (
              <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-inner bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800">
                <img
                  className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                  alt={post.title}
                  src={post.image}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490237014491-8aa29811ea61?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              </div>
            ) : (
              <div className="h-1.5 w-32 bg-vibrant-mint rounded-full mb-8 opacity-20"></div>
            )}

            <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
              {(post.content || '').split('\n\n').map((para, i) => (
                <p key={i} className="first-letter:text-2xl first-letter:font-bold first-letter:text-vibrant-mint/50">
                  {para}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-6">
              <EnergyButton
                size="lg"
                count={post.likes_count || 0}
                onLike={async () => {
                  if (!id) return;
                  if (!isAuthenticated) {
                    setToastMessage('請先登入後再傳遞正能量喔！');
                    setShowToast(true);
                    setTimeout(() => navigate('/login'), 2000);
                    return;
                  }
                  try {
                    const response = await postService.likePost(id);
                    if (response) {
                      setPost(prev => prev ? { ...prev, likes_count: response.likes_count } : null);
                    }
                  } catch (err) {
                    console.error('點讚失敗', err);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: post.title,
                      text: post.content,
                      url: window.location.href
                    }).catch(() => { });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('連結已複製到剪貼簿！');
                  }
                }}
                className="flex items-center gap-3 group px-6 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-vibrant/10 dark:hover:bg-vibrant-mint/10 transition-all border border-transparent hover:border-vibrant-mint/20 shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:scale-110 group-hover:text-vibrant-mint transition-all shadow-sm">
                  <span className="material-symbols-outlined text-xl">share</span>
                </div>
                <span className="font-black text-slate-700 dark:text-slate-200">分享溫暖</span>
              </button>
            </div>
          </div>
        </article>

        {/* 加入支持區塊 */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-primary-vibrant/10 to-vibrant-mint/5 dark:from-vibrant-mint/10 dark:to-emerald-900/10 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-vibrant-mint/10 shadow-lg shadow-vibrant-mint/5"
        >
          <div className="flex items-center gap-5">
            <div className="flex -space-x-4">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  className="h-14 w-14 rounded-full border-4 border-white dark:border-slate-900 shadow-lg object-cover"
                  alt={`Supporter ${i}`}
                  src={`https://picsum.photos/seed/supporter${i}/100/100`}
                />
              ))}
              <AnimatePresence mode="popLayout">
                {isJoined && (
                  <motion.img
                    key="me"
                    initial={{ scale: 0, x: -30, rotate: -30 }}
                    animate={{ scale: 1, x: 0, rotate: 0 }}
                    exit={{ scale: 0, x: -30, rotate: -30 }}
                    className="h-14 w-14 rounded-full border-4 border-vibrant-mint z-10 shadow-xl object-cover"
                    alt="You"
                    src={authUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'U')}&background=00A67E&color=fff`}
                  />
                )}
              </AnimatePresence>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-black text-slate-900 dark:text-slate-100 text-xl leading-tight">
                今天有 {supporterCount} 人為作者加油
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold italic mt-1 bg-white/50 dark:bg-slate-800/50 inline-block px-3 py-0.5 rounded-full">
                每一份善意，都在照亮鄰居的心
              </p>
            </div>
          </div>
          <button
            onClick={handleJoinToggle}
            className={cn(
              "w-full sm:w-auto px-10 py-4 font-black rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 group",
              isJoined
                ? "bg-white dark:bg-slate-800 text-vibrant-mint border-2 border-vibrant-mint/20"
                : "bg-vibrant-mint text-white hover:brightness-110 shadow-vibrant-mint/30 hover:shadow-vibrant-mint/50"
            )}
          >
            {isJoined ? (
              <>
                <span className="material-symbols-outlined text-xl group-hover:animate-bounce">check_circle</span>
                已加入支持者
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl group-hover:scale-125 transition-transform">volunteer_activism</span>
                加入他們
              </>
            )}
          </button>
        </motion.div>

        {/* 留言區 */}
        <section className="space-y-8 pb-32">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-vibrant-mint rounded-full"></span>
              正能量留言
            </h2>
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black text-slate-500">
              {comments.length} 條回應
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
            <div className="flex gap-4">
              <img
                className="h-12 w-12 rounded-full border-2 border-vibrant-mint object-cover hidden sm:block shadow-sm"
                alt="Current user"
                src={authUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser?.name || 'U')}&background=00A67E&color=fff`}
              />
              <div className="flex-1 space-y-4">
                <div className="relative">
                  <textarea
                    className="w-full rounded-2xl border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-800/30 focus:ring-vibrant-mint focus:border-vibrant-mint placeholder:text-slate-400 p-6 transition-all text-lg font-medium resize-none shadow-inner"
                    placeholder="想說點暖心的話支持鄰居嗎？"
                    rows={4}
                    maxLength={200}
                    disabled={isSubmitting}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  ></textarea>
                  <div className={cn(
                    "absolute bottom-4 right-6 text-xs font-black px-2 py-1 rounded-md bg-slate-50 dark:bg-slate-900 shadow-inner",
                    commentText.length >= 180 ? "text-red-500" : "text-slate-400"
                  )}>
                    {commentText.length} / 200
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handlePostComment}
                    disabled={!commentText.trim() || isSubmitting}
                    className="px-12 py-4 bg-vibrant-mint text-white font-black rounded-2xl hover:brightness-110 transition-all shadow-xl shadow-vibrant-mint/20 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed text-lg flex items-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-xl">sync</span>
                        發佈中...
                      </>
                    ) : (
                      '發佈留言'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {comments.map((comment) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={comment.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-lg shadow-slate-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800 group hover:border-vibrant-mint/20 transition-all"
                >
                  <div className="flex gap-5">
                    <img
                      className="h-14 w-14 rounded-full border-2 border-slate-50 dark:border-slate-800 object-cover shadow-sm"
                      alt={comment.author_name || comment.userName}
                      src={comment.author_avatar || comment.userAvatar}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-lg text-slate-900 dark:text-slate-50">{comment.author_name || comment.userName}</h4>
                        <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full">
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : (comment.timestamp || '剛剛')}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-lg mb-6 leading-relaxed font-medium">
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 border-t border-slate-50 dark:border-slate-800/50 pt-5">
                        <button
                          onClick={() => toggleCommentLike(comment.id)}
                          className={cn(
                            "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-black transition-all active:scale-90 shadow-sm",
                            likedComments.has(comment.id)
                              ? "bg-red-500 text-white shadow-red-200"
                              : "bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 border border-slate-100 dark:border-slate-700"
                          )}
                        >
                          <span className={cn(
                            "material-symbols-outlined text-xl transition-transform duration-300",
                            likedComments.has(comment.id) ? "fill-icon scale-125 rotate-12" : "group-hover:scale-110"
                          )}>
                            {likedComments.has(comment.id) ? 'sunny' : 'favorite'}
                          </span>
                          {likedComments.has(comment.id) ? '能量已傳遞' : '送出溫暖'}
                        </button>
                        <button className="text-slate-400 hover:text-vibrant-mint font-black text-sm px-4 py-2 hover:bg-vibrant-mint/5 rounded-xl transition-all">
                          回覆
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {comments.length === 0 && (
            <div className="py-20 text-center space-y-4 opacity-50">
              <span className="material-symbols-outlined text-6xl text-slate-300">chat_bubble</span>
              <p className="font-bold text-slate-400 text-lg">目前還沒有留言，快來搶頭香吧！</p>
            </div>
          )}
        </section>
      </div>

      {/* 全局提示容器 */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-12 left-1/2 z-[100] bg-slate-900 border border-vibrant-mint/30 text-white px-8 py-5 rounded-3xl shadow-2xl flex items-center gap-4 min-w-[320px] backdrop-blur-md"
          >
            <div className="w-10 h-10 bg-vibrant-mint rounded-full flex items-center justify-center shadow-lg shadow-vibrant-mint/20 animate-bounce">
              <span className="material-symbols-outlined text-white text-xl">volunteer_activism</span>
            </div>
            <div className="flex-1">
              <p className="font-black text-white">{toastMessage}</p>
              <p className="text-xs text-vibrant-mint font-bold italic">每一份溫暖我們都收到了 ✨</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
